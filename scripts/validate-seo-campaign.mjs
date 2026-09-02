import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ownership = JSON.parse(await readFile(path.join(root, 'seo/ownership.json'), 'utf8'));
const failures = [];
const seen = {
  title: new Map(),
  description: new Map(),
  canonical: new Map(),
  keyword: new Map(),
};

function fail(message) {
  failures.push(message);
}

function decode(value = '') {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/&ndash;|&#8211;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;|&#8217;|&#x27;/g, '’')
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&#x2F;/g, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

function recordUnique(kind, value, owner) {
  if (!value) return fail(`${owner}: missing ${kind}`);
  const key = value.toLocaleLowerCase('en-GB');
  const previous = seen[kind].get(key);
  if (previous) fail(`${owner}: duplicate ${kind} also owned by ${previous}`);
  else seen[kind].set(key, owner);
}

function jsonLdObjects(value) {
  if (Array.isArray(value)) return value.flatMap(jsonLdObjects);
  if (!value || typeof value !== 'object') return [];
  const nested = Array.isArray(value['@graph']) ? value['@graph'].flatMap(jsonLdObjects) : [];
  return [value, ...nested];
}

function visibleFaq(html) {
  const block = html.match(/<div class="faq-list">([\s\S]*?)(?:<div class="source-box"|<\/article>)/i)?.[1] ?? '';
  return [...block.matchAll(/<div class="faq-item">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/gi)]
    .map((match) => ({ question: decode(match[1]), answer: decode(match[2]) }));
}

function schemaFaq(objects) {
  const faq = objects.find((item) => item['@type'] === 'FAQPage');
  return (faq?.mainEntity ?? []).map((item) => ({
    question: decode(item.name),
    answer: decode(item.acceptedAnswer?.text),
  }));
}

function visibleServiceFaq(html) {
  const section = html.match(/<section[^>]*id="faq"[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
  return [...section.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => ({ question: decode(match[1]), answer: decode(match[2]) }));
}

const implementedArticles = ownership.articleBacklog.filter((item) => item.status === 'implemented');
for (const article of implementedArticles) {
  const owner = `blog/${article.slug}`;
  const filename = path.join(root, 'blog', `${article.slug}.html`);
  try {
    await access(filename);
  } catch {
    fail(`${owner}: page is missing`);
    continue;
  }

  const html = await readFile(filename, 'utf8');
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const description = decode(html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] ?? '';
  const primaryKeyword = article.primaryKeyword.trim().toLocaleLowerCase('en-GB');
  recordUnique('title', title, owner);
  recordUnique('description', description, owner);
  recordUnique('canonical', canonical, owner);
  recordUnique('keyword', primaryKeyword, owner);

  if (title.length < 30 || title.length > 65) fail(`${owner}: title length ${title.length}, expected 30–65`);
  if (description.length < 120 || description.length > 165) fail(`${owner}: meta description length ${description.length}, expected 120–165`);
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) fail(`${owner}: expected exactly one H1`);
  if (/kensal/i.test(html)) fail(`${owner}: contains prohibited Kensal-specific reference or imagery`);

  const blocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  const objects = [];
  for (const block of blocks) {
    try {
      objects.push(...jsonLdObjects(JSON.parse(block[1])));
    } catch (error) {
      fail(`${owner}: invalid JSON-LD (${error.message})`);
    }
  }
  if (!objects.some((item) => item['@type'] === 'BlogPosting')) fail(`${owner}: BlogPosting schema missing`);
  if (!objects.some((item) => item['@type'] === 'BreadcrumbList')) fail(`${owner}: BreadcrumbList schema missing`);

  const visible = visibleFaq(html);
  const schema = schemaFaq(objects);
  if (!visible.length) fail(`${owner}: visible FAQ is missing or does not use the shared faq-list pattern`);
  if (JSON.stringify(visible) !== JSON.stringify(schema)) fail(`${owner}: visible FAQ does not exactly match FAQPage schema`);
}

const blogIndexHtml = await readFile(path.join(root, 'blog', 'index.html'), 'utf8');
const blogIndexObjects = [];
for (const block of blogIndexHtml.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
  try { blogIndexObjects.push(JSON.parse(block[1])); } catch (_) { /* Base validator reports invalid JSON-LD. */ }
}
const blogSchema = blogIndexObjects.find((item) => item['@type'] === 'Blog');
const blogPosts = blogSchema?.blogPost ?? [];
if (!blogPosts.length) fail('blog/index.html: Blog.blogPost schema is missing');
if (blogPosts.some((item) => item['@type'] !== 'BlogPosting')) fail('blog/index.html: every Blog.blogPost item must have @type BlogPosting');
const visibleCardPaths = [...blogIndexHtml.matchAll(/<a\s+href="(\/blog\/[^"]+)"\s+class="insight-card/gi)].map((match) => match[1]).sort();
const schemaCardPaths = blogPosts.map((item) => {
  try { return new URL(item.url).pathname; } catch (_) { return ''; }
}).sort();
if (JSON.stringify(visibleCardPaths) !== JSON.stringify(schemaCardPaths)) fail('blog/index.html: Blog.blogPost URLs must exactly match the visible insight-card URLs');

for (const territory of ownership.territories) {
  recordUnique('keyword', territory.primaryKeyword.trim().toLocaleLowerCase('en-GB'), territory.commercialUrl);
  const filename = path.join(root, `${territory.commercialUrl.replace(/^\//, '')}.html`);
  const html = await readFile(filename, 'utf8');
  const primaryCta = html.match(/<a\s+href="([^"]+)"\s+class="btn-primary"/i)?.[1] ?? '';
  if (primaryCta !== '/#research') fail(`${territory.commercialUrl}: first primary CTA must lead to the coaching enquiry, found ${primaryCta || 'none'}`);
  const objects = [];
  for (const block of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { objects.push(...jsonLdObjects(JSON.parse(block[1]))); } catch (_) { /* Base validator reports invalid JSON-LD. */ }
  }
  const visible = visibleServiceFaq(html);
  const schema = schemaFaq(objects);
  if (schema.length && JSON.stringify(visible) !== JSON.stringify(schema)) fail(`${territory.commercialUrl}: visible service FAQ does not exactly match FAQPage schema`);
}

if (implementedArticles.length !== 24) {
  fail(`Campaign registry has ${implementedArticles.length} implemented articles; expected 24 registered articles after this campaign`);
}

if (failures.length) {
  console.error(`Campaign validation failed (${failures.length}):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`Campaign validation passed for ${ownership.territories.length} commercial owners and ${implementedArticles.length} articles.`);
}

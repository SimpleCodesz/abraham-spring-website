import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ownership = JSON.parse(await readFile(path.join(root, 'seo/ownership.json'), 'utf8'));
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const redirects = await readFile(path.join(root, 'netlify.toml'), 'utf8');
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(absolute));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

for (const territory of ownership.territories) {
  const slug = territory.commercialUrl.replace(/^\//, '');
  const filename = `${slug}.html`;
  const filepath = path.join(root, filename);

  try {
    await access(filepath);
  } catch {
    failures.push(`${territory.name}: missing ${filename}`);
    continue;
  }

  const html = await readFile(filepath, 'utf8');
  const canonical = `https://abrahamspring.co.uk${territory.commercialUrl}`;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] ?? '';
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const jsonBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];

  expect(title.length >= 30 && title.length <= 65, `${territory.name}: title length is ${title.length}, expected 30-65`);
  expect(description.length >= 120 && description.length <= 165, `${territory.name}: meta description length is ${description.length}, expected 120-165`);
  expect(h1Count === 1, `${territory.name}: expected one H1, found ${h1Count}`);
  expect(html.includes(`<link rel="canonical" href="${canonical}">`), `${territory.name}: canonical mismatch`);
  expect(html.includes('meta name="robots" content="index, follow"'), `${territory.name}: index/follow directive missing`);
  expect(sitemap.includes(`<loc>${canonical}</loc>`), `${territory.name}: missing from sitemap.xml`);
  expect(redirects.includes(`from = "${territory.commercialUrl}"`), `${territory.name}: clean-URL rule missing from netlify.toml`);
  expect(jsonBlocks.length > 0, `${territory.name}: JSON-LD missing`);

  for (const block of jsonBlocks) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      failures.push(`${territory.name}: invalid JSON-LD (${error.message})`);
    }
  }

  expect(html.includes('class="btn-primary"'), `${territory.name}: primary conversion action missing`);
}

for (const article of ownership.articleBacklog.filter((item) => item.status === 'implemented')) {
  const filename = path.join('blog', `${article.slug}.html`);
  const filepath = path.join(root, filename);
  try {
    await access(filepath);
  } catch {
    failures.push(`${article.workingTitle}: missing ${filename}`);
    continue;
  }

  const html = await readFile(filepath, 'utf8');
  const canonical = `https://abrahamspring.co.uk/blog/${article.slug}`;
  expect(html.includes(`<link rel="canonical" href="${canonical}">`), `${article.workingTitle}: canonical mismatch`);
  expect(html.includes(`href="${article.commercialDestination}"`), `${article.workingTitle}: commercial destination link missing`);
  expect(sitemap.includes(`<loc>${canonical}</loc>`), `${article.workingTitle}: missing from sitemap.xml`);
  expect((html.match(/https:\/\//g) ?? []).length >= 8, `${article.workingTitle}: evidence/source links appear incomplete`);
  expect((html.match(/<h1\b/gi) ?? []).length === 1, `${article.workingTitle}: expected exactly one H1`);
}

const primaryKeywords = ownership.territories.map((territory) => territory.primaryKeyword.toLowerCase());
expect(new Set(primaryKeywords).size === primaryKeywords.length, 'Primary keyword cannibalisation: duplicate primary keyword in ownership map');
expect(!redirects.includes('from = "/*"'), 'Catch-all rewrite must not return the homepage for unknown URLs');

try {
  await access(path.join(root, '404.html'));
} catch {
  failures.push('Missing 404.html after removing the catch-all rewrite');
}

for (const filepath of await collectHtml(root)) {
  const relative = path.relative(root, filepath);
  const html = await readFile(filepath, 'utf8');
  expect((html.match(/<title>/gi) ?? []).length === 1, `${relative}: expected exactly one title tag`);
  for (const block of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      failures.push(`${relative}: invalid JSON-LD (${error.message})`);
    }
  }
}

if (failures.length) {
  console.error(`SEO validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`SEO validation passed for ${ownership.territories.length} ownership territories.`);
}

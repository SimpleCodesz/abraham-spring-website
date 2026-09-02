import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const pages = [
  ['blog/adhd-burnout.html', '/blog/adhd-burnout'],
  ['blog/nervous-system-regulation.html', '/blog/nervous-system-regulation'],
  ['executive-performance-coaching.html', '/executive-performance-coaching'],
  ['strength-conditioning.html', '/strength-conditioning'],
  ['blog/burnout-recovery-stages.html', '/blog/burnout-recovery-stages']
];
const failures = [];
const values = { titles: new Map(), descriptions: new Map(), canonicals: new Map() };

function addUnique(group, value, file) {
  if (!value) return failures.push(`${file}: missing ${group}`);
  if (values[group].has(value)) failures.push(`${file}: duplicate ${group} with ${values[group].get(value)}`);
  values[group].set(value, file);
}

function routeFile(href) {
  const clean = href.split(/[?#]/)[0];
  if (!clean || clean === '/') return 'index.html';
  if (clean.endsWith('/')) return `${clean.slice(1)}index.html`;
  return `${clean.slice(1)}.html`;
}

for (const [file, route] of pages) {
  const html = readFileSync(join(root, file), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]?.trim();
  const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)].length;
  const robots = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i)?.[1];

  addUnique('titles', title, file);
  addUnique('descriptions', description, file);
  addUnique('canonicals', canonical, file);
  if (canonical !== `https://abrahamspring.co.uk${route}`) failures.push(`${file}: canonical does not match route`);
  if (h1s !== 1) failures.push(`${file}: expected one H1, found ${h1s}`);
  if (robots !== 'index, follow') failures.push(`${file}: robots must be index, follow`);

  const jsonBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (!jsonBlocks.length) failures.push(`${file}: missing JSON-LD`);
  for (const block of jsonBlocks) {
    try { JSON.parse(block[1]); } catch (error) { failures.push(`${file}: invalid JSON-LD (${error.message})`); }
  }

  for (const match of html.matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/gi)) {
    const target = routeFile(match[1]);
    if (!existsSync(join(root, target))) failures.push(`${file}: internal link does not resolve: ${match[1]}`);
  }
}

const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
for (const [, route] of pages) {
  const url = `https://abrahamspring.co.uk${route}`;
  const count = sitemap.split(`<loc>${url}</loc>`).length - 1;
  if (count !== 1) failures.push(`sitemap.xml: expected one ${url}, found ${count}`);
}

const index = readFileSync(join(root, 'blog/index.html'), 'utf8');
const cardRoutes = [...index.matchAll(/<a\s+href="(\/blog\/[^"#?]+)"\s+class="insight-card(?: featured)?"/g)].map(match => match[1]);
const indexJson = JSON.parse(index.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i)[1]);
const schemaRoutes = indexJson.blogPost.map(post => new URL(post.url).pathname);
if (cardRoutes.length !== 14) failures.push(`blog/index.html: expected 14 cards, found ${cardRoutes.length}`);
if (schemaRoutes.length !== 14) failures.push(`blog/index.html: expected 14 BlogPosting entries, found ${schemaRoutes.length}`);
if (JSON.stringify(cardRoutes) !== JSON.stringify(schemaRoutes)) failures.push('blog/index.html: visible cards and BlogPosting entries differ');

if (failures.length) {
  console.error(`Wave 2 validation failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Wave 2 validation passed for ${pages.length} routes and ${cardRoutes.length} Insights entries.`);

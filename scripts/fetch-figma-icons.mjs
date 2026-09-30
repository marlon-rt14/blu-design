/**
 * Downloads the whole icon collection from `bDS - Icons` into
 * `.figma-assets/icons/<section>/<name>.svg`.
 *
 * The collection is 1170 glyphs across 19 sections, which rules out the Figma
 * MCP server: `download_assets` hands back one node per call. `/v1/files/:key
 * /components` returns the entire index — node id, name, description and the
 * containing frame, which *is* the section — in a single request, and
 * `/v1/images` takes 50 ids at a time.
 *
 * The section comes from `containing_frame.name`, not from the description,
 * even though both carry it: the frame is where design moves an icon when it
 * gets reclassified, and the description is prose that can lag behind.
 *
 * Needs `FIGMA_API_KEY` in the environment (it lives in `~/.zshrc`). The token
 * travels as a header, never as an argument, so it does not show up in the
 * process list.
 *
 * Usage: node scripts/fetch-figma-icons.mjs [--list]
 */
import { mkdir, writeFile } from 'node:fs/promises';

const FILE_KEY = 'WlAjbUHE4M3YeoDwvnRwix';
/** The only page in the file; every section frame lives on it. */
const PAGE_NAME = 'Universal icons';
const OUT_DIR = new URL('../.figma-assets/icons/', import.meta.url);
/** Figma rejects very long query strings; 50 ids fit comfortably. */
const BATCH = 50;
/** Parallel downloads. The S3 urls are signed and expire, so do not crawl. */
const CONCURRENCY = 24;

const token = process.env.FIGMA_API_KEY;
if (token === undefined || token === '') {
  console.error('Falta FIGMA_API_KEY en el entorno.');
  process.exit(1);
}

const api = async (path) => {
  const response = await fetch(`https://api.figma.com/v1/${path}`, {
    headers: { 'X-Figma-Token': token },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${path}`);
  const body = await response.json();
  if (body.err) throw new Error(String(body.err));
  return body;
};

/** `Finance & eCommerce` → `finance-ecommerce`, the module's file name. */
export const sectionSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/gu, ' ')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');

const index = await api(`files/${FILE_KEY}/components`);
const icons = index.meta.components
  .filter((component) => component.containing_frame?.pageName === PAGE_NAME)
  .map((component) => ({
    id: component.node_id,
    name: component.name,
    section: component.containing_frame.name,
    slug: sectionSlug(component.containing_frame.name),
    description: component.description ?? '',
  }))
  .sort((a, b) => a.slug.localeCompare(b.slug) || a.name.localeCompare(b.name));

const sections = new Map();
for (const icon of icons) sections.set(icon.slug, (sections.get(icon.slug) ?? 0) + 1);
console.log(`iconos: ${icons.length}, secciones: ${sections.size}`);

const duplicates = new Map();
for (const icon of icons) duplicates.set(icon.name, (duplicates.get(icon.name) ?? 0) + 1);
const collisions = [...duplicates].filter(([, count]) => count > 1);
if (collisions.length > 0) console.warn('colisiones de nombre:', collisions);

if (process.argv.includes('--list')) {
  console.log(JSON.stringify(icons, null, 2));
  process.exit(0);
}

const urls = new Map();
for (let i = 0; i < icons.length; i += BATCH) {
  const batch = icons.slice(i, i + BATCH);
  const images = await api(
    `images/${FILE_KEY}?ids=${batch.map((icon) => icon.id).join(',')}&format=svg`,
  );
  for (const [id, url] of Object.entries(images.images)) {
    if (url !== null) urls.set(id, url);
  }
  console.log(`  urls ${urls.size}/${icons.length}`);
}

for (const slug of sections.keys()) {
  await mkdir(new URL(`${slug}/`, OUT_DIR), { recursive: true });
}

let bytes = 0;
const failed = [];
const queue = [...icons];
const worker = async () => {
  for (let icon = queue.shift(); icon !== undefined; icon = queue.shift()) {
    const url = urls.get(icon.id);
    if (url === undefined) {
      failed.push(icon.name);
      continue;
    }
    const response = await fetch(url);
    if (!response.ok) {
      failed.push(icon.name);
      continue;
    }
    const svg = await response.text();
    bytes += svg.length;
    await writeFile(new URL(`${icon.slug}/${icon.name}.svg`, OUT_DIR), svg);
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

await writeFile(
  new URL('index.json', OUT_DIR),
  `${JSON.stringify({ file: FILE_KEY, fetchedAt: new Date().toISOString(), icons }, null, 2)}\n`,
);

console.log(`descargados: ${icons.length - failed.length}, ${(bytes / 1024).toFixed(1)} kB`);
if (failed.length > 0) console.error(`sin svg (${failed.length}):`, failed.join(', '));

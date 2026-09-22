/**
 * Downloads the country flags from `BDS3 - Assets` into `.figma-assets/flags/`.
 *
 * The Figma MCP server hands back one node per call, which is 265 calls for this
 * set. The REST API takes every id at once, so this is two requests plus one
 * download each — and, more to the point, it is repeatable: when design touches
 * the set, this runs again instead of the work being redone by hand.
 *
 * Needs `FIGMA_API_KEY` in the environment (it lives in `~/.zshrc`). The token
 * travels as a header, never as an argument, so it does not show up in the
 * process list.
 *
 * Usage: node scripts/fetch-figma-flags.mjs [--list]
 */
import { mkdir, writeFile } from 'node:fs/promises';

const FILE_KEY = 'EjuudbnL2TbkjnSCwBNztw';
/** The `.Flag` component set, whose variants are one country each. */
const FLAG_SET_NODE = '2053:2053';
const OUT_DIR = new URL('../.figma-assets/flags/', import.meta.url);
/** Figma rejects very long query strings; the set fits comfortably in these. */
const BATCH = 50;

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

/** `Country=EC - Ecuador` → `{ code: 'EC', name: 'Ecuador' }`. */
const parseVariant = (name) => {
  const match = /^Country=(?<code>[A-Z-]+) - (?<label>.+)$/u.exec(name);
  return match?.groups === undefined
    ? undefined
    : { code: match.groups.code, name: match.groups.label };
};

const nodes = await api(`files/${FILE_KEY}/nodes?ids=${FLAG_SET_NODE}&depth=1`);
const children = nodes.nodes[FLAG_SET_NODE]?.document?.children ?? [];
const flags = children
  .map((child) => ({ id: child.id, ...parseVariant(child.name) }))
  .filter((flag) => flag.code !== undefined);

console.log(`variantes: ${children.length}, con codigo parseable: ${flags.length}`);
if (process.argv.includes('--list')) {
  console.log(JSON.stringify(flags, null, 2));
  process.exit(0);
}

const urls = new Map();
for (let i = 0; i < flags.length; i += BATCH) {
  const batch = flags.slice(i, i + BATCH);
  const images = await api(
    `images/${FILE_KEY}?ids=${batch.map((flag) => flag.id).join(',')}&format=svg`,
  );
  for (const [id, url] of Object.entries(images.images)) {
    if (url !== null) urls.set(id, url);
  }
  console.log(`  urls ${urls.size}/${flags.length}`);
}

await mkdir(OUT_DIR, { recursive: true });
let bytes = 0;
let failed = 0;
for (const flag of flags) {
  const url = urls.get(flag.id);
  if (url === undefined) {
    failed += 1;
    continue;
  }
  const svg = await (await fetch(url)).text();
  bytes += svg.length;
  await writeFile(new URL(`${flag.code}.svg`, OUT_DIR), svg);
}
await writeFile(
  new URL('index.json', OUT_DIR),
  `${JSON.stringify(flags, null, 2)}\n`,
);
console.log(
  `descargadas ${flags.length - failed} banderas, ${(bytes / 1024).toFixed(1)} kB` +
    (failed === 0 ? '' : `, ${failed} sin URL`),
);

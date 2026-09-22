/**
 * Turns `.figma-assets/flags/*.svg` into one typed data module.
 *
 * **Data, not components.** 243 flags as 243 components would be 486 files
 * across the two platforms, and every one of them would be the same `<svg>`
 * around a different list of paths. So the paths are the module and each
 * platform keeps one renderer — `Path` from `react-native-svg` on native, a
 * plain `<path>` on web.
 *
 * The flags are safe to reduce to paths because the set says so, measured
 * rather than assumed: every one of the 265 exports is `<path>` only, and the
 * 530 `clipPath`s they carry are all full-frame `240x160` rects — Figma frame
 * clips, not real ones. Dropping them also drops the duplicate-id problem that
 * inlining 243 SVGs into one document would otherwise create.
 *
 * Usage: node scripts/generate-flags.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';

const IN_DIR = new URL('../.figma-assets/flags/', import.meta.url);
const OUT_FILE = new URL('../packages/shared/src/data/flags.generated.ts', import.meta.url);

/** Presentation attributes the set actually uses, mapped to their React names. */
const ATTRIBUTES = {
  fill: 'fill',
  stroke: 'stroke',
  'stroke-width': 'strokeWidth',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  opacity: 'opacity',
};
const NUMERIC = new Set(['strokeWidth', 'strokeMiterlimit', 'opacity']);

const { COUNTRY_CODES } = await import('../packages/shared/src/data/countries.ts');
const ours = new Set(COUNTRY_CODES);

const files = (await readdir(IN_DIR)).filter((name) => name.endsWith('.svg'));
const flags = [];
const skipped = [];
const unknown = new Set();

for (const file of files.sort()) {
  const code = file.replace('.svg', '');
  if (!ours.has(code)) {
    skipped.push(code);
    continue;
  }
  const svg = await readFile(new URL(file, IN_DIR), 'utf8');
  const viewBox = /viewBox="([^"]+)"/u.exec(svg)?.[1];
  if (viewBox !== '0 0 240 160') throw new Error(`${file}: viewBox inesperado ${viewBox}`);

  const paths = [];
  for (const match of svg.matchAll(/<path\b([^>]*?)\/?>/gu)) {
    const attrs = Object.fromEntries(
      [...match[1].matchAll(/([a-zA-Z-]+)="([^"]*)"/gu)].map(([, key, value]) => [key, value]),
    );
    const { d, id: _id, ...rest } = attrs;
    if (d === undefined) throw new Error(`${file}: <path> sin d`);
    const entry = { d };
    for (const [key, value] of Object.entries(rest)) {
      const name = ATTRIBUTES[key];
      if (name === undefined) {
        unknown.add(key);
        continue;
      }
      entry[name] = NUMERIC.has(name) ? Number(value) : value;
    }
    paths.push(entry);
  }
  if (paths.length === 0) throw new Error(`${file}: sin paths`);
  flags.push([code, paths]);
}

if (unknown.size > 0) throw new Error(`atributos no contemplados: ${[...unknown].join(', ')}`);

const body = flags
  .map(([code, paths]) => {
    const rows = paths.map((path) => `    ${JSON.stringify(path)},`).join('\n');
    return `  ${code.includes('-') ? `'${code}'` : code}: [\n${rows}\n  ],`;
  })
  .join('\n');

const file = `// Generado por scripts/generate-flags.mjs — no editar a mano.
// Origen: Figma \`BDS3 - Assets\`, component set \`.Flag\` (2053:2053).
import type { TCountryCode } from './countries';

/**
 * One drawn shape of a flag: the \`d\` plus whatever presentation attributes
 * that shape carries. Every key here appears in the real set — the generator
 * throws on an attribute it has not been taught, so a redesign that introduces
 * gradients or strokes cannot land silently.
 */
export interface IFlagPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeMiterlimit?: number;
  /** Only \`round\` appears in the set; typed narrowly so the object spreads
   *  straight into \`react-native-svg\`'s \`Path\`, whose props are unions. */
  strokeLinejoin?: 'round';
  fillRule?: 'evenodd';
  clipRule?: 'evenodd';
  opacity?: number;
}

/**
 * The box every flag is drawn in, and the reason a flag is 1.5 times as wide as
 * it is tall: bDS sizes a flag by its **height**, and \`Flag icon\`'s Rectangle
 * shape is \xd71.5 of it.
 */
export const FLAG_VIEW_BOX = '0 0 240 160';
export const FLAG_ASPECT_RATIO = 240 / 160;

/**
 * Every country in the catalogue, drawn.
 *
 * \`Record\`, not \`Partial<Record<…>>\`: the set covers all ${flags.length} codes
 * the catalogue has, so a missing key is a bug rather than a gap, and the
 * renderer needs no fallback.
 */
export const FLAG_PATHS: Record<TCountryCode, IFlagPath[]> = {
${body}
};
`;

await writeFile(OUT_FILE, file);
console.log(
  `${flags.length} banderas, ${flags.reduce((n, [, p]) => n + p.length, 0)} paths, ` +
    `${(file.length / 1024).toFixed(1)} kB de modulo. Fuera del catalogo: ${skipped.length}.`,
);

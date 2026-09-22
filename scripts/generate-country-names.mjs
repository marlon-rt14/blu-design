/**
 * Writes the Spanish country names into a module, for runtimes without
 * `Intl.DisplayNames`.
 *
 * Hermes is that runtime: measured on an iPhone 17 Pro simulator, the country
 * sheet listed `EC` instead of `Ecuador`, which is `countryName` degrading as
 * designed rather than a crash. Web keeps using `Intl` — it is the same CLDR
 * data and it covers every locale — and this table is what native falls back
 * to.
 *
 * **Generated from Node's own ICU**, so the strings are CLDR's and not
 * somebody's transcription of 243 country names.
 *
 * Usage: node --experimental-strip-types scripts/generate-country-names.mjs
 */
import { writeFile } from 'node:fs/promises';

const OUT = new URL('../packages/shared/src/data/countryNames.generated.ts', import.meta.url);
const { COUNTRY_CODES } = await import('../packages/shared/src/data/countries.ts');

const display = new Intl.DisplayNames(['es'], { type: 'region' });
const rows = [];
const unresolved = [];
for (const code of COUNTRY_CODES) {
  const name = display.of(code);
  if (name === undefined || name === code) unresolved.push(code);
  rows.push(`  ${code}: ${JSON.stringify(name ?? code)},`);
}
if (unresolved.length > 0) {
  throw new Error(`el ICU de Node no resolvió: ${unresolved.join(', ')}`);
}

const file = `// Generado por scripts/generate-country-names.mjs — no editar a mano.
// Origen: el ICU de Node, o sea CLDR, en español.
import type { TCountryCode } from './countries';

/**
 * Every country's name in Spanish.
 *
 * **Only for runtimes without \`Intl.DisplayNames\`.** Hermes is one: measured
 * on a simulator, the PhoneField's country sheet listed \`EC\` instead of
 * \`Ecuador\`. Where \`Intl\` exists it wins, because it is the same data and it
 * answers for every locale rather than just this one.
 *
 * Spanish because that is the product's language and the language bDS writes
 * in. A second locale on a runtime without \`Intl\` would need a second table.
 */
export const COUNTRY_NAMES_ES: Record<TCountryCode, string> = {
${rows.join('\n')}
};
`;
await writeFile(OUT, file);
console.log(`${rows.length} nombres, ${(file.length / 1024).toFixed(1)} kB`);

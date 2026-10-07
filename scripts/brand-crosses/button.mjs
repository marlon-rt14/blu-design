/**
 * Emits the Button's brand x semantic step table from its Figma Dev frame.
 *
 * ```sh
 * source ~/.zshrc && node scripts/brand-crosses/button.mjs
 * ```
 *
 * One file per component on purpose: each reads its own frame and its own
 * section, and the shared work lives in `lib.mjs`. Adding the next component is
 * a frame id and an output path.
 *
 * @see scripts/brand-crosses/lib.mjs for why this is generated at all.
 */
import { writeFileSync } from 'node:fs';

import { collapseBrands, fetchNode, readBrandCross, SEMANTICS } from './lib.mjs';

/** `Button · Plataformas`, page `Button`. Section `07` lives inside it. */
const FRAME = '1507:65184';
const OUT = 'packages/shared/src/tokens/button.brandSteps.ts';

const frame = await fetchNode(FRAME);
const { kept, dropped } = readBrandCross(frame);
const { collapsed, perBrand } = collapseBrands(kept);

for (const [token, steps] of dropped) {
  console.log(`  skipped ${token} — not the fill family: ${steps.join(', ')}`);
}
if (Object.keys(perBrand).length > 0) {
  throw new Error(
    `These rows take a different step per brand, which this emitter cannot ` +
      `collapse: ${Object.keys(perBrand).join(', ')}. Teach the generated shape ` +
      `a brand level before re-running.`,
  );
}

const tokens = Object.keys(collapsed).sort();
const body = tokens
  .map((token) => {
    const rows = SEMANTICS.map((s) => `    '${s}': '${collapsed[token][s]}',`).join('\n');
    return `  '${token}': {\n${rows}\n  },`;
  })
  .join('\n');

writeFileSync(
  OUT,
  `/**
 * Which brand primitive each semantic takes, per Button colour token.
 *
 * **Generated — do not edit.** \`node scripts/brand-crosses/button.mjs\` reads it
 * out of section \`07 · Origen de cada color\` of the Figma frame
 * \`Button · Plataformas\` (\`${FRAME}\`), which is where design annotates it.
 *
 * The step is the tail of a primitive path: the full one is
 * \`color.{step}\` under \`color.<tone>.brand.<brand>\`, e.g. \`light/fill-hc\` for
 * brand \`discover\` is \`color.light.brand.discover.fill-hc\`. Those primitives are
 * byte-identical in all 18 exported folders — 60 paths checked — so the cross
 * needs no new folder and no wider theme key.
 *
 * Only the \`fill\` family is here. The section's other ten rows point at numeric
 * ramp steps (\`light/700\`) or at \`static/*\`, and are out of scope by decision.
 *
 * Note \`mc-dark\` takes the same step as \`dark\`, and \`hc-light\` the same as
 * \`mc-light\`: the semantic chooses the rung, and the choice is not derivable
 * from the semantic's name. That is the reason this table exists instead of a
 * three-line function.
 */
export const buttonBrandSteps = {
${body}
} as const satisfies Record<string, Record<string, \`\${'light' | 'dark'}/\${string}\`>>;

/** The colour tokens of the Button that carry the brand, as section \`07\` lists them. */
export type TButtonBrandToken = keyof typeof buttonBrandSteps;
`,
);
console.log(`\n${OUT}: ${tokens.length} tokens x ${SEMANTICS.length} semantics`);
for (const t of tokens) console.log(`  ${t}`);

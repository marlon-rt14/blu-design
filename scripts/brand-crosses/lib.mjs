/**
 * Shared machinery for reading a component's `07 · Origen de cada color` section
 * out of its Figma Dev frame and emitting the brand x semantic step table.
 *
 * ## What this exists for
 *
 * `brand` and `mode` both own `color.json` and the Supernova export ships one
 * folder per axis value, never the cross product — so `discover` + `dark` is a
 * theme the export cannot produce, and `resolveTheme` drops the brand. For most
 * tokens that is simply a gap. For the handful that carry the brand colour it is
 * the whole point of the brand.
 *
 * Those few **can** be crossed, because the brand primitives are reachable by
 * path: `color/{light|dark}/brand/{brand}/{step}`, and — measured across all 18
 * folders, 60 paths, zero differences — they are identical in every folder. So
 * the cross needs no new folder and no bigger theme key. It needs one thing the
 * JSON does not carry: **which step each semantic takes**. That is what Jetto
 * annotates in section `07`, and what this emits.
 *
 * ## Why generated and not hand-written
 *
 * The table is (brand x token x semantic). Even scoped to the `fill` family that
 * is 90 cells for the Button, and it moves whenever design retunes contrast —
 * `discover` and `clubmiles` had their light steps shifted one darker on
 * 2026-10-01. A table that size, hand-copied, is wrong the first time someone
 * forgets to recopy it and nothing fails loudly. Re-running a script is cheap;
 * noticing a stale cell is not.
 *
 * ## What it deliberately does not emit
 *
 * **No colour values.** Only the step *names*. The hex behind a step changes with
 * every Supernova sync, and baking it here would create a second source of truth
 * that silently drifts from `theme/`. The step mapping changes only when design
 * re-annotates, which is a different and much slower clock.
 *
 * **No numeric or `static/*` steps.** Of the Button's 13 brand-moved tokens only
 * 3 take the `fill` family; the other 10 point at numeric ramp steps
 * (`light/700`) or at `static/alpha/white/12`, which does not even live under
 * `brand/`. Those are out of scope by decision, not by oversight — see
 * {@link FILL_STEP}.
 *
 * @see docs/props-enlazadas-a-tokens.md
 */

/**
 * The steps this reads. Everything else in the section is skipped.
 *
 * Six names and their two tones. `-hc` is not "high contrast only": the semantic
 * decides which step it takes, and both `mc-*` and `hc-*` land on the `-hc`
 * rung — which is why the mapping has to be read rather than guessed from the
 * semantic's name.
 */
export const FILL_STEP =
  /^(light|dark)\/(fill|fill-hover|fill-pressed|fill-hc|fill-hover-hc|fill-pressed-hc)$/;

/** The six modes of `3. Semantic`, in the order the section's columns use. */
export const SEMANTICS = ['light', 'dark', 'mc-light', 'mc-dark', 'hc-light', 'hc-dark'];

/** The five modes of `2. Brand`. */
export const BRANDS = ['blu', 'titanium', 'discover', 'clubmiles', 'grandtable'];

const FILE_KEY = 'DOUsaQf0fK7hybeS0n74gb';

/** Fetches one node subtree. The token goes in a header, never in the URL. */
export const fetchNode = async (nodeId) => {
  const token = process.env['FIGMA_API_KEY'];
  if (!token) throw new Error('FIGMA_API_KEY is not set — `source ~/.zshrc` first.');
  const response = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${nodeId}`, {
    headers: { 'X-Figma-Token': token },
  });
  if (!response.ok) throw new Error(`Figma ${response.status} for ${nodeId}`);
  const body = await response.json();
  const node = body.nodes[nodeId]?.document;
  if (!node) throw new Error(`Node ${nodeId} is not in the response`);
  return node;
};

/** Depth-first search by layer name. The names are the contract here, not the ids. */
export const findByName = (node, name) => {
  if (node.name === name) return node;
  for (const child of node.children ?? []) {
    const hit = findByName(child, name);
    if (hit) return hit;
  }
  return undefined;
};

/** Every TEXT descendant as `[layerName, text]`, in document order. */
const textsOf = (node, out = []) => {
  if (node.type === 'TEXT') {
    const text = (node.characters ?? '').trim();
    if (text) out.push([node.name, text]);
  }
  for (const child of node.children ?? []) textsOf(child, out);
  return out;
};

/**
 * Reads the `07 · Origen de cada color` section into
 * `{ [token]: { [brand]: { [semantic]: step } } }`, keeping only
 * {@link FILL_STEP} rows.
 *
 * Also returns what it dropped and why, because a row vanishing silently is how
 * a table like this goes stale without anyone noticing.
 */
export const readBrandCross = (frame) => {
  const section = findByName(frame, 'sec-07-origen-del-color');
  if (!section) throw new Error('No `sec-07-origen-del-color` in this frame');

  const raw = {};
  for (const block of section.children ?? []) {
    if (!block.name.startsWith('marca · ')) continue;
    const brand = block.name.slice('marca · '.length);
    for (const row of block.children ?? []) {
      if (!row.name.startsWith('fila · ')) continue;
      const token = row.name.slice('fila · '.length);
      for (const cell of row.children ?? []) {
        if (!cell.name.startsWith('celda · ')) continue;
        const semantic = cell.name.slice('celda · '.length);
        // The cell's `primitivo` layer can carry a second line of prose
        // ("sin número (color propio)"); only the first line is the step.
        const step = textsOf(cell)
          .find(([layer]) => layer === 'primitivo')?.[1]
          .split('\n')[0]
          .trim();
        if (step) ((raw[token] ??= {})[brand] ??= {})[semantic] = step;
      }
    }
  }

  const kept = {};
  const dropped = [];
  for (const [token, byBrand] of Object.entries(raw)) {
    const cells = Object.values(byBrand).flatMap((b) => Object.values(b));
    if (cells.length === 0) continue;
    if (cells.every((step) => FILL_STEP.test(step))) kept[token] = byBrand;
    else dropped.push([token, [...new Set(cells.filter((s) => !FILL_STEP.test(s)))]]);
  }
  return { kept, dropped };
};

/**
 * Collapses the table when the step turns out not to depend on the brand.
 *
 * It does for the three `primary/bg-*` rows and it does not for six of the other
 * ten, so this is checked rather than assumed: when every brand agrees, the
 * emitted table is `token -> semantic -> step` and the brand is just the path
 * segment; when they disagree, the brand stays a level of the table.
 */
export const collapseBrands = (kept) => {
  const collapsed = {};
  const perBrand = {};
  for (const [token, byBrand] of Object.entries(kept)) {
    const signatures = new Set(
      BRANDS.map((brand) => JSON.stringify(SEMANTICS.map((s) => byBrand[brand]?.[s]))),
    );
    if (signatures.size === 1) collapsed[token] = byBrand[BRANDS[0]];
    else perBrand[token] = byBrand;
  }
  return { collapsed, perBrand };
};

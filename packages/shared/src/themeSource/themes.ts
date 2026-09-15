import clubmilesColor from '../theme/clubmiles/color.json';
import darkColor from '../theme/dark/color.json';
import darkDimension from '../theme/dark/dimension.json';
import discoverColor from '../theme/discover/color.json';
import expandedDimension from '../theme/expanded/dimension.json';
import grandtableColor from '../theme/grandtable/color.json';
import hcdarkColor from '../theme/hcdark/color.json';
import hcdarkDimension from '../theme/hcdark/dimension.json';
import hclightColor from '../theme/hclight/color.json';
import hclightDimension from '../theme/hclight/dimension.json';
import lightColor from '../theme/light/color.json';
import lightDimension from '../theme/light/dimension.json';
import lightString from '../theme/light/string.json';
import lightTypography from '../theme/light/typography.json';
import mcdarkColor from '../theme/mcdark/color.json';
import mclightColor from '../theme/mclight/color.json';
import regularDimension from '../theme/regular/dimension.json';
import titaniumColor from '../theme/titanium/color.json';

/**
 * The product a screen belongs to — Figma's `2. Brand` collection.
 *
 * Changes 180 colour tokens: the `brand/*` ramp, `role/brand`, `role/scene`,
 * and the `component/*` groups that carry a brand colour (Button, LinkButton,
 * IconButton, Chip, Tag, Badge and a few more).
 */
export type TThemeBrand = 'blu' | 'titanium' | 'discover' | 'clubmiles' | 'grandtable';

/**
 * How much contrast the surface has — Figma's `3. Semantic` collection.
 *
 * Changes roughly 1042 colour tokens, so it is by far the widest axis. `mc-*`
 * is medium contrast and `hc-*` is high contrast; both come in a light and a
 * dark flavour.
 */
export type TThemeMode = 'light' | 'dark' | 'mc-light' | 'mc-dark' | 'hc-light' | 'hc-dark';

/**
 * How generous the spacing and type scale are — Figma's `4. Layout` collection.
 *
 * Three steps, one per form factor, as the variable descriptions in Figma put
 * it: *"compact para telefono, regular para tablet, expanded para escritorio"*.
 *
 * The only axis that touches no colour at all — measured, the three folders
 * share one byte-identical `color.json`. It moves 34 of the 303 `dimension`
 * tokens, and it moves them **monotonically**: `compact <= regular <= expanded`
 * holds for all 34, with no exceptions. `regular` is a real middle step and not
 * an interpolation: of those 34 it equals `compact` in 13, equals `expanded` in
 * 10, and carries a value of its own in the remaining 11.
 *
 * Three tokens deliberately do **not** move, and Figma says so in their
 * descriptions: `space/inset/3xl` (48, because the control it reserves room for
 * is always the same size), `space/stack/sm`, and the whole `space/doc/*` scale,
 * which measures documentation and not product.
 */
export type TThemeLayout = 'compact' | 'regular' | 'expanded';

/**
 * Where the colour comes from — the one thing `brand` and `mode` have to share.
 *
 * Both axes own `color.json` and they overlap heavily, so a theme can carry one
 * brand **or** one non-default mode, never both. The export makes that literal:
 * every mode folder is a `blu` snapshot (they match `blu` on all 26
 * `brand/ramp` tokens) and every brand folder is a light one (`titanium` has
 * `canvas/surface/primary` at `#ffffff`).
 *
 * This is the **only** genuine conflict between the three axes, which is why it
 * is the only one {@link resolveTheme} has to resolve by dropping something.
 */
export type TThemeColorSource =
  | 'light'
  | 'dark'
  | 'mc-light'
  | 'mc-dark'
  | 'hc-light'
  | 'hc-dark'
  | 'titanium'
  | 'discover'
  | 'clubmiles'
  | 'grandtable';

/**
 * The key a per-theme token record is indexed by: a colour source and a layout,
 * **composed**.
 *
 * Figma composes the three collections live, so all 5 x 6 x 3 = 90 combinations
 * exist there while Supernova exports one folder per mode with the other two
 * axes at their default — 12 flat snapshots. Reading a folder per request would
 * therefore allow only 8 exact combinations.
 *
 * It allows 30, because **layout is orthogonal to the other two, measured**:
 *
 * - `layout` moves **0** colour tokens. The three layout folders share one
 *   byte-identical `color.json`.
 * - `brand` moves **0** dimension tokens. All four brand folders ship light's
 *   `dimension.json`, byte for byte.
 * - `layout` and `mode` both touch `dimension.json`, but on **disjoint** keys:
 *   layout moves 34 (`space/*`, `font/size/*`, `radius/*`, `chart/marker/*`) and
 *   mode moves at most 17 (`border/*`, `chart/*`, `focus/*`, `elevation/*`).
 *   The intersection is empty, so there is nothing to arbitrate.
 *
 * So `dark` + `regular` is not a fallback: it is dark's colour with regular's
 * dimensions plus dark's 7 `elevation` shadows, every token coming from a file
 * that actually declares it. See {@link composeDimension}.
 *
 * What remains impossible is a brand in a non-default mode — `discover` in
 * `hc-light` is a dark brick red in Figma that appears in no exported folder.
 * That case, and only that case, falls back and reports
 * {@link IResolvedTheme.isExact} as `false`.
 */
export type TThemeSourceKey = `${TThemeColorSource}@${TThemeLayout}`;

/** The four Style-Dictionary-categorized token files Supernova exports per theme. */
export interface IThemeSource {
  color: unknown;
  dimension: unknown;
  typography: unknown;
  string: unknown;
}

/**
 * The colour and dimension files each colour source contributes.
 *
 * **Deduplicated on purpose.** The export ships 15 folders — 60 files, 14.8 MB —
 * and many are byte-identical:
 *
 * - `base`, `blu`, `light` and `compact` are identical in **all four** files, so
 *   `light` is the only one imported. `base` was the old name for it, `blu` is
 *   the default brand and `compact` the default layout, so by definition all
 *   three are what `light` already resolves to. `compact` arriving as its own
 *   folder is in fact how the default of that axis was confirmed.
 * - `typography.json` and `string.json` are identical across all 15 folders, so
 *   they are imported once.
 * - `mc-light` shares `light`'s dimensions and `mc-dark` shares `dark`'s; the
 *   brands share `light`'s outright.
 *
 * That takes the import set from 60 files to 18, and the JSON in the bundle from
 * 14.8 MB to 9.2 MB. It is still far more than the 2.0 MB two themes cost, which
 * is why lazy loading is a tracked follow-up: these are static imports, so the
 * bundler includes every one of them whether a screen uses it or not.
 */
const COLOR_SOURCES: Record<TThemeColorSource, { color: unknown; dimension: unknown }> = {
  light: { color: lightColor, dimension: lightDimension },
  dark: { color: darkColor, dimension: darkDimension },
  'mc-light': { color: mclightColor, dimension: lightDimension },
  'mc-dark': { color: mcdarkColor, dimension: darkDimension },
  'hc-light': { color: hclightColor, dimension: hclightDimension },
  'hc-dark': { color: hcdarkColor, dimension: hcdarkDimension },
  titanium: { color: titaniumColor, dimension: lightDimension },
  discover: { color: discoverColor, dimension: lightDimension },
  clubmiles: { color: clubmilesColor, dimension: lightDimension },
  grandtable: { color: grandtableColor, dimension: lightDimension },
};

/** The dimension file each layout contributes. `compact` is the exported default. */
const LAYOUT_DIMENSIONS: Record<TThemeLayout, unknown> = {
  compact: lightDimension,
  regular: regularDimension,
  expanded: expandedDimension,
};

type TTokenNode = { readonly [segment: string]: unknown };

/**
 * A node is a token once it carries a scalar `value`. Deeper objects are groups.
 *
 * Checked on `value` rather than on depth because the tree is not uniform —
 * `border/width/default` sits three levels down and `space/inset/md` four.
 */
const isTokenLeaf = (node: unknown): node is { value: unknown } =>
  typeof node === 'object' &&
  node !== null &&
  'value' in node &&
  typeof (node as { value: unknown }).value !== 'object';

/**
 * Builds the dimension tree for one colour source and one layout.
 *
 * Walks the layout's file and, per token, keeps the colour source's value **only
 * where that source moved it off light** — which is how the two axes' edits stay
 * separable without a hand-written list of which token belongs to whom. Their
 * key sets are disjoint (see {@link TThemeSourceKey}), so no token is ever
 * claimed twice and the walk cannot pick a loser.
 *
 * Returns an existing tree by identity whenever one side has nothing to add, so
 * only the 4 colour sources that touch dimensions x the 2 non-default layouts —
 * 8 trees — are ever built. The other 22 combinations reuse an imported object.
 */
const composeDimension = (colorDimension: unknown, layoutDimension: unknown): unknown => {
  if (colorDimension === lightDimension) return layoutDimension;
  if (layoutDimension === lightDimension) return colorDimension;

  const walk = (base: unknown, color: unknown, layout: unknown): unknown => {
    if (isTokenLeaf(layout)) {
      return isTokenLeaf(color) && isTokenLeaf(base) && color.value !== base.value ? color : layout;
    }
    if (typeof layout !== 'object' || layout === null) return layout;
    const composed: Record<string, unknown> = {};
    for (const segment of Object.keys(layout as TTokenNode)) {
      composed[segment] = walk(
        (base as TTokenNode | undefined)?.[segment],
        (color as TTokenNode | undefined)?.[segment],
        (layout as TTokenNode)[segment],
      );
    }
    return composed;
  };

  return walk(lightDimension, colorDimension, layoutDimension);
};

/**
 * Raw, fully-resolved token trees per theme. Component token modules (e.g.
 * `card.tokens.ts`) read out of these with `readThemeToken` /
 * `readThemeDimension` / `readThemeTypography` rather than importing the JSON
 * directly, so the path lookup and error handling only live in one place.
 *
 * One entry per {@link TThemeSourceKey} — 10 colour sources x 3 layouts = 30.
 */
export const themeSources: Record<TThemeSourceKey, IThemeSource> = Object.fromEntries(
  (Object.keys(COLOR_SOURCES) as TThemeColorSource[]).flatMap((source) =>
    (Object.keys(LAYOUT_DIMENSIONS) as TThemeLayout[]).map((layout) => [
      `${source}@${layout}`,
      {
        color: COLOR_SOURCES[source].color,
        dimension: composeDimension(COLOR_SOURCES[source].dimension, LAYOUT_DIMENSIONS[layout]),
        typography: lightTypography,
        string: lightString,
      },
    ]),
  ),
) as Record<TThemeSourceKey, IThemeSource>;

/** Every value of each axis, in the order the selectors should show them. */
export const THEME_BRANDS: readonly TThemeBrand[] = [
  'blu',
  'titanium',
  'discover',
  'clubmiles',
  'grandtable',
];
export const THEME_MODES: readonly TThemeMode[] = [
  'light',
  'dark',
  'mc-light',
  'mc-dark',
  'hc-light',
  'hc-dark',
];
export const THEME_LAYOUTS: readonly TThemeLayout[] = ['compact', 'regular', 'expanded'];

/** The default of each axis — the state every exported folder is a deviation from. */
export const DEFAULT_THEME_BRAND = 'blu' satisfies TThemeBrand;
export const DEFAULT_THEME_MODE = 'light' satisfies TThemeMode;
export const DEFAULT_THEME_LAYOUT = 'compact' satisfies TThemeLayout;

/**
 * The key of the fully-default theme: `blu`, `light`, `compact`.
 *
 * For the handful of tokens that carry no theme variance at all — the font
 * family, the Snackbar's dwell times — read here rather than writing a key
 * literal, so nothing in the codebase depends on how keys are spelled.
 */
export const DEFAULT_THEME_SOURCE_KEY =
  `${DEFAULT_THEME_MODE}@${DEFAULT_THEME_LAYOUT}` satisfies TThemeSourceKey;

/** What to resolve. Every axis is optional and falls back to its default. */
export interface IThemeRequest {
  brand?: TThemeBrand;
  mode?: TThemeMode;
  layout?: TThemeLayout;
}

/** Every axis of a theme request, with its default filled in. */
export interface IThemeAxes {
  brand: TThemeBrand;
  mode: TThemeMode;
  layout: TThemeLayout;
}

/** The outcome of {@link resolveTheme}. */
export interface IResolvedTheme extends IThemeAxes {
  /** The key to read tokens with. */
  key: TThemeSourceKey;
  /**
   * The axes **as asked for**, before any fallback.
   *
   * Carried alongside the effective values so a caller can name which axis was
   * dropped instead of guessing. Without it, a warning can only say that
   * *something* fell back — which is how Storybook's notice ended up blaming the
   * brand for a layout that had been overridden by the mode.
   */
  requested: IThemeAxes;
  /**
   * `false` only when a brand was asked for **in a non-default mode**, the one
   * combination the export cannot produce. The brand gives way and that is
   * reported rather than hidden: a silent fallback would show a titanium Button
   * in light while the toolbar claimed dark.
   *
   * Layout never causes this — it composes with both other axes.
   */
  isExact: boolean;
}

/**
 * Resolves a request across the three axes to one token key.
 *
 * `layout` always survives. `brand` and `mode` compete for `color.json`, and
 * **mode wins**: it moves ~1042 colour tokens against the brand's 180, and it is
 * the axis carrying contrast, which is the one with accessibility riding on it.
 * Losing the brand costs the viewer less than losing legibility.
 *
 * @param request - The desired brand, mode and layout.
 * @returns The key to read with, the axes actually in effect, what was asked
 *   for, and whether the match was exact.
 */
export const resolveTheme = ({
  brand = DEFAULT_THEME_BRAND,
  mode = DEFAULT_THEME_MODE,
  layout = DEFAULT_THEME_LAYOUT,
}: IThemeRequest = {}): IResolvedTheme => {
  const requested: IThemeAxes = { brand, mode, layout };

  if (mode !== DEFAULT_THEME_MODE) {
    // The mode holds the colour, so any brand alongside it has to give way.
    return {
      key: `${mode}@${layout}`,
      brand: DEFAULT_THEME_BRAND,
      mode,
      layout,
      requested,
      isExact: brand === DEFAULT_THEME_BRAND,
    };
  }
  if (brand !== DEFAULT_THEME_BRAND) {
    return {
      key: `${brand}@${layout}`,
      brand,
      mode: DEFAULT_THEME_MODE,
      layout,
      requested,
      isExact: true,
    };
  }
  return {
    key: `${DEFAULT_THEME_MODE}@${layout}`,
    brand: DEFAULT_THEME_BRAND,
    mode: DEFAULT_THEME_MODE,
    layout,
    requested,
    isExact: true,
  };
};

/**
 * Which modes an exported theme exists in for a given brand.
 *
 * Only `blu` has all six: the mode folders are blu snapshots, so every other
 * brand exists in `light` alone. Selectors use this to show what is real instead
 * of offering combinations that fall back.
 *
 * There is no `layoutsForBrand`, deliberately — every brand works in all three
 * layouts, because the axes compose.
 */
export const modesForBrand = (brand: TThemeBrand): readonly TThemeMode[] =>
  brand === DEFAULT_THEME_BRAND ? THEME_MODES : [DEFAULT_THEME_MODE];

/**
 * Builds a component's per-theme token record from its reader.
 *
 * Replaces the hand-written `{ light: readX('light'), dark: readX('dark') }` the
 * 26 token modules used to end with. Written once here so that the day these
 * stop being resolved eagerly at import time — the tracked follow-up — it is one
 * change rather than 26.
 *
 * @param read - Resolves every token a component needs for one theme.
 * @returns That component's tokens, keyed by theme.
 */
export const fromThemeSources = <T,>(read: (key: TThemeSourceKey) => T): Record<TThemeSourceKey, T> =>
  Object.fromEntries(
    (Object.keys(themeSources) as TThemeSourceKey[]).map((key) => [key, read(key)]),
  ) as Record<TThemeSourceKey, T>;

/**
 * The tokens of a single theme, pulled out of a component's per-theme record.
 *
 * Use this instead of indexing with a key literal — `TTokensOf<typeof
 * cardTokens>` rather than `(typeof cardTokens)['light']`. The old form named a
 * key, so it broke the day keys stopped being plain mode names.
 */
export type TTokensOf<TRecord> = TRecord[keyof TRecord];

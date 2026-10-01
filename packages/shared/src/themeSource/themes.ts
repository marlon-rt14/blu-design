import androidBorderRadius from '../theme/android/border-radius.json';
import androidBorderWidth from '../theme/android/border-width.json';
import androidDimensionFile from '../theme/android/dimension.json';
import androidFontFamily from '../theme/android/font-family.json';
import androidFontSize from '../theme/android/font-size.json';
import androidFontWeight from '../theme/android/font-weight.json';
import androidLineHeight from '../theme/android/line-height.json';
import androidSize from '../theme/android/size.json';
import androidSpace from '../theme/android/space.json';
import androidStringFile from '../theme/android/string.json';
import clubmilesColor from '../theme/clubmiles/color.json';
import darkColor from '../theme/dark/color.json';
import darkDimensionFile from '../theme/dark/dimension.json';
import discoverColor from '../theme/discover/color.json';
import expandedDimensionFile from '../theme/expanded/dimension.json';
import expandedFontSize from '../theme/expanded/font-size.json';
import expandedSize from '../theme/expanded/size.json';
import expandedSpace from '../theme/expanded/space.json';
import grandtableColor from '../theme/grandtable/color.json';
import hcdarkColor from '../theme/hcdark/color.json';
import hcdarkDimensionFile from '../theme/hcdark/dimension.json';
import hclightBorderWidth from '../theme/hclight/border-width.json';
import hclightColor from '../theme/hclight/color.json';
import hclightDimensionFile from '../theme/hclight/dimension.json';
import lightBorderRadius from '../theme/light/border-radius.json';
import lightBorderWidth from '../theme/light/border-width.json';
import lightColor from '../theme/light/color.json';
import lightDimensionFile from '../theme/light/dimension.json';
import lightFontFamily from '../theme/light/font-family.json';
import lightFontSize from '../theme/light/font-size.json';
import lightFontWeight from '../theme/light/font-weight.json';
import lightLetterSpacing from '../theme/light/letter-spacing.json';
import lightLineHeight from '../theme/light/line-height.json';
import lightOpacity from '../theme/light/opacity.json';
import lightSize from '../theme/light/size.json';
import lightSpace from '../theme/light/space.json';
import lightStringFile from '../theme/light/string.json';
import lightTypography from '../theme/light/typography.json';
import mcdarkColor from '../theme/mcdark/color.json';
import mclightColor from '../theme/mclight/color.json';
import regularBorderRadius from '../theme/regular/border-radius.json';
import regularDimensionFile from '../theme/regular/dimension.json';
import regularFontSize from '../theme/regular/font-size.json';
import regularSize from '../theme/regular/size.json';
import regularSpace from '../theme/regular/space.json';
import titaniumColor from '../theme/titanium/color.json';
import webBorderRadius from '../theme/web/border-radius.json';
import webDimensionFile from '../theme/web/dimension.json';
import webFontFamily from '../theme/web/font-family.json';
import webFontSize from '../theme/web/font-size.json';
import webFontWeight from '../theme/web/font-weight.json';
import webLineHeight from '../theme/web/line-height.json';
import webSize from '../theme/web/size.json';
import webSpace from '../theme/web/space.json';
import webStringFile from '../theme/web/string.json';

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
 * Which operating system the surface is running on — Figma's `5. Platform`
 * collection, and the axis that arrived last (export of 2026-09-30).
 *
 * Moves 140 dimension/string tokens and **0 colours**. Nearly all of them live
 * under `platform/*`, but five reach a component through an alias and those are
 * the ones that show: `radius/action` (web 12 · iOS pill · Android 12),
 * `radius/field/{sm,md}` (12 · 12 · **4**), `font/size/body/{sm,md}`
 * (14/16 · 15/17 · 14/16) and `font/family/text`.
 *
 * Not the same thing as *native vs hybrid*. Every component reads this axis;
 * what the 14 native ones additionally do is change **anatomy**, which is a
 * different mechanism and not tokens. That list is design's — see the Figma
 * frame `Nativos e híbridos` (`1694:37`).
 */
export type TThemePlatform = 'web' | 'ios' | 'android';

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
 * It allows 90, because **layout and platform are orthogonal to everything,
 * measured**. All six pairwise intersections of the four axes are empty:
 *
 * ```
 *              moves   PLATFORM  MODE  LAYOUT  BRAND
 *  PLATFORM     140        -       0      0      0
 *  MODE          17        0       -      0      0
 *  LAYOUT        68        0       0      -      0
 *  BRAND          0        0       0      0      -
 * ```
 *
 * On colour it is just as clean: `layout` and `platform` move **0** colour
 * tokens — their folders ship `light`'s `color.json` byte for byte — and
 * `brand` moves **0** dimension tokens.
 *
 * So `dark` + `regular` + `android` is not a fallback: it is dark's colour,
 * regular's spacing, android's radii and dark's 7 `elevation` shadows, every
 * token coming from a file that actually declares it. See
 * {@link composeDimension}.
 *
 * What remains impossible is a brand in a non-default mode — `discover` in
 * `hc-light` is a dark brick red in Figma that appears in no exported folder.
 * That case, and only that case, falls back and reports
 * {@link IResolvedTheme.isExact} as `false`.
 */
export type TThemeSourceKey = `${TThemeColorSource}@${TThemeLayout}@${TThemePlatform}`;

/**
 * The four token trees a theme is read through.
 *
 * Four **trees**, no longer four files: the sync of 2026-09-29 split the export
 * into 14 files per folder, one per Style Dictionary category. Nine groups left
 * `dimension.json` for files of their own — `size`, `space`, `border-radius`,
 * `border-width`, `font-size`, `line-height`, `letter-spacing`, `font-weight`
 * and `opacity` — and `font/family` left `string.json`. {@link dimensionTree}
 * and {@link lightString} put them back together, so a token path keeps naming
 * the token and not the file it happens to ship in.
 *
 * Reassembling rather than renaming is deliberate: the alternative was a
 * category prefix per read (`size.size.control.height.lg`), which would have
 * rewritten 58 of the 90 paths across 46 `*.tokens.ts` files and tied every one
 * of them to how the exporter chooses to shard its output next time.
 */
export interface IThemeSource {
  color: unknown;
  dimension: unknown;
  typography: unknown;
  string: unknown;
}

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
 * Unwraps the single category object a Supernova file wraps its tokens in.
 *
 * Every exported file is `{ "_comment": …, "<category>": { … } }`, and the
 * category is named after the **file**, not after the tokens: `size.json` holds
 * `size.size.control.*` and `border-radius.json` holds
 * `border-radius.radius.action`. Dropping that outer key is what lets the pieces
 * merge back into one tree.
 */
const categoryBody = (file: unknown): TTokenNode => {
  const body = Object.entries(file as TTokenNode).find(([segment]) => segment !== '_comment')?.[1];
  return (body ?? {}) as TTokenNode;
};

/**
 * Deep-merges token groups, leaf by leaf.
 *
 * Has to be deep, not a spread: five separate files contribute a `font` group
 * (`font.weight` from `dimension.json`, `font.size` from `font-size.json`,
 * `font.family`, `font.line-height`, `font.letter-spacing`), and several
 * contribute `platform` and `chart`. Measured across all 15 folders before
 * relying on it: **no leaf is declared twice**, so the merge has no winner to
 * pick and the order of the files does not matter.
 */
const mergeTokenGroups = (
  into: Record<string, unknown>,
  from: TTokenNode,
): Record<string, unknown> => {
  for (const [segment, node] of Object.entries(from)) {
    const existing = into[segment];
    const bothGroups =
      typeof existing === 'object' &&
      existing !== null &&
      !isTokenLeaf(existing) &&
      typeof node === 'object' &&
      node !== null &&
      !isTokenLeaf(node);
    into[segment] = bothGroups
      ? mergeTokenGroups({ ...(existing as Record<string, unknown>) }, node as TTokenNode)
      : node;
  }
  return into;
};

/** Merges several exported files into one tree rooted at `root`. */
const categoryTree = (root: string, files: readonly unknown[]): unknown => ({
  [root]: files.reduce<Record<string, unknown>>(
    (merged, file) => mergeTokenGroups(merged, categoryBody(file)),
    {},
  ),
});

/**
 * The ten exported files that make up one `dimension` tree.
 *
 * An object rather than ten positional parameters, because the platform axis
 * moves nine of the ten and a ten-argument call is unreadable — `letter-spacing`
 * and `opacity` are the only two that are byte-identical in all 18 folders.
 */
interface IDimensionFiles {
  dimension: unknown;
  borderRadius: unknown;
  borderWidth: unknown;
  fontSize: unknown;
  fontWeight: unknown;
  lineHeight: unknown;
  size: unknown;
  space: unknown;
}

/** Rebuilds the one `dimension` tree every `*.tokens.ts` reads. */
const dimensionTree = (files: IDimensionFiles): unknown =>
  categoryTree('dimension', [
    files.dimension,
    files.borderRadius,
    files.borderWidth,
    files.fontSize,
    files.fontWeight,
    files.lineHeight,
    files.size,
    files.space,
    lightLetterSpacing,
    lightOpacity,
  ]);

/** What `light` contributes, which is also what `ios` contributes — see {@link PLATFORM_SOURCES}. */
const LIGHT_FILES: IDimensionFiles = {
  dimension: lightDimensionFile,
  borderRadius: lightBorderRadius,
  borderWidth: lightBorderWidth,
  fontSize: lightFontSize,
  fontWeight: lightFontWeight,
  lineHeight: lightLineHeight,
  size: lightSize,
  space: lightSpace,
};

/**
 * The distinct dimension trees, one per folder that actually moves a dimension.
 *
 * Four axes contribute and they touch **disjoint** key sets — measured, all six
 * pairwise intersections are empty (see {@link TThemeSourceKey}), which is why
 * {@link composeDimension} can overlay them in any order without arbitrating.
 *
 * - **mode** moves 17 keys: `border/*`, `chart/*`, `focus/*`, `elevation/*`
 * - **layout** moves 68: `space/*`, `font/size/*`, `size/control/*`, `radius/*`
 * - **platform** moves 140, nearly all under `platform/*`
 * - **brand** moves **0**, which is why no brand appears here
 */
const lightDimension = dimensionTree(LIGHT_FILES);
const darkDimension = dimensionTree({ ...LIGHT_FILES, dimension: darkDimensionFile });
const hclightDimension = dimensionTree({
  ...LIGHT_FILES,
  dimension: hclightDimensionFile,
  borderWidth: hclightBorderWidth,
});
const hcdarkDimension = dimensionTree({
  ...LIGHT_FILES,
  dimension: hcdarkDimensionFile,
  borderWidth: hclightBorderWidth,
});
const regularDimension = dimensionTree({
  ...LIGHT_FILES,
  dimension: regularDimensionFile,
  borderRadius: regularBorderRadius,
  fontSize: regularFontSize,
  size: regularSize,
  space: regularSpace,
});
const expandedDimension = dimensionTree({
  ...LIGHT_FILES,
  dimension: expandedDimensionFile,
  borderRadius: regularBorderRadius,
  fontSize: expandedFontSize,
  size: expandedSize,
  space: expandedSpace,
});
const webDimension = dimensionTree({
  dimension: webDimensionFile,
  borderRadius: webBorderRadius,
  borderWidth: lightBorderWidth,
  fontSize: webFontSize,
  fontWeight: webFontWeight,
  lineHeight: webLineHeight,
  size: webSize,
  space: webSpace,
});
const androidDimension = dimensionTree({
  dimension: androidDimensionFile,
  borderRadius: androidBorderRadius,
  borderWidth: androidBorderWidth,
  fontSize: androidFontSize,
  fontWeight: androidFontWeight,
  lineHeight: androidLineHeight,
  size: androidSize,
  space: androidSpace,
});

/**
 * The `string` tree: the export's own `string.json` plus `font-family.json`.
 *
 * `font/family/*` is a string token that the split moved into a file of its
 * own. It belongs here rather than in {@link dimensionTree} — a family name is
 * not a measurement — and it is what {@link DEFAULT_THEME_SOURCE_KEY} reads
 * `string.font.family.mulish` out of.
 *
 * **Three of them, because the platform moves it**: `font/family/text` resolves
 * to Mulish on web, SF Pro on iOS and Roboto on Android, and `platform/variant`
 * names the platform outright. Brand, mode and layout leave it untouched — the
 * file is byte-identical in all 15 of their folders.
 */
const lightString = categoryTree('string', [lightStringFile, lightFontFamily]);
const webString = categoryTree('string', [webStringFile, webFontFamily]);
const androidString = categoryTree('string', [androidStringFile, androidFontFamily]);

/**
 * The colour and dimension files each colour source contributes.
 *
 * **Deduplicated on purpose.** The export ships 15 folders — 210 files, 18 MB —
 * and most are byte-identical:
 *
 * - `base`, `blu`, `light` and `compact` are identical in **every** file, so
 *   `light` is the only one imported. `base` was the old name for it, `blu` is
 *   the default brand and `compact` the default layout, so by definition all
 *   three are what `light` already resolves to. `compact` arriving as its own
 *   folder is in fact how the default of that axis was confirmed.
 * - `typography.json`, `string.json`, `font-family.json`, `font-weight.json`,
 *   `letter-spacing.json`, `line-height.json` and `opacity.json` are identical
 *   across all 15 folders, so they are imported once.
 * - `mc-light` shares `light`'s dimensions and `mc-dark` shares `dark`'s; the
 *   brands share `light`'s outright.
 *
 * That takes the import set from 210 files to 36, and the JSON in the bundle
 * from 18 MB to 10.1 MB. It is still far more than the 2.0 MB two themes cost,
 * which is why lazy loading is a tracked follow-up: these are static imports, so
 * the bundler includes every one of them whether a screen uses it or not.
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

/**
 * What each platform contributes: its dimensions **and** its strings.
 *
 * The only axis that moves `string.json`, which is why this is a pair and
 * `LAYOUT_DIMENSIONS` is not.
 *
 * **`ios` reuses `light`'s trees by identity, and that is not a shortcut**: the
 * 14 files of `theme/ios/` are byte-identical to `theme/light/`. The export was
 * taken with `5. Platform` pinned to iOS, so every non-platform folder carries
 * iOS values. That is exactly why wiring this axis is what fixes the web — it
 * had been reading iOS all along, silently.
 */
const PLATFORM_SOURCES: Record<TThemePlatform, { dimension: unknown; string: unknown }> = {
  web: { dimension: webDimension, string: webString },
  ios: { dimension: lightDimension, string: lightString },
  android: { dimension: androidDimension, string: androidString },
};

/**
 * Overlays any number of dimension trees onto `light`.
 *
 * Walks `light` and, per token, takes the value of the **first contributor that
 * moved it off light**. That is how three axes' edits stay separable without a
 * hand-written list of which token belongs to whom — and "first" is never a
 * choice, because their key sets are disjoint: all six pairwise intersections
 * are empty (see {@link TThemeSourceKey}). No token is ever claimed twice, so
 * the walk cannot pick a loser.
 *
 * Returns an existing tree by identity whenever fewer than two contributors have
 * anything to add, so only combinations that genuinely mix axes are ever built —
 * 4 colour sources x 2 non-default layouts x 2 non-default platforms.
 */
const composeDimension = (...contributors: readonly unknown[]): unknown => {
  const moved = contributors.filter((tree) => tree !== lightDimension);
  if (moved.length === 0) return lightDimension;
  if (moved.length === 1) return moved[0];

  const walk = (base: unknown, overlays: readonly unknown[]): unknown => {
    if (isTokenLeaf(base)) {
      const moving = overlays.find(
        (overlay) => isTokenLeaf(overlay) && overlay.value !== base.value,
      );
      return moving ?? base;
    }
    if (typeof base !== 'object' || base === null) return base;
    const composed: Record<string, unknown> = {};
    for (const segment of Object.keys(base as TTokenNode)) {
      composed[segment] = walk(
        (base as TTokenNode)[segment],
        overlays.map((overlay) => (overlay as TTokenNode | undefined)?.[segment]),
      );
    }
    return composed;
  };

  return walk(lightDimension, moved);
};

/**
 * Raw, fully-resolved token trees per theme. Component token modules (e.g.
 * `card.tokens.ts`) read out of these with `readThemeToken` /
 * `readThemeDimension` / `readThemeTypography` rather than importing the JSON
 * directly, so the path lookup and error handling only live in one place.
 *
 * One entry per {@link TThemeSourceKey} — 10 colour sources x 3 layouts x 3
 * platforms = 90. `color` and `typography` are shared by reference across the 9
 * layout x platform combinations of each source, because neither axis moves
 * them; only `dimension` and `string` are actually composed.
 */
export const themeSources: Record<TThemeSourceKey, IThemeSource> = Object.fromEntries(
  (Object.keys(COLOR_SOURCES) as TThemeColorSource[]).flatMap((source) =>
    (Object.keys(LAYOUT_DIMENSIONS) as TThemeLayout[]).flatMap((layout) =>
      (Object.keys(PLATFORM_SOURCES) as TThemePlatform[]).map((platform) => [
        `${source}@${layout}@${platform}`,
        {
          color: COLOR_SOURCES[source].color,
          dimension: composeDimension(
            COLOR_SOURCES[source].dimension,
            LAYOUT_DIMENSIONS[layout],
            PLATFORM_SOURCES[platform].dimension,
          ),
          typography: lightTypography,
          string: PLATFORM_SOURCES[platform].string,
        },
      ]),
    ),
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
export const THEME_PLATFORMS: readonly TThemePlatform[] = ['web', 'ios', 'android'];

/** The default of each axis — the state every exported folder is a deviation from. */
export const DEFAULT_THEME_BRAND = 'blu' satisfies TThemeBrand;
export const DEFAULT_THEME_MODE = 'light' satisfies TThemeMode;
export const DEFAULT_THEME_LAYOUT = 'compact' satisfies TThemeLayout;
/**
 * `web`, and **not** because the export defaults to it — it does not, every
 * non-platform folder carries iOS values.
 *
 * Each runtime knows its own platform and the provider always passes it
 * (`Platform.OS` on mobile, `'web'` on web), so this default only ever governs
 * the handful of reads that go through {@link DEFAULT_THEME_SOURCE_KEY} and
 * carry no platform variance anyway. Declaring `web` means that if something
 * ever *does* forget to pass one, the web gets web values instead of silently
 * reproducing iOS — which is the bug this axis exists to end.
 */
export const DEFAULT_THEME_PLATFORM = 'web' satisfies TThemePlatform;

/**
 * The key of the fully-default theme: `blu`, `light`, `compact`, `web`.
 *
 * For the handful of tokens that carry no theme variance at all — the font
 * family, the Snackbar's dwell times — read here rather than writing a key
 * literal, so nothing in the codebase depends on how keys are spelled.
 */
export const DEFAULT_THEME_SOURCE_KEY =
  `${DEFAULT_THEME_MODE}@${DEFAULT_THEME_LAYOUT}@${DEFAULT_THEME_PLATFORM}` satisfies TThemeSourceKey;

/** What to resolve. Every axis is optional and falls back to its default. */
export interface IThemeRequest {
  brand?: TThemeBrand;
  mode?: TThemeMode;
  layout?: TThemeLayout;
  platform?: TThemePlatform;
}

/** Every axis of a theme request, with its default filled in. */
export interface IThemeAxes {
  brand: TThemeBrand;
  mode: TThemeMode;
  layout: TThemeLayout;
  platform: TThemePlatform;
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
   * Layout and platform never cause this — both compose with every other axis,
   * measured: all six pairwise intersections are empty.
   */
  isExact: boolean;
}

/**
 * Resolves a request across the four axes to one token key.
 *
 * `layout` and `platform` always survive. `brand` and `mode` compete for `color.json`, and
 * **mode wins**: it moves ~1042 colour tokens against the brand's 180, and it is
 * the axis carrying contrast, which is the one with accessibility riding on it.
 * Losing the brand costs the viewer less than losing legibility.
 *
 * @param request - The desired brand, mode, layout and platform.
 * @returns The key to read with, the axes actually in effect, what was asked
 *   for, and whether the match was exact.
 */
export const resolveTheme = ({
  brand = DEFAULT_THEME_BRAND,
  mode = DEFAULT_THEME_MODE,
  layout = DEFAULT_THEME_LAYOUT,
  platform = DEFAULT_THEME_PLATFORM,
}: IThemeRequest = {}): IResolvedTheme => {
  const requested: IThemeAxes = { brand, mode, layout, platform };
  // Layout and platform survive every request: their key sets are disjoint from
  // the colour axes' and from each other's, so there is nothing to arbitrate.
  const tail = `${layout}@${platform}` as const;

  if (mode !== DEFAULT_THEME_MODE) {
    // The mode holds the colour, so any brand alongside it has to give way.
    return {
      key: `${mode}@${tail}`,
      brand: DEFAULT_THEME_BRAND,
      mode,
      layout,
      platform,
      requested,
      isExact: brand === DEFAULT_THEME_BRAND,
    };
  }
  if (brand !== DEFAULT_THEME_BRAND) {
    return {
      key: `${brand}@${tail}`,
      brand,
      mode: DEFAULT_THEME_MODE,
      layout,
      platform,
      requested,
      isExact: true,
    };
  }
  return {
    key: `${DEFAULT_THEME_MODE}@${tail}`,
    brand: DEFAULT_THEME_BRAND,
    mode: DEFAULT_THEME_MODE,
    layout,
    platform,
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

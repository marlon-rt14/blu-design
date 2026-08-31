import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type { TIconColor, TIconSize } from '../types/atoms/icon.types';

/**
 * Every semantic icon colour, for one theme.
 *
 * The full `color/icon/*` group — 33 roles. Unlike every other component in the
 * library this does **not** come from `color.component.*`: there is no
 * `color/component/icon` group at all, because colour is not part of the Icon's
 * design API. The component consumes the semantic layer directly, which is also
 * why the whole group is exposed rather than a hand-picked subset — there is no
 * component layer to tell us which roles are "the Icon's".
 *
 * 30 of the 33 shift between light and dark. The three that hold are
 * `action.on-scene.default`, `fixed.white` and `on-media.disabled` — all three
 * sit on a surface the design system does not control, so they cannot follow the
 * mode.
 */
export type TIconColorTokens = Record<TIconColor, string>;

/** Edge length per size step. */
export interface IIconDimensionTokens {
  /**
   * `size/icon/*` — 8 · 12 · 16 · 24 · 32 · 40.
   *
   * Identical in both themes: `dimension.size.icon.*` is one of the groups that
   * does not vary by mode. Kept inside the per-theme record anyway, so the
   * shape matches every other component's tokens and so a future divergence
   * needs no restructuring.
   */
  size: Record<TIconSize, number>;
}

/** Every token an Icon needs, resolved for a single theme. */
export interface IIconTokens {
  colors: TIconColorTokens;
  dimension: IIconDimensionTokens;
}

/**
 * The grid every bDS glyph is drawn on, as an SVG `viewBox`.
 *
 * A constant rather than a token: it is a property of the artwork, not of the
 * theme, and it never varies. 24 is verified — not 40, despite a 40x40 export
 * looking canonical. Those coordinates divide back to round numbers at 24 (a
 * `40` export of `image` has `4.16669`, which is `2.5` scaled by 40/24), so 24
 * is the grid and `size/icon/*` scales it. Nothing is redrawn per size, which is
 * also why `2xs` (8) is documented as a mark rather than an icon.
 */
export const ICON_VIEW_BOX = '0 0 24 24';

const SIZES: readonly TIconSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];

/**
 * The 33 roles of `color/icon/*`, in token order.
 *
 * Listed explicitly rather than walked out of the JSON: the union in
 * `icon.types.ts` and this array have to agree, and enumerating both means the
 * compiler catches a drift the moment Supernova adds or removes a role.
 */
const COLORS: readonly TIconColor[] = [
  'primary',
  'secondary',
  'tertiary',
  'disabled',
  'brand',
  'danger',
  'success',
  'info',
  'warning',
  'inverse',
  'on-brand',
  'on-selected',
  'partner-deuna',
  'fixed.white',
  'on-inverse.danger',
  'on-inverse.disabled',
  'on-inverse.info',
  'on-inverse.success',
  'on-inverse.warning',
  'on-scene.default',
  'on-scene.secondary',
  'on-media.disabled',
  'complementary.aqua',
  'complementary.indigo',
  'complementary.tangerine',
  'action.primary.default',
  'action.primary.quiet.default',
  'action.primary.soft.default',
  'action.danger.default',
  'action.danger.quiet.default',
  'action.danger.soft.default',
  'action.neutral.default',
  'action.on-scene.default',
];

const readIconTokens = (mode: TThemeMode): IIconTokens => {
  const { color, dimension } = themeSources[mode];

  // The doubled `color.` is not a typo. The first segment is the export's file
  // wrapper, the second is the semantic role group *also* named `color` — so
  // Figma's `color/icon/primary` lands at `color.color.icon.primary`, while a
  // component token like the Button's lands at `color.component.button.*`.
  const colorAt = (role: TIconColor): string =>
    readThemeToken(color, `color.color.icon.${role}`);
  const sizeAt = (step: TIconSize): number =>
    readThemeDimension(dimension, `dimension.size.icon.${step}`);

  return {
    colors: Object.fromEntries(COLORS.map((role) => [role, colorAt(role)])) as TIconColorTokens,
    dimension: {
      size: Object.fromEntries(SIZES.map((step) => [step, sizeAt(step)])) as Record<
        TIconSize,
        number
      >,
    },
  };
};

/**
 * Icon tokens, keyed by theme mode.
 *
 * Source: `color.color.icon.*` and `dimension.size.icon.*` in `theme/base`
 * (light) and `theme/dark`. Both platforms pick the right entry at render time
 * via `useThemeMode()`.
 *
 * Verified against Figma on 2026-08-31, component set `576:23427`: each of the
 * six variants binds its own `size/icon/*` and the values match the export
 * exactly (8 · 12 · 16 · 24 · 32 · 40). All six also render
 * `color/icon/primary`, which is the glyph's default fill rather than a design
 * axis — the component has no colour property.
 */
export const iconTokens: Record<TThemeMode, IIconTokens> = {
  light: readIconTokens('light'),
  dark: readIconTokens('dark'),
};

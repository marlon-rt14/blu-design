import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TCardPadding } from '../types/atoms/card.types';

/** Every colour a Card needs, resolved for a single theme. */
export interface ICardColorTokens {
  /**
   * The surface itself.
   *
   * `component/card/surface/bg` — the only co-token this component has, and the
   * one it shares with ListGroup. It was renamed from
   * `component/listgroup/surface/bg` on 2026-09-01 keeping its ID, which is why
   * the `listgroup` group no longer exists in the export.
   *
   * **The Figma file still shows the old name.** Reading the component's
   * variables back returns `component/listgroup/surface/bg` for this exact
   * binding, so anyone inspecting the design will see `listgroup` where this
   * code says `card`. Same variable, same ID — only the export has caught up.
   */
  surface: string;
  /**
   * Border of the `raised` ramp.
   *
   * `#00000000` in both exported themes, so today it is an invisible 1px that
   * only occupies space. It is read rather than skipped on purpose: bDS puts the
   * background separation on this border in the contrast modes, and reading the
   * token means the card starts showing one the day such a theme ships, with no
   * code change.
   */
  raisedBorder: string;
  /** Near shadow of the `raised` ramp — the one that does the work. */
  raisedShadowNear: string;
  /**
   * Far shadow of the `raised` ramp.
   *
   * Transparent in `dark`, where its blur and offset are `0` as well, so a dark
   * raised card separates on the near shadow alone.
   */
  raisedShadowFar: string;
}

/** Every metric a Card needs, resolved for a single theme. */
export interface ICardDimensionTokens {
  /** `radius/surface/md` (16). The surface ramp, not the control one. */
  borderRadius: number;
  /**
   * Width of the `raised` border, from `border/width/default`.
   *
   * **1px, measured against the component** (`704:33353`): the variant is
   * 320x102 and its content slot sits at `x: 1, y: 1` with `318x100`, so the
   * border takes exactly one pixel per side. That is what makes a raised card
   * 2px bigger than a flat one with the same content.
   *
   * The token is a deliberate choice rather than a reading, because **Figma
   * binds no width variable here** — the stroke is a loose `1`. Binding
   * `border/width/default` matches it in both exported themes and diverges in
   * the two high-contrast ones, where the token is `2` and Figma would still
   * draw `1`. Ours is the more useful of the two: in those modes this border
   * *is* the separation from the background, so a thicker one is the point.
   * Reported to design; if they disagree, hardcode the `1`.
   */
  raisedBorderWidth: number;
  /** Inner padding per `padding` step. `none` is `0`, `md` is `space/inset/md`. */
  padding: Record<TCardPadding, number>;
  /** Vertical offset and blur of each shadow layer. There is no x and no spread. */
  raisedShadowNearY: number;
  raisedShadowNearBlur: number;
  raisedShadowFarY: number;
  raisedShadowFarBlur: number;
}

/** Every token a Card needs, resolved for a single theme. */
export interface ICardTokens {
  colors: ICardColorTokens;
  dimension: ICardDimensionTokens;
}

const readCardTokens = (key: TThemeSourceKey): ICardTokens => {
  const { color, dimension } = themeSources[key];
  // Note the single `color.` here: the elevation ramp sits at the top level of
  // the export, next to `color.color.*`, not inside it. Same as the Snackbar.
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  return {
    colors: {
      surface: colorAt('component.card.surface.bg'),
      raisedBorder: colorAt('elevation.raised.border'),
      raisedShadowNear: colorAt('elevation.raised.shadow.near'),
      raisedShadowFar: colorAt('elevation.raised.shadow.far'),
    },
    dimension: {
      borderRadius: dimensionAt('radius.surface.md'),
      raisedBorderWidth: dimensionAt('border.width.default'),
      padding: { none: 0, md: dimensionAt('space.inset.md') },
      raisedShadowNearY: dimensionAt('elevation.raised.shadow.near-y'),
      raisedShadowNearBlur: dimensionAt('elevation.raised.shadow.near-blur'),
      raisedShadowFarY: dimensionAt('elevation.raised.shadow.far-y'),
      raisedShadowFarBlur: dimensionAt('elevation.raised.shadow.far-blur'),
    },
  };
};

/**
 * Card tokens, keyed by theme mode.
 *
 * Source: `color.component.card.surface.bg`, the `color.elevation.raised.*`
 * ramp and `dimension.*`. The surface differs between themes (`#ffffff` /
 * `#333b4d`) and so does the whole raised ramp; the radius and the padding do
 * not.
 */
export const cardTokens = fromThemeSources(readCardTokens);

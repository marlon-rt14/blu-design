import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type { TTooltipType } from '../types/molecules/tooltip.types';

/** Every colour a Tooltip needs, resolved for a single theme. */
export interface ITooltipColorTokens {
  /**
   * The panel.
   *
   * `#232b3d` in light and `#e6e8ec` in dark — it is the *inverse* surface, so
   * it flips with the mode. That darkness is the signal: bDS separates the two
   * floating patterns by it, *"claro = apareció solo y trae controles, oscuro =
   * lo pediste vos"*. A Coachmark is light; a Tooltip is dark.
   */
  surface: string;
  title: string;
  body: string;
  /**
   * Fill of the pointer, from the `tippointer` group rather than this one.
   *
   * Equal to {@link surface} in both themes and read separately anyway, because
   * they are separate tokens and the pointer is a shared component: the same
   * `.TipPointer` serves the Menu and the Coachmark with `tone="floating"`,
   * where the two values differ.
   */
  pointer: string;
  shadowNear: string;
  shadowFar: string;
}

/** One resolved typography role. */
export interface ITooltipTypographyRole {
  fontWeight: string;
  fontSize: number;
  /** A **ratio**, not pixels — CSS takes it as given, React Native needs it multiplied. */
  lineHeightRatio: number;
}

/**
 * Tooltip typography, composed from `font/*` primitives.
 *
 * The text styles bDS binds are `text/body/sm/strong` for the title and
 * `text/body/sm/default` for the body — same size, different weight. Neither
 * reaches the export, because a Figma text style is not a variable.
 */
export interface ITooltipTypographyTokens {
  title: ITooltipTypographyRole;
  body: ITooltipTypographyRole;
}

/** Metrics of the panel and the gaps inside it. */
export interface ITooltipDimensionTokens {
  /** Left and right padding, from `space/inset/md`. The same at both types. */
  paddingHorizontal: number;
  /**
   * Top and bottom padding, which **is not the same at both types**.
   *
   * `descriptive` takes `space/inset/sm` (8) and `info` takes `space/inset/md`
   * (12). Measured: the descriptive panel is 37 tall for one 21px line, and the
   * info panel is 95 for a 71px content column.
   */
  paddingVertical: Record<TTooltipType, number>;
  /**
   * Radius of the panel, also **different per type**: `radius/surface/sm` (12)
   * for `descriptive` and `radius/surface/md` (16) for `info`.
   *
   * Read off both variants rather than assumed — the two bind different tokens.
   */
  borderRadius: Record<TTooltipType, number>;
  /** Space between the text block and the link, from `space/stack/sm`. */
  linkGap: number;
  /** Space between the content column and the dismiss, from `space/inline/sm`. */
  dismissGap: number;
  /**
   * Distance from the trigger to the panel, from `space/8`.
   *
   * The gap the pointer lives in. `space/8` is a raw step rather than a
   * semantic one, and it is what the file binds.
   */
  offset: number;
  shadowNearY: number;
  shadowNearBlur: number;
  shadowFarY: number;
  shadowFarBlur: number;
}

/**
 * Space between the title and the body: **zero**.
 *
 * Not an oversight and not a token. Measured on the `info` variant, the title
 * ends at y=21 and the body starts at y=21. bDS states the rule for the
 * Coachmark and it holds here: *"comparten interlineado y el aire ya está
 * adentro de la caja de línea. eBay pone 8; nosotros no."*
 */
export const TOOLTIP_TITLE_BODY_GAP = 0;

/**
 * The pointer's box: 16 across the panel's edge by 10 deep.
 *
 * Not tokens — this is `.TipPointer`'s own size, and the component is hidden
 * from the assets panel (the leading dot) because nobody should instance it
 * loose. Rotated for the horizontal sides, so `left` and `right` get 10x16.
 */
export const TOOLTIP_POINTER_LENGTH = 16;
export const TOOLTIP_POINTER_DEPTH = 10;

/**
 * How far the pointer sits **inside** the panel: 2.
 *
 * Which is why it only protrudes 8 of its 10, and why a tooltip with a pointer
 * measures exactly 8 more than the same one at `placement="none"` — 37 against
 * 45 for `descriptive`, 95 against 103 for `info`. Both measured.
 */
export const TOOLTIP_POINTER_INSET = 2;

/** Every token a Tooltip needs, resolved for a single theme. */
export interface ITooltipTokens {
  colors: ITooltipColorTokens;
  dimension: ITooltipDimensionTokens;
  typography: ITooltipTypographyTokens;
}

/** Line-height ratio of `text/body/sm/*`. Not a token. */
const BODY_LINE_HEIGHT_RATIO = 1.5;

const readTooltipTokens = (mode: TThemeMode): ITooltipTokens => {
  const { color, dimension } = themeSources[mode];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const fontSize = dimensionAt('font.size.body.sm');

  return {
    colors: {
      surface: colorAt('component.tooltip.surface.bg'),
      title: colorAt('component.tooltip.content.title'),
      body: colorAt('component.tooltip.content.body'),
      pointer: colorAt('component.tippointer.punta.bg-inverse'),
      shadowNear: colorAt('elevation.overlay.shadow.near'),
      shadowFar: colorAt('elevation.overlay.shadow.far'),
    },
    dimension: {
      paddingHorizontal: dimensionAt('space.inset.md'),
      paddingVertical: {
        descriptive: dimensionAt('space.inset.sm'),
        info: dimensionAt('space.inset.md'),
      },
      borderRadius: {
        descriptive: dimensionAt('radius.surface.sm'),
        info: dimensionAt('radius.surface.md'),
      },
      linkGap: dimensionAt('space.stack.sm'),
      dismissGap: dimensionAt('space.inline.sm'),
      offset: dimensionAt('space.8'),
      shadowNearY: dimensionAt('elevation.overlay.shadow.near-y'),
      shadowNearBlur: dimensionAt('elevation.overlay.shadow.near-blur'),
      shadowFarY: dimensionAt('elevation.overlay.shadow.far-y'),
      shadowFarBlur: dimensionAt('elevation.overlay.shadow.far-blur'),
    },
    typography: {
      title: {
        fontWeight: String(dimensionAt('font.weight.extrabold')),
        fontSize,
        lineHeightRatio: BODY_LINE_HEIGHT_RATIO,
      },
      body: {
        fontWeight: String(dimensionAt('font.weight.regular')),
        fontSize,
        lineHeightRatio: BODY_LINE_HEIGHT_RATIO,
      },
    },
  };
};

/**
 * Tooltip tokens, keyed by theme mode.
 *
 * Source: the three co-tokens of `color.component.tooltip.*`, one from
 * `color.component.tippointer.*`, the `elevation.overlay` ramp and
 * `dimension.*`. Of the 23 the development documentation lists, the ones left
 * out belong to the nested instances and are read by those components
 * themselves: `radius/pill` and `size/control/height/xs` are the dismiss
 * IconButton's, and `font/*` beyond the body size is the LinkButton's.
 *
 * `space/inline/xs` (4) is bound on the `info` variant and **read by nothing
 * here**: it appears in no gap of the measured layout. Left unread rather than
 * guessed at.
 *
 * The panel is the inverse surface, so every colour flips between the two
 * themes. The pointer has no stroke: the `tippointer` group publishes a
 * `border-floating` but no `border-inverse`, and the tooltip uses the inverse
 * tone. The note in bDS about the pointer's stroke being bound to
 * `border/width/default` is about the shared `.TipPointer`, which the Coachmark
 * uses with `tone="floating"`.
 */
export const tooltipTokens: Record<TThemeMode, ITooltipTokens> = {
  light: readTooltipTokens('light'),
  dark: readTooltipTokens('dark'),
};

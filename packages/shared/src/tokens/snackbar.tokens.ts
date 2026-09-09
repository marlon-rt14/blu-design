import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import type { TSnackbarStatus } from '../types/atoms/snackbar.types';

/** IconButton `on-inverse` colours used by the local dismiss control. */
export interface ISnackbarDismissColorTokens {
  backgroundHover: string;
  backgroundPressed: string;
  icon: string;
  borderFocus: string;
}

export interface ISnackbarColorTokens {
  surface: string;
  border: string;
  text: string;
  icon: Record<TSnackbarStatus, string>;
  dismiss: ISnackbarDismissColorTokens;
  overlayShadowNear: string;
  overlayShadowFar: string;
}

/**
 * Message type is live-node `text/body/md/default` — Regular 16 / 150%.
 * Do **not** invent a `typography.component.snackbar` shorthand; none exists.
 */
export interface ISnackbarDimensionTokens {
  padding: number;
  contentGap: number;
  actionsGap: number;
  actionsInlineGap: number;
  borderWidth: number;
  borderRadius: number;
  iconSize: number;
  contentMinHeight: number;
  dismissSize: number;
  dismissIconSize: number;
  targetMin: number;
  pillRadius: number;
  focusRingOffset: number;
  focusRingSpread: number;
  overlayShadowNearY: number;
  overlayShadowNearBlur: number;
  overlayShadowFarY: number;
  overlayShadowFarBlur: number;
  /**
   * Figma copy: *"Ancho maximo 448"*. Not a theme leaf — searched
   * `dimension.json` for 448 and there is none. Do not invent a path.
   */
  maxWidth: number;
  zIndex: number;
  /** Vertical dy before the pan claims the gesture — `space/inline/sm`. */
  swipeCapture: number;
  /**
   * Autoclose without action — layout alias of `motion/dwell/default`
   * (`default_1` in the Token Studio export).
   */
  dwellDefaultMs: number;
  /**
   * Autoclose with `showAction` — layout alias of `motion/dwell/long`
   * (`long_1` in the Token Studio export).
   */
  dwellLongMs: number;
}

export interface ISnackbarTokens {
  colors: ISnackbarColorTokens;
  dimension: ISnackbarDimensionTokens;
  message: IThemeTypographyValue;
}

const SNACKBAR_MAX_WIDTH_PX = 448;

const readSnackbarTokens = (mode: TThemeMode): ISnackbarTokens => {
  const { color, dimension } = themeSources[mode];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const fontSize = dimensionAt('font.size.body.md');

  return {
    colors: {
      surface: colorAt('component.snackbar.surface.bg'),
      border: colorAt('component.snackbar.surface.border'),
      text: colorAt('component.snackbar.content.text'),
      icon: {
        info: colorAt('component.snackbar.icon.info'),
        success: colorAt('component.snackbar.icon.success'),
        warning: colorAt('component.snackbar.icon.warning'),
        danger: colorAt('component.snackbar.icon.danger'),
      },
      dismiss: {
        backgroundHover: colorAt('component.iconbutton.on-inverse.bg-hover'),
        backgroundPressed: colorAt('component.iconbutton.on-inverse.bg-pressed'),
        icon: colorAt('component.iconbutton.on-inverse.icon-default'),
        borderFocus: colorAt('component.iconbutton.focus.border-on-inverse'),
      },
      overlayShadowNear: colorAt('elevation.overlay.shadow.near'),
      overlayShadowFar: colorAt('elevation.overlay.shadow.far'),
    },
    dimension: {
      padding: dimensionAt('space.inset.md'),
      contentGap: dimensionAt('space.inline.md'),
      actionsGap: dimensionAt('space.inline.lg'),
      actionsInlineGap: dimensionAt('space.inline.xs'),
      borderWidth: dimensionAt('border.width.default'),
      borderRadius: dimensionAt('radius.surface.sm'),
      iconSize: dimensionAt('size.icon.md'),
      contentMinHeight: dimensionAt('size.control.height.sm'),
      dismissSize: dimensionAt('size.control.height.sm'),
      dismissIconSize: dimensionAt('size.icon.sm'),
      targetMin: dimensionAt('size.target.min'),
      pillRadius: dimensionAt('radius.pill'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      overlayShadowNearY: dimensionAt('elevation.overlay.shadow.near-y'),
      overlayShadowNearBlur: dimensionAt('elevation.overlay.shadow.near-blur'),
      overlayShadowFarY: dimensionAt('elevation.overlay.shadow.far-y'),
      overlayShadowFarBlur: dimensionAt('elevation.overlay.shadow.far-blur'),
      maxWidth: SNACKBAR_MAX_WIDTH_PX,
      zIndex: dimensionAt('z.toast_1'),
      swipeCapture: dimensionAt('space.inline.sm'),
      // Layout aliases (`*_1`) — same ms as primitives `motion.dwell.{default,long}`.
      dwellDefaultMs: dimensionAt('motion.dwell.default_1'),
      dwellLongMs: dimensionAt('motion.dwell.long_1'),
    },
    message: {
      fontWeight: String(dimensionAt('font.weight.regular')),
      fontSize,
      lineHeight: fontSize * (dimensionAt('font.line-height.normal') / 100),
      fontFamily: baseFontFamily,
    },
  };
};

export const snackbarTokens: Record<TThemeMode, ISnackbarTokens> = {
  light: readSnackbarTokens('light'),
  dark: readSnackbarTokens('dark'),
};

/**
 * Resolves autoclose dwell. Explicit `duration` wins; otherwise
 * `motion/dwell/long` when `showAction`, else `motion/dwell/default`.
 * Same across modes — dwell is not density-dependent.
 */
export const resolveSnackbarDurationMs = (duration: number | undefined, showAction: boolean): number => {
  const { dwellDefaultMs, dwellLongMs } = snackbarTokens.light.dimension;
  if (duration != null) {
    return duration;
  }
  return showAction ? dwellLongMs : dwellDefaultMs;
};

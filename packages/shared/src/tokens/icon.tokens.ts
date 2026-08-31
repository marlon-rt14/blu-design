import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type { TIconSize } from '../types/atoms/icon.types';

/**
 * Even-odd path of Figma's `icon/placeholder` glyph, viewBox `0 0 24 24`.
 * Fill was `#323949` (`color/icon/primary`) on the export; renderers paint
 * `currentColor` / the `color` prop instead so TextField can override.
 *
 * Temporary: replaced when the real Icon set lands.
 */
export const ICON_PLACEHOLDER_PATH =
  'M0 0H24V24H0V0ZM2.4 2.4V21.6H21.6V2.4H2.4ZM3.84 18.48L18.48 3.84L20.16 5.52L5.52 20.16L3.84 18.48Z';

/** Colors a standalone Icon needs, resolved for a single theme. */
export interface IIconColorTokens {
  primary: string;
  disabled: string;
}

/** Every token an Icon needs, resolved for a single theme. */
export interface IIconTokens {
  colors: IIconColorTokens;
  /** Pixel size per `TIconSize`, from `dimension.size.icon.*`. */
  size: Record<TIconSize, number>;
}

const readIconTokens = (mode: TThemeMode): IIconTokens => {
  const { color, dimension } = themeSources[mode];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  return {
    colors: {
      primary: readThemeToken(color, 'color.color.icon.primary'),
      disabled: readThemeToken(color, 'color.color.icon.disabled'),
    },
    size: {
      '2xs': dimensionAt('size.icon.2xs'),
      xs: dimensionAt('size.icon.xs'),
      sm: dimensionAt('size.icon.sm'),
      md: dimensionAt('size.icon.md'),
      lg: dimensionAt('size.icon.lg'),
      xl: dimensionAt('size.icon.xl'),
    },
  };
};

/**
 * Icon tokens, keyed by theme mode.
 *
 * Source: `color.color.icon.{primary,disabled}` and `dimension.size.icon.*`
 * in `theme/base` (light) and `theme/dark`. Both platforms pick the right
 * entry at render time via `useThemeMode()`.
 */
export const iconTokens: Record<TThemeMode, IIconTokens> = {
  light: readIconTokens('light'),
  dark: readIconTokens('dark'),
};

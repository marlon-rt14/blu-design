import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TSpinnerAppearance, TSpinnerSize } from '../types/atoms/spinner.types';

/** Indicator + track for one appearance. */
export interface ISpinnerAppearanceColors {
  indicator: string;
  track: string;
}

export interface ISpinnerColorTokens {
  appearances: Record<TSpinnerAppearance, ISpinnerAppearanceColors>;
}

export interface ISpinnerDimensionTokens {
  /** `size/icon/{sm,md,lg}` — sm 16 · md 24 · lg 32. */
  size: Record<TSpinnerSize, number>;
  /**
   * Full-turn duration. Dev does not list a duration leaf; the set asks for
   * `motion/duration/*` on the native thread. No cycle-length token exists —
   * 1000 ms is the documented constant (same class of gap as Coachmark width).
   */
  rotationDurationMs: number;
}

export interface ISpinnerTokens {
  colors: ISpinnerColorTokens;
  dimension: ISpinnerDimensionTokens;
}

/**
 * One revolution. Not a theme leaf — see {@link ISpinnerDimensionTokens.rotationDurationMs}.
 */
export const SPINNER_ROTATION_DURATION_MS = 1000;

/** Default a11y label — Spinner · Dev firma. */
export const SPINNER_DEFAULT_LABEL = 'Cargando';

/**
 * SVG paths authored on a 24×24 grid (live `appearance=primary, size=md`).
 * Scale via the Svg/svg `width`/`height` from `size/icon/*`.
 */
export const SPINNER_VIEWBOX = '0 0 24 24';

export const SPINNER_TRACK_PATH =
  'M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM2.4 12C2.4 17.3019 6.69807 21.6 12 21.6C17.3019 21.6 21.6 17.3019 21.6 12C21.6 6.69807 17.3019 2.4 12 2.4C6.69807 2.4 2.4 6.69807 2.4 12Z';

export const SPINNER_INDICATOR_PATH =
  'M12 0C13.7523 -7.65948e-08 15.4833 0.383759 17.0714 1.12431C18.6595 1.86485 20.0662 2.94422 21.1925 4.28655C22.3189 5.62888 23.1376 7.20159 23.5911 8.89417C24.0446 10.5867 24.122 12.3581 23.8177 14.0838L21.4542 13.667C21.6976 12.2865 21.6357 10.8694 21.2729 9.51534C20.9101 8.16127 20.2551 6.9031 19.354 5.82924C18.4529 4.75538 17.3276 3.89188 16.0571 3.29944C14.7866 2.70701 13.4018 2.4 12 2.4L12 0Z';

const readSpinnerTokens = (key: TThemeSourceKey): ISpinnerTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  return {
    colors: {
      appearances: {
        brand: {
          indicator: colorAt('component.spinner.indicator.brand'),
          track: colorAt('component.spinner.track.default'),
        },
        primary: {
          indicator: colorAt('component.spinner.indicator.default'),
          track: colorAt('component.spinner.track.default'),
        },
        'on-brand': {
          indicator: colorAt('component.spinner.indicator.on-brand'),
          track: colorAt('component.spinner.track.on-brand'),
        },
      },
    },
    dimension: {
      size: {
        sm: dimensionAt('size.icon.sm'),
        md: dimensionAt('size.icon.md'),
        lg: dimensionAt('size.icon.lg'),
      },
      rotationDurationMs: SPINNER_ROTATION_DURATION_MS,
    },
  };
};

/**
 * Spinner tokens per theme.
 *
 * Source: `color.component.spinner.{indicator,track}.*` and `dimension.size.icon.*`.
 */
export const spinnerTokens = fromThemeSources(readSpinnerTokens);

import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TBadgeStatus } from '../types/atoms/badge.types';
import { baseFontFamily } from './theme.tokens';

/** Fill + number colour for one status — both dedicated leaves, not a shared inverse hack. */
export interface IBadgeStatusColorTokens {
  /** `component.badge.surface.bg-{status}` — saturated, never `subtle` (that fails contrast against the page). */
  bg: string;
  /** `component.badge.count.text-{status}` — follows the tone; not a blanket `text/inverse`. */
  text: string;
}

export interface IBadgeColorTokens {
  statuses: Record<TBadgeStatus, IBadgeStatusColorTokens>;
}

export interface IBadgeDimensionTokens {
  /** `size/icon/md` (24) — the `count` pill's fixed height and its floor width (a single digit is circular). */
  countSize: number;
  /** `size/icon/xs` (12) — the `dot`'s fixed diameter. */
  dotSize: number;
  /** Horizontal inset once the count text is wider than the pill is tall (e.g. `"9+"`). */
  paddingHorizontal: number;
  borderRadius: number;
}

export interface IBadgeTokens {
  colors: IBadgeColorTokens;
  dimension: IBadgeDimensionTokens;
  /** `text/label/sm/default`. */
  text: IThemeTypographyValue;
}

const readBadgeTokens = (key: TThemeSourceKey): IBadgeTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const statusColors = (status: TBadgeStatus): IBadgeStatusColorTokens => ({
    bg: colorAt(`component.badge.surface.bg-${status}`),
    text: colorAt(`component.badge.count.text-${status}`),
  });

  const fontSize = dimensionAt('font.size.label.sm');

  return {
    colors: {
      statuses: {
        danger: statusColors('danger'),
        warning: statusColors('warning'),
        success: statusColors('success'),
        info: statusColors('info'),
        brand: statusColors('brand'),
        neutral: statusColors('neutral'),
      },
    },
    dimension: {
      countSize: dimensionAt('size.icon.md'),
      dotSize: dimensionAt('size.icon.xs'),
      paddingHorizontal: dimensionAt('space.inset.xs'),
      borderRadius: dimensionAt('radius.pill'),
    },
    text: {
      fontWeight: String(dimensionAt('font.weight.regular')),
      fontSize,
      lineHeight: fontSize * (dimensionAt('font.line-height.normal') / 100),
      fontFamily: baseFontFamily,
    },
  };
};

/**
 * Badge tokens per theme.
 *
 * Source: `color.component.badge.*` (12 leaves — `surface.bg-*` and
 * `count.text-*`, six statuses each) and `dimension.*`. No nested
 * component reads its own tokens here — Badge has none.
 */
export const badgeTokens = fromThemeSources(readBadgeTokens);

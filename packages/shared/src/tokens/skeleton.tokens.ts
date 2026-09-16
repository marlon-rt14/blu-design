import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TSkeletonSize } from '../types/atoms/skeleton.types';

export interface ISkeletonColorTokens {
  /** `component/skeleton/bg` — sunken surface (same as Image loading). */
  background: string;
  /** `component/skeleton/highlight` — sheen band (~26% width). */
  highlight: string;
}

export interface ISkeletonDimensionTokens {
  /** Line-bar height for `shape="text"` — caption/md · body/sm · body/md × normal leading. */
  textHeight: Record<TSkeletonSize, number>;
  /** Diameter for `shape="circle"` — `component/avatar/size/{sm,md,lg}`. */
  circleSize: Record<TSkeletonSize, number>;
  /** Corner radius for `shape="block"` — `radius/surface/{sm,md,lg}`. */
  blockRadius: Record<TSkeletonSize, number>;
  /** Pill radius for text bars and circles — `radius/pill`. */
  pillRadius: number;
  /** Gap between stacked text lines — `space/stack/sm`. */
  lineGap: number;
  /** Sheen band width as a fraction of the bone (Figma: 26%). */
  sheenWidthRatio: number;
  /**
   * Full sheen sweep. No cycle-length leaf in theme — same documented gap as
   * Image's loading sheen (1.6s).
   */
  sheenDurationMs: number;
}

export interface ISkeletonTokens {
  colors: ISkeletonColorTokens;
  dimension: ISkeletonDimensionTokens;
}

/** Shared with Image loading sheen — not a theme leaf. */
export const SKELETON_SHEEN_DURATION_MS = 1600;

/** Default a11y label — announced once on the wrapper. */
export const SKELETON_DEFAULT_LABEL = 'Cargando';

/** Figma anatomy: sheen band is 26% of the base. */
export const SKELETON_SHEEN_WIDTH_RATIO = 0.26;

const readSkeletonTokens = (key: TThemeSourceKey): ISkeletonTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const lineHeightRatio = dimensionAt('font.line-height.normal') / 100;

  return {
    colors: {
      background: colorAt('component.skeleton.bg'),
      highlight: colorAt('component.skeleton.highlight'),
    },
    dimension: {
      textHeight: {
        sm: Math.round(dimensionAt('font.size.caption.md') * lineHeightRatio),
        md: Math.round(dimensionAt('font.size.body.sm') * lineHeightRatio),
        lg: Math.round(dimensionAt('font.size.body.md') * lineHeightRatio),
      },
      circleSize: {
        sm: dimensionAt('component.avatar.size.sm'),
        md: dimensionAt('component.avatar.size.md'),
        lg: dimensionAt('component.avatar.size.lg'),
      },
      blockRadius: {
        sm: dimensionAt('radius.surface.sm'),
        md: dimensionAt('radius.surface.md'),
        lg: dimensionAt('radius.surface.lg'),
      },
      pillRadius: dimensionAt('radius.pill'),
      lineGap: dimensionAt('space.stack.sm'),
      sheenWidthRatio: SKELETON_SHEEN_WIDTH_RATIO,
      sheenDurationMs: SKELETON_SHEEN_DURATION_MS,
    },
  };
};

/**
 * Skeleton tokens per theme.
 *
 * Source: `color.component.skeleton.{bg,highlight}`, avatar sizes, surface
 * radii, `radius/pill`, and type-scale leaves for text bar height.
 */
export const skeletonTokens = fromThemeSources(readSkeletonTokens);

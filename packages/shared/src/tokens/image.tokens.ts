import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TImageRadius } from '../types/atoms/image.types';

export interface IImageSurfaceColorTokens {
  /** `component/image/surface/bg` — sunken fill under every status. */
  background: string;
  /** `component/image/surface/border` — solid on loading/error, dashed on empty. */
  border: string;
}

export interface IImageIconColorTokens {
  /** Empty-state IconImage — `component/image/icon/icon-placeholder`. */
  placeholder: string;
  /** Error-state IconAlertTriangle — `component/image/icon/icon-default`. */
  default: string;
}

export interface IImageSkeletonColorTokens {
  /** `component/skeleton/bg` — same pair Image loading shares with Skeleton. */
  background: string;
  /** `component/skeleton/highlight` — sheen band (~26% width). */
  highlight: string;
}

export interface IImageColorTokens {
  surface: IImageSurfaceColorTokens;
  icon: IImageIconColorTokens;
  skeleton: IImageSkeletonColorTokens;
}

export interface IImageDimensionTokens {
  borderWidth: number;
  /** Icon box is always `size/icon/lg` (32) across ratios. */
  iconSize: number;
  /** Sheen band width as a fraction of the frame (Figma Skeleton: 26%). */
  sheenWidthRatio: number;
  radii: Record<TImageRadius, number>;
}

export interface IImageTokens {
  colors: IImageColorTokens;
  dimension: IImageDimensionTokens;
}

const readImageTokens = (key: TThemeSourceKey): IImageTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  return {
    colors: {
      surface: {
        background: colorAt('component.image.surface.bg'),
        border: colorAt('component.image.surface.border'),
      },
      icon: {
        placeholder: colorAt('component.image.icon.icon-placeholder'),
        default: colorAt('component.image.icon.icon-default'),
      },
      skeleton: {
        background: colorAt('component.skeleton.bg'),
        highlight: colorAt('component.skeleton.highlight'),
      },
    },
    dimension: {
      borderWidth: dimensionAt('border.width.default'),
      iconSize: dimensionAt('size.icon.lg'),
      sheenWidthRatio: 0.26,
      radii: {
        none: 0,
        sm: dimensionAt('radius.surface.sm'),
        md: dimensionAt('radius.surface.md'),
      },
    },
  };
};

export const imageTokens = fromThemeSources(readImageTokens);

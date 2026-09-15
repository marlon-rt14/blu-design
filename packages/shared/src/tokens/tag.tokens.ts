import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TTagAppearance, TTagPalette, TTagSize } from '../types/atoms/tag.types';

export interface ITagAppearanceColorTokens {
  background: string;
  text: string;
  icon: string;
  /** Only meaningful for `outline` — `fill`/`soft` paint no border. */
  border: string | undefined;
}

export type TTagPaletteColorTokens = Record<TTagAppearance, ITagAppearanceColorTokens>;

export interface ITagColorTokens {
  palettes: Record<TTagPalette, TTagPaletteColorTokens>;
}

export interface ITagSizeDimensionTokens {
  /** Fixed height — 32 / 24 — not a floor: Tag never wraps to more than one line. */
  height: number;
  paddingHorizontal: number;
  fontSize: number;
}

export interface ITagDimensionTokens {
  sizes: Record<TTagSize, ITagSizeDimensionTokens>;
  /** Between the leading icon, the label and the remove target. `space/inline/xs` (4). */
  gap: number;
  /** `radius/control/sm` (4) — Tag is squared, not a pill, despite the shape it shares with Avatar/Badge elsewhere. */
  borderRadius: number;
  /** `border/width/default` (1) — `outline` only. */
  borderWidth: number;
  /** WCAG 2.5.8's floor for a target nested inside another. Constant at both sizes. */
  removeTargetSize: number;
  fontWeight: string;
}

export interface ITagTokens {
  colors: ITagColorTokens;
  dimension: ITagDimensionTokens;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const LINE_HEIGHT_RATIO = 1.5;

const PALETTES: readonly TTagPalette[] = [
  'neutral',
  'brand',
  'success',
  'warning',
  'danger',
  'info',
  'tangerine',
  'aqua',
  'indigo',
];

const readTagTokens = (key: TThemeSourceKey): ITagTokens => {
  const { color, dimension } = themeSources[key];
  const at = (path: string): string => readThemeToken(color, `color.component.tag.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const outlineBackground = at('outline.bg-default');

  const palettes = Object.fromEntries(
    PALETTES.map((palette) => [
      palette,
      {
        fill: {
          background: at(`fill.bg-${palette}`),
          text: at(`fill.text-${palette}`),
          icon: at(`fill.icon-${palette}`),
          border: undefined,
        },
        soft: {
          background: at(`soft.bg-${palette}`),
          text: at(`soft.text-${palette}`),
          icon: at(`soft.icon-${palette}`),
          border: undefined,
        },
        outline: {
          background: outlineBackground,
          text: at(`outline.text-${palette}`),
          icon: at(`outline.icon-${palette}`),
          border: at(`outline.border-${palette}`),
        },
      },
    ]),
  ) as Record<TTagPalette, TTagPaletteColorTokens>;

  return {
    colors: { palettes },
    dimension: {
      sizes: {
        sm: {
          height: dimensionAt('size.control.height.sm'),
          paddingHorizontal: dimensionAt('space.inset.sm'),
          fontSize: dimensionAt('font.size.label.md'),
        },
        xs: {
          height: dimensionAt('size.control.height.xs'),
          paddingHorizontal: dimensionAt('space.inset.xs'),
          fontSize: dimensionAt('font.size.label.sm'),
        },
      },
      gap: dimensionAt('space.inline.xs'),
      borderRadius: dimensionAt('radius.control.sm'),
      borderWidth: dimensionAt('border.width.default'),
      removeTargetSize: dimensionAt('size.control.height.xs'),
      fontWeight: String(dimensionAt('font.weight.medium')),
    },
  };
};

/** Re-exported so consumers can format a line-height from `fontSize` without hardcoding the ratio again. */
export const TAG_LINE_HEIGHT_RATIO = LINE_HEIGHT_RATIO;

export const tagTokens = fromThemeSources(readTagTokens);

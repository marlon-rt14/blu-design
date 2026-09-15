import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import type { TCheckboxSize } from '../types/atoms/checkbox.types';

export interface ICheckboxBoxColorTokens {
  backgroundUnchecked: string;
  backgroundSelected: string;
  backgroundSelectedPressed: string;
  backgroundDisabled: string;
  borderDefault: string;
  borderHover: string;
  borderSelected: string;
  borderDisabled: string;
  borderFocus: string;
  overlayHover: string;
  overlayHoverSelected: string;
}

/** Selected mark uses `fixed.white`, not on-brand — Figma. */
export interface ICheckboxIconColorTokens {
  selected: string;
  disabled: string;
}

export interface ICheckboxLabelColorTokens {
  default: string;
  disabled: string;
}

export interface ICheckboxColorTokens {
  box: ICheckboxBoxColorTokens;
  icon: ICheckboxIconColorTokens;
  label: ICheckboxLabelColorTokens;
  /**
   * Gap of the offset focus ring — Figma paints the 1px franja with
   * `canvas/surface/primary`. `box.bg-unchecked` aliases that same token.
   */
  focusRingGap: string;
}

/**
 * Box edge = `size.icon.{sm|md}`; mark is one step down (`xs` / `sm`).
 * Row floor is `control.height.sm` (32) vs `target.min` (48) — live sm is 32, not 48.
 */
export interface ICheckboxSizeTokens {
  boxSize: number;
  markSize: number;
  minHeight: number;
  label: IThemeTypographyValue;
}

export interface ICheckboxDimensionTokens {
  borderRadius: number;
  borderWidth: number;
  gap: number;
  focusRingOffset: number;
  focusRingSpread: number;
}

export interface ICheckboxTokens {
  colors: ICheckboxColorTokens;
  sizes: Record<TCheckboxSize, ICheckboxSizeTokens>;
  dimension: ICheckboxDimensionTokens;
}

const readCheckboxTokens = (key: TThemeSourceKey): ICheckboxTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.checkbox.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  // `font.line-height.*` primitives are literal percentages mis-typed as
  // `px` upstream (`"150px"` means 150%) — same trap as TextField. Do **not**
  // read `typography.component.checkbox.labeled` (`400 16px/20px`); live
  // Figma is `text/body/{sm,md}/default`.
  const composedTypographyAt = (sizePath: string): IThemeTypographyValue => {
    const fontSize = dimensionAt(sizePath);
    return {
      fontWeight: String(dimensionAt('font.weight.regular')),
      fontSize,
      lineHeight: fontSize * (dimensionAt('font.line-height.normal') / 100),
      fontFamily: baseFontFamily,
    };
  };

  return {
    colors: {
      box: {
        backgroundUnchecked: colorAt('box.bg-unchecked'),
        backgroundSelected: colorAt('box.bg-selected'),
        backgroundSelectedPressed: colorAt('box.bg-selected-pressed'),
        backgroundDisabled: colorAt('box.bg-disabled'),
        borderDefault: colorAt('box.border-default'),
        borderHover: colorAt('box.border-hover'),
        borderSelected: colorAt('box.border-selected'),
        borderDisabled: colorAt('box.border-disabled'),
        borderFocus: colorAt('box.border-focus'),
        overlayHover: colorAt('box.overlay-hover'),
        overlayHoverSelected: colorAt('box.overlay-hover-selected'),
      },
      icon: {
        selected: colorAt('icon.icon-selected'),
        disabled: colorAt('icon.icon-disabled'),
      },
      label: {
        default: colorAt('label.text-default'),
        disabled: colorAt('label.text-disabled'),
      },
      focusRingGap: readThemeToken(color, 'color.color.canvas.surface.primary'),
    },
    sizes: {
      sm: {
        boxSize: dimensionAt('size.icon.sm'),
        markSize: dimensionAt('size.icon.xs'),
        minHeight: dimensionAt('size.control.height.sm'),
        label: composedTypographyAt('font.size.body.sm'),
      },
      md: {
        boxSize: dimensionAt('size.icon.md'),
        markSize: dimensionAt('size.icon.sm'),
        minHeight: dimensionAt('size.target.min'),
        label: composedTypographyAt('font.size.body.md'),
      },
    },
    dimension: {
      borderRadius: dimensionAt('radius.control.sm'),
      borderWidth: dimensionAt('border.width.control-strong'),
      gap: dimensionAt('space.inline.sm'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
    },
  };
};

export const checkboxTokens = fromThemeSources(readCheckboxTokens);

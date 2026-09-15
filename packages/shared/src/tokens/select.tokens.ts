import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import type { TSelectSize } from '../types/molecules/select.types';

/** Container colors, keyed by the state that drives them — same shape as TextField's own. */
export interface ISelectContainerColorTokens {
  background: string;
  backgroundPressed: string;
  backgroundReadOnly: string;
  backgroundDisabled: string;
  border: string;
  borderHover: string;
  borderFocus: string;
  borderError: string;
  borderReadOnly: string;
  borderDisabled: string;
  /** Low-alpha wash layered over the container on hover — not a solid background swap. */
  overlayHover: string;
}

export interface ISelectValueColorTokens {
  placeholder: string;
  filled: string;
  readOnly: string;
  disabled: string;
}

export interface ISelectSupportColorTokens {
  default: string;
  disabled: string;
}

export interface ISelectHelperColorTokens extends ISelectSupportColorTokens {
  error: string;
}

export interface ISelectMenuColorTokens {
  background: string;
  border: string;
  /** The two-layer elevated shadow the floating menu casts — see `dimension.menuShadow*`. */
  shadowNear: string;
  shadowFar: string;
}

export interface ISelectColorTokens {
  container: ISelectContainerColorTokens;
  label: ISelectSupportColorTokens;
  value: ISelectValueColorTokens;
  helper: ISelectHelperColorTokens;
  icon: ISelectSupportColorTokens;
  menu: ISelectMenuColorTokens;
  /** 1px franja of the offset focus ring — `canvas/surface/primary`. */
  focusRingGap: string;
}

/** Metrics that vary by `TSelectSize` — same idea as TextField's `ITextFieldSizeTokens`. */
export interface ISelectSizeDimensionTokens {
  minHeight: number;
  paddingVertical: number;
}

export interface ISelectDimensionTokens {
  paddingHorizontal: number;
  borderRadius: number;
  borderWidth: number;
  focusRingOffset: number;
  focusRingSpread: number;
  /** Gap between the leading icon, the label+value column and the chevron. */
  contentGap: number;
  /** Gap between the field and its helper/error line. */
  footerSlotGap: number;
  menuBorderRadius: number;
  menuShadowNearY: number;
  menuShadowNearBlur: number;
  menuShadowFarY: number;
  menuShadowFarBlur: number;
  /** `z/dropdown_1` — literally documented as "Select, menu, autocomplete". */
  menuZIndex: number;
  /** Gap between the field and the menu panel below it. */
  menuOffset: number;
  /** Vertical padding of the search box shown inside the menu when `isSearchable` is on — `space/inset/sm`. */
  searchPaddingVertical: number;
}

export type ISelectTypographyRole = IThemeTypographyValue;

export interface ISelectTypographyTokens {
  /** The floating label — identical role to TextField's own. */
  label: ISelectTypographyRole;
  /** The chosen option's label, or the placeholder while unset. */
  value: ISelectTypographyRole;
  helper: ISelectTypographyRole;
}

export interface ISelectTokens {
  colors: ISelectColorTokens;
  sizes: Record<TSelectSize, ISelectSizeDimensionTokens>;
  dimension: ISelectDimensionTokens;
  typography: ISelectTypographyTokens;
  /** `sm`/`md` share `size/icon/sm` (16); `lg` steps up to `size/icon/md` (24) — same mapping TextField uses for its affix icons. */
  iconSize: Record<TSelectSize, number>;
}

const readSelectTokens = (key: TThemeSourceKey): ISelectTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.select.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const composedTypographyAt = (
    sizePath: string,
    weightPath: string,
    lineHeightRatioPath: string,
  ): ISelectTypographyRole => {
    const fontSize = dimensionAt(sizePath);
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt(lineHeightRatioPath) / 100),
      fontFamily: baseFontFamily,
    };
  };

  return {
    colors: {
      container: {
        background: colorAt('container.bg-default'),
        backgroundPressed: colorAt('container.bg-pressed'),
        backgroundReadOnly: colorAt('container.bg-readonly'),
        backgroundDisabled: colorAt('container.bg-disabled'),
        border: colorAt('container.border-default'),
        borderHover: colorAt('container.border-hover'),
        borderFocus: colorAt('container.border-focus'),
        borderError: colorAt('container.border-error'),
        borderReadOnly: colorAt('container.border-readonly'),
        borderDisabled: colorAt('container.border-disabled'),
        overlayHover: colorAt('container.overlay-hover'),
      },
      label: {
        default: colorAt('label.text-default'),
        disabled: colorAt('label.text-disabled'),
      },
      value: {
        placeholder: colorAt('value.text-placeholder'),
        filled: colorAt('value.text-filled'),
        readOnly: colorAt('value.text-readonly'),
        disabled: colorAt('value.text-disabled'),
      },
      helper: {
        default: colorAt('helper.text-default'),
        error: colorAt('helper.text-error'),
        disabled: colorAt('helper.text-disabled'),
      },
      icon: {
        default: colorAt('icon.icon-default'),
        disabled: colorAt('icon.icon-disabled'),
      },
      menu: {
        background: colorAt('menu.bg-default'),
        border: colorAt('menu.border-default'),
        shadowNear: readThemeToken(color, 'color.elevation.overlay.shadow.near'),
        shadowFar: readThemeToken(color, 'color.elevation.overlay.shadow.far'),
      },
      focusRingGap: readThemeToken(color, 'color.color.canvas.surface.primary'),
    },
    sizes: {
      sm: { minHeight: dimensionAt('size.control.height.sm'), paddingVertical: 0 },
      md: { minHeight: dimensionAt('size.field.height.md'), paddingVertical: 0 },
      lg: { minHeight: dimensionAt('size.field.height.lg'), paddingVertical: dimensionAt('space.inset.xs') },
    },
    dimension: {
      paddingHorizontal: dimensionAt('space.inset.md'),
      borderRadius: dimensionAt('radius.field.md'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      contentGap: dimensionAt('space.inline.sm'),
      footerSlotGap: dimensionAt('space.stack.xs'),
      menuBorderRadius: dimensionAt('radius.surface.md'),
      menuShadowNearY: dimensionAt('elevation.overlay.shadow.near-y'),
      menuShadowNearBlur: dimensionAt('elevation.overlay.shadow.near-blur'),
      menuShadowFarY: dimensionAt('elevation.overlay.shadow.far-y'),
      menuShadowFarBlur: dimensionAt('elevation.overlay.shadow.far-blur'),
      menuZIndex: dimensionAt('z.dropdown_1'),
      menuOffset: dimensionAt('space.stack.xs'),
      searchPaddingVertical: dimensionAt('space.inset.sm'),
    },
    typography: {
      label: composedTypographyAt('font.size.label.sm', 'font.weight.extrabold', 'font.line-height.snug'),
      value: composedTypographyAt('font.size.body.md', 'font.weight.regular', 'font.line-height.normal'),
      helper: composedTypographyAt('font.size.caption.md', 'font.weight.regular', 'font.line-height.normal'),
    },
    iconSize: {
      sm: dimensionAt('size.icon.sm'),
      md: dimensionAt('size.icon.sm'),
      lg: dimensionAt('size.icon.md'),
    },
  };
};

/**
 * Select tokens, keyed by theme mode.
 *
 * Source: `color.component.select.*` and `dimension.*` in `theme/base` (light)
 * and `theme/dark` — typography is composed from `dimension.font.*`
 * primitives, same reasoning as `textField.tokens.ts`.
 */
export const selectTokens = fromThemeSources(readSelectTokens);

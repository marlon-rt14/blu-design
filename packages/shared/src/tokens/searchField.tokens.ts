import type { TThemeSourceKey } from '../themeSource';
import { fromThemeSources, readThemeDimension, readThemeToken, themeSources } from '../themeSource';
import type { TIconButtonSize } from '../types/atoms/iconButton.types';
import type { TSearchFieldSize } from '../types/atoms/searchField.types';
import { baseFontFamily } from './theme.tokens';

/** One text role: placeholder and value share it; only the color changes. */
export interface ISearchFieldTypographyRole {
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  lineHeight: number;
}

/** Geometry that changes with `size`. */
export interface ISearchFieldSizeTokens {
  minHeight: number;
  paddingX: number;
  /**
   * Web clear control. Live `lg` binds IconButton `sm` (32). Dev open item 3:
   * `sm` field drops to `xs` (24). Mobile grows the hit area to `targetMin`
   * without changing this drawing.
   */
  clearButtonSize: TIconButtonSize;
}

/** Every token a SearchField needs, resolved for a single theme. */
export interface ISearchFieldTokens {
  colors: {
    container: {
      /** Web bar. `component/searchfield/container/bg-default`. */
      background: string;
      backgroundDisabled: string;
      /**
       * Native bar. Live iOS node binds `color/fill/neutral/subtle`, not the
       * white input fill — a borderless search bar.
       */
      backgroundNative: string;
      border: string;
      borderHover: string;
      borderFocus: string;
      borderDisabled: string;
    };
    value: {
      placeholder: string;
      filled: string;
      disabled: string;
    };
    icon: {
      default: string;
      disabled: string;
    };
    /** Gap between the field border and the focus ring. `canvas/surface/primary`. */
    focusRingGap: string;
  };
  sizes: Record<TSearchFieldSize, ISearchFieldSizeTokens>;
  dimension: {
    gap: number;
    /**
     * Web corner. Dev decision (22-sep): `radius/field/md`, same as TextField.
     * The component co-token `component/searchfield/radius` is still pill and
     * is what native uses.
     */
    webRadius: number;
    /** Native corner. `component/searchfield/radius` → `radius/pill`. */
    nativeRadius: number;
    borderWidth: number;
    focusRingOffset: number;
    focusRingSpread: number;
    /**
     * Search glyph. Live web `lg` (`1530:65194`) is 16 (`icon/size/sm`),
     * not `icon/size/md` (24). Same glyph at every field size.
     */
    iconSize: number;
    /** Minimum touch target. Mobile clear uses this as `hitSlop` math. */
    targetMin: number;
  };
  typography: Record<TSearchFieldSize, ISearchFieldTypographyRole>;
}

const readSearchFieldTokens = (key: TThemeSourceKey): ISearchFieldTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.searchfield.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const composedTypographyAt = (
    sizePath: string,
    weightPath: string,
    lineHeightRatioPath: string,
  ): ISearchFieldTypographyRole => {
    const fontSize = dimensionAt(sizePath);
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt(lineHeightRatioPath) / 100),
      fontFamily: baseFontFamily,
    };
  };

  const paddingMd = dimensionAt('component.searchfield.padding-x.md');
  const paddingSm = dimensionAt('component.searchfield.padding-x.sm');
  const bodyMd = composedTypographyAt('font.size.body.md', 'font.weight.regular', 'font.line-height.normal');
  const bodySm = composedTypographyAt('font.size.body.sm', 'font.weight.regular', 'font.line-height.normal');

  return {
    colors: {
      container: {
        background: colorAt('container.bg-default'),
        backgroundDisabled: colorAt('container.bg-disabled'),
        backgroundNative: readThemeToken(color, 'color.color.fill.neutral.subtle'),
        border: colorAt('container.border-default'),
        borderHover: colorAt('container.border-hover'),
        borderFocus: colorAt('container.border-focus'),
        borderDisabled: colorAt('container.border-disabled'),
      },
      value: {
        placeholder: colorAt('value.text-placeholder'),
        filled: colorAt('value.text-filled'),
        disabled: colorAt('value.text-disabled'),
      },
      icon: {
        default: colorAt('icon.icon-default'),
        disabled: colorAt('icon.icon-disabled'),
      },
      focusRingGap: readThemeToken(color, 'color.color.canvas.surface.primary'),
    },
    sizes: {
      lg: {
        minHeight: dimensionAt('size.field.height.lg'),
        paddingX: paddingMd,
        clearButtonSize: 'sm',
      },
      md: {
        minHeight: dimensionAt('component.searchfield.height.md'),
        paddingX: paddingMd,
        clearButtonSize: 'sm',
      },
      sm: {
        minHeight: dimensionAt('component.searchfield.height.sm'),
        paddingX: paddingSm,
        clearButtonSize: 'xs',
      },
    },
    dimension: {
      gap: dimensionAt('component.searchfield.gap'),
      webRadius: dimensionAt('radius.field.md'),
      nativeRadius: dimensionAt('component.searchfield.radius'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      iconSize: dimensionAt('component.searchfield.icon.size.sm'),
      targetMin: dimensionAt('size.target.min'),
    },
    typography: {
      lg: bodyMd,
      md: bodyMd,
      sm: bodySm,
    },
  };
};

/** SearchField tokens for every `TThemeSourceKey`. */
export const searchFieldTokens: Record<TThemeSourceKey, ISearchFieldTokens> = fromThemeSources(readSearchFieldTokens);

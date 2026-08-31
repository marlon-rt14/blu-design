import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import type { TSwitchItemSize } from '../types/molecules/switchItem.types';

/** Row surface colors. */
export interface ISwitchItemSurfaceColorTokens {
  background: string;
  overlayHover: string;
  overlayPressed: string;
  borderFocus: string;
}

/** Label / description / divider colors. */
export interface ISwitchItemColorTokens {
  surface: ISwitchItemSurfaceColorTokens;
  label: { default: string; disabled: string };
  description: { default: string; disabled: string };
  divider: { background: string };
}

/** Metrics that vary by `TSwitchItemSize`. */
export interface ISwitchItemSizeTokens {
  minHeight: number;
}

/** Metrics shared by every size. */
export interface ISwitchItemDimensionTokens {
  paddingHorizontal: number;
  contentGap: number;
  stackGap: number;
  focusRingSpread: number;
  dividerHeight: number;
}

/** Every token a SwitchItem needs, resolved for a single theme. */
export interface ISwitchItemTokens {
  colors: ISwitchItemColorTokens;
  sizes: Record<TSwitchItemSize, ISwitchItemSizeTokens>;
  dimension: ISwitchItemDimensionTokens;
  typography: {
    label: IThemeTypographyValue;
    description: IThemeTypographyValue;
  };
}

const readSwitchItemTokens = (mode: TThemeMode): ISwitchItemTokens => {
  const { color, dimension } = themeSources[mode];
  const colorAt = (path: string): string =>
    readThemeToken(color, `color.component.switchitem.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const composedTypographyAt = (
    sizePath: string,
    weightPath: string,
    lineHeightRatioPath: string,
  ): IThemeTypographyValue => {
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
      surface: {
        background: colorAt('surface.bg-default'),
        overlayHover: colorAt('surface.overlay-hover'),
        overlayPressed: colorAt('surface.overlay-pressed'),
        borderFocus: colorAt('surface.border-focus'),
      },
      label: {
        default: colorAt('label.text-default'),
        disabled: colorAt('label.text-disabled'),
      },
      description: {
        // Figma paints description with `color/text/secondary`. The
        // component group only ships `description.text-disabled` — no
        // `text-default` co-token — so the semantic role is the source.
        default: readThemeToken(color, 'color.color.text.secondary'),
        disabled: colorAt('description.text-disabled'),
      },
      divider: {
        background: colorAt('divider.bg-default'),
      },
    },
    sizes: {
      sm: { minHeight: dimensionAt('size.target.min') },
      md: { minHeight: dimensionAt('size.field.height.lg') },
    },
    dimension: {
      paddingHorizontal: dimensionAt('space.inset.md'),
      contentGap: dimensionAt('space.inline.sm'),
      stackGap: dimensionAt('space.stack.xs'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      dividerHeight: dimensionAt('border.width.default'),
    },
    typography: {
      label: composedTypographyAt('font.size.body.md', 'font.weight.regular', 'font.line-height.normal'),
      description: composedTypographyAt(
        'font.size.caption.md',
        'font.weight.regular',
        'font.line-height.normal',
      ),
    },
  };
};

/**
 * SwitchItem tokens, keyed by theme mode.
 *
 * Source: `color.component.switchitem.*` and `dimension.*` in `theme/base`
 * (light) and `theme/dark`. Description default is `color.color.text.secondary`
 * because the component group has no `description.text-default`. Both
 * platforms pick the right entry at render time via `useThemeMode()`.
 */
export const switchItemTokens: Record<TThemeMode, ISwitchItemTokens> = {
  light: readSwitchItemTokens('light'),
  dark: readSwitchItemTokens('dark'),
};

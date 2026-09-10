import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import type { TTabSize } from '../types/atoms/tabItem.types';

export interface ITabsLabelColorTokens {
  active: string;
  inactive: string;
  disabled: string;
}

export interface ITabsIconColorTokens {
  active: string;
  inactive: string;
  disabled: string;
}

export interface ITabsIndicatorColorTokens {
  active: string;
  disabled: string;
}

export interface ITabsSurfaceColorTokens {
  overlayHover: string;
  overlayPressed: string;
  borderFocus: string;
  divider: string;
}

export interface ITabsColorTokens {
  label: ITabsLabelColorTokens;
  icon: ITabsIconColorTokens;
  indicator: ITabsIndicatorColorTokens;
  surface: ITabsSurfaceColorTokens;
  badge: {
    background: string;
    text: string;
  };
}

export interface ITabsSizeTokens {
  height: number;
  label: IThemeTypographyValue;
}

export interface ITabsDimensionTokens {
  paddingX: number;
  itemGap: number;
  labelRowGap: number;
  iconSize: number;
  pillRadius: number;
  overlayRadius: number;
  indicatorWidth: number;
  dividerWidth: number;
  barPaddingX: number;
  badgeMinSize: number;
  badgePaddingX: number;
  badgeLetterSpacing: number;
  targetMin: number;
  focusRingOffset: number;
  focusRingSpread: number;
}

export interface ITabsTokens {
  colors: ITabsColorTokens;
  sizes: Record<TTabSize, ITabsSizeTokens>;
  dimension: ITabsDimensionTokens;
  badge: IThemeTypographyValue;
}

const readTabsTokens = (mode: TThemeMode): ITabsTokens => {
  const { color, dimension } = themeSources[mode];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const composedTypographyAt = (sizePath: string, weightPath: string, lineHeightPath: string): IThemeTypographyValue => {
    const fontSize = dimensionAt(sizePath);
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt(lineHeightPath) / 100),
      fontFamily: baseFontFamily,
    };
  };

  const badge = composedTypographyAt('font.size.label.sm', 'font.weight.regular', 'font.line-height.snug');

  return {
    colors: {
      label: {
        active: colorAt('component.tabs.label.text-active'),
        inactive: colorAt('component.tabs.label.text-inactive'),
        disabled: colorAt('component.tabs.label.text-disabled'),
      },
      icon: {
        active: colorAt('component.tabs.icon.icon-active'),
        inactive: colorAt('component.tabs.icon.icon-inactive'),
        disabled: colorAt('component.tabs.icon.icon-disabled'),
      },
      indicator: {
        active: colorAt('component.tabs.indicator.bg-active'),
        disabled: colorAt('component.tabs.indicator.bg-disabled'),
      },
      surface: {
        overlayHover: colorAt('component.tabs.surface.overlay-hover'),
        overlayPressed: colorAt('component.tabs.surface.overlay-pressed'),
        borderFocus: colorAt('component.tabs.surface.border-focus'),
        divider: colorAt('component.tabs.surface.divider'),
      },
      badge: {
        background: colorAt('component.badge.surface.bg-neutral'),
        text: colorAt('component.badge.count.text-neutral'),
      },
    },
    sizes: {
      md: {
        height: dimensionAt('size.control.height.md'),
        label: composedTypographyAt('font.size.label.md', 'font.weight.extrabold', 'font.line-height.snug'),
      },
      lg: {
        height: dimensionAt('size.control.height.lg'),
        label: composedTypographyAt('font.size.label.lg', 'font.weight.extrabold', 'font.line-height.snug'),
      },
    },
    dimension: {
      paddingX: dimensionAt('space.inset.md'),
      itemGap: dimensionAt('space.inline.lg'),
      labelRowGap: dimensionAt('space.inline.sm'),
      iconSize: dimensionAt('size.icon.sm'),
      pillRadius: dimensionAt('radius.pill'),
      overlayRadius: dimensionAt('radius.control.sm'),
      indicatorWidth: dimensionAt('border.width.indicator'),
      dividerWidth: dimensionAt('border.width.divider'),
      barPaddingX: dimensionAt('space.inset.xs'),
      badgeMinSize: dimensionAt('size.control.height.xs'),
      badgePaddingX: dimensionAt('space.inset.xs'),
      /** `font/letter-spacing/wide` is 2% of the body, mis-typed as px. */
      badgeLetterSpacing: badge.fontSize * (dimensionAt('font.letter-spacing.wide') / 100),
      targetMin: dimensionAt('size.target.min'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
    },
    badge,
  };
};

export const tabsTokens: Record<TThemeMode, ITabsTokens> = {
  light: readTabsTokens('light'),
  dark: readTabsTokens('dark'),
};

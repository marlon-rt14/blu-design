import { tabsTokens } from '@dsm/shared';
import type { TTabSize, TTabsLayout, TTokensOf } from '@dsm/shared';
import type { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ITabItemProps } from './TabItem.types';

type TTabChrome = 'active' | 'inactive' | 'disabled';

interface IUseTabItemParams extends ITabItemProps {
  isPressed: boolean;
  measuredWidth: number;
}

interface IUseTabItemResult {
  rootStyle: StyleProp<ViewStyle>;
  overlayStyle: StyleProp<ViewStyle> | undefined;
  labelRowStyle: StyleProp<ViewStyle>;
  badgeStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  badgeLabelStyle: StyleProp<TextStyle>;
  indicatorStyle: StyleProp<ViewStyle> | undefined;
  iconColor: string;
  hitSlop: Insets | undefined;
  isDisabled: boolean;
}

const sizeTokensOf = (size: TTabSize, tokens: TTokensOf<typeof tabsTokens>) => {
  switch (size) {
    case 'md':
      return tokens.sizes.md;
    case 'lg':
      return tokens.sizes.lg;
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
};

const layoutOf = (layout: TTabsLayout): TTabsLayout => {
  switch (layout) {
    case 'scrollable':
    case 'fitted':
      return layout;
    default: {
      const _exhaustive: never = layout;
      return _exhaustive;
    }
  }
};

const chromeOf = (isDisabled: boolean, isSelected: boolean, isPressed: boolean): TTabChrome => {
  if (isDisabled) return 'disabled';
  if (isSelected || isPressed) return 'active';
  return 'inactive';
};

/**
 * Resolves every colour and metric the native TabItem needs.
 *
 * No hover — a touch screen has none. Pressed still paints the overlay.
 * ExtraBold at every state; colour carries inactive vs active. Short labels
 * and `md` (44 < 48) get hitSlop out to `size.target.min`.
 */
export const useTabItem = ({
  size = 'lg',
  layout = 'scrollable',
  isSelected = false,
  isDisabled = false,
  isPressed,
  measuredWidth,
}: IUseTabItemParams): IUseTabItemResult => {
  const mode = useThemeMode();
  const tokens = tabsTokens[mode];
  const sizeTokens = sizeTokensOf(size, tokens);
  const { dimension } = tokens;
  const fitted = layoutOf(layout) === 'fitted';
  const chrome = chromeOf(isDisabled, isSelected, isPressed);
  const overlayColor = isDisabled
    ? undefined
    : isPressed
      ? tokens.colors.surface.overlayPressed
      : undefined;

  const iconColor =
    chrome === 'disabled'
      ? tokens.colors.icon.disabled
      : chrome === 'active'
        ? tokens.colors.icon.active
        : tokens.colors.icon.inactive;

  const rootStyle: ViewStyle = {
    height: sizeTokens.height,
    paddingHorizontal: dimension.paddingX,
    flexShrink: fitted ? 1 : 0,
    flexGrow: fitted ? 1 : 0,
    flexBasis: fitted ? 0 : undefined,
    minWidth: fitted ? 1 : undefined,
  };

  const overlayStyle: ViewStyle | undefined = overlayColor
    ? {
        borderRadius: dimension.overlayRadius,
        backgroundColor: overlayColor,
      }
    : undefined;

  const labelRowStyle: ViewStyle = {
    gap: dimension.labelRowGap,
  };

  const labelStyle: TextStyle = {
    fontFamily: resolveMulishFontFamily(sizeTokens.label.fontWeight),
    fontSize: sizeTokens.label.fontSize,
    lineHeight: sizeTokens.label.lineHeight,
    color:
      chrome === 'disabled'
        ? tokens.colors.label.disabled
        : chrome === 'active'
          ? tokens.colors.label.active
          : tokens.colors.label.inactive,
  };

  const badgeStyle: ViewStyle = {
    minWidth: dimension.badgeMinSize,
    minHeight: dimension.badgeMinSize,
    paddingHorizontal: dimension.badgePaddingX,
    borderRadius: dimension.pillRadius,
    backgroundColor: tokens.colors.badge.background,
  };

  const badgeLabelStyle: TextStyle = {
    fontFamily: resolveMulishFontFamily(tokens.badge.fontWeight),
    fontSize: tokens.badge.fontSize,
    lineHeight: tokens.badge.lineHeight,
    letterSpacing: dimension.badgeLetterSpacing,
    color: tokens.colors.badge.text,
  };

  const indicatorStyle: ViewStyle | undefined = isSelected
    ? {
        height: dimension.indicatorWidth,
        backgroundColor: isDisabled ? tokens.colors.indicator.disabled : tokens.colors.indicator.active,
      }
    : undefined;

  const verticalSlop = Math.max(0, Math.ceil((dimension.targetMin - sizeTokens.height) / 2));
  const horizontalSlop =
    measuredWidth > 0 ? Math.max(0, Math.ceil((dimension.targetMin - measuredWidth) / 2)) : 0;
  const hitSlop: Insets | undefined =
    verticalSlop === 0 && horizontalSlop === 0
      ? undefined
      : { top: verticalSlop, bottom: verticalSlop, left: horizontalSlop, right: horizontalSlop };

  return {
    rootStyle,
    overlayStyle,
    labelRowStyle,
    badgeStyle,
    labelStyle,
    badgeLabelStyle,
    indicatorStyle,
    iconColor,
    hitSlop,
    isDisabled,
  };
};

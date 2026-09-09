import { tabsTokens } from '@dsm/shared';
import type { TTabSize, TTabsLayout } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ITabItemProps } from './TabItem.types';

type TTabChrome = 'active' | 'inactive' | 'disabled';

interface IUseTabItemParams extends ITabItemProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

interface IUseTabItemResult {
  rootStyle: CSSProperties;
  overlayStyle: CSSProperties | undefined;
  contentStyle: CSSProperties;
  labelRowStyle: CSSProperties;
  iconStyle: CSSProperties;
  labelStyle: CSSProperties;
  badgeStyle: CSSProperties;
  badgeLabelStyle: CSSProperties;
  indicatorStyle: CSSProperties | undefined;
  iconColor: string;
  isDisabled: boolean;
}

const sizeTokensOf = (size: TTabSize, tokens: (typeof tabsTokens)['light']) => {
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

const chromeOf = (
  isDisabled: boolean,
  isSelected: boolean,
  isHovered: boolean,
  isPressed: boolean,
): TTabChrome => {
  if (isDisabled) return 'disabled';
  if (isSelected || isHovered || isPressed) return 'active';
  return 'inactive';
};

const overlayColorOf = (
  isDisabled: boolean,
  isHovered: boolean,
  isPressed: boolean,
  tokens: (typeof tabsTokens)['light'],
): string | undefined => {
  if (isDisabled) return undefined;
  if (isPressed) return tokens.colors.surface.overlayPressed;
  if (isHovered) return tokens.colors.surface.overlayHover;
  return undefined;
};

/**
 * Resolves every style the web TabItem needs from the active theme, its
 * props and its current interaction state.
 *
 * Hover / pressed paint an overlay behind the content (`radius/control/sm`).
 * Focus is Switch's flush ring (`spread` − `offset`, no gap) — not
 * TextField's offset two-tone. Live nodes use ExtraBold at every state;
 * colour carries inactive vs active.
 */
export const useTabItem = ({
  size = 'md',
  layout = 'scrollable',
  isSelected = false,
  isDisabled = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseTabItemParams): IUseTabItemResult => {
  const mode = useThemeMode();
  const tokens = tabsTokens[mode];
  const sizeTokens = sizeTokensOf(size, tokens);
  const fontFamily = useFontFamily(sizeTokens.label.fontWeight);
  const badgeFontFamily = useFontFamily(tokens.badge.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { dimension } = tokens;

  const chrome = chromeOf(isDisabled, isSelected, isHovered, isPressed);
  const overlayColor = overlayColorOf(isDisabled, isHovered, isPressed, tokens);
  const showFocusRing = isFocusVisible && !isDisabled;
  const boxShadow = showFocusRing
    ? `0 0 0 ${dimension.focusRingSpread - dimension.focusRingOffset}px ${tokens.colors.surface.borderFocus}`
    : undefined;
  const fitted = layoutOf(layout) === 'fitted';

  const rootStyle: CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: sizeTokens.height,
    paddingInline: dimension.paddingX,
    margin: 0,
    border: 'none',
    background: 'transparent',
    appearance: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    overflow: 'visible',
    flexShrink: fitted ? 1 : 0,
    flexGrow: fitted ? 1 : 0,
    flexBasis: fitted ? 0 : 'auto',
    minWidth: fitted ? 1 : undefined,
    width: fitted ? '100%' : undefined,
    boxShadow,
    outline: 'none',
    transition: prefersReducedMotion ? 'none' : 'box-shadow 120ms ease',
  };

  const overlayStyle: CSSProperties | undefined = overlayColor
    ? {
        position: 'absolute',
        inset: 0,
        borderRadius: dimension.overlayRadius,
        backgroundColor: overlayColor,
        pointerEvents: 'none',
      }
    : undefined;

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: '100%',
  };

  const labelRowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimension.labelRowGap,
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
  };

  const iconColor =
    chrome === 'disabled'
      ? tokens.colors.icon.disabled
      : chrome === 'active'
        ? tokens.colors.icon.active
        : tokens.colors.icon.inactive;

  const iconStyle: CSSProperties = {
    display: 'inline-flex',
    flexShrink: 0,
    color: iconColor,
  };

  const labelStyle: CSSProperties = {
    margin: 0,
    color:
      chrome === 'disabled'
        ? tokens.colors.label.disabled
        : chrome === 'active'
          ? tokens.colors.label.active
          : tokens.colors.label.inactive,
    fontFamily,
    fontWeight: sizeTokens.label.fontWeight,
    fontSize: sizeTokens.label.fontSize,
    lineHeight: `${sizeTokens.label.lineHeight}px`,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const badgeStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: dimension.badgeMinSize,
    minHeight: dimension.badgeMinSize,
    paddingInline: dimension.badgePaddingX,
    borderRadius: dimension.pillRadius,
    backgroundColor: tokens.colors.badge.background,
    flexShrink: 0,
  };

  const badgeLabelStyle: CSSProperties = {
    color: tokens.colors.badge.text,
    fontFamily: badgeFontFamily,
    fontWeight: tokens.badge.fontWeight,
    fontSize: tokens.badge.fontSize,
    lineHeight: `${tokens.badge.lineHeight}px`,
    letterSpacing: dimension.badgeLetterSpacing,
    userSelect: 'none',
  };

  const indicatorStyle: CSSProperties | undefined = isSelected
    ? {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: dimension.indicatorWidth,
        backgroundColor: isDisabled ? tokens.colors.indicator.disabled : tokens.colors.indicator.active,
        pointerEvents: 'none',
      }
    : undefined;

  return {
    rootStyle,
    overlayStyle,
    contentStyle,
    labelRowStyle,
    iconStyle,
    labelStyle,
    badgeStyle,
    badgeLabelStyle,
    indicatorStyle,
    iconColor,
    isDisabled,
  };
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

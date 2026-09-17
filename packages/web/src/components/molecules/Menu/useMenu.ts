import { menuTokens, MENU_LINE_HEIGHT_RATIO } from '@dsm/shared';
import type { TMenuSize } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';

interface IUseMenuParams {
  size: TMenuSize;
}

/** Live flags a single row resolves its paint from — computed by the caller, not stored here. */
interface IMenuItemState {
  isSelected: boolean;
  /** Keyboard-highlighted or mouse-hovered — Menu treats the two as one concept, same as Select's own dropdown. */
  isHighlighted: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
  isDisabled: boolean;
}

interface IMenuItemStyles {
  rowStyle: CSSProperties;
  labelStyle: CSSProperties;
  descriptionStyle: CSSProperties;
  trailingStyle: CSSProperties;
  iconColor: string;
  /** Fixed regardless of state — the check mark is never anything but `icon-brand`. */
  checkColor: string;
}

interface IUseMenuResult {
  wrapperStyle: CSSProperties;
  headerStyle: CSSProperties;
  listStyle: CSSProperties;
  emptyStyle: CSSProperties;
  getItemStyle: (state: IMenuItemState) => IMenuItemStyles;
}

/**
 * Resolves every style Menu needs. Per-row color painting is a function
 * rather than a single static object — each row carries its own selected /
 * highlighted / pressed / disabled combination at the same time, unlike an
 * atom that only ever renders one instance of itself.
 */
export const useMenu = ({ size }: IUseMenuParams): IUseMenuResult => {
  const mode = useThemeMode();
  const tokens = menuTokens[mode];
  const prefersReducedMotion = usePrefersReducedMotion();
  const sizeTokens = tokens.dimension.sizes[size];
  const labelFont = useFontFamily(tokens.dimension.fontWeight);

  const wrapperStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: tokens.dimension.borderRadius,
    border: `${tokens.dimension.borderWidth}px solid ${tokens.colors.surfaceBorder}`,
    backgroundColor: tokens.colors.surfaceBg,
    overflow: 'hidden',
    fontFamily: labelFont,
  };

  const headerStyle: CSSProperties = {
    boxSizing: 'border-box',
    margin: 0,
    padding: `${tokens.dimension.paddingVertical}px ${sizeTokens.paddingHorizontal}px`,
    fontFamily: labelFont,
    fontWeight: tokens.dimension.fontWeight,
    fontSize: tokens.dimension.descriptionFontSize,
    lineHeight: `${tokens.dimension.descriptionFontSize * MENU_LINE_HEIGHT_RATIO}px`,
    color: tokens.colors.headerText,
  };

  const listStyle: CSSProperties = {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    outline: 'none',
  };

  const emptyStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    minHeight: sizeTokens.minHeight,
    padding: `${tokens.dimension.paddingVertical}px ${sizeTokens.paddingHorizontal}px`,
    fontFamily: labelFont,
    fontWeight: tokens.dimension.fontWeight,
    fontSize: sizeTokens.labelFontSize,
    lineHeight: `${sizeTokens.labelFontSize * MENU_LINE_HEIGHT_RATIO}px`,
    color: tokens.colors.emptyText,
  };

  const getItemStyle = ({ isSelected, isHighlighted, isPressed, isFocusVisible, isDisabled }: IMenuItemState): IMenuItemStyles => {
    // "selected + pressed apila dos velos": stack the selected wash and the pressed wash, there is no combined token.
    const washes: string[] = [];
    if (!isDisabled) {
      if (isSelected) {
        if (isHighlighted) washes.push(tokens.colors.item.overlaySelected);
        if (isPressed) washes.push(tokens.colors.item.overlayPressed);
      } else if (isPressed) {
        washes.push(tokens.colors.item.overlayPressed);
      } else if (isHighlighted) {
        washes.push(tokens.colors.item.overlayHover);
      }
    }
    const backgroundImage = washes.length > 0 ? washes.map((wash) => `linear-gradient(${wash}, ${wash})`).join(', ') : undefined;

    return {
      rowStyle: {
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.dimension.gap,
        minHeight: sizeTokens.minHeight,
        padding: `${tokens.dimension.paddingVertical}px ${sizeTokens.paddingHorizontal}px`,
        borderRadius: tokens.dimension.borderRadius,
        backgroundColor: isSelected ? tokens.colors.item.bgSelected : tokens.colors.item.bgDefault,
        backgroundImage,
        boxShadow: isFocusVisible ? `0 0 0 ${tokens.dimension.focusRingSpread}px ${tokens.colors.item.borderFocus}` : undefined,
        transition: prefersReducedMotion ? 'none' : 'background-color 120ms ease, box-shadow 120ms ease',
        cursor: isDisabled ? 'default' : 'pointer',
      },
      labelStyle: {
        margin: 0,
        fontFamily: labelFont,
        fontWeight: tokens.dimension.fontWeight,
        fontSize: sizeTokens.labelFontSize,
        lineHeight: `${sizeTokens.labelFontSize * MENU_LINE_HEIGHT_RATIO}px`,
        color: isDisabled ? tokens.colors.item.labelDisabled : tokens.colors.item.label,
      },
      descriptionStyle: {
        margin: 0,
        fontFamily: labelFont,
        fontWeight: tokens.dimension.fontWeight,
        fontSize: tokens.dimension.descriptionFontSize,
        lineHeight: `${tokens.dimension.descriptionFontSize * MENU_LINE_HEIGHT_RATIO}px`,
        color: isDisabled ? tokens.colors.item.descriptionDisabled : tokens.colors.item.description,
      },
      trailingStyle: {
        flexShrink: 0,
        fontFamily: labelFont,
        fontWeight: tokens.dimension.fontWeight,
        fontSize: sizeTokens.labelFontSize,
        lineHeight: `${sizeTokens.labelFontSize * MENU_LINE_HEIGHT_RATIO}px`,
        color: isDisabled ? tokens.colors.item.trailingDisabled : tokens.colors.item.trailing,
        whiteSpace: 'nowrap',
      },
      iconColor: isDisabled ? tokens.colors.item.iconDisabled : tokens.colors.item.iconDefault,
      checkColor: tokens.colors.item.iconBrand,
    };
  };

  return { wrapperStyle, headerStyle, listStyle, emptyStyle, getItemStyle };
};

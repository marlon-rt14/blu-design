import { chipTokens, CHIP_LINE_HEIGHT_RATIO } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IChipProps } from './Chip.types';

/** Params of {@link useChip}: the Chip props plus the live interaction state. */
interface IUseChipParams extends IChipProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

interface IUseChipResult {
  rootStyle: CSSProperties;
  iconWrapperStyle: CSSProperties;
  labelStyle: CSSProperties;
  removeWrapperStyle: CSSProperties;
}

/**
 * Resolves every style the Chip needs. Hover only ever applies on web — the
 * dev contract's own platform table has no hover row for iOS/Android.
 */
export const useChip = ({
  selected,
  size = 'sm',
  disabled = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseChipParams): IUseChipResult => {
  const mode = useThemeMode();
  const tokens = chipTokens[mode];
  const prefersReducedMotion = usePrefersReducedMotion();
  const sizeTokens = tokens.dimension.sizes[size];
  const labelFont = useFontFamily(tokens.dimension.fontWeight);

  const state = disabled
    ? selected
      ? tokens.colors.selectedDisabled
      : tokens.colors.unselectedDisabled
    : selected
      ? isPressed
        ? tokens.colors.selectedPressed
        : isHovered
          ? tokens.colors.selectedHover
          : tokens.colors.selected
      : isPressed
        ? tokens.colors.unselectedPressed
        : isHovered
          ? tokens.colors.unselectedHover
          : tokens.colors.unselected;

  const labelColor = disabled ? tokens.colors.labelDisabled : selected ? tokens.colors.labelSelected : tokens.colors.labelDefault;
  const iconColor = disabled ? tokens.colors.iconDisabled : selected ? tokens.colors.iconSelected : tokens.colors.iconDefault;

  const backgroundImage = state.overlay ? `linear-gradient(${state.overlay}, ${state.overlay})` : undefined;

  const boxShadow = isFocusVisible && !disabled ? `0 0 0 ${tokens.dimension.focusRingSpread}px ${tokens.colors.borderFocus}` : undefined;

  return {
    rootStyle: {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      gap: tokens.dimension.gap,
      height: sizeTokens.height,
      paddingInline: sizeTokens.paddingHorizontal,
      margin: 0,
      borderRadius: tokens.dimension.borderRadius,
      borderWidth: tokens.dimension.borderWidth,
      borderStyle: 'solid',
      borderColor: state.border,
      backgroundColor: state.background,
      backgroundImage,
      boxShadow,
      transition: prefersReducedMotion ? 'none' : 'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
    iconWrapperStyle: {
      display: 'inline-flex',
      flexShrink: 0,
      color: iconColor,
    },
    labelStyle: {
      color: labelColor,
      fontFamily: labelFont,
      fontWeight: tokens.dimension.fontWeight,
      fontSize: sizeTokens.fontSize,
      lineHeight: sizeTokens.fontSize * CHIP_LINE_HEIGHT_RATIO,
      whiteSpace: 'nowrap',
    },
    removeWrapperStyle: {
      display: 'inline-flex',
      flexShrink: 0,
      color: iconColor,
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
  };
};

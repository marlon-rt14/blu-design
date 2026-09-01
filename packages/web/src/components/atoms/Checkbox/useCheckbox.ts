import { checkboxTokens } from '@dsm/shared';
import type { TCheckboxSize, TIconSize } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ICheckboxProps } from './Checkbox.types';

interface IUseCheckboxParams extends ICheckboxProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

interface IUseCheckboxResult {
  rowStyle: CSSProperties;
  boxSlotStyle: CSSProperties;
  boxStyle: CSSProperties;
  overlayStyle: CSSProperties | undefined;
  labelStyle: CSSProperties;
  inputStyle: CSSProperties;
  isDisabled: boolean;
  isSelected: boolean;
  isIndeterminate: boolean;
  markIconSize: TIconSize;
}

/** sm field → mark `xs` (12); md field → mark `sm` (16). Never `lg` inside the box. */
const markIconSizeForField = (size: TCheckboxSize): TIconSize => {
  switch (size) {
    case 'sm':
      return 'xs';
    case 'md':
      return 'sm';
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
};

/**
 * Hover overlay sits at `-borderWidth` so it covers the 2px stroke. Focus is
 * an offset ring (gap + spread), kept on a checked box — not TextField's flush ring.
 */
export const useCheckbox = ({
  size = 'sm',
  isChecked = false,
  isIndeterminate = false,
  isDisabled = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseCheckboxParams): IUseCheckboxResult => {
  const mode = useThemeMode();
  const tokens = checkboxTokens[mode];
  const sizeTokens = tokens.sizes[size];
  const { boxSize, minHeight } = sizeTokens;
  const { borderRadius, borderWidth, gap, focusRingOffset, focusRingSpread } = tokens.dimension;
  const fontFamily = useFontFamily(sizeTokens.label.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSelected = isIndeterminate || isChecked;

  const boxBackground = isDisabled
    ? tokens.colors.box.backgroundDisabled
    : isSelected && isPressed
      ? tokens.colors.box.backgroundSelectedPressed
      : isSelected
        ? tokens.colors.box.backgroundSelected
        : tokens.colors.box.backgroundUnchecked;

  const boxBorderColor = isDisabled
    ? tokens.colors.box.borderDisabled
    : isSelected
      ? tokens.colors.box.borderSelected
      : isPressed
        ? tokens.colors.box.borderHover
        : tokens.colors.box.borderDefault;

  const overlayColor = isDisabled
    ? undefined
    : isPressed
      ? undefined
      : isSelected && isHovered
        ? tokens.colors.box.overlayHoverSelected
        : !isSelected && isHovered
          ? tokens.colors.box.overlayHover
          : undefined;

  const showFocusRing = isFocusVisible && !isDisabled;
  const boxShadow = showFocusRing
    ? `0 0 0 ${focusRingOffset}px ${tokens.colors.focusRingGap}, 0 0 0 ${focusRingOffset + focusRingSpread}px ${tokens.colors.box.borderFocus}`
    : undefined;

  const rowStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap,
    minHeight,
    boxSizing: 'border-box',
    cursor: isDisabled ? 'default' : 'pointer',
  };

  const boxSlotStyle: CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    width: boxSize,
    height: boxSize,
  };

  const boxStyle: CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: boxSize,
    height: boxSize,
    borderRadius,
    borderWidth,
    borderStyle: 'solid',
    borderColor: boxBorderColor,
    backgroundColor: boxBackground,
    boxShadow,
    overflow: 'visible',
    pointerEvents: 'none',
    transition: prefersReducedMotion ? 'none' : 'background-color 120ms ease, border-color 120ms ease',
  };

  const overlayStyle: CSSProperties | undefined = overlayColor
    ? {
        position: 'absolute',
        top: -borderWidth,
        right: -borderWidth,
        bottom: -borderWidth,
        left: -borderWidth,
        borderRadius,
        backgroundColor: overlayColor,
        pointerEvents: 'none',
      }
    : undefined;

  const labelStyle: CSSProperties = {
    fontFamily,
    fontWeight: sizeTokens.label.fontWeight,
    fontSize: sizeTokens.label.fontSize,
    lineHeight: `${sizeTokens.label.lineHeight}px`,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
    userSelect: 'none',
  };

  const inputStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    margin: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: isDisabled ? 'default' : 'pointer',
    zIndex: 2,
  };

  return {
    rowStyle,
    boxSlotStyle,
    boxStyle,
    overlayStyle,
    labelStyle,
    inputStyle,
    isDisabled,
    isSelected,
    isIndeterminate,
    markIconSize: markIconSizeForField(size),
  };
};

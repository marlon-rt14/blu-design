import { checkboxTokens } from '@dsm/shared';
import type { TCheckboxSize, TIconSize } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ICheckboxProps } from './Checkbox.types';

interface IUseCheckboxParams extends ICheckboxProps {
  isPressed: boolean;
  isFocused: boolean;
}

interface IUseCheckboxResult {
  rowStyle: StyleProp<ViewStyle>;
  ringStyle: StyleProp<ViewStyle>;
  gapStyle: StyleProp<ViewStyle>;
  boxStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
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
 * Offset focus ring is always reserved (`offset` + `spread` borders, transparent
 * when unfocused) so layout does not jump. Opposite of TextField's flush ring.
 */
export const useCheckbox = ({
  size = 'md',
  isChecked = false,
  isIndeterminate = false,
  isDisabled = false,
  isPressed,
  isFocused,
}: IUseCheckboxParams): IUseCheckboxResult => {
  const mode = useThemeMode();
  const tokens = checkboxTokens[mode];
  const sizeTokens = tokens.sizes[size];
  const { boxSize, minHeight } = sizeTokens;
  const { borderRadius, borderWidth, gap, focusRingOffset, focusRingSpread } = tokens.dimension;
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

  const showFocusRing = isFocused && !isDisabled;
  // Borders always reserved so focus doesn't shift layout; negative margin
  // collapses them so the box+gap match web (box-shadow doesn't take space).
  const ringOutset = focusRingOffset + focusRingSpread;

  const rowStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'center',
    gap,
    minHeight,
    flexShrink: 0,
  };

  const ringStyle: StyleProp<ViewStyle> = {
    borderRadius: borderRadius + ringOutset,
    borderWidth: focusRingSpread,
    borderColor: showFocusRing ? tokens.colors.box.borderFocus : 'transparent',
    margin: -ringOutset,
  };

  const gapStyle: StyleProp<ViewStyle> = {
    borderRadius: borderRadius + focusRingOffset,
    borderWidth: focusRingOffset,
    borderColor: showFocusRing ? tokens.colors.focusRingGap : 'transparent',
  };

  const boxStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: boxSize,
    height: boxSize,
    borderRadius,
    borderWidth,
    borderColor: boxBorderColor,
    backgroundColor: boxBackground,
    overflow: 'visible',
  };

  const labelStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(sizeTokens.label.fontWeight),
    fontSize: sizeTokens.label.fontSize,
    lineHeight: sizeTokens.label.lineHeight,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
  };

  return {
    rowStyle,
    ringStyle,
    gapStyle,
    boxStyle,
    labelStyle,
    isDisabled,
    isSelected,
    isIndeterminate,
    markIconSize: markIconSizeForField(size),
  };
};

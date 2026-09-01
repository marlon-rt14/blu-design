import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { IconCheck, IconMinus } from '../../../icons';
import type { ICheckboxProps } from './Checkbox.types';
import { useCheckbox } from './useCheckbox';

/** `Pressable` `onFocus` only fires on react-native-web; iOS/Android it's a no-op. */
export const Checkbox = (props: ICheckboxProps): ReactElement => {
  const {
    isChecked = false,
    isIndeterminate = false,
    isDisabled = false,
    label,
    showLabel = true,
    accessibilityLabel,
    onValueChange,
    testID,
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { rowStyle, ringStyle, gapStyle, boxStyle, labelStyle, isSelected, markIconSize } = useCheckbox({
    ...props,
    isChecked,
    isIndeterminate,
    isDisabled,
    isPressed,
    isFocused,
  });

  const nextChecked = isIndeterminate ? true : !isChecked;
  const a11yChecked: boolean | 'mixed' = isIndeterminate ? 'mixed' : isChecked;
  const markColor = isDisabled ? 'disabled' : 'fixed.white';
  const Mark = isIndeterminate ? IconMinus : IconCheck;
  const a11yLabel = showLabel ? label : accessibilityLabel;

  return (
    <Pressable
      accessibilityLabel={a11yLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: a11yChecked, disabled: isDisabled }}
      disabled={isDisabled}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={() => onValueChange?.(nextChecked)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={rowStyle}
      testID={testID}
    >
      <View style={ringStyle}>
        <View style={gapStyle}>
          <View style={boxStyle}>{isSelected ? <Mark color={markColor} size={markIconSize} /> : null}</View>
        </View>
      </View>
      {showLabel && label ? <Text style={labelStyle}>{label}</Text> : null}
    </Pressable>
  );
};

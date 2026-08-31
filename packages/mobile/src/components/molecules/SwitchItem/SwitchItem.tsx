import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Switch } from '../../atoms/Switch';
import type { ISwitchItemProps } from './SwitchItem.types';
import { useSwitchItem } from './useSwitchItem';

/**
 * React Native SwitchItem — the iOS-canonical Switch usage. The entire
 * row is the control (`Pressable` + `accessibilityRole="switch"`). The
 * embedded Switch is visual-only (`isContained`) so we don't nest two
 * switches in the accessibility tree.
 *
 * @example
 * ```tsx
 * const [on, setOn] = useState(true);
 * <SwitchItem label="Notifications" isChecked={on} onValueChange={setOn} />
 * ```
 */
export const SwitchItem = (props: ISwitchItemProps): ReactElement => {
  const {
    isChecked = false,
    size = 'md',
    label,
    showDescription = false,
    description,
    showDivider = true,
    isDisabled = false,
    showStateLabel = false,
    onLabel,
    offLabel,
    onValueChange,
    testID,
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const { rowStyle, overlayStyle, textColumnStyle, labelStyle, descriptionStyle, dividerStyle } = useSwitchItem({
    ...props,
    isPressed,
  });

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => onValueChange?.(!isChecked)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={rowStyle}
      testID={testID}
    >
      {overlayStyle ? <View pointerEvents="none" style={overlayStyle} /> : null}
      <View style={textColumnStyle}>
        <Text style={labelStyle}>{label}</Text>
        {showDescription && description ? <Text style={descriptionStyle}>{description}</Text> : null}
      </View>
      <Switch
        isChecked={isChecked}
        isContained
        isDisabled={isDisabled}
        offLabel={offLabel}
        onLabel={onLabel}
        showStateLabel={showStateLabel}
        size={size}
      />
      {showDivider ? <View pointerEvents="none" style={dividerStyle} /> : null}
    </Pressable>
  );
};

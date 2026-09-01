import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { ISwitchProps } from './Switch.types';
import { useSwitch } from './useSwitch';

/**
 * React Native Switch — a custom `Pressable` track + thumb. Does **not**
 * use RN `Switch` / `UISwitch` (Apple green, 51×31, wrong tokens).
 *
 * `accessibilityRole="switch"` with `accessibilityState={{ checked, disabled }}`.
 * No hover. Standalone row floor is live-node (sm 32 × track 40; md 48 ×
 * 56) — do not expand sm to 48×48. `isContained` drops the Pressable
 * so SwitchItem can own the row hit target.
 *
 * @example
 * ```tsx
 * const [on, setOn] = useState(false);
 * <Switch isChecked={on} onValueChange={setOn} />
 * ```
 */
export const Switch = (props: ISwitchProps): ReactElement => {
  const {
    isChecked = false,
    isDisabled = false,
    isContained = false,
    showStateLabel = false,
    onLabel = 'ON',
    offLabel = 'OFF',
    onValueChange,
    testID,
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const { hitTargetStyle, trackStyle, overlayStyle, thumbStyle, travelStyle, labelStyle } = useSwitch({
    ...props,
    isChecked,
    isDisabled,
    isPressed,
  });

  const track = (
    <View style={trackStyle}>
      {overlayStyle ? <View pointerEvents="none" style={overlayStyle} /> : null}
      <View style={thumbStyle} />
      <View style={travelStyle}>
        {showStateLabel ? <Text style={labelStyle}>{isChecked ? onLabel : offLabel}</Text> : null}
      </View>
    </View>
  );

  if (isContained) {
    return (
      <View style={hitTargetStyle} testID={testID}>
        {track}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => onValueChange?.(!isChecked)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={hitTargetStyle}
      testID={testID}
    >
      {track}
    </Pressable>
  );
};

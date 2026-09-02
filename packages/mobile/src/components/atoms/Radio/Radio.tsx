import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { radioStyles } from './Radio.styles';
import type { IRadioProps } from './Radio.types';
import { useRadio } from './useRadio';

/**
 * React Native Radio — one exclusive choice inside a group.
 *
 * **It never stands alone.** bDS is explicit: if there is only one option, that
 * is a Checkbox. And a group cannot be cleared once chosen — if the user has to
 * be able to go back to "none", the group is missing an explicit option for it.
 *
 * The `Pressable` is the whole row, not just the circle: bDS makes the row the
 * touch target and sizes it to `size/target/min` at `md`. `accessibilityRole`
 * and `accessibilityState.checked` are what let VoiceOver and TalkBack announce
 * the option and its group — there is no native radio element to inherit that
 * from, unlike web.
 *
 * Controlled: the selection always comes from `isChecked` and the Radio never
 * changes it. Coordinating a group belongs to whatever owns it.
 *
 * Selection and focus share the same blue on purpose: the dot says selected, the
 * ring says focused. Focus only lights up through react-native-web; on iOS and
 * Android `Pressable`'s `onFocus` is a no-op.
 *
 * @example
 * ```tsx
 * <Radio label="Débito" isChecked={m === 'debito'} onPress={() => pick('debito')} />
 * ```
 */
export const Radio = ({ onPress, ...props }: IRadioProps): ReactElement => {
  const { label, showLabel = true, isChecked = false, testID } = props;
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { rowStyle, boxStyle, dotStyle, labelStyle, isDisabled } = useRadio({
    ...props,
    isPressed,
    isFocused,
  });

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      disabled={isDisabled}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[radioStyles.row, rowStyle]}
      testID={testID}
    >
      <View style={[radioStyles.box, boxStyle]}>{dotStyle ? <View style={dotStyle} /> : null}</View>
      {showLabel ? <Text style={labelStyle}>{label}</Text> : null}
    </Pressable>
  );
};

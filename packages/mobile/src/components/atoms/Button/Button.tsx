import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';

import type { IButtonProps } from './Button.types';
import { useButton } from './useButton';

/**
 * React Native Button — the primary way to trigger an action.
 *
 * Wraps a `Pressable` with `accessibilityRole="button"` so screen readers
 * announce it correctly. The press state is tracked locally to drive the pressed
 * styles, rather than relying on `Pressable`'s style callback, so that the whole
 * styling decision stays inside `useButton`.
 *
 * @example
 * ```tsx
 * <Button label="Save" onPress={handleSave} />
 * <Button label="Cancel" variant="secondary" size="small" onPress={close} />
 * <Button label="Save" isDisabled />
 * ```
 */
export const Button = ({ onPress, ...props }: IButtonProps): ReactElement => {
  const [isPressed, setIsPressed] = useState(false);
  const { containerStyle, labelStyle, isDisabled } = useButton({ ...props, isPressed });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={containerStyle}
      testID={props.testID}
    >
      <Text style={labelStyle}>{props.label}</Text>
    </Pressable>
  );
};

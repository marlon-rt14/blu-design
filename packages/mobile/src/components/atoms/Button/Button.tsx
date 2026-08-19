import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';

import type { IButtonProps } from './Button.types';
import { useButton } from './useButton';

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

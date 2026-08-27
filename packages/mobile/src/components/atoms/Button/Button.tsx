import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { buttonStyles } from './Button.styles';
import type { IButtonProps } from './Button.types';
import { useButton } from './useButton';

/**
 * React Native Button — the primary way to trigger an action.
 *
 * Wraps a `Pressable` with `accessibilityRole="button"` so screen readers
 * announce it correctly. The press state is tracked here rather than through
 * `Pressable`'s style callback, so the whole styling decision stays inside
 * `useButton` — same split as `TextArea`.
 *
 * Two independent axes drive the look: `variant` says what the action *means*
 * (`primary`, `danger`) and `appearance` says how much weight it carries
 * (`fill` › `soft` › `outline` › `ghost`, plus `on-inverse` for inverted
 * surfaces). Lower the hierarchy with `appearance`, never by changing `variant`.
 *
 * The outer `View` is the focus ring layer. It always reserves the ring's width
 * and only recolors it, so focusing never shifts layout. It is reachable through
 * react-native-web (which is how Storybook renders this); on iOS and Android
 * `Pressable`'s `onFocus` is a no-op.
 *
 * `hitSlop` is applied automatically for every size below `size/target/min` —
 * bDS flags `size="xs"` (24) as requiring it.
 *
 * @example
 * ```tsx
 * <Button label="Publicar" onPress={publish} />
 * <Button label="Guardar borrador" appearance="outline" onPress={saveDraft} />
 * <Button label="Eliminar" variant="danger" size="sm" onPress={remove} />
 * ```
 */
export const Button = ({ onPress, ...props }: IButtonProps): ReactElement => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { ringStyle, containerStyle, labelStyle, hitSlop, isDisabled } = useButton({
    ...props,
    isPressed,
    isFocused,
  });

  return (
    <View style={ringStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        hitSlop={hitSlop}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[buttonStyles.container, containerStyle]}
        testID={props.testID}
      >
        <Text style={labelStyle}>{props.label}</Text>
      </Pressable>
    </View>
  );
};

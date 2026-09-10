import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable } from 'react-native';

import type { IIconButtonProps } from './IconButton.types';
import { useIconButton } from './useIconButton';

/**
 * React Native IconButton — the same action as a Button, without the label.
 *
 * Use it only when the icon is unambiguous on its own, or when there is no room
 * for text: *"si hay duda sobre qué hace, lleva etiqueta y entonces es Button"*.
 *
 * **`label` is required and is the only name this control has.** There is no
 * visible text, so it becomes the `accessibilityLabel`. Say the action, not the
 * drawing: `"Cerrar aviso"`, never `"equis"`.
 *
 * At `xs`, `sm` and `md` the control is smaller than `size/target/min`, so it
 * ships a `hitSlop` that closes the gap. That is the one thing this platform
 * can do that web cannot: grow what responds to a finger without moving the
 * drawing.
 *
 * @example
 * ```tsx
 * <IconButton icon={IconTrash} label="Eliminar" onPress={remove} />
 * <IconButton appearance="veil" icon={IconX} label="Cerrar aviso" onPress={close} size="sm" />
 * ```
 */
export const IconButton = (props: IIconButtonProps): ReactElement => {
  const { icon: Icon, label, onPress, testID } = props;
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { buttonStyle, iconSize, iconColor, hitSlop, isDisabled } = useIconButton({
    ...props,
    isPressed,
    isFocused,
  });

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={hitSlop}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={buttonStyle}
      testID={testID}
    >
      {/* The colour is handed over rather than inherited: there is no cascade
          here. A glyph carrying its own colour would break the six modes. */}
      <Icon size={iconSize} tintColor={iconColor} />
    </Pressable>
  );
};

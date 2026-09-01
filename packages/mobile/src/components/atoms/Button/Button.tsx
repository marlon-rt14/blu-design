import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';

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
 * The focus ring is an `outline`, not a wrapping View: React Native supports the
 * four `outline*` properties and, like in CSS, they draw outside the box without
 * touching layout — so there is nothing to reserve. `outlineOffset` is what keeps
 * the gap transparent instead of painting it in a guessed surface colour.
 * Focus itself is only reachable through react-native-web (which is how
 * Storybook renders this); on iOS and Android `Pressable`'s `onFocus` is a no-op.
 *
 * `hitSlop` is applied automatically for every size below `size/target/min` —
 * bDS flags `size="xs"` (24) as requiring it.
 *
 * @example
 * ```tsx
 * <Button label="Publicar" onPress={publish} />
 * <Button label="Guardar borrador" appearance="outline" onPress={saveDraft} />
 * <Button label="Eliminar" variant="danger" size="sm" onPress={remove} />
 * <Button label="Agregar" leadingIcon={IconPlus} onPress={add} />
 * ```
 */
export const Button = ({
  onPress,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  ...props
}: IButtonProps): ReactElement => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { containerStyle, outlineStyle, labelStyle, iconSize, iconColor, hitSlop, isDisabled } =
    useButton({ ...props, isPressed, isFocused });

  return (
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
      style={[buttonStyles.container, containerStyle, outlineStyle]}
      testID={props.testID}
    >
      {/* `tintColor`, not `color`: the value is a hex the Button already
          resolved, and a role would not carry the appearance's own label
          colour. Web needs none of this — there the icons inherit. */}
      {LeadingIcon ? <LeadingIcon size={iconSize} tintColor={iconColor} /> : null}
      <Text style={labelStyle}>{props.label}</Text>
      {TrailingIcon ? <TrailingIcon size={iconSize} tintColor={iconColor} /> : null}
    </Pressable>
  );
};

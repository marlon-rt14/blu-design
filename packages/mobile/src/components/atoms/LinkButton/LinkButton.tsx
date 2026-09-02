import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';

import { linkButtonStyles } from './LinkButton.styles';
import type { ILinkButtonProps } from './LinkButton.types';
import { useLinkButton } from './useLinkButton';

/**
 * React Native LinkButton — an action wearing a link's face.
 *
 * **It does not change the URL.** It acts on the screen it is on: opens,
 * expands, undoes. If the destination is another screen or an external site,
 * this is the wrong component.
 *
 * `appearance` picks the surface the link sits on, and each one carries its own
 * colours — including the focus ring, which goes white on `on-inverse` and
 * `on-scene`.
 *
 * The focus ring is an `outline`, not a wrapping View. Like in CSS it is ignored
 * by layout, so nothing has to be reserved to keep focusing from shifting the
 * text, and `outlineOffset` keeps the gap transparent rather than painting it in
 * a guessed surface colour. It only lights up through react-native-web, which is
 * how Storybook renders this.
 *
 * `hitSlop` is always applied — bDS is explicit that a standalone link needs it,
 * since both sizes sit far below the minimum touch target.
 *
 * @example
 * ```tsx
 * <LinkButton label="Ver más" onPress={expand} />
 * <LinkButton label="Deshacer" appearance="on-inverse" size="sm" onPress={undo} />
 * ```
 */
export const LinkButton = ({ onPress, ...props }: ILinkButtonProps): ReactElement => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { pressableStyle, labelStyle, hitSlop, isDisabled } = useLinkButton({
    ...props,
    isPressed,
    isFocused,
  });

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={hitSlop}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[linkButtonStyles.container, pressableStyle]}
      testID={props.testID}
    >
      <Text style={labelStyle}>{props.label}</Text>
    </Pressable>
  );
};

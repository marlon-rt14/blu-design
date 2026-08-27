import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

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
 * The outer `View` is the focus ring layer: it always reserves the ring's width
 * and only recolors it, so focusing never shifts layout. It only lights up
 * through react-native-web, which is how Storybook renders this.
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
  const { ringStyle, labelStyle, hitSlop, isDisabled } = useLinkButton({
    ...props,
    isPressed,
    isFocused,
  });

  return (
    <View style={ringStyle}>
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
        style={linkButtonStyles.container}
        testID={props.testID}
      >
        <Text style={labelStyle}>{props.label}</Text>
      </Pressable>
    </View>
  );
};

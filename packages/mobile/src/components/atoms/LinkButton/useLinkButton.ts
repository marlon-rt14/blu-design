import { linkButtonTokens } from '@dsm/shared';
import type { TLinkButtonState } from '@dsm/shared';
import type { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ILinkButtonProps } from './LinkButton.types';

/** Params of {@link useLinkButton}: the props plus the live interaction state. */
interface IUseLinkButtonParams extends ILinkButtonProps {
  /** Whether the `Pressable` is currently held down. */
  isPressed: boolean;
  /**
   * Whether the `Pressable` has focus. Only reachable through react-native-web —
   * `Pressable`'s `onFocus` is documented `@platform macos windows`.
   */
  isFocused: boolean;
}

/** Styles and derived values the LinkButton needs to render. */
interface IUseLinkButtonResult {
  /** Everything the `Pressable` needs: hugging width, ring radius, and the outline when focused. */
  pressableStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  /** Expands the touch target up to `size/target/min`. Never `undefined` here: both sizes fall short. */
  hitSlop: Insets;
  /** Normalized disabled flag, safe to hand straight to `Pressable`. */
  isDisabled: boolean;
  /** Resolved interaction state, exposed so stories and tests can assert on it. */
  state: TLinkButtonState;
}

/**
 * Resolves every colour, metric and touch target the native LinkButton needs,
 * from the active theme, its props and its current interaction state.
 *
 * Same shape as `@dsm/mobile`'s `useTextArea`: the component owns the interaction
 * state and passes it in. The state ladder is two rungs shorter than web's — a
 * touch screen has no `hover`, and bDS does not implement `visited` in apps.
 *
 * @param params - The LinkButton props plus the current press/focus state.
 * @returns The resolved styles, the touch target, and the normalized flags.
 */
export const useLinkButton = ({
  appearance = 'default',
  size = 'md',
  isDisabled = false,
  underline = false,
  isPressed,
  isFocused,
}: IUseLinkButtonParams): IUseLinkButtonResult => {
  const mode = useThemeMode();
  const tokens = linkButtonTokens[mode];
  const colors = tokens.colors[appearance];

  const state: TLinkButtonState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isFocused
        ? 'focus'
        : 'default';

  // `focus` falls through to the default colour: the affordance is the ring.
  const color =
    state === 'disabled'
      ? colors.textDisabled
      : state === 'pressed'
        ? colors.textPressed
        : colors.text;

  // `outline` rather than a wrapper View with a reserved border: it is ignored
  // by layout, so there is nothing to reserve and no extra node. `outlineOffset`
  // is what keeps the gap transparent instead of painting it in a guessed colour.
  //
  // `alignSelf` moves here from that wrapper and is still load-bearing: the link
  // has no width of its own, and a stretched Pressable would hand it a
  // full-width touch area it never asked for. `borderRadius` exists only for the
  // outline to follow — the text itself has no corners.
  const pressableStyle: StyleProp<ViewStyle> = {
    alignSelf: 'flex-start',
    borderRadius: tokens.dimension.focusRingRadius,
    ...(isFocused
      ? {
          outlineWidth: tokens.dimension.focusRingSpread,
          outlineOffset: tokens.dimension.focusRingOffset,
          outlineColor: colors.borderFocus,
          outlineStyle: 'solid' as const,
        }
      : {}),
  };

  // See @dsm/mobile's TextField useTextField for why fontWeight never
  // accompanies fontFamily here — same Android font-resolver constraint.
  const labelStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.fontWeight),
    fontSize: tokens.typography.fontSize[size],
    // React Native takes lineHeight in pixels, so the ratio is applied here.
    // On web the same value goes in unmultiplied, as a CSS ratio.
    lineHeight: tokens.dimension.height[size],
    color,
    textDecorationLine: underline ? 'underline' : 'none',
  };

  // Not optional, unlike the Button's: bDS is explicit that "todo enlace suelto
  // necesita hitSlop", and both sizes (24 and 21) are far below
  // size/target/min (48). Vertical only — the horizontal reach depends on the
  // label's own width, so a very short label may still want a wider slop.
  const verticalSlop = Math.max(
    0,
    Math.ceil((tokens.dimension.minTouchTarget - tokens.dimension.height[size]) / 2),
  );

  return {
    pressableStyle,
    labelStyle,
    hitSlop: { top: verticalSlop, bottom: verticalSlop },
    isDisabled,
    state,
  };
};

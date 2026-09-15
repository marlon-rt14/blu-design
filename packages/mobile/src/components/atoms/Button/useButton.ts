import { buttonTokens } from '@dsm/shared';
import type { IButtonSurfaceColorTokens, TButtonState, TIconSize, TTokensOf } from '@dsm/shared';
import type { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { IButtonProps } from './Button.types';

/** Params of {@link useButton}: the Button props plus the live interaction state. */
interface IUseButtonParams extends IButtonProps {
  /** Whether the `Pressable` is currently held down. */
  isPressed: boolean;
  /**
   * Whether the `Pressable` has focus. Only reachable through
   * react-native-web — `Pressable`'s `onFocus` is documented
   * `@platform macos windows`, so on iOS and Android this stays `false`.
   */
  isFocused: boolean;
}

/** Styles and derived values the Button needs to render. */
interface IUseButtonResult {
  /** The pressable box: height, padding, surface and radius. */
  containerStyle: StyleProp<ViewStyle>;
  /** The focus ring, or `undefined` when not focused. Merged onto the pressable. */
  outlineStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  /**
   * Which Icon size step to give the slots. Not the control's own size: `xs` and
   * `sm` both take 16, `md` and `lg` both take 24.
   */
  iconSize: TIconSize;
  /**
   * Colour for the icon slots, handed over explicitly because React Native has
   * no `currentColor` to inherit through.
   *
   * This is the **label** colour. bDS publishes `icon-default` and
   * `icon-disabled` per group, but all 28 of them are byte-identical to their
   * `text-*` twin in both themes, so reading them separately would add fourteen
   * lookups that provably return the same value. If they ever diverge, this is
   * the line that changes.
   */
  iconColor: string;
  /** Expands the touch target up to `size/target/min`; `undefined` when the size already clears it. */
  hitSlop: Insets | undefined;
  /** Normalized disabled flag, safe to hand straight to `Pressable`. */
  isDisabled: boolean;
  /** Resolved interaction state, exposed so stories and tests can assert on it. */
  state: TButtonState;
}

/**
 * Resolves the surface tokens for a `variant` + `appearance` pairing.
 *
 * Throws on `danger` + `on-inverse` rather than falling back: bDS ships no
 * tokens for that pair, so there is genuinely nothing to render, and a silent
 * fallback would be a wrong render that looks deliberate. Same philosophy as
 * `readThemeToken` in `@dsm/shared`.
 */
const readSurface = (
  colors: TTokensOf<typeof buttonTokens>['colors'],
  variant: NonNullable<IButtonProps['variant']>,
  appearance: NonNullable<IButtonProps['appearance']>,
): IButtonSurfaceColorTokens => {
  if (variant === 'primary') {
    return colors.primary[appearance];
  }
  if (appearance === 'on-inverse') {
    throw new Error(
      "Button: appearance 'on-inverse' is only defined for variant 'primary'. " +
        'bDS ships no tokens for danger on an inverted surface — a destructive action does not belong on a six-second toast.',
    );
  }
  return colors.danger[appearance];
};

/**
 * Resolves every color, metric and touch target the native Button needs, from
 * the active theme, its props and its current interaction state.
 *
 * Same shape as `@dsm/mobile`'s `useTextArea`: the component owns the
 * interaction state and passes it in. There is no hover state — a touch screen
 * has none, so the ladder is one rung shorter than web's.
 *
 * @param params - The Button props plus the current press/focus state.
 * @returns The resolved styles, the touch target, and the normalized flags.
 */
export const useButton = ({
  variant = 'primary',
  appearance = 'fill',
  size = 'md',
  isDisabled = false,
  isPressed,
  isFocused,
}: IUseButtonParams): IUseButtonResult => {
  const mode = useThemeMode();
  const tokens = buttonTokens[mode];
  const surface = readSurface(tokens.colors, variant, appearance);

  const state: TButtonState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isFocused
        ? 'focus'
        : 'default';

  // `focus` falls through to `background`: no `bg-focus` token exists anywhere
  // in the export, because the affordance is the ring.
  const backgroundColor =
    state === 'disabled'
      ? surface.backgroundDisabled
      : state === 'pressed'
        ? surface.backgroundPressed
        : surface.background;

  const borderColor =
    state === 'disabled'
      ? surface.borderDisabled
      : state === 'pressed'
        ? surface.borderPressed ?? surface.border
        : surface.border;

  // `outline`, not a wrapper View with a reserved border. React Native has
  // supported the four `outline*` properties since 0.71, and they behave like
  // the CSS ones: drawn outside the box, ignored by layout, and — the reason
  // this replaced the old ring — `outlineOffset` leaves the gap **transparent**.
  // A painted gap would have to guess the surface behind it and would show as a
  // halo over a card, over bg/inverse or over a photo.
  //
  // It also removes a whole node per Button: the wrapper existed only to reserve
  // the border width so focusing did not shift layout, which an outline cannot
  // do in the first place.
  //
  // On an inverted surface the blue does not read, hence the second colour.
  const outlineStyle: StyleProp<ViewStyle> = isFocused
    ? {
        outlineWidth: tokens.focus.spread,
        outlineOffset: tokens.focus.offset,
        outlineColor:
          appearance === 'on-inverse' ? tokens.focus.colorOnInverse : tokens.focus.color,
        outlineStyle: 'solid',
      }
    : undefined;

  const containerStyle: StyleProp<ViewStyle> = {
    height: tokens.dimension.height[size],
    minWidth: tokens.dimension.minWidth,
    paddingHorizontal: tokens.dimension.paddingHorizontal[size],
    columnGap: tokens.dimension.gap,
    borderRadius: tokens.dimension.borderRadius,
    // `transparent` rather than omitting, so switching appearance never leaves a
    // stale value from a previous render.
    backgroundColor: backgroundColor ?? 'transparent',
    borderWidth: borderColor === undefined ? 0 : tokens.dimension.borderWidth,
    borderColor: borderColor ?? 'transparent',
  };

  // See @dsm/mobile's TextField useTextField for why fontWeight never
  // accompanies fontFamily here — same Android font-resolver constraint.
  const labelStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.fontWeight),
    fontSize: tokens.typography.fontSize[size],
    color: isDisabled ? surface.labelDisabled : surface.label,
  };

  // bDS flags size='xs' (24) as requiring hitSlop, being less than half of
  // size/target/min. Rather than special-casing xs, close the gap for every size
  // that falls short — which is what that token is for. Only the vertical axis
  // needs it: minWidth (64) already clears 48.
  const verticalSlop = Math.max(
    0,
    Math.ceil((tokens.dimension.minTouchTarget - tokens.dimension.height[size]) / 2),
  );
  const hitSlop: Insets | undefined =
    verticalSlop === 0 ? undefined : { top: verticalSlop, bottom: verticalSlop };

  return {
    containerStyle,
    outlineStyle,
    labelStyle,
    iconSize: tokens.dimension.iconSize[size],
    iconColor: isDisabled ? surface.labelDisabled : surface.label,
    hitSlop,
    isDisabled,
    state,
  };
};

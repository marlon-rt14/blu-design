import { otpFieldTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { IOTPFieldProps } from './OTPField.types';

/** Params of {@link useOTPField}: the props plus the live focus state. */
interface IUseOTPFieldParams extends IOTPFieldProps {
  /** Whether the underlying `TextInput` currently has focus. */
  isFocused: boolean;
}

/** Styles and derived values the OTPField needs to render. */
interface IUseOTPFieldResult {
  /** The outer column. Hugs the row rather than stretching to the parent. */
  wrapperStyle: StyleProp<ViewStyle>;
  /**
   * The row of boxes, which is a `Pressable` rather than a `View`.
   * `position: relative` so the input can cover it.
   */
  rowStyle: StyleProp<ViewStyle>;
  /** One box, in whatever state the whole field is in. */
  boxStyle: StyleProp<ViewStyle>;
  /**
   * The ring, to merge onto the active box only. `undefined` while the field is
   * not focused, or while it is disabled.
   */
  activeBoxStyle: StyleProp<ViewStyle> | undefined;
  /** One digit's text. */
  digitStyle: StyleProp<TextStyle>;
  /**
   * The real `TextInput`, covering the whole row. Its **text** is transparent,
   * not the view — see the note at the style itself for why that distinction
   * decides whether the field works on iOS.
   */
  inputStyle: StyleProp<TextStyle>;
  helperStyle: StyleProp<TextStyle>;
  /** One entry per box: the digit to paint, or `''` for an empty box. */
  digits: string[];
  /** Which box carries the ring — the first empty one, or the last when full. */
  activeIndex: number;
  isDisabled: boolean;
  /** `true` when `isInvalid` or `errorMessage` is set. */
  isInvalid: boolean;
  /** `errorMessage` or `helperText` when `showHelper` is `true`; `undefined` otherwise. */
  displayedHelperText: string | undefined;
  /** Strips everything that is not a digit and caps the result at `length`. */
  sanitize: (raw: string) => string;
}

/**
 * Resolves every colour and metric the native OTPField needs, from the active
 * theme, its props and its current focus state.
 *
 * Same shape as the web hook. There is no hover on either platform here — with
 * one input there is no per-digit element to hover — so unlike the rest of the
 * field family the two platforms have the identical state ladder.
 *
 * @param params - The OTPField props plus the current focus state.
 * @returns The resolved styles, the digits to paint, and the sanitizer.
 */
export const useOTPField = ({
  value,
  length = 4,
  isDisabled = false,
  isInvalid = false,
  errorMessage,
  helperText,
  showHelper = true,
  isFocused,
}: IUseOTPFieldParams): IUseOTPFieldResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = otpFieldTokens[mode];

  const hasError = isInvalid || Boolean(errorMessage);
  const sanitize = (raw: string): string => raw.replace(/\D/g, '').slice(0, length);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');
  // The caret sits on the first empty box, and on the last one once the code is
  // complete. Figma's `focus` variant rings box 1 while showing two digits,
  // which is a mock — the same variant is named `isFilled=false` and should show
  // no digits at all.
  const activeIndex = Math.min(value.length, length - 1);

  // Disabled is the last word: no error border, no ring, quiet digits. Error and
  // focus, by contrast, compose — `validation` is an axis of its own precisely
  // so a field can be wrong and focused at the same time.
  const borderColor = isDisabled
    ? colors.digit.borderDisabled
    : hasError
      ? colors.digit.borderError
      : colors.digit.border;

  return {
    wrapperStyle: {
      // The boxes are a fixed size, so the column hugs the row and the helper
      // centres against the boxes rather than against the screen.
      alignSelf: 'flex-start',
    },
    rowStyle: {
      position: 'relative',
      flexDirection: 'row',
      gap: dimension.gap,
      // Nothing on this path clips: the ring is drawn outside the active box and
      // reaches into the gap beside it.
    },
    boxStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension.boxSize,
      height: dimension.boxSize,
      borderRadius: dimension.borderRadius,
      borderWidth: dimension.borderWidth,
      borderColor,
      backgroundColor: isDisabled ? colors.digit.backgroundDisabled : colors.digit.background,
    },
    // The ring is an `outline` on the box itself rather than a wrapper View, so
    // focusing never resizes the row, and `outlineOffset` leaves the gap
    // transparent instead of painting a colour over whatever is behind.
    activeBoxStyle:
      isFocused && !isDisabled
        ? {
            outlineWidth: dimension.focusRingSpread,
            outlineOffset: dimension.focusRingOffset,
            outlineColor: colors.digit.borderFocus,
            outlineStyle: 'solid' as const,
          }
        : undefined,
    digitStyle: {
      // `fontFamily` carries the weight on this platform; never both.
      fontFamily: resolveMulishFontFamily(typography.digit.fontWeight),
      fontSize: typography.digit.fontSize,
      // Pixels here, a ratio in CSS.
      lineHeight: typography.digit.fontSize * typography.digit.lineHeightRatio,
      color: isDisabled ? colors.char.disabled : colors.char.default,
    },
    // Invisible and on top of every box, which is what makes one input behave
    // like a row of them: a tap anywhere focuses it, the OS sees a single field
    // to autofill from an SMS, and a long press gets the native paste menu —
    // which is how most people enter a code they were just sent.
    inputStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 0,
      // **Not `opacity: 0`, and this is a platform difference that bites.**
      // UIKit's `hitTest` skips views with alpha at or near zero, so an
      // `opacity: 0` TextInput never receives the tap and the keyboard never
      // opens — the field looks fine and is impossible to type into. CSS has no
      // such rule, so the identical trick does work on web.
      //
      // The view therefore stays fully opaque and the *text* is what disappears:
      // `color` here, plus `caretHidden` and `selectionColor` on the component.
      // `display: none` is out for the same reason as on web — it takes the
      // input out of reach of autofill.
      color: 'transparent',
    },
    helperStyle: {
      paddingTop: dimension.helperGap,
      // Centred, measured against Figma: the ink centres on the row's centre.
      textAlign: 'center',
      fontFamily: resolveMulishFontFamily(typography.helper.fontWeight),
      fontSize: typography.helper.fontSize,
      lineHeight: typography.helper.fontSize * typography.helper.lineHeightRatio,
      color: isDisabled
        ? colors.helper.disabled
        : hasError
          ? colors.helper.error
          : colors.helper.default,
    },
    digits,
    activeIndex,
    isDisabled,
    isInvalid: hasError,
    displayedHelperText: showHelper ? errorMessage ?? helperText : undefined,
    sanitize,
  };
};

import { otpFieldTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IOTPFieldProps } from './OTPField.types';

/** Params of {@link useOTPField}: the props plus the live interaction state. */
interface IUseOTPFieldParams extends IOTPFieldProps {
  isFocused: boolean;
}

/** Styles and derived values the OTPField needs to render. */
interface IUseOTPFieldResult {
  /** The outer column: row of boxes + helper. Sized to its content. */
  wrapperStyle: CSSProperties;
  /** The row. `position: relative` so the real input can cover it. */
  rowStyle: CSSProperties;
  /** One box, in whatever state the whole field is in. */
  boxStyle: CSSProperties;
  /**
   * The ring, to merge onto the active box only. `undefined` while the field is
   * not focused, or while it is disabled.
   */
  activeBoxStyle: CSSProperties | undefined;
  /** The real input: transparent, and covering the whole row. */
  inputStyle: CSSProperties;
  helperStyle: CSSProperties;
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
 * Resolves every style and derived value the OTPField needs, from the active
 * theme, its props and its current focus state.
 *
 * Same shape as the rest of the field family: the component owns the
 * interaction state and passes it in.
 *
 * @param params - The OTPField props plus whether the input currently has focus.
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
  const tokens = otpFieldTokens[mode];
  const { colors, dimension, typography } = tokens;
  const digitFontFamily = useFontFamily(typography.digit.fontWeight);
  const helperFontFamily = useFontFamily(typography.helper.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();

  const hasError = isInvalid || Boolean(errorMessage);
  const sanitize = (raw: string): string => raw.replace(/\D/g, '').slice(0, length);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');
  // The caret sits on the first empty box, and on the last one once the code is
  // complete — there is nowhere further to go. Figma's `focus` variant puts the
  // ring on box 1 while showing two digits, which is a mock rather than a rule:
  // the same variant is named `isFilled=false`, so it should show no digits at
  // all. Behaviour follows the anatomy, not that render.
  const activeIndex = Math.min(value.length, length - 1);

  // Disabled is the last word: no error border, no ring, quiet digits. Verified
  // against Figma's `error` + `disabled` variants, which render as plain
  // disabled. Error and focus, by contrast, compose — that is the whole point
  // of `validation` being an axis of its own.
  const borderColor = isDisabled
    ? colors.digit.borderDisabled
    : hasError
      ? colors.digit.borderError
      : colors.digit.border;

  const transition = prefersReducedMotion
    ? 'none'
    : 'border-color 120ms ease, background-color 120ms ease, outline-color 120ms ease';

  return {
    wrapperStyle: {
      display: 'inline-flex',
      flexDirection: 'column',
      // The boxes are a fixed size, so the column is as wide as the row and the
      // helper centres against the boxes rather than against the page.
      alignItems: 'stretch',
    },
    rowStyle: {
      position: 'relative',
      display: 'flex',
      gap: dimension.gap,
      // No `overflow: hidden` anywhere on this path: the ring is drawn outside
      // the active box and reaches into the gap beside it.
    },
    boxStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension.boxSize,
      height: dimension.boxSize,
      borderRadius: dimension.borderRadius,
      border: `${dimension.borderWidth}px solid ${borderColor}`,
      backgroundColor: isDisabled ? colors.digit.backgroundDisabled : colors.digit.background,
      color: isDisabled ? colors.char.disabled : colors.char.default,
      fontFamily: digitFontFamily,
      fontWeight: typography.digit.fontWeight,
      fontSize: typography.digit.fontSize,
      lineHeight: typography.digit.lineHeightRatio,
      transition,
      // The row is one input; a box is never a target of its own.
      pointerEvents: 'none',
      userSelect: 'none',
    },
    // `outline`, not `box-shadow`: only `outline-offset` leaves the gap
    // transparent, and this gap falls between two boxes rather than on a known
    // surface, so painting it would be guessing.
    activeBoxStyle:
      isFocused && !isDisabled
        ? {
            outline: `${dimension.focusRingSpread}px solid ${colors.digit.borderFocus}`,
            outlineOffset: dimension.focusRingOffset,
          }
        : undefined,
    // Transparent and on top of every box, which is what makes one input behave
    // like a row of them: a tap anywhere focuses it, the OS sees a single field
    // to autofill, and there is no caret to compete with the ring.
    inputStyle: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      border: 'none',
      borderRadius: dimension.borderRadius,
      backgroundColor: 'transparent',
      // Not `visibility: hidden` and not `display: none`: either one takes the
      // input out of the focus order and out of reach of autofill.
      opacity: 0,
      outline: 'none',
      cursor: isDisabled ? 'not-allowed' : 'text',
    },
    helperStyle: {
      margin: 0,
      paddingTop: dimension.helperGap,
      // Centred, measured: the ink centres on the row's centre to within
      // 0.25px, not on its left edge.
      textAlign: 'center',
      fontFamily: helperFontFamily,
      fontWeight: typography.helper.fontWeight,
      fontSize: typography.helper.fontSize,
      lineHeight: typography.helper.lineHeightRatio,
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

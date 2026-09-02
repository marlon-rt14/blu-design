import { radioTokens } from '@dsm/shared';
import type { TRadioState } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IRadioProps } from './Radio.types';

/** Params of {@link useRadio}: the props plus the live interaction state. */
interface IUseRadioParams extends IRadioProps {
  isHovered: boolean;
  isPressed: boolean;
  /** Keyboard focus only. Clicking a radio focuses it too, and a ring on click is noise. */
  isFocusVisible: boolean;
}

/** Styles and derived values the Radio needs to render. */
interface IUseRadioResult {
  /** The row: the whole touch target, per bDS. */
  rowStyle: CSSProperties;
  /** The circle, including its inside border and the focus outline. */
  boxStyle: CSSProperties;
  /** The inner mark. `undefined` when there is nothing to draw. */
  dotStyle: CSSProperties | undefined;
  labelStyle: CSSProperties;
  /** Takes the input out of sight without taking it out of the accessibility tree. */
  inputStyle: CSSProperties;
  isDisabled: boolean;
  state: TRadioState;
}

/**
 * Resolves every style the Radio needs, from the active theme, its props and its
 * current interaction state.
 *
 * `hover` is the one state that is not a token lookup: bDS composites
 * `box/overlay-hover` over the resting colours, and `radioTokens` does that
 * arithmetic once so both platforms get the same value.
 *
 * @param params - The Radio props plus the current hover/press/focus state.
 */
export const useRadio = ({
  size = 'sm',
  isChecked = false,
  isDisabled = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseRadioParams): IUseRadioResult => {
  const mode = useThemeMode();
  const tokens = radioTokens[mode];
  const { dimension, typography } = tokens;
  const fontFamily = useFontFamily(typography.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();

  const state: TRadioState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isHovered
        ? 'hover'
        : isFocusVisible
          ? 'focus'
          : 'default';

  // The token groups keep Figma's axis name (`selected`), the prop takes the
  // platform's (`isChecked`). See `IRadioBaseProps.isChecked`.
  const colors = tokens.colors[isChecked ? 'selected' : 'unselected'][state];
  const boxSize = dimension.box[size];

  return {
    rowStyle: {
      boxSizing: 'border-box',
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: dimension.gap,
      // The whole row is the target, not just the circle — bDS says so outright.
      minHeight: dimension.rowMinHeight[size],
      cursor: isDisabled ? 'not-allowed' : 'pointer',
    },
    boxStyle: {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: boxSize,
      height: boxSize,
      // `radius/pill`, expressed as half the box so it stays a circle at both
      // sizes without depending on a sentinel value.
      borderRadius: '50%',
      // Inside the edge, which is how Figma draws it: the 2px eats into the
      // circle rather than growing it.
      border: `${dimension.borderWidth}px solid ${colors.border}`,
      backgroundColor: colors.background,
      // Same mechanism as the Button: the offset gap stays transparent instead
      // of being painted in a guessed surface colour.
      outline: isFocusVisible ? `${dimension.focusRingSpread}px solid ${tokens.colors.borderFocus}` : 'none',
      outlineOffset: dimension.focusRingOffset,
      transition: prefersReducedMotion
        ? 'none'
        : 'background-color 120ms ease, border-color 120ms ease, outline-color 120ms ease',
    },
    dotStyle:
      colors.dot === undefined
        ? undefined
        : {
            width: dimension.dot[size],
            height: dimension.dot[size],
            borderRadius: '50%',
            backgroundColor: colors.dot,
            transition: prefersReducedMotion ? 'none' : 'background-color 120ms ease',
          },
    labelStyle: {
      color: colors.label,
      fontFamily,
      fontWeight: typography.fontWeight,
      fontSize: typography.fontSize[size],
      lineHeight: typography.lineHeightRatio,
    },
    // Not `display: none` and not `visibility: hidden` — either would take the
    // input out of the accessibility tree and off the tab order, losing the
    // grouping the native element is here for. It stays rendered and unseen.
    inputStyle: {
      position: 'absolute',
      width: 1,
      height: 1,
      margin: 0,
      padding: 0,
      opacity: 0,
      pointerEvents: 'none',
    },
    isDisabled,
    state,
  };
};

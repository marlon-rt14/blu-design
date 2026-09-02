import { choiceItemTokens } from '@dsm/shared';
import type { TChoiceItemState } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IChoiceItemProps } from './ChoiceItem.types';

/** Params of {@link useChoiceItem}: the props plus the live interaction state. */
interface IUseChoiceItemParams extends IChoiceItemProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

/** Styles the ChoiceItem needs to render. */
interface IUseChoiceItemResult {
  /** The row: the whole target, and the `<label>`. */
  rowStyle: CSSProperties;
  /** The content column — label, description, and the divider anchored to it. */
  contentStyle: CSSProperties;
  labelStyle: CSSProperties;
  descriptionStyle: CSSProperties;
  trailingStyle: CSSProperties;
  /** The hairline, or `undefined` when it is off. */
  dividerStyle: CSSProperties | undefined;
  /** Takes the input out of sight without taking it out of the accessibility tree. */
  inputStyle: CSSProperties;
  isDisabled: boolean;
  state: TChoiceItemState;
}

/**
 * Resolves every style the row needs, from the active theme, its props and its
 * current interaction state.
 *
 * `hover` and `pressed` are composites rather than token lookups — the row lays
 * a 6% and a 10% overlay over its own surface — and `choiceItemTokens` does that
 * arithmetic once so both platforms agree.
 *
 * @param params - The ChoiceItem props plus the current hover/press/focus state.
 */
export const useChoiceItem = ({
  size = 'sm',
  isDisabled = false,
  showDivider = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseChoiceItemParams): IUseChoiceItemResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = choiceItemTokens[mode];
  const prefersReducedMotion = usePrefersReducedMotion();
  const labelFont = useFontFamily(typography.label.fontWeight);

  const state: TChoiceItemState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isHovered
        ? 'hover'
        : isFocusVisible
          ? 'focus'
          : 'default';

  const stateColors = colors.state[state];

  return {
    rowStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: dimension.gap,
      width: '100%',
      minHeight: dimension.minHeight[size],
      paddingInline: dimension.paddingHorizontal[size],
      paddingBlock: dimension.paddingVertical,
      backgroundColor: stateColors.background,
      // The ring goes on the row, not only on the control — bDS is explicit.
      // The control shows its own too, which is why the focus state is passed
      // down to it as well.
      outline: isFocusVisible ? `${dimension.focusRingSpread}px solid ${colors.borderFocus}` : 'none',
      outlineOffset: dimension.focusRingOffset,
      transition: prefersReducedMotion ? 'none' : 'background-color 120ms ease, outline-color 120ms ease',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
    },
    contentStyle: {
      // `position: relative` is here for the divider, which anchors to the
      // content rather than to the row: bDS wants it to start where the text
      // starts, so it clears the control's column.
      position: 'relative',
      display: 'flex',
      flex: '1 0 0',
      flexDirection: 'column',
      // Stretched, then the text centred inside it. Both matter: without the
      // stretch the column is only as tall as its text, and the divider —
      // positioned from this box's bottom — floats in the middle of the row
      // instead of sitting on its edge.
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: dimension.contentGap,
      minWidth: 0,
    },
    labelStyle: {
      width: '100%',
      color: stateColors.label,
      fontFamily: labelFont,
      fontWeight: typography.label.fontWeight,
      fontSize: typography.label.fontSize[size],
      lineHeight: typography.label.lineHeightRatio,
      margin: 0,
    },
    descriptionStyle: {
      width: '100%',
      color: stateColors.description,
      fontFamily: labelFont,
      fontWeight: typography.description.fontWeight,
      fontSize: typography.description.fontSize,
      lineHeight: typography.description.lineHeightRatio,
      margin: 0,
    },
    trailingStyle: {
      flexShrink: 0,
      whiteSpace: 'nowrap',
      color: stateColors.trailing,
      fontFamily: labelFont,
      fontWeight: typography.trailing.fontWeight,
      fontSize: typography.trailing.fontSize,
      lineHeight: typography.trailing.lineHeightRatio,
      margin: 0,
    },
    dividerStyle: showDivider
      ? {
          position: 'absolute',
          left: 0,
          right: 0,
          // Sits on the row's vertical inset, so it lands between two rows
          // rather than inside this one.
          bottom: -dimension.paddingVertical,
          height: dimension.dividerWidth,
          backgroundColor: colors.divider,
        }
      : undefined,
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

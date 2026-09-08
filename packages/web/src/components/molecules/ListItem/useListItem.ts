import { listItemTokens } from '@dsm/shared';
import type { TListItemState } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IListItemProps } from './ListItem.types';

/** Params of {@link useListItem}: the props plus the live interaction state. */
interface IUseListItemParams extends IListItemProps {
  isInteractive: boolean;
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

/** Styles the ListItem needs to render. */
interface IUseListItemResult {
  rowStyle: CSSProperties;
  leadingStyle: CSSProperties;
  /** The content column — title, description, and the divider anchored to it. */
  contentStyle: CSSProperties;
  titleStyle: CSSProperties;
  descriptionStyle: CSSProperties;
  trailingTextStyle: CSSProperties;
  iconColor: string;
  /** The hairline, or `undefined` when it is off. */
  dividerStyle: CSSProperties | undefined;
  isDisabled: boolean;
  state: TListItemState;
}

/**
 * Resolves every style the row needs, from the active theme, its props and its
 * current interaction state.
 *
 * `hover` and `pressed` composite an overlay over the resting surface rather
 * than being distinct token colors — same technique as ChoiceItem's.
 */
export const useListItem = ({
  size = 'md',
  isDisabled = false,
  showDivider = false,
  isInteractive,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseListItemParams): IUseListItemResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = listItemTokens[mode];
  const prefersReducedMotion = usePrefersReducedMotion();
  const titleFont = useFontFamily(typography.title.fontWeight);
  const trailingTextFont = useFontFamily(typography.trailingText.fontWeight);

  const state: TListItemState = isDisabled
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
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: dimension.gap,
      width: '100%',
      minHeight: dimension.minHeight,
      paddingInline: dimension.paddingHorizontal[size],
      paddingBlock: dimension.paddingVertical,
      backgroundColor: stateColors.background,
      outline: isInteractive && isFocusVisible ? `${dimension.focusRingSpread}px solid ${colors.borderFocus}` : 'none',
      outlineOffset: dimension.focusRingOffset,
      transition: prefersReducedMotion ? 'none' : 'background-color 120ms ease, outline-color 120ms ease',
      cursor: isInteractive ? (isDisabled ? 'not-allowed' : 'pointer') : 'default',
    },
    leadingStyle: {
      flexShrink: 0,
      display: 'flex',
    },
    contentStyle: {
      // `position: relative` anchors the divider to the text column, not to
      // the row's edge — bDS wants it starting where the label starts, so it
      // clears the leading icon/avatar's column.
      position: 'relative',
      display: 'flex',
      flex: '1 0 0',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: dimension.contentGap,
      minWidth: 0,
    },
    titleStyle: {
      width: '100%',
      color: stateColors.title,
      fontFamily: titleFont,
      fontWeight: typography.title.fontWeight,
      fontSize: typography.title.fontSize[size],
      lineHeight: typography.title.lineHeightRatio,
      margin: 0,
    },
    descriptionStyle: {
      width: '100%',
      color: stateColors.description,
      fontFamily: titleFont,
      fontWeight: typography.description.fontWeight,
      fontSize: typography.description.fontSize,
      lineHeight: typography.description.lineHeightRatio,
      margin: 0,
    },
    trailingTextStyle: {
      flexShrink: 0,
      whiteSpace: 'nowrap',
      color: stateColors.trailing,
      fontFamily: trailingTextFont,
      fontWeight: typography.trailingText.fontWeight,
      fontSize: typography.trailingText.fontSize,
      lineHeight: typography.trailingText.lineHeightRatio,
      margin: 0,
    },
    iconColor: stateColors.icon,
    dividerStyle: showDivider
      ? {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -dimension.paddingVertical,
          height: dimension.dividerWidth,
          backgroundColor: colors.divider,
        }
      : undefined,
    isDisabled,
    state,
  };
};

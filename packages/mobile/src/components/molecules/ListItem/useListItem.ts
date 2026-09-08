import { listItemTokens } from '@dsm/shared';
import type { TListItemState } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { IListItemProps } from './ListItem.types';

/** Params of {@link useListItem}: the props plus the live interaction state. */
interface IUseListItemParams extends IListItemProps {
  isInteractive: boolean;
  isPressed: boolean;
  /** Only reachable through react-native-web; `onFocus` is a no-op on iOS and Android. */
  isFocused: boolean;
}

/** Styles the ListItem needs to render. */
interface IUseListItemResult {
  rowStyle: StyleProp<ViewStyle>;
  leadingStyle: StyleProp<ViewStyle>;
  /** The content column — title, description, and the divider anchored to it. */
  contentStyle: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
  descriptionStyle: StyleProp<TextStyle>;
  trailingTextStyle: StyleProp<TextStyle>;
  iconColor: string;
  /** The hairline, or `undefined` when it is off. */
  dividerStyle: StyleProp<ViewStyle> | undefined;
  isDisabled: boolean;
  state: TListItemState;
}

/**
 * Resolves every style the row needs, from the active theme, its props and its
 * current interaction state.
 *
 * There is no `hover` here — a touch screen has none — so the ladder is one rung
 * shorter than web's, same as ChoiceItem's.
 */
export const useListItem = ({
  size = 'md',
  isDisabled = false,
  showDivider = false,
  isInteractive,
  isPressed,
  isFocused,
}: IUseListItemParams): IUseListItemResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = listItemTokens[mode];
  const titleFont = resolveMulishFontFamily(typography.title.fontWeight);
  const trailingTextFont = resolveMulishFontFamily(typography.trailingText.fontWeight);

  const state: TListItemState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isFocused
        ? 'focus'
        : 'default';

  const stateColors = colors.state[state];

  return {
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: dimension.gap,
      width: '100%',
      minHeight: dimension.minHeight,
      paddingHorizontal: dimension.paddingHorizontal[size],
      paddingVertical: dimension.paddingVertical,
      backgroundColor: stateColors.background,
      ...(isInteractive && isFocused
        ? {
            outlineWidth: dimension.focusRingSpread,
            outlineOffset: dimension.focusRingOffset,
            outlineColor: colors.borderFocus,
            outlineStyle: 'solid' as const,
          }
        : {}),
    },
    leadingStyle: {
      flexShrink: 0,
    },
    contentStyle: {
      position: 'relative',
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'flex-start',
      rowGap: dimension.contentGap,
      minWidth: 0,
    },
    titleStyle: {
      width: '100%',
      color: stateColors.title,
      fontFamily: titleFont,
      fontSize: typography.title.fontSize[size],
      lineHeight: typography.title.fontSize[size] * typography.title.lineHeightRatio,
    },
    descriptionStyle: {
      width: '100%',
      color: stateColors.description,
      fontFamily: titleFont,
      fontSize: typography.description.fontSize,
      lineHeight: typography.description.fontSize * typography.description.lineHeightRatio,
    },
    trailingTextStyle: {
      flexShrink: 0,
      color: stateColors.trailing,
      fontFamily: trailingTextFont,
      fontSize: typography.trailingText.fontSize,
      lineHeight: typography.trailingText.fontSize * typography.trailingText.lineHeightRatio,
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

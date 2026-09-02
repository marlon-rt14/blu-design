import { choiceItemTokens } from '@dsm/shared';
import type { TChoiceItemState } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { IChoiceItemProps } from './ChoiceItem.types';

/** Params of {@link useChoiceItem}: the props plus the live interaction state. */
interface IUseChoiceItemParams extends IChoiceItemProps {
  isPressed: boolean;
  /** Only reachable through react-native-web; `onFocus` is a no-op on iOS and Android. */
  isFocused: boolean;
}

/** Styles the ChoiceItem needs to render. */
interface IUseChoiceItemResult {
  /** The row: the whole touch target. */
  rowStyle: StyleProp<ViewStyle>;
  /** The content column — label, description, and the divider anchored to it. */
  contentStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  descriptionStyle: StyleProp<TextStyle>;
  trailingStyle: StyleProp<TextStyle>;
  /** The hairline, or `undefined` when it is off. */
  dividerStyle: StyleProp<ViewStyle> | undefined;
  isDisabled: boolean;
  state: TChoiceItemState;
}

/**
 * Resolves every style the row needs, from the active theme, its props and its
 * current interaction state.
 *
 * There is no `hover` here — a touch screen has none — so the ladder is one rung
 * shorter than web's. The composited hover colour still exists in the tokens and
 * simply goes unused on this platform.
 *
 * @param params - The ChoiceItem props plus the current press/focus state.
 */
export const useChoiceItem = ({
  size = 'sm',
  isDisabled = false,
  showDivider = false,
  isPressed,
  isFocused,
}: IUseChoiceItemParams): IUseChoiceItemResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = choiceItemTokens[mode];

  const state: TChoiceItemState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isFocused
        ? 'focus'
        : 'default';

  const stateColors = colors.state[state];
  const font = resolveMulishFontFamily(typography.label.fontWeight);

  return {
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: dimension.gap,
      width: '100%',
      minHeight: dimension.minHeight[size],
      paddingHorizontal: dimension.paddingHorizontal[size],
      paddingVertical: dimension.paddingVertical,
      backgroundColor: stateColors.background,
      // The ring goes on the row, not only on the control. Same mechanism as
      // everywhere else: an outline leaves the offset gap transparent.
      ...(isFocused
        ? {
            outlineWidth: dimension.focusRingSpread,
            outlineOffset: dimension.focusRingOffset,
            outlineColor: colors.borderFocus,
            outlineStyle: 'solid' as const,
          }
        : {}),
    },
    contentStyle: {
      // `position: relative` is here for the divider, which anchors to the
      // content rather than to the row: it has to start where the text starts.
      position: 'relative',
      flex: 1,
      // Stretched, then the text centred inside it. Both matter: without the
      // stretch the column is only as tall as its text, and the divider —
      // positioned from this box's bottom — floats in the middle of the row
      // instead of sitting on its edge.
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'flex-start',
      rowGap: dimension.contentGap,
      minWidth: 0,
    },
    // See @dsm/mobile's TextField useTextField for why fontWeight never
    // accompanies fontFamily here — same Android font-resolver constraint.
    labelStyle: {
      width: '100%',
      color: stateColors.label,
      fontFamily: font,
      fontSize: typography.label.fontSize[size],
      // React Native takes lineHeight in pixels, so the ratio is applied here.
      lineHeight: typography.label.fontSize[size] * typography.label.lineHeightRatio,
    },
    descriptionStyle: {
      width: '100%',
      color: stateColors.description,
      fontFamily: font,
      fontSize: typography.description.fontSize,
      lineHeight: typography.description.fontSize * typography.description.lineHeightRatio,
    },
    trailingStyle: {
      flexShrink: 0,
      color: stateColors.trailing,
      fontFamily: font,
      fontSize: typography.trailing.fontSize,
      lineHeight: typography.trailing.fontSize * typography.trailing.lineHeightRatio,
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
    isDisabled,
    state,
  };
};

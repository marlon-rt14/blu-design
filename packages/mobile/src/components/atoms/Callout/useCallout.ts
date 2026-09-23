import { calloutTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { ICalloutProps } from './Callout.types';

interface IUseCalloutResult {
  rootStyle: StyleProp<ViewStyle>;
  iconBoxStyle: StyleProp<ViewStyle>;
  iconColor: string;
  contentStyle: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
  bodyStyle: StyleProp<TextStyle>;
  actionWrapStyle: StyleProp<ViewStyle>;
  dismissWrapStyle: StyleProp<ViewStyle>;
}

/**
 * Resolves every style the Callout needs.
 *
 * Same shape as web's `useCallout`: one row — icon, content column,
 * dismiss — spaced by a single `gap`, no colour chip behind the icon, and
 * no local dismiss painting (the shipped `IconButton` `veil`/`xs` resolves
 * its own tokens).
 */
export const useCallout = ({ palette = 'brand' }: ICalloutProps): IUseCalloutResult => {
  const mode = useThemeMode();
  const { colors, dimension, title: titleType, body: bodyType } = calloutTokens[mode];
  const paletteColors = colors.palettes[palette];
  const titleFontFamily = useFontFamily(titleType.fontWeight);
  const bodyFontFamily = useFontFamily(bodyType.fontWeight);

  return {
    rootStyle: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: dimension.gap,
      width: '100%',
      padding: dimension.padding,
      borderRadius: dimension.borderRadius,
      backgroundColor: paletteColors.bg,
    },
    // Sized and top-aligned to the title/body's first line — the code
    // equivalent of Figma's `lineBox`.
    iconBoxStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension.iconSize,
      height: dimension.iconSize,
      flexShrink: 0,
    },
    iconColor: paletteColors.icon,
    contentStyle: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: 1,
      minWidth: 0,
    },
    titleStyle: {
      fontFamily: titleFontFamily,
      fontSize: titleType.fontSize,
      lineHeight: titleType.lineHeight,
      color: paletteColors.title,
    },
    bodyStyle: {
      fontFamily: bodyFontFamily,
      fontSize: bodyType.fontSize,
      lineHeight: bodyType.lineHeight,
      color: paletteColors.body,
    },
    actionWrapStyle: {
      flexDirection: 'row',
      paddingTop: dimension.actionPaddingTop,
    },
    dismissWrapStyle: {
      flexShrink: 0,
    },
  };
};

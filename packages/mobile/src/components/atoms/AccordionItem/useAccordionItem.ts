import { accordionTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveFontWeight, useThemeMode } from '../../../theme';
import type { IAccordionItemProps } from './AccordionItem.types';

interface IUseAccordionItemParams extends IAccordionItemProps {
  isPressed: boolean;
}

interface IUseAccordionItemResult {
  rootStyle: StyleProp<ViewStyle>;
  headerStyle: StyleProp<ViewStyle>;
  iconWrapperStyle: StyleProp<ViewStyle>;
  iconColor: string;
  titleStyle: StyleProp<TextStyle>;
  chevronColor: string;
  panelStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<TextStyle>;
}

/**
 * Resolves every style the AccordionItem needs. No hover — there is no
 * pointer on touch, same restraint `TextField`/`Switch` already apply on
 * this platform.
 */
export const useAccordionItem = ({
  appearance = 'default',
  size = 'sm',
  disabled = false,
  isPressed,
  showDivider = false,
}: IUseAccordionItemParams): IUseAccordionItemResult => {
  const mode = useThemeMode();
  const { colors, dimension, title: titleType, content: contentType } = accordionTokens[mode];
  const appearanceColors = colors.appearances[appearance];
  const titleFontWeight = resolveFontWeight(titleType.fontWeight);
  const contentFontWeight = resolveFontWeight(contentType.fontWeight);

  const headerBackground = disabled
    ? 'transparent'
    : isPressed
      ? appearanceColors.overlayPressed
      : 'transparent';

  return {
    rootStyle: {
      width: '100%',
      borderBottomWidth: showDivider ? 1 : 0,
      borderBottomColor: appearanceColors.divider,
    },
    headerStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      minHeight: dimension.headerMinHeight[size],
      gap: dimension.headerGap,
      paddingHorizontal: dimension.headerPaddingX,
      paddingVertical: dimension.headerPaddingY,
      backgroundColor: headerBackground,
    },
    iconWrapperStyle: {
      flexShrink: 0,
      width: dimension.iconSize,
      height: dimension.iconSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconColor: disabled ? appearanceColors.iconDisabled : appearanceColors.icon,
    titleStyle: {
      flex: 1,
      fontWeight: titleFontWeight,
      fontSize: titleType.fontSize,
      lineHeight: titleType.lineHeight,
      color: disabled ? appearanceColors.titleDisabled : appearanceColors.title,
    },
    chevronColor: disabled ? appearanceColors.chevronDisabled : appearanceColors.chevron,
    panelStyle: {
      paddingHorizontal: dimension.headerPaddingX,
      paddingTop: dimension.contentPaddingTop,
      paddingBottom: dimension.contentPaddingBottom,
    },
    contentStyle: {
      fontWeight: contentFontWeight,
      fontSize: contentType.fontSize,
      lineHeight: contentType.lineHeight,
      color: appearanceColors.content,
    },
  };
};

import { emptyStateTokens } from '@dsm/shared';
import type { TButtonAppearance, TButtonSize } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveFontWeight, useThemeMode } from '../../../theme';
import type { IEmptyStateProps } from './EmptyState.types';

interface IUseEmptyStateResult {
  rootStyle: StyleProp<ViewStyle>;
  graphicWrapStyle: StyleProp<ViewStyle>;
  graphicColor: string;
  textBlockStyle: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
  bodyStyle: StyleProp<TextStyle>;
  actionsWrapStyle: StyleProp<ViewStyle>;
  /** `fill` in `page`, `outline` in `inline` — derived, never a prop. */
  buttonAppearance: TButtonAppearance;
  /** `md` in `page`, `sm` in `inline` — derived, never a prop. */
  buttonSize: TButtonSize;
  /** `component.emptystate.action.min-width` (160) in `page` only. */
  buttonMinWidth: number | undefined;
}

/** Same shape as web's `useEmptyState`: resolves styles plus the Button config `layout` derives. */
export const useEmptyState = ({ layout = 'page' }: IEmptyStateProps): IUseEmptyStateResult => {
  const mode = useThemeMode();
  const { colors, dimension, titlePage, titleInline, bodyPage, bodyInline } = emptyStateTokens[mode];
  const isPage = layout === 'page';
  const titleType = isPage ? titlePage : titleInline;
  const bodyType = isPage ? bodyPage : bodyInline;
  const titleWeight = resolveFontWeight(titleType.fontWeight);
  const bodyWeight = resolveFontWeight(bodyType.fontWeight);

  return {
    rootStyle: {
      alignItems: isPage ? 'center' : 'flex-start',
      width: '100%',
      padding: isPage ? dimension.padding : 0,
    },
    graphicWrapStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension.iconSize,
      height: dimension.iconSize,
      marginBottom: dimension.gapGraphic,
    },
    graphicColor: colors.icon,
    textBlockStyle: {
      alignItems: isPage ? 'center' : 'flex-start',
      gap: dimension.gapText,
      width: '100%',
    },
    titleStyle: {
      textAlign: isPage ? 'center' : 'left',
      fontWeight: titleWeight,
      fontSize: titleType.fontSize,
      lineHeight: titleType.lineHeight,
      color: colors.title,
    },
    bodyStyle: {
      textAlign: isPage ? 'center' : 'left',
      fontWeight: bodyWeight,
      fontSize: bodyType.fontSize,
      lineHeight: bodyType.lineHeight,
      color: colors.body,
    },
    actionsWrapStyle: {
      flexDirection: isPage ? 'column' : 'row',
      alignItems: 'center',
      gap: dimension.gapActions,
      marginTop: dimension.gapAction,
    },
    buttonAppearance: isPage ? 'fill' : 'outline',
    buttonSize: isPage ? 'md' : 'sm',
    buttonMinWidth: isPage ? dimension.actionMinWidth : undefined,
  };
};

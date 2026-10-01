import { emptyStateTokens } from '@dsm/shared';
import type { TButtonAppearance, TButtonSize } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IEmptyStateProps } from './EmptyState.types';

interface IUseEmptyStateResult {
  rootStyle: CSSProperties;
  graphicWrapStyle: CSSProperties;
  textBlockStyle: CSSProperties;
  titleStyle: CSSProperties;
  bodyStyle: CSSProperties;
  actionsWrapStyle: CSSProperties;
  /** `fill` in `page`, `outline` in `inline` — derived, never a prop. */
  buttonAppearance: TButtonAppearance;
  /** `md` in `page`, `sm` in `inline` — derived, never a prop. */
  buttonSize: TButtonSize;
  /** `component.emptystate.action.min-width` (160) in `page` only — `inline` hugs its label. */
  buttonMinWidth: number | undefined;
}

/**
 * Resolves every style the EmptyState needs, plus the Button config
 * `layout` derives (appearance, size, min-width) — none of those are props,
 * per the dev contract's own §03/§04.
 */
export const useEmptyState = ({ layout = 'page' }: IEmptyStateProps): IUseEmptyStateResult => {
  const mode = useThemeMode();
  const { colors, dimension, titlePage, titleInline, bodyPage, bodyInline } = emptyStateTokens[mode];
  const isPage = layout === 'page';
  const titleType = isPage ? titlePage : titleInline;
  const bodyType = isPage ? bodyPage : bodyInline;
  const titleFontFamily = useFontFamily(titleType.fontWeight);
  const bodyFontFamily = useFontFamily(bodyType.fontWeight);

  return {
    rootStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isPage ? 'center' : 'flex-start',
      textAlign: isPage ? 'center' : 'left',
      width: '100%',
      // `inline` has no padding of its own — the block it sits in provides it.
      padding: isPage ? dimension.padding : 0,
    },
    graphicWrapStyle: {
      display: 'inline-flex',
      flexShrink: 0,
      width: dimension.iconSize,
      height: dimension.iconSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: dimension.gapGraphic,
      color: colors.icon,
    },
    textBlockStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: dimension.gapText,
      width: '100%',
    },
    titleStyle: {
      margin: 0,
      fontFamily: titleFontFamily,
      fontWeight: titleType.fontWeight,
      fontSize: titleType.fontSize,
      lineHeight: `${titleType.lineHeight}px`,
      color: colors.title,
    },
    bodyStyle: {
      margin: 0,
      fontFamily: bodyFontFamily,
      fontWeight: bodyType.fontWeight,
      fontSize: bodyType.fontSize,
      lineHeight: `${bodyType.lineHeight}px`,
      color: colors.body,
    },
    actionsWrapStyle: {
      display: 'flex',
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

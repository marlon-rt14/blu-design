import { calloutTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { ICalloutProps } from './Callout.types';

interface IUseCalloutResult {
  rootStyle: CSSProperties;
  iconBoxStyle: CSSProperties;
  iconColor: string;
  contentStyle: CSSProperties;
  titleStyle: CSSProperties;
  bodyStyle: CSSProperties;
  actionWrapStyle: CSSProperties;
  dismissWrapStyle: CSSProperties;
}

/**
 * Resolves every style the Callout needs.
 *
 * One flex row — icon, content column, dismiss — with a single `gap`
 * spacing all three, the same shape Alert already uses. Unlike Alert there
 * is no colour chip behind the icon (the dev contract is explicit: *"sin
 * chip de color"*) and no local dismiss painting — the shipped `IconButton`
 * (`veil`/`xs`) resolves its own tokens and tracks its own interaction
 * state.
 */
export const useCallout = ({ palette = 'brand' }: ICalloutProps): IUseCalloutResult => {
  const mode = useThemeMode();
  const { colors, dimension, title: titleType, body: bodyType } = calloutTokens[mode];
  const paletteColors = colors.palettes[palette];
  const titleFontFamily = useFontFamily(titleType.fontWeight);
  const bodyFontFamily = useFontFamily(bodyType.fontWeight);

  return {
    rootStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: dimension.gap,
      width: '100%',
      padding: dimension.padding,
      borderRadius: dimension.borderRadius,
      backgroundColor: paletteColors.bg,
    },
    // Sized and top-aligned to the title/body's first line — the code
    // equivalent of Figma's `lineBox` (an invisible text node that gives the
    // icon the exact height of the first line without adding width).
    iconBoxStyle: {
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension.iconSize,
      height: dimension.iconSize,
    },
    iconColor: paletteColors.icon,
    contentStyle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: 1,
      minWidth: 0,
    },
    titleStyle: {
      margin: 0,
      fontFamily: titleFontFamily,
      fontWeight: titleType.fontWeight,
      fontSize: titleType.fontSize,
      lineHeight: `${titleType.lineHeight}px`,
      color: paletteColors.title,
    },
    bodyStyle: {
      margin: 0,
      fontFamily: bodyFontFamily,
      fontWeight: bodyType.fontWeight,
      fontSize: bodyType.fontSize,
      lineHeight: `${bodyType.lineHeight}px`,
      color: paletteColors.body,
    },
    actionWrapStyle: {
      display: 'flex',
      paddingTop: dimension.actionPaddingTop,
    },
    dismissWrapStyle: {
      flexShrink: 0,
    },
  };
};

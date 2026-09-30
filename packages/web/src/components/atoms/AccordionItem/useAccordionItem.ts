import { accordionTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IAccordionItemProps } from './AccordionItem.types';

interface IUseAccordionItemParams extends IAccordionItemProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

interface IUseAccordionItemResult {
  rootStyle: CSSProperties;
  headerStyle: CSSProperties;
  iconWrapperStyle: CSSProperties;
  titleStyle: CSSProperties;
  chevronWrapperStyle: CSSProperties;
  panelWrapperStyle: CSSProperties;
  contentStyle: CSSProperties;
  transitionMs: number;
}

/** `motion/duration/normal` (200) — Accordion's own token list has no dedicated motion leaf. */
const TRANSITION_MS_FALLBACK = 200;

/**
 * Resolves every style the AccordionItem needs.
 *
 * Colour precedence on the header background is the same shape TextField's
 * border already follows: `disabled` overrides everything, then `pressed`,
 * then `hover` — there is no separate `focus` background, only the ring.
 * Hover only applies on web (no pointer on touch, mirrored by mobile's own
 * `useAccordionItem` never taking an `isHovered` param).
 */
export const useAccordionItem = ({
  appearance = 'default',
  size = 'sm',
  disabled = false,
  isExpanded = false,
  isHovered,
  isPressed,
  isFocusVisible,
  showDivider = false,
}: IUseAccordionItemParams): IUseAccordionItemResult => {
  const mode = useThemeMode();
  const { colors, dimension, title: titleType, content: contentType } = accordionTokens[mode];
  const appearanceColors = colors.appearances[appearance];
  const prefersReducedMotion = usePrefersReducedMotion();
  const titleFontFamily = useFontFamily(titleType.fontWeight);
  const contentFontFamily = useFontFamily(contentType.fontWeight);

  const transitionMs = prefersReducedMotion ? 0 : TRANSITION_MS_FALLBACK;

  const headerBackground = disabled
    ? 'transparent'
    : isPressed
      ? appearanceColors.overlayPressed
      : isHovered
        ? appearanceColors.overlayHover
        : 'transparent';

  return {
    rootStyle: {
      boxSizing: 'border-box',
      width: '100%',
      borderBottomWidth: showDivider ? 1 : 0,
      borderBottomStyle: 'solid',
      borderBottomColor: appearanceColors.divider,
    },
    headerStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      minHeight: dimension.headerMinHeight[size],
      gap: dimension.headerGap,
      paddingInline: dimension.headerPaddingX,
      paddingBlock: dimension.headerPaddingY,
      border: 'none',
      backgroundColor: headerBackground,
      cursor: disabled ? 'default' : 'pointer',
      boxShadow: isFocusVisible ? `0 0 0 ${dimension.focusRingSpread}px ${appearanceColors.borderFocus}` : 'none',
      textAlign: 'left',
    },
    iconWrapperStyle: {
      display: 'inline-flex',
      flexShrink: 0,
      width: dimension.iconSize,
      height: dimension.iconSize,
      alignItems: 'center',
      justifyContent: 'center',
      color: disabled ? appearanceColors.iconDisabled : appearanceColors.icon,
    },
    titleStyle: {
      margin: 0,
      flex: 1,
      minWidth: 0,
      textAlign: 'left',
      fontFamily: titleFontFamily,
      fontWeight: titleType.fontWeight,
      fontSize: titleType.fontSize,
      lineHeight: `${titleType.lineHeight}px`,
      color: disabled ? appearanceColors.titleDisabled : appearanceColors.title,
    },
    chevronWrapperStyle: {
      display: 'inline-flex',
      flexShrink: 0,
      width: dimension.chevronSize,
      height: dimension.chevronSize,
      alignItems: 'center',
      justifyContent: 'center',
      color: disabled ? appearanceColors.chevronDisabled : appearanceColors.chevron,
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: transitionMs === 0 ? 'none' : `transform ${transitionMs}ms ease`,
    },
    // Height is written imperatively in `AccordionItem.tsx` (`useLayoutEffect`,
    // same reasoning as `TextArea`'s auto-grow) — this only owns what doesn't
    // need to be measured.
    panelWrapperStyle: {
      boxSizing: 'border-box',
      overflow: 'hidden',
      transition: transitionMs === 0 ? 'none' : `height ${transitionMs}ms ease`,
    },
    contentStyle: {
      boxSizing: 'border-box',
      paddingInline: dimension.headerPaddingX,
      paddingTop: dimension.contentPaddingTop,
      paddingBottom: dimension.contentPaddingBottom,
      fontFamily: contentFontFamily,
      fontWeight: contentType.fontWeight,
      fontSize: contentType.fontSize,
      lineHeight: `${contentType.lineHeight}px`,
      color: appearanceColors.content,
    },
    transitionMs,
  };
};

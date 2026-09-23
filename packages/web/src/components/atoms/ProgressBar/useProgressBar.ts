import { progressBarTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IProgressBarProps } from './ProgressBar.types';

/** Everything the web ProgressBar needs to render. */
interface IUseProgressBarResult {
  trackStyle: CSSProperties;
  fillStyle: CSSProperties;
  headerStyle: CSSProperties;
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
  /** `value` clamped to 0–100. What goes in `aria-valuenow`. */
  clamped: number;
  /** The percentage as it is shown, already rounded. */
  percentage: string;
  /** Whether the header row renders: `showHeader` and something to put in it. */
  hasHeader: boolean;
  /** Whether the label text is on screen. The name stays either way. */
  labelVisible: boolean;
}

/**
 * Resolves the web ProgressBar's styles and its one piece of arithmetic.
 *
 * @param props - The ProgressBar props.
 * @returns The four styles, the clamped value and the formatted percentage.
 */
export const useProgressBar = ({
  value,
  label,
  showHeader = true,
  showLabel = true,
  showValue = true,
  status = 'brand',
  size = 'md',
}: IProgressBarProps): IUseProgressBarResult => {
  const mode = useThemeMode();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { colors, dimension, typography, motion } = progressBarTokens[mode];
  const labelFont = useFontFamily(typography.label.fontWeight);
  const valueFont = useFontFamily(typography.value.fontWeight);

  const height = dimension.height[size];
  const clamped = Math.min(100, Math.max(0, value));
  // Three booleans and one rule: `showHeader` wins. The label's text and the
  // percentage each answer for themselves inside it, and an empty header does
  // not render — a row with nothing in it would still take vertical space,
  // which is the very thing Figma's `showHeader` exists to avoid.
  //
  // **`showHeader` is folded into `labelVisible`, not checked beside it.** The
  // flag means "the label's text is on screen", and with the header off it is
  // not — measured the hard way: without this, `showHeader={false}` left
  // `aria-labelledby` pointing at an element that no longer rendered, which is
  // a bar with no accessible name at all.
  const labelVisible = showHeader && showLabel && label !== undefined;
  const hasHeader = showHeader && (labelVisible || showValue);

  return {
    trackStyle: {
      backgroundColor: colors.track,
      borderRadius: dimension.borderRadius,
      height,
      // The rail clips the fill, which is what gives the fill its rounded end
      // without the fill having to know it is a pill.
      overflow: 'hidden',
      width: '100%',
    },
    fillStyle: {
      backgroundColor: colors.fill[status],
      borderRadius: dimension.borderRadius,
      height: '100%',
      // **Any progress at all is visible.** bDS: *"cualquier valor mayor que 0
      // dibuja como mínimo el alto de la pista"* — so 1 % is a round dot rather
      // than nothing, and the bar never lies by looking empty.
      minWidth: clamped > 0 ? height : 0,
      transition: prefersReducedMotion
        ? 'none'
        : `width ${motion.duration}ms ${motion.easing}`,
      width: `${clamped}%`,
    },
    headerStyle: {
      alignItems: 'baseline',
      display: 'flex',
      gap: dimension.headerSpacing,
      // The label takes the room and the percentage stays at the end, which is
      // what keeps a column of bars aligned on the right.
      justifyContent: 'space-between',
      marginBlockEnd: dimension.headerGap,
    },
    labelStyle: {
      color: colors.label,
      fontFamily: labelFont,
      fontSize: typography.label.fontSize,
      fontWeight: typography.label.fontWeight,
      lineHeight: typography.label.lineHeightRatio,
      minWidth: 0,
    },
    valueStyle: {
      color: colors.value,
      flexShrink: 0,
      fontFamily: valueFont,
      fontSize: typography.value.fontSize,
      fontWeight: typography.value.fontWeight,
      lineHeight: typography.value.lineHeightRatio,
    },
    clamped,
    // Rounded, because *"'99,7 por ciento' es ruido"*. The narrow no-break
    // space before the sign is the Spanish convention and what bDS writes.
    percentage: `${Math.round(clamped)} %`,
    hasHeader,
    labelVisible,
  };
};

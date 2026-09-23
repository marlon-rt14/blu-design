import { progressBarTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IProgressBarProps } from './ProgressBar.types';

/** Everything the native ProgressBar needs to render. */
interface IUseProgressBarResult {
  trackStyle: StyleProp<ViewStyle>;
  /** Everything about the fill **except** its width, which is animated. */
  fillStyle: StyleProp<ViewStyle>;
  headerStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  valueStyle: StyleProp<TextStyle>;
  /** `value` clamped to 0–100. What goes in `accessibilityValue`. */
  clamped: number;
  /** The percentage as it is shown, already rounded. */
  percentage: string;
  /** Whether the header row renders: `showHeader` and something to put in it. */
  hasHeader: boolean;
  /** Whether the label text is on screen. The name stays either way. */
  labelVisible: boolean;
  /** Height of the track, which is also the fill's minimum width. */
  height: number;
  /** `motion/duration/normal`, for the width animation. */
  durationMs: number;
}

/**
 * Resolves the native ProgressBar's styles and its one piece of arithmetic.
 *
 * The width is **not** here: it is an `Animated.Value` the component owns, and
 * a hook that returned it would have to own the animation too.
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
      // dibuja como mínimo el alto de la pista"*.
      minWidth: clamped > 0 ? height : 0,
    },
    headerStyle: {
      alignItems: 'baseline',
      columnGap: dimension.headerSpacing,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: dimension.headerGap,
    },
    labelStyle: {
      color: colors.label,
      flexShrink: 1,
      fontFamily: labelFont,
      fontSize: typography.label.fontSize,
      // Pixels, not a ratio: `lineHeight` is a multiplier in CSS and an
      // absolute length on this platform.
      lineHeight: typography.label.fontSize * typography.label.lineHeightRatio,
    },
    valueStyle: {
      color: colors.value,
      fontFamily: valueFont,
      fontSize: typography.value.fontSize,
      lineHeight: typography.value.fontSize * typography.value.lineHeightRatio,
    },
    clamped,
    // Rounded, because *"'99,7 por ciento' es ruido"*.
    percentage: `${Math.round(clamped)} %`,
    hasHeader,
    labelVisible,
    height,
    durationMs: motion.duration,
  };
};

import {
  progressStepperLabelColor,
  progressStepperSecondaryColor,
  progressStepperTokens,
} from '@dsm/shared';
import type { IProgressStepperColorTokens, TStepStatus } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { IStepProps } from './Step.types';

interface IUseStepResult {
  rootStyle: CSSProperties;
  railStyle: CSSProperties;
  indicatorStyle: CSSProperties;
  labelColumnStyle: CSSProperties;
  labelStyle: CSSProperties;
  secondaryStyle: CSSProperties;
  numberStyle: CSSProperties;
  iconWrapStyle: CSSProperties;
  dotStyle: CSSProperties;
  showGlyph: boolean;
  showDot: boolean;
  showNumber: boolean;
  iconSize: 'sm';
  isVertical: boolean;
}

const indicatorFill = (
  colors: IProgressStepperColorTokens,
  status: TStepStatus,
): { background: string; border: string; contentColor: string } => {
  switch (status) {
    case 'pending':
      return {
        background: 'transparent',
        border: colors.indicatorBorderUpcoming,
        contentColor: colors.numberUpcoming,
      };
    case 'active':
      return {
        background: colors.indicatorCurrent,
        border: colors.indicatorCurrent,
        contentColor: colors.numberCurrent,
      };
    case 'done':
      return {
        background: colors.indicatorComplete,
        border: colors.indicatorComplete,
        contentColor: colors.iconOnFill,
      };
    case 'error':
      return {
        background: colors.indicatorError,
        border: colors.indicatorError,
        contentColor: colors.iconOnFill,
      };
    case 'warning':
      return {
        background: colors.indicatorWarning,
        border: colors.indicatorWarning,
        contentColor: colors.iconOnFill,
      };
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
};

/**
 * Resolves Step layout + indicator/label colours from the active theme.
 *
 * Horizontal: Step is `flex: 1`; rail is `[leading?][indicator][trailing?]` with
 * `space/inline/xs` between line and circle. Labels sit in normal flow under
 * the full cell (start / center / end) and clip instead of bleeding.
 * Vertical: no leading line; trailing grows under the indicator.
 */
export const useStep = ({
  status = 'pending',
  purpose = 'status',
  orientation = 'horizontal',
  labelAlign = 'center',
}: IStepProps): IUseStepResult => {
  const mode = useThemeMode();
  const tokens = progressStepperTokens[mode];
  const { colors, dimension, label, labelStrong, secondary, number } = tokens;
  const isVertical = orientation === 'vertical';
  const fills = indicatorFill(colors, status);
  const isTerminal = status === 'done' || status === 'error' || status === 'warning';
  const isWizard = purpose === 'wizard';
  const showGlyph = isTerminal;
  const showDot = !isWizard && status === 'active';
  const showNumber = isWizard && (status === 'pending' || status === 'active');
  const useStrongLabel = status === 'active';

  const textAlign: CSSProperties['textAlign'] = isVertical
    ? 'left'
    : labelAlign === 'start'
      ? 'left'
      : labelAlign === 'end'
        ? 'right'
        : 'center';

  const alignItems: CSSProperties['alignItems'] = isVertical
    ? 'flex-start'
    : labelAlign === 'start'
      ? 'flex-start'
      : labelAlign === 'end'
        ? 'flex-end'
        : 'center';

  const typography = useStrongLabel ? labelStrong : label;

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'row' : 'column',
    // Vertical: labels hug the indicator (Figma), not the mid-point of the rail.
    alignItems: isVertical ? 'flex-start' : 'stretch',
    gap: dimension.railToLabelGap,
    boxSizing: 'border-box',
    minWidth: 0,
    ...(isVertical ? {} : { flex: '1 1 0%', overflow: 'hidden' }),
  };

  const railStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    // Figma: space/inline/xs between rail segment and circle (line does not touch).
    gap: dimension.railGap,
    flexShrink: 0,
    ...(isVertical
      ? { width: dimension.indicatorSize }
      : { width: '100%', height: dimension.indicatorSize }),
  };

  const indicatorStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension.indicatorSize,
    height: dimension.indicatorSize,
    borderRadius: dimension.borderRadius,
    boxSizing: 'border-box',
    flexShrink: 0,
    backgroundColor: fills.background,
    borderWidth: status === 'pending' ? dimension.railThickness : 0,
    borderStyle: 'solid',
    borderColor: fills.border,
    color: fills.contentColor,
  };

  const labelColumnStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems,
    gap: dimension.labelGap,
    minWidth: 0,
    // Vertical: top-align with the 24 indicator (Figma); do not vertically
    // center against the trailing connector length.
    ...(isVertical
      ? { flex: 1, paddingTop: 0 }
      : { width: '100%', overflow: 'hidden' }),
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    margin: 0,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight as CSSProperties['fontWeight'],
    fontSize: typography.fontSize,
    lineHeight: `${typography.lineHeight}px`,
    color: progressStepperLabelColor(colors, status),
    textAlign,
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const secondaryStyle: CSSProperties = {
    display: 'block',
    margin: 0,
    fontFamily: secondary.fontFamily,
    fontWeight: secondary.fontWeight as CSSProperties['fontWeight'],
    fontSize: secondary.fontSize,
    lineHeight: `${secondary.lineHeight}px`,
    color: progressStepperSecondaryColor(colors, status),
    textAlign,
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const numberStyle: CSSProperties = {
    margin: 0,
    fontFamily: number.fontFamily,
    fontWeight: number.fontWeight as CSSProperties['fontWeight'],
    fontSize: number.fontSize,
    lineHeight: `${number.lineHeight}px`,
    color: fills.contentColor,
  };

  const iconWrapStyle: CSSProperties = {
    display: 'inline-flex',
    color: fills.contentColor,
    width: dimension.iconSize,
    height: dimension.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const dotStyle: CSSProperties = {
    width: dimension.dotSize,
    height: dimension.dotSize,
    borderRadius: '50%',
    backgroundColor: colors.indicatorDot,
    display: 'block',
    flexShrink: 0,
  };

  return {
    rootStyle,
    railStyle,
    indicatorStyle,
    labelColumnStyle,
    labelStyle,
    secondaryStyle,
    numberStyle,
    iconWrapStyle,
    dotStyle,
    showGlyph,
    showDot,
    showNumber,
    iconSize: 'sm',
    isVertical,
  };
};

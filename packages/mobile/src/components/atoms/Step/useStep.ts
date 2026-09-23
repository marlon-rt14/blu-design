import {
  progressStepperLabelColor,
  progressStepperSecondaryColor,
  progressStepperTokens,
} from '@dsm/shared';
import type { IProgressStepperColorTokens, TStepStatus } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IStepProps } from './Step.types';

interface IUseStepResult {
  rootStyle: StyleProp<ViewStyle>;
  railStyle: StyleProp<ViewStyle>;
  indicatorStyle: StyleProp<ViewStyle>;
  labelColumnStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  secondaryStyle: StyleProp<TextStyle>;
  numberStyle: StyleProp<TextStyle>;
  iconTint: string;
  dotStyle: StyleProp<ViewStyle>;
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

  const textAlign: TextStyle['textAlign'] = isVertical
    ? 'left'
    : labelAlign === 'start'
      ? 'left'
      : labelAlign === 'end'
        ? 'right'
        : 'center';

  const alignItems: ViewStyle['alignItems'] = isVertical
    ? 'flex-start'
    : labelAlign === 'start'
      ? 'flex-start'
      : labelAlign === 'end'
        ? 'flex-end'
        : 'center';

  const typography = useStrongLabel ? labelStrong : label;

  const rootStyle: ViewStyle = {
    flexDirection: isVertical ? 'row' : 'column',
    // Vertical: labels hug the indicator (Figma), not the mid-point of the rail.
    alignItems: isVertical ? 'flex-start' : 'stretch',
    gap: dimension.railToLabelGap,
    minWidth: 0,
    ...(isVertical ? {} : { flex: 1, overflow: 'hidden' }),
  };

  const railStyle: ViewStyle = {
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    // Figma: space/inline/xs between rail segment and circle (line does not touch).
    gap: dimension.railGap,
    flexShrink: 0,
    ...(isVertical
      ? { width: dimension.indicatorSize }
      : { width: '100%', height: dimension.indicatorSize }),
  };

  const indicatorStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension.indicatorSize,
    height: dimension.indicatorSize,
    borderRadius: dimension.borderRadius,
    flexShrink: 0,
    backgroundColor: fills.background,
    borderWidth: status === 'pending' ? dimension.railThickness : 0,
    borderColor: fills.border,
  };

  const labelColumnStyle: ViewStyle = {
    flexDirection: 'column',
    alignItems,
    gap: dimension.labelGap,
    minWidth: 0,
    // Vertical: top-align with the 24 indicator (Figma).
    ...(isVertical ? { flex: 1 } : { width: '100%', overflow: 'hidden' }),
  };

  const labelStyle: TextStyle = {
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight as TextStyle['fontWeight'],
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    color: progressStepperLabelColor(colors, status),
    textAlign,
    width: '100%',
  };

  const secondaryStyle: TextStyle = {
    fontFamily: secondary.fontFamily,
    fontWeight: secondary.fontWeight as TextStyle['fontWeight'],
    fontSize: secondary.fontSize,
    lineHeight: secondary.lineHeight,
    color: progressStepperSecondaryColor(colors, status),
    textAlign,
    width: '100%',
  };

  const numberStyle: TextStyle = {
    fontFamily: number.fontFamily,
    fontWeight: number.fontWeight as TextStyle['fontWeight'],
    fontSize: number.fontSize,
    lineHeight: number.lineHeight,
    color: fills.contentColor,
  };

  const dotStyle: ViewStyle = {
    width: dimension.dotSize,
    height: dimension.dotSize,
    borderRadius: dimension.dotSize / 2,
    backgroundColor: colors.indicatorDot,
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
    iconTint: fills.contentColor,
    dotStyle,
    showGlyph,
    showDot,
    showNumber,
    iconSize: 'sm',
    isVertical,
  };
};

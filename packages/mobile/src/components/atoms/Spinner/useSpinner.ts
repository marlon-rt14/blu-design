import {
  SPINNER_DEFAULT_LABEL,
  spinnerTokens,
} from '@dsm/shared';
import type { ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { ISpinnerProps } from './Spinner.types';

interface IUseSpinnerResult {
  rootStyle: ViewStyle;
  trackFill: string;
  indicatorFill: string;
  edge: number;
  label: string;
  rotationDurationMs: number;
}

export const useSpinner = ({
  appearance = 'brand',
  size = 'md',
  label = SPINNER_DEFAULT_LABEL,
}: ISpinnerProps): IUseSpinnerResult => {
  const mode = useThemeMode();
  const tokens = spinnerTokens[mode];
  const colors = tokens.colors.appearances[appearance];
  const edge = tokens.dimension.size[size];

  const rootStyle: ViewStyle = {
    width: edge,
    height: edge,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return {
    rootStyle,
    trackFill: colors.track,
    indicatorFill: colors.indicator,
    edge,
    label,
    rotationDurationMs: tokens.dimension.rotationDurationMs,
  };
};

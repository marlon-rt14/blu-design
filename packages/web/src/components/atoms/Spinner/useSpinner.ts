import {
  SPINNER_DEFAULT_LABEL,
  spinnerTokens,
} from '@dsm/shared';
import type { CSSProperties } from 'react';

import { usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ISpinnerProps } from './Spinner.types';

interface IUseSpinnerResult {
  rootStyle: CSSProperties;
  svgStyle: CSSProperties;
  trackFill: string;
  indicatorFill: string;
  edge: number;
  label: string;
  prefersReducedMotion: boolean;
  rotationDurationMs: number;
}

export const useSpinner = ({
  appearance = 'brand',
  size = 'md',
  label = SPINNER_DEFAULT_LABEL,
}: ISpinnerProps): IUseSpinnerResult => {
  const mode = useThemeMode();
  const tokens = spinnerTokens[mode];
  const prefersReducedMotion = usePrefersReducedMotion();
  const colors = tokens.colors.appearances[appearance];
  const edge = tokens.dimension.size[size];

  const rootStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: edge,
    height: edge,
    flexShrink: 0,
  };

  const svgStyle: CSSProperties = {
    display: 'block',
    width: edge,
    height: edge,
    ...(prefersReducedMotion
      ? {}
      : {
          animation: `dsm-spinner-rotate ${tokens.dimension.rotationDurationMs}ms linear infinite`,
        }),
  };

  return {
    rootStyle,
    svgStyle,
    trackFill: colors.track,
    indicatorFill: colors.indicator,
    edge,
    label,
    prefersReducedMotion,
    rotationDurationMs: tokens.dimension.rotationDurationMs,
  };
};

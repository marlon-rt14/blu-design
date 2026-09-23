import { progressStepperTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { IStepConnectorProps } from './StepConnector.types';

interface IUseStepConnectorResult {
  lineStyle: CSSProperties;
}

/**
 * Resolves the rail segment. Thickness on the cross axis; flexGrow fills the
 * parent's main axis. Parent Step supplies `gap: space/inline/xs` above the
 * line. Vertical also insets below and keeps a min length so steps stay spaced
 * like Figma (not a short dash between tight labels).
 */
export const useStepConnector = ({
  status = 'inactive',
  orientation = 'horizontal',
}: IStepConnectorProps): IUseStepConnectorResult => {
  const mode = useThemeMode();
  const { colors, dimension } = progressStepperTokens[mode];
  const isVertical = orientation === 'vertical';
  const fill = status === 'done' ? colors.railLineComplete : colors.railLineDefault;

  return {
    lineStyle: {
      flex: '1 1 0%',
      alignSelf: 'center',
      backgroundColor: fill,
      minWidth: 0,
      ...(isVertical
        ? {
            width: dimension.railThickness,
            // Floor so vertical hits keep Figma-like spacing even when labels
            // are short — `space/stack/2xl`.
            minHeight: dimension.railSegmentMinLength,
            marginBottom: dimension.railGap,
          }
        : { height: dimension.railThickness, minHeight: 0 }),
    },
  };
};

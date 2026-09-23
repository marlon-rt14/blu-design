import { progressStepperTokens } from '@dsm/shared';
import type { StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IStepConnectorProps } from './StepConnector.types';

interface IUseStepConnectorResult {
  lineStyle: StyleProp<ViewStyle>;
}

/**
 * Resolves the rail segment. Parent Step supplies `gap: space/inline/xs`
 * above the line. Vertical also insets below and keeps a min length so steps
 * stay spaced like Figma.
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
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      alignSelf: 'center',
      backgroundColor: fill,
      minWidth: 0,
      ...(isVertical
        ? {
            width: dimension.railThickness,
            minHeight: dimension.railSegmentMinLength,
            marginBottom: dimension.railGap,
          }
        : { height: dimension.railThickness, minHeight: 0 }),
    },
  };
};

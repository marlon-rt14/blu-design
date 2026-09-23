import type { StyleProp, ViewStyle } from 'react-native';

import type { IProgressStepperProps } from './ProgressStepper.types';

interface IUseProgressStepperResult {
  listStyle: StyleProp<ViewStyle>;
  isVertical: boolean;
}

/**
 * Resolves the ProgressStepper list layout. Connectors live inside each Step.
 */
export const useProgressStepper = ({
  orientation = 'horizontal',
}: IProgressStepperProps): IUseProgressStepperResult => {
  const isVertical = orientation === 'vertical';

  const listStyle: ViewStyle = {
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: isVertical ? 'stretch' : 'flex-start',
    width: '100%',
  };

  return { listStyle, isVertical };
};

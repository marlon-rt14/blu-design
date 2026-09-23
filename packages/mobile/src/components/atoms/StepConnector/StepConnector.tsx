import type { ReactElement } from 'react';
import { View } from 'react-native';

import type { IStepConnectorProps } from './StepConnector.types';
import { useStepConnector } from './useStepConnector';

/**
 * React Native StepConnector — rail segment between ProgressStepper hits.
 *
 * Decorative (`accessibilityRole="none"`). Thickness is `border/width/divider`;
 * colour is `inactive` or `done`. ProgressStepper derives status from the
 * **left** step via `deriveStepConnectorStatus`.
 */
export const StepConnector = (props: IStepConnectorProps): ReactElement => {
  const { testID } = props;
  const { lineStyle } = useStepConnector(props);

  return <View accessibilityRole="none" style={lineStyle} testID={testID} />;
};

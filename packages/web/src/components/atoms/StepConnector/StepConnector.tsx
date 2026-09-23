import type { ReactElement } from 'react';

import type { IStepConnectorProps } from './StepConnector.types';
import { useStepConnector } from './useStepConnector';

/**
 * Web StepConnector — rail segment between ProgressStepper hits.
 *
 * Decorative (`aria-hidden`). Thickness is `border/width/divider`; colour is
 * `inactive` (default line) or `done` (complete). ProgressStepper derives
 * status from the **left** step via `deriveStepConnectorStatus`.
 *
 * @example
 * ```tsx
 * <StepConnector status="done" orientation="horizontal" />
 * ```
 */
export const StepConnector = (props: IStepConnectorProps): ReactElement => {
  const { testID } = props;
  const { lineStyle } = useStepConnector(props);

  return <span aria-hidden="true" data-testid={testID} style={lineStyle} />;
};

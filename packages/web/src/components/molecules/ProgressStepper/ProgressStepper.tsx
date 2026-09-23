import { deriveStepConnectorStatus } from '@dsm/shared';
import type { ReactElement } from 'react';

import { Step } from '../../atoms/Step';
import type { IProgressStepperProps } from './ProgressStepper.types';
import { useProgressStepper } from './useProgressStepper';

const labelAlignFor = (
  index: number,
  count: number,
  isVertical: boolean,
): 'start' | 'center' | 'end' => {
  if (isVertical) return 'start';
  if (index === 0) return 'start';
  if (index === count - 1) return 'end';
  return 'center';
};

/**
 * Web ProgressStepper — data-driven timeline / wizard rail.
 *
 * Maps `steps[]` into Step atoms. First has no leading line; last has no
 * trailing; vertical never has leading. Connector colour comes from the
 * **left** step (`deriveStepConnectorStatus`) — not the next one.
 *
 * Figma lengths 3–7 are guidance, not a hard clamp.
 */
export const ProgressStepper = (props: IProgressStepperProps): ReactElement => {
  const { steps, purpose = 'status', orientation = 'horizontal', testID } = props;
  const { listStyle, isVertical } = useProgressStepper(props);
  const count = steps.length;

  return (
    <ol data-testid={testID} role="list" style={listStyle}>
      {steps.map((step, index) => {
        const isFirst = index === 0;
        const isLast = index === count - 1;
        const showLeadingLine = !isFirst && !isVertical;
        const showTrailingLine = !isLast;
        const leadingConnectorStatus = isFirst
          ? 'inactive'
          : deriveStepConnectorStatus(steps[index - 1]!.status);
        const trailingConnectorStatus = deriveStepConnectorStatus(step.status);

        return (
          <Step
            isCurrent={step.status === 'active'}
            key={`${step.label}-${index}`}
            label={step.label}
            labelAlign={labelAlignFor(index, count, isVertical)}
            leadingConnectorStatus={leadingConnectorStatus}
            orientation={orientation}
            purpose={purpose}
            secondaryLabel={step.secondaryLabel}
            showLeadingLine={showLeadingLine}
            showTrailingLine={showTrailingLine}
            status={step.status}
            stepNumber={String(index + 1)}
            trailingConnectorStatus={trailingConnectorStatus}
          />
        );
      })}
    </ol>
  );
};

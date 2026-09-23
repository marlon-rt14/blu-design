import type { ReactElement } from 'react';

import { IconAlertTriangle, IconCheck, IconX } from '../../../icons';
import { StepConnector } from '../StepConnector';
import type { IStepProps } from './Step.types';
import { useStep } from './useStep';

/**
 * Web Step — one hit inside ProgressStepper.
 *
 * Indicator (24) + optional leading/trailing connectors + labels. ProgressStepper
 * owns edge flags and connector status. Horizontal labels clip inside the cell;
 * vertical never draws a leading line.
 */
export const Step = (props: IStepProps): ReactElement => {
  const {
    status = 'pending',
    orientation = 'horizontal',
    label,
    secondaryLabel,
    stepNumber,
    showLeadingLine = true,
    showTrailingLine = true,
    leadingConnectorStatus = 'inactive',
    trailingConnectorStatus = 'inactive',
    isCurrent = false,
    testID,
  } = props;

  const {
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
    iconSize,
    isVertical,
  } = useStep(props);

  let Glyph: typeof IconCheck | typeof IconAlertTriangle | typeof IconX | null = null;
  switch (status) {
    case 'done':
      Glyph = IconCheck;
      break;
    case 'warning':
      Glyph = IconAlertTriangle;
      break;
    case 'error':
      Glyph = IconX;
      break;
    case 'pending':
    case 'active':
      Glyph = null;
      break;
    default: {
      const _exhaustive: never = status;
      void _exhaustive;
    }
  }

  const indicator = (
    <span aria-hidden="true" style={indicatorStyle}>
      {showGlyph && Glyph ? (
        <span style={iconWrapStyle}>
          <Glyph size={iconSize} />
        </span>
      ) : null}
      {showDot ? <span style={dotStyle} /> : null}
      {showNumber && stepNumber ? <span style={numberStyle}>{stepNumber}</span> : null}
    </span>
  );

  const leading =
    showLeadingLine && !isVertical ? (
      <StepConnector orientation={orientation} status={leadingConnectorStatus} />
    ) : null;

  const trailing = showTrailingLine ? (
    <StepConnector orientation={orientation} status={trailingConnectorStatus} />
  ) : null;

  return (
    <li
      aria-current={isCurrent ? 'step' : undefined}
      data-testid={testID}
      style={{ ...rootStyle, listStyle: 'none' }}
    >
      <div style={railStyle}>
        {leading}
        {indicator}
        {trailing}
      </div>
      <div style={labelColumnStyle}>
        {label ? <span style={labelStyle}>{label}</span> : null}
        {secondaryLabel ? <span style={secondaryStyle}>{secondaryLabel}</span> : null}
      </div>
    </li>
  );
};

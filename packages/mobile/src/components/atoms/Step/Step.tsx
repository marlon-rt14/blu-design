import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { IconAlertTriangle, IconCheck, IconX } from '../../../icons';
import { StepConnector } from '../StepConnector';
import type { IStepProps } from './Step.types';
import { useStep } from './useStep';

/**
 * React Native Step — one hit inside ProgressStepper.
 *
 * Indicator (24) + optional leading/trailing connectors + labels. Vertical
 * never draws a leading line.
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
    iconTint,
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
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={indicatorStyle}>
      {showGlyph && Glyph ? <Glyph size={iconSize} tintColor={iconTint} /> : null}
      {showDot ? <View style={dotStyle} /> : null}
      {showNumber && stepNumber ? <Text style={numberStyle}>{stepNumber}</Text> : null}
    </View>
  );

  const leading =
    showLeadingLine && !isVertical ? (
      <StepConnector orientation={orientation} status={leadingConnectorStatus} />
    ) : null;

  const trailing = showTrailingLine ? (
    <StepConnector orientation={orientation} status={trailingConnectorStatus} />
  ) : null;

  return (
    <View
      accessibilityRole="none"
      accessibilityState={{ selected: isCurrent }}
      style={rootStyle}
      testID={testID}
    >
      <View style={railStyle}>
        {leading}
        {indicator}
        {trailing}
      </View>
      <View style={labelColumnStyle}>
        {label ? <Text style={labelStyle}>{label}</Text> : null}
        {secondaryLabel ? <Text style={secondaryStyle}>{secondaryLabel}</Text> : null}
      </View>
    </View>
  );
};

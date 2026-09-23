import type {
  TProgressStepperOrientation,
  TProgressStepperPurpose,
  TStepStatus,
} from '../atoms/step.types';

export type {
  TProgressStepperOrientation,
  TProgressStepperPurpose,
  TStepStatus,
};

/**
 * One hit in a ProgressStepper.
 *
 * Dev firma (`ProgressStepper · Dev` `1020:123665`): `label`, optional
 * `secondaryLabel`, and `status`. `stepNumber` is not written — the host fills
 * it from the array index for `purpose="wizard"`.
 */
export interface IProgressStepDef {
  label: string;
  /** Timestamp or detail. Omit to hide the secondary row. */
  secondaryLabel?: string;
  status: TStepStatus;
}

/**
 * Platform-agnostic contract for ProgressStepper.
 *
 * Data-driven host: pass `steps[]` (Figma drew 3–7; treat that as guidance, not
 * a hard clamp). Connectors and edge lines are derived — not host props.
 *
 * @example
 * ```ts
 * {
 *   purpose: 'status',
 *   orientation: 'horizontal',
 *   steps: [
 *     { label: 'Paso 1', secondaryLabel: '12 ago, 10:45', status: 'done' },
 *     { label: 'Paso 2', secondaryLabel: '12 ago, 10:45', status: 'active' },
 *     { label: 'Paso 3', secondaryLabel: '12 ago, 10:45', status: 'pending' },
 *   ],
 * }
 * ```
 */
export interface IProgressStepperBaseProps {
  /**
   * Ordered hits. Figma's matrix covers lengths 3–7; longer/shorter still
   * render — group real flows if they exceed seven.
   */
  steps: IProgressStepDef[];
  /**
   * @defaultValue `'status'`
   */
  purpose?: TProgressStepperPurpose;
  /**
   * @defaultValue `'horizontal'`
   */
  orientation?: TProgressStepperOrientation;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and `testID` on
   * mobile.
   */
  testID?: string;
}

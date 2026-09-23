import type { TStepConnectorStatus } from './stepConnector.types';

/**
 * Visual state of one ProgressStepper hit.
 *
 * None of the five rely on colour alone — each has a distinct shape (empty
 * ring, filled + dot/number, check, triangle, X).
 *
 * @defaultValue `'pending'`
 */
export type TStepStatus = 'pending' | 'active' | 'done' | 'warning' | 'error';

/**
 * What the circle shows inside.
 *
 * - `status`: empty / dot / filled glyph — timeline of what happened.
 * - `wizard`: numbered index for pending/active — where you are in a flow.
 *
 * @defaultValue `'status'`
 */
export type TProgressStepperPurpose = 'status' | 'wizard';

/**
 * Row vs column layout for ProgressStepper / Step.
 *
 * Vertical never draws a leading line — the previous step's trailing segment
 * forms the continuous rail.
 *
 * @defaultValue `'horizontal'`
 */
export type TProgressStepperOrientation = 'horizontal' | 'vertical';

/**
 * Platform-agnostic contract for Step.
 *
 * A single hit inside ProgressStepper. Not meant to stand alone — outside the
 * host there is no process to read. ProgressStepper owns edge line flags and
 * passes `purpose` / `orientation` down.
 */
export interface IStepBaseProps {
  /**
   * @defaultValue `'pending'`
   */
  status?: TStepStatus;
  /**
   * @defaultValue `'status'`
   */
  purpose?: TProgressStepperPurpose;
  /**
   * @defaultValue `'horizontal'`
   */
  orientation?: TProgressStepperOrientation;
  /** Primary label under / beside the indicator. */
  label?: string;
  /**
   * Secondary caption (timestamp, detail). Omit to hide the row — Figma's
   * `showSecondaryLabel` is not a separate prop in the Dev firma.
   */
  secondaryLabel?: string;
  /**
   * Index shown inside the circle when `purpose="wizard"` and status is
   * pending/active. ProgressStepper fills this from the array index.
   */
  stepNumber?: string;
  /**
   * Draw the leading rail segment. ProgressStepper turns this off for the
   * first step and for every step when `orientation="vertical"`.
   *
   * @defaultValue `true`
   */
  showLeadingLine?: boolean;
  /**
   * Draw the trailing rail segment. ProgressStepper turns this off for the
   * last step.
   *
   * @defaultValue `true`
   */
  showTrailingLine?: boolean;
  /**
   * Status of the leading connector when shown. ProgressStepper derives it
   * from the previous step.
   *
   * @defaultValue `'inactive'`
   */
  leadingConnectorStatus?: TStepConnectorStatus;
  /**
   * Status of the trailing connector when shown. ProgressStepper derives it
   * from this step via `deriveStepConnectorStatus`.
   *
   * @defaultValue `'inactive'`
   */
  trailingConnectorStatus?: TStepConnectorStatus;
  /**
   * Horizontal label align. ProgressStepper sets start / center / end for
   * first / middle / last. Vertical always start.
   *
   * @defaultValue `'center'`
   */
  labelAlign?: 'start' | 'center' | 'end';
  /**
   * Marks the current step for assistive tech (`aria-current="step"`).
   * ProgressStepper sets this when `status="active"`.
   */
  isCurrent?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and `testID` on
   * mobile.
   */
  testID?: string;
}

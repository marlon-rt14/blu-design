/**
 * Whether a rail segment has been traversed.
 *
 * Chosen by ProgressStepper from the **left** step — not a host prop. See
 * {@link deriveStepConnectorStatus}.
 *
 * @defaultValue `'inactive'`
 */
export type TStepConnectorStatus = 'inactive' | 'done';

/**
 * Platform-agnostic contract for StepConnector.
 *
 * The rail segment between two ProgressStepper hits. Thickness is always
 * `border/width/divider` (1 in light/dark, 2 in HC). Figma gives it no
 * orientation variant — Step passes the parent's axis so thickness lands on
 * the cross axis and `flexGrow` fills the main one.
 */
export interface IStepConnectorBaseProps {
  /**
   * @defaultValue `'inactive'`
   */
  status?: TStepConnectorStatus;
  /**
   * Which axis the parent rail flexes on. Step sets this from
   * ProgressStepper's `orientation`.
   *
   * @defaultValue `'horizontal'`
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and `testID` on
   * mobile.
   */
  testID?: string;
}

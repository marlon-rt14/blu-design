import type { TSwitchSize } from '../atoms/switch.types';

/**
 * Physical size of the SwitchItem row. Matches Figma (`sm` 48 / `md` 56)
 * and `dimension.size.target.min` / `dimension.size.field.height.lg`.
 * The embedded Switch uses the same `sm` / `md` token.
 */
export type TSwitchItemSize = TSwitchSize;

/**
 * Shared SwitchItem contract — the iOS-canonical Switch usage: a list
 * row whose content is the label, with the Switch as the trailing
 * control. The entire row is the hit target; focus lands on the row,
 * not the thumb.
 *
 * Embeds the Switch atom. Does not duplicate track styles.
 */
export interface ISwitchItemBaseProps {
  /**
   * Whether the embedded Switch is on. Controlled — the parent holds
   * the value.
   *
   * @defaultValue `false`
   */
  isChecked?: boolean;
  /**
   * Row height and embedded Switch size.
   *
   * @defaultValue `'md'`
   */
  size?: TSwitchItemSize;
  /** Accessible name of the row, rendered as the leading label. */
  label: string;
  /**
   * Whether `description` renders under the label.
   *
   * @defaultValue `false`
   */
  showDescription?: boolean;
  /** Supporting text under `label`, gated by `showDescription`. */
  description?: string;
  /**
   * Whether a bottom divider paints. Default on — Figma list rows
   * divide by default.
   *
   * @defaultValue `true`
   */
  showDivider?: boolean;
  /**
   * Disables the row and the embedded Switch.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Passthrough to the embedded Switch — visual ON/OFF word inside
   * the track, not the accessible name.
   *
   * @defaultValue `false`
   */
  showStateLabel?: boolean;
  /**
   * Passthrough to the embedded Switch.
   *
   * @defaultValue `'ON'`
   */
  onLabel?: string;
  /**
   * Passthrough to the embedded Switch.
   *
   * @defaultValue `'OFF'`
   */
  offLabel?: string;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the
   * native `testID` on mobile.
   */
  testID?: string;
}

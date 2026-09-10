/**
 * Physical size of the Checkbox. Live nodes, not the Figma description's
 * blanket "minHeight 48": `sm` is 16 box / 12 mark / 32 row; `md` is 24 / 16 / 48.
 */
export type TCheckboxSize = 'sm' | 'md';

/**
 * Shared Checkbox contract. `checked` is not a three-way enum — Figma:
 * *"indeterminate no es un tercer valor del dato: en código es checked=false
 * + indeterminate=true."* `showLabel` is independent of whether `label` is set.
 */
export interface ICheckboxBaseProps {
  /**
   * Controlled. Ignored while `isIndeterminate` is true.
   *
   * @defaultValue `false`
   */
  isChecked?: boolean;
  /**
   * Partial selection: selected fill + `IconMinus`. Pair with `isChecked={false}`.
   * Clicking follows native (indeterminate → checked); the parent clears this flag.
   *
   * @defaultValue `false`
   */
  isIndeterminate?: boolean;
  /**
   * @defaultValue `'md'`
   *
   * Figma/Supernova/Dev property default (`md` first on the axis). `sm` is the
   * denser 16 box / 32 row; `md` is 24 / 48 (`size/target/min`).
   */
  size?: TCheckboxSize;
  /**
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /** Visible only when `showLabel` is true — having a string set is not enough. */
  label?: string;
  /**
   * Independent of `label` being set, matching Figma's own boolean.
   *
   * @defaultValue `true`
   */
  showLabel?: boolean;
  /** Accessible name when `showLabel` is false. Leave out when `label` already names it. */
  accessibilityLabel?: string;
  /** `data-testid` on web, `testID` on mobile. */
  testID?: string;
}

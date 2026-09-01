/**
 * Physical size of the Switch. Matches Figma's `size` axis (`sm` / `md`).
 *
 * Track geometry is composed, not hardcoded: `2 × size.icon.{sm|md} + 2 ×
 * space.inset.xs` → sm 40×24 (thumb 16), md 56×32 (thumb 24).
 */
export type TSwitchSize = 'sm' | 'md';

/**
 * Shared Switch contract. The Switch has **no label of its own** — Apple
 * HIG iOS (and Figma: "Switch suelto no existe como pieza de pantalla")
 * put the accessible name on the list row. Use {@link ISwitchItemBaseProps}
 * for that. Outside a list, HIG wants a toggle *button*, not a labelled
 * switch; do not add a `label` prop here.
 *
 * Immediate: `onChange` / `onValueChange` fires on press, no pending state.
 */
export interface ISwitchBaseProps {
  /**
   * Whether the switch is on. Controlled — the parent holds the value.
   *
   * @defaultValue `false`
   */
  isChecked?: boolean;
  /**
   * Physical size of the track + thumb.
   *
   * @defaultValue `'sm'`
   */
  size?: TSwitchSize;
  /**
   * Disables interaction and paints the disabled tokens. Not a visual
   * `state` prop — hover / press / focus are tracked internally.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Whether the overline `ON` / `OFF` word renders inside the track.
   * Visual only — it is not the accessible name. Default off, matching
   * Figma and iOS (UISwitch has no ON/OFF text inside the track).
   *
   * @defaultValue `false`
   */
  showStateLabel?: boolean;
  /**
   * Word shown in the track when `showStateLabel` is on and `isChecked`
   * is true.
   *
   * @defaultValue `'ON'`
   */
  onLabel?: string;
  /**
   * Word shown in the track when `showStateLabel` is on and `isChecked`
   * is false.
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

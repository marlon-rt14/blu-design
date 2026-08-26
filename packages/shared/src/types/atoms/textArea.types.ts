/**
 * Platform-agnostic contract for the TextArea.
 *
 * Unlike `TextField`, Figma's `TextArea` component set has a single variant
 * axis (`state`) and no `size` — see `sn_get_figma_component_detail` on the
 * "BDS3 - Core components" library. Don't add a `size` prop by analogy with
 * `TextField`; it doesn't exist for this component.
 *
 * There is also no `placeholder` prop: the `label` node itself doubles as
 * the placeholder — it renders inside the field while empty and floats
 * above once a value is set, per Figma's floating-label rule (`focus` alone,
 * with no value, does NOT float it — that state changed 2026-08-20).
 *
 * Leaves out event handlers and the `rows` starting height: each platform
 * adds its own when extending this interface (`onChange` / `rows` on web,
 * `onChangeText` / `numberOfLines` on mobile). Focus is tracked internally by
 * each implementation, not passed as a prop — see `useTextArea` on either
 * platform.
 */
export interface ITextAreaBaseProps {
  /** Current value. Controlled — the component never manages its own state. */
  value: string;
  /**
   * Rendered inside the field while `value` is empty (acting as a
   * placeholder), and floats above the field once `value` is set. There is
   * no separate `placeholder` prop — see the note above.
   */
  label?: string;
  /**
   * Rendered in the footer's left slot when `showHelper` is `true`. Ignored
   * while `errorMessage` is set.
   */
  helperText?: string;
  /**
   * Rendered in the footer's left slot instead of `helperText` when
   * `showHelper` is `true`, styled as an error. Setting it also applies the
   * invalid border colour, same as `isInvalid`. Figma requires a message
   * whenever `isInvalid` is set — a red border alone fails WCAG 1.4.1 — so
   * pair this with `showHelper: true`.
   */
  errorMessage?: string;
  /**
   * Whether `helperText` / `errorMessage` renders in the footer at all —
   * independent of whether either is set, matching Figma's own `showHelper`
   * boolean. Toggling this off and on again preserves whatever text was set,
   * instead of clearing it.
   *
   * @defaultValue `false`
   */
  showHelper?: boolean;
  /**
   * Whether the `"n/max"` counter renders in the footer at all — independent
   * of `maxLength` being set, matching Figma's own `showCounter` boolean.
   * `showHelper` and `showCounter` toggle independently; with both `false`
   * the footer occupies zero extra height.
   *
   * @defaultValue `false`
   */
  showCounter?: boolean;
  /**
   * Applies the invalid styling. `errorMessage` implies this even when it is
   * left `false`, but pairing it with a message is required, not optional —
   * see `errorMessage`.
   *
   * @defaultValue `false`
   */
  isInvalid?: boolean;
  /**
   * Blocks interaction and applies the disabled styling. The platform handler
   * (`onChange` / `onChangeText`) is not called while this is `true`.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Shows the value but blocks editing. Unlike `isDisabled`, the value stays
   * fully legible — used for data the user can see but not edit through this
   * control.
   *
   * @defaultValue `false`
   */
  isReadOnly?: boolean;
  /**
   * Maximum character count. Used to compute the `"n/max"` counter text —
   * note the format has no surrounding spaces, unlike `TextField`'s
   * `"n / max"`. See `showCounter` for whether it actually renders.
   */
  maxLength?: number;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the
   * native `testID` on mobile, so the same selector works in both suites.
   */
  testID?: string;
}

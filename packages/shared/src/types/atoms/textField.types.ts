/**
 * Physical size of a TextField.
 *
 * Not three scales of the same anatomy — `small` (32px) is a single-line
 * field where `label` only ever acts as a placeholder; `medium` (44px) and
 * `large` (56px) additionally float `label` above the value once there is
 * one. Border radius and horizontal padding are the same at every size (see
 * `textFieldTokens` in `@dsm/shared`) — only height, vertical padding and
 * the floating-label behavior change.
 */
export type TTextFieldSize = 'small' | 'medium' | 'large';

/**
 * Platform-agnostic contract for the TextField.
 *
 * There is no `placeholder` prop: `label` doubles as the placeholder while
 * `value` is empty, and floats above the value once there is one — the same
 * single-node swap `TextArea` uses (see `ITextAreaBaseProps`), except at
 * `size='small'`, where it never floats (see `TTextFieldSize`).
 *
 * Leaves out event handlers and the native input type: each platform adds its
 * own when extending this interface (`onChange` / `type` on web,
 * `onChangeText` / `keyboardType` on mobile). Focus is tracked internally by
 * each implementation, not passed as a prop — see `useTextField` on either
 * platform.
 */
export interface ITextFieldBaseProps {
  /** Current value. Controlled — the component never manages its own state. */
  value: string;
  /**
   * Rendered inside the field while `value` is empty (acting as a
   * placeholder), and floats above the field once `value` is set — except at
   * `size='small'`, where it never floats. There is no separate `placeholder`
   * prop — see the note above.
   */
  label?: string;
  /** Rendered below the field when `showHelper` is `true`. Ignored while `errorMessage` is set. */
  helperText?: string;
  /**
   * Rendered below the field instead of `helperText` when `showHelper` is
   * `true`, styled as an error. Setting it also applies the invalid border
   * colour, same as `isInvalid`. Figma's own note: pair this with
   * `showHelper` — a red border alone fails WCAG 1.4.1, and unlike
   * `TextArea`, this component won't force the message visible for you.
   */
  errorMessage?: string;
  /**
   * Whether `helperText` / `errorMessage` renders below the field at all —
   * independent of whether either is set, matching Figma's own `showHelper`
   * boolean. Toggling this off and on again preserves whatever text was set,
   * instead of clearing it.
   *
   * @defaultValue `false`
   */
  showHelper?: boolean;
  /**
   * Whether the `"n / max"` counter renders below the field at all —
   * independent of `maxLength` being set, matching Figma's own `showCounter`
   * boolean. `showHelper` and `showCounter` toggle independently; with both
   * `false` the field takes up no extra height for the footer.
   *
   * @defaultValue `false`
   */
  showCounter?: boolean;
  /**
   * Applies the invalid styling without necessarily showing an error message —
   * useful for inline validation before a message is ready. `errorMessage`
   * implies this even when it is left `false`.
   *
   * @defaultValue `false`
   */
  isInvalid?: boolean;
  /**
   * Physical size of the field.
   *
   * @defaultValue `'medium'`
   */
  size?: TTextFieldSize;
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
  /** Maximum character count. Used to compute the `"n / max"` counter text — see `showCounter`. */
  maxLength?: number;
  /**
   * Text rendered before the value — e.g. `"$"` on an amount field. Shown
   * only when `showPrefixText` is `true`; independent of `prefixIcon` and
   * `showPrefixIcon`, so either, both, or neither can be on at once.
   */
  prefix?: string;
  /** Whether `prefix` renders. @defaultValue `false` */
  showPrefixText?: boolean;
  /** Whether the icon slot before the value renders — see the platform's own `prefixIcon` prop for its content. @defaultValue `false` */
  showPrefixIcon?: boolean;
  /**
   * Text rendered after the value — e.g. `"USD"` on an amount field. Shown
   * only when `showSuffixText` is `true`; independent of `suffixIcon` and
   * `showSuffixIcon`.
   */
  suffix?: string;
  /** Whether `suffix` renders. @defaultValue `false` */
  showSuffixText?: boolean;
  /** Whether the icon slot after the value renders — see the platform's own `suffixIcon` prop for its content. @defaultValue `false` */
  showSuffixIcon?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the
   * native `testID` on mobile, so the same selector works in both suites.
   */
  testID?: string;
}

/** Physical size of a TextField. Drives height, corner radius and horizontal padding. */
export type TTextFieldSize = 'medium' | 'large';

/**
 * Platform-agnostic contract for the TextField.
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
  /** Label rendered above the field. */
  label?: string;
  /** Shown when the field is empty, in place of the value. */
  placeholder?: string;
  /** Rendered below the field. Hidden while `errorMessage` is set. */
  helperText?: string;
  /**
   * Rendered below the field instead of `helperText`, styled as an error.
   * Setting it also applies the invalid border colour, same as `isInvalid`.
   */
  errorMessage?: string;
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
  /** Maximum character count. When set, renders a `"n / max"` counter below the field. */
  maxLength?: number;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the
   * native `testID` on mobile, so the same selector works in both suites.
   */
  testID?: string;
}

import type { IOTPFieldBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

/**
 * Props of the web OTPField.
 *
 * Extends the shared {@link IOTPFieldBaseProps} contract with the web-specific
 * bits. Note there is no `onChange`: the shared `onValueChange` replaces it,
 * because the component sanitizes what the platform hands it and a raw
 * `ChangeEvent` would carry characters the field rejected.
 */
export interface IOTPFieldProps extends IOTPFieldBaseProps {
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Maps to the native `name` attribute, for uncontrolled form submission. */
  name?: string;
  /**
   * Whether the input takes focus on mount.
   *
   * Usually right for this field: an OTP screen exists to receive a code, so
   * landing with the keyboard already up saves a tap. Left off by default
   * because stealing focus is the caller's decision, not the component's.
   *
   * @defaultValue `false`
   */
  autoFocus?: boolean;
}

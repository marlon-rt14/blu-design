import type { IOTPFieldBaseProps } from '@dsm/shared';

/**
 * Props of the React Native OTPField.
 *
 * Extends the shared {@link IOTPFieldBaseProps} contract with the mobile-specific
 * handlers. Note there is no `onChangeText`: the shared `onValueChange` replaces
 * it, because the component strips non-digits and caps the length, so the raw
 * text would report characters the field rejected.
 */
export interface IOTPFieldProps extends IOTPFieldBaseProps {
  onFocus?: () => void;
  onBlur?: () => void;
  /**
   * Whether the input takes focus on mount, bringing the keyboard up with it.
   *
   * Usually right for this field: an OTP screen exists to receive a code. Left
   * off by default because opening the keyboard is the caller's decision.
   *
   * @defaultValue `false`
   */
  autoFocus?: boolean;
}

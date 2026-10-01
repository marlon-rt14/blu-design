import type { ISearchFieldBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the React Native SearchField.
 *
 * `trailingAccessory` is a host node. It renders only while `value` is empty.
 * With text, the field draws `IconXCircle` (iOS clear glyph). One mobile
 * package covers iOS and Android; the circle glyph is the one Dev specifies
 * for iOS, and it stays a single control instead of a second veil button.
 */
export interface ISearchFieldProps extends ISearchFieldBaseProps {
  /** Called with the next value on every keystroke. */
  onChangeText?: (value: string) => void;
  /**
   * Called when the clear control is pressed.
   *
   * When omitted, the field calls `onChangeText('')`.
   */
  onClear?: () => void;
  /** Called with the current value when the keyboard search key is pressed. */
  onSubmit?: (value: string) => void;
  /**
   * Trailing slot. Visible only while `value` is empty; a non-empty value
   * replaces it with the clear control.
   */
  trailingAccessory?: ReactNode;
}

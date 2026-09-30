import type { ISearchFieldBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the web SearchField.
 *
 * `onChange` receives the next string, not a DOM event — the Dev firma is
 * `onChangeText`. `trailingAccessory` is a host node (mic, camera, filter);
 * it renders only while `value` is empty. With text, the field draws its own
 * clear control (`IconButton` veil + `IconX`, label "Borrar búsqueda").
 */
export interface ISearchFieldProps extends ISearchFieldBaseProps {
  /** Called with the next value on every keystroke. */
  onChange?: (value: string) => void;
  /**
   * Called when the clear control is pressed.
   *
   * When omitted, the field calls `onChange('')`.
   */
  onClear?: () => void;
  /** Called with the current value on Enter. Only when search hits a server. */
  onSubmit?: (value: string) => void;
  /**
   * Trailing slot. Visible only while `value` is empty; a non-empty value
   * replaces it with the clear control.
   */
  trailingAccessory?: ReactNode;
}

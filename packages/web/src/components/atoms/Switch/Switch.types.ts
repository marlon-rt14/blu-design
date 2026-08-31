import type { ISwitchBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

/**
 * Props of the web Switch.
 *
 * Extends {@link ISwitchBaseProps} with a change handler and the native
 * `id` / `name` attributes. Hover, press and focus are tracked internally.
 *
 * The Switch has no label of its own — put the accessible name on
 * `SwitchItem`. `isContained` is the composition seam for that row.
 */
export interface ISwitchProps extends ISwitchBaseProps {
  /** Fired with the new checked value. Not called while `isDisabled`. */
  onChange?: (isChecked: boolean) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Maps to the native `id`, so a parent `<label htmlFor>` can point here. */
  id?: string;
  /** Maps to the native `name`, for form submission. */
  name?: string;
  /**
   * Visual-only embedding inside SwitchItem: no own focus ring, no extra
   * hit-target padding. The row owns the accessible name and the 48pt target.
   *
   * @defaultValue `false`
   */
  isContained?: boolean;
}

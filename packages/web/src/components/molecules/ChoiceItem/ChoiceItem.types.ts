import type { IChoiceItemBaseProps } from '@dsm/shared';
import type { ChangeEvent } from 'react';

/**
 * Props of the web ChoiceItem.
 *
 * Extends the shared {@link IChoiceItemBaseProps} contract with the browser's
 * own semantics. The row renders the real `<input>` itself — `type="radio"` or
 * `type="checkbox"` per `control` — and **is** its `<label>`, so a click
 * anywhere on the row toggles the option.
 */
export interface IChoiceItemProps extends IChoiceItemBaseProps {
  /**
   * Groups radio rows together. Two rows sharing it are mutually exclusive and
   * the arrow keys move between them.
   *
   * Only meaningful with `control="radio"`; a checkbox row ignores it.
   */
  name?: string;
  /** Value submitted with the form when this row is chosen. */
  value?: string;
  /** Called when the user picks this row. Never fires while `isDisabled`. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

import type { ICheckboxGroupBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the React Native CheckboxGroup.
 *
 * Extends the shared {@link ICheckboxGroupBaseProps} contract with the rows,
 * which arrive as children — Figma models them as a `rows` slot and
 * children is the same idea.
 */
export interface ICheckboxGroupProps extends ICheckboxGroupBaseProps {
  /**
   * The rows. Figma's slot accepts `ChoiceItem` (`control="checkbox"`) and
   * `ListGroup`.
   *
   * **The rows have to be controlled from above.** Each ChoiceItem owns its
   * own checked flag; nothing here toggles a sibling.
   */
  children: ReactNode;
}

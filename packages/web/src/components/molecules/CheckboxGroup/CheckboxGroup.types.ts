import type { ICheckboxGroupBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the web CheckboxGroup.
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
   * Each row owns its own checked state. The group does not share a `name`
   * the way RadioGroup does — several options or none may be chosen.
   */
  children: ReactNode;
}

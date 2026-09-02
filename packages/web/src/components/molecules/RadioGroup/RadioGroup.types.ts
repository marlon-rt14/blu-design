import type { IRadioGroupBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the web RadioGroup.
 *
 * Extends the shared {@link IRadioGroupBaseProps} contract with the rows, which
 * arrive as children — Figma models them as a `rows` slot and children is the
 * same idea.
 */
export interface IRadioGroupProps extends IRadioGroupBaseProps {
  /**
   * The rows. Figma's slot accepts `ChoiceItem` and `ListGroup`; until this
   * library ships either, `Radio` goes here.
   *
   * **Give every radio inside the same `name`.** That is what makes the browser
   * treat them as one group: arrow keys move the selection, the group takes a
   * single tab stop, and only the chosen one submits. The group cannot do it for
   * you — a slot has no say over what it is handed.
   */
  children: ReactNode;
}

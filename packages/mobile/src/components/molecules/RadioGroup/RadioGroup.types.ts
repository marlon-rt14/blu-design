import type { IRadioGroupBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the React Native RadioGroup.
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
   * **The rows have to be controlled from above.** Unlike web there is no
   * native radio to inherit grouping from: nothing unmarks the siblings for
   * you, so whoever renders the group holds which option is chosen. That is
   * also why the Radio is controlled-only.
   */
  children: ReactNode;
}

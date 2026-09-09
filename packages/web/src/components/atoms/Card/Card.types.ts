import type { ICardBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the web Card.
 *
 * Extends the shared {@link ICardBaseProps} contract with the children, which is
 * all this component takes: there are no event handlers, because the Card is not
 * interactive, and no `style` or `className`, matching every other component
 * here. Size it from a container.
 */
export interface ICardProps extends ICardBaseProps {
  /**
   * Whatever the card holds. The slot is free — no preferred contents, no
   * minimum, no promise about what goes in.
   */
  children?: ReactNode;
}

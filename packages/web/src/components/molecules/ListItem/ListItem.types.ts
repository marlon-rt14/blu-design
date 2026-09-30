import type { IListItemBaseProps } from '@dsm/shared';
import type { MouseEventHandler } from 'react';

/**
 * Props of the web ListItem.
 *
 * One addition, and it is the handler the contract writes as `onPress`: on
 * web a row that reacts to a click is a `onClick`, so the name follows the
 * platform and the behaviour follows the contract.
 */
export interface IListItemProps extends IListItemBaseProps {
  /**
   * Makes the row a real target: adds the pointer/keyboard handling, the
   * focus ring and the `hover`/`pressed` painting. Omit it for a row that is
   * plain content — *"sin handler la fila no es interactiva"*.
   */
  onClick?: MouseEventHandler<HTMLDivElement>;
}

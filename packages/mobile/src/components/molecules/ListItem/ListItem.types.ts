import type { IListItemBaseProps } from '@dsm/shared';

/**
 * Props of the React Native ListItem.
 *
 * One addition, the handler the contract names: its presence is what makes
 * the row a target at all.
 */
export interface IListItemProps extends IListItemBaseProps {
  /**
   * Makes the row a real target: wraps it in a `Pressable` and turns on the
   * pressed painting. Omit it for a row that is plain content — *"sin handler
   * la fila no es interactiva y no debe tener estados de toque"*.
   */
  onPress?: () => void;
}

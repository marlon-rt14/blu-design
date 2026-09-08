import type { IListItemBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the mobile ListItem.
 *
 * `trailing` (an Icon, Badge, Tag or IconButton in Figma's instance-swap)
 * arrives as a node here rather than in the shared contract, which stays free
 * of `ReactNode`. It is rendered inert — see `IListItemBaseProps`'s note on
 * why the row keeps a single target.
 */
export interface IListItemProps extends IListItemBaseProps {
  /** Content shown in the `trailing` slot when `showTrailing` is true. Decorative — never a second interactive target. */
  trailing?: ReactNode;
  /**
   * Makes the row a real target: adds the press handling, the focus ring and
   * the `pressed` painting. Omit it for a row that is plain content.
   */
  onPress?: () => void;
}

import type { IListItemBaseProps } from '@dsm/shared';
import type { MouseEventHandler, ReactNode } from 'react';

/**
 * Props of the web ListItem.
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
   * Makes the row a real target: adds the pointer/keyboard handling, the
   * focus ring and the `hover`/`pressed` painting. Omit it for a row that is
   * plain content.
   */
  onClick?: MouseEventHandler<HTMLDivElement>;
}

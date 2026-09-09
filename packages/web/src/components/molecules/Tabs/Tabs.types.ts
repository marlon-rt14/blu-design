import type { ITabsBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the web Tabs bar.
 *
 * Extends the shared {@link ITabsBaseProps} contract with the items, which
 * arrive as children. Figma's `showItem3`–`showItem6` are instance-visibility
 * toggles on a 6-slot master — code uses `children` (min 2, max 6).
 */
export interface ITabsProps extends ITabsBaseProps {
  /**
   * The Tab items. Between 2 and 6. `Tabs` injects `size`, `layout` and
   * the roving `tabIndex` onto each child.
   */
  children: ReactNode;
}

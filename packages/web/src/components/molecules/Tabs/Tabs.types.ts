import type { ITabsBaseProps } from '@dsm/shared';

/**
 * Props of the web Tabs bar.
 *
 * Nothing to add: the contract's six props are all platform-agnostic. The
 * tabs arrive as data in `tabs`, not as children — Figma's
 * `showItem3`–`showItem6` are instance-visibility toggles on a six-slot
 * master, and *"en código es un arreglo"*.
 */
export type ITabsProps = ITabsBaseProps;

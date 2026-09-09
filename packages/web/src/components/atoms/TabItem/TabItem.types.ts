import type { ITabItemBaseProps, TTabsLayout } from '@dsm/shared';

/**
 * Props of the web TabItem.
 *
 * Extends the shared {@link ITabItemBaseProps} contract with the browser
 * handler and the fields `Tabs` injects (`layout`, `tabIndex`). Those two
 * are not Figma Tab properties — the bar owns them.
 */
export interface ITabItemProps extends ITabItemBaseProps {
  /** Called when this tab is picked. Never fires while `isDisabled`. */
  onChange?: () => void;
  /**
   * How the item sizes itself inside the bar. Injected by `Tabs`.
   *
   * @defaultValue `'scrollable'`
   */
  layout?: TTabsLayout;
  /**
   * Roving tabindex. Selected is `0`, siblings `-1`. Injected by `Tabs`.
   * Standalone defaults to `0`.
   */
  tabIndex?: number;
}

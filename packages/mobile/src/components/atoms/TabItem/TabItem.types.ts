import type { ITabItemBaseProps, TTabsLayout } from '@dsm/shared';

/**
 * Props of the React Native TabItem.
 *
 * Extends the shared {@link ITabItemBaseProps} contract with the mobile
 * handler and the `layout` field `Tabs` injects. `layout` is not a Figma
 * Tab property — the bar owns it.
 */
export interface ITabItemProps extends ITabItemBaseProps {
  /** Called when this tab is picked. Never fires while `isDisabled`. */
  onPress?: () => void;
  /**
   * How the item sizes itself inside the bar. Injected by `Tabs`.
   *
   * @defaultValue `'scrollable'`
   */
  layout?: TTabsLayout;
}

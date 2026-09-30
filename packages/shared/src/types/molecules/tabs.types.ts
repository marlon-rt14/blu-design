import type { ReactNode } from 'react';

import type { TTabSize } from '../atoms/tabItem.types';

export type { TTabSize };

/**
 * How the bar distributes its width.
 *
 * `fitted` splits it evenly between the tabs; `scrollable` lets them keep
 * their natural width and overflow sideways.
 */
export type TTabsLayout = 'scrollable' | 'fitted';

/**
 * One tab, as data.
 *
 * The bar takes an array of these rather than children, which is the
 * contract's own shape. Figma turns the count on with four booleans
 * (`showItem3`–`showItem6`) on a six-slot master; *"en código es un
 * arreglo"*.
 */
export interface ITabDef {
  /**
   * Identifies the tab. It is what {@link ITabsBaseProps.value} holds and
   * what {@link ITabsBaseProps.onChange} hands back — never the index, so
   * reordering the array cannot silently change the selection.
   */
  key: string;
  /** The tab's text. */
  label: string;
  /**
   * Glyph before the label. Its presence turns the slot on.
   *
   * **A node, not a name**, sized to the bar: tabs draw their glyph at
   * `size/icon/sm` (16) at both steps.
   */
  leadingIcon?: ReactNode;
  /**
   * Count on the tab's Badge. Its presence turns the badge on.
   *
   * A number, not a string: it is a count, and the component formats it.
   */
  badge?: number;
  /**
   * Blocks this tab. It stays in the reading order and is announced as
   * disabled — arrow keys skip it, they do not remove it.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
}

/**
 * Platform-agnostic contract for the Tabs bar.
 *
 * **The selection is not marked tab by tab.** There is one `value` — the key
 * of the active tab — and each tab compares itself against it. The contract
 * is explicit: *"no se marca pestaña por pestaña: sale del valor"*. That is
 * what makes two active tabs, or none, impossible to write.
 *
 * Tabs are data, not children. `TabItem` still exists as the thing that draws
 * one, but it is internal: it takes `isSelected`, `layout` and `size` from
 * the bar, and nothing else fills those in correctly.
 *
 * There is no TabPanel — Figma does not ship one, so neither does this.
 *
 * @example
 * ```tsx
 * const [tab, setTab] = useState('movimientos');
 *
 * <Tabs
 *   onChange={setTab}
 *   tabs={[
 *     { key: 'movimientos', label: 'Movimientos' },
 *     { key: 'pendientes', label: 'Pendientes', badge: 9 },
 *   ]}
 *   value={tab}
 * />
 * ```
 */
export interface ITabsBaseProps {
  /** The tabs, left to right. Two to six — beyond that the bar stops being one. */
  tabs: ITabDef[];
  /** The `key` of the active tab. */
  value: string;
  /** Called with the `key` of the tab that was picked. */
  onChange: (key: string) => void;
  /**
   * How the bar distributes its width.
   *
   * @defaultValue `'scrollable'`
   */
  layout?: TTabsLayout;
  /**
   * Physical size. Propagates to every tab.
   *
   * @defaultValue `'lg'`
   */
  size?: TTabSize;
  /**
   * The line under the bar — which is also the line the selected indicator
   * sits on.
   *
   * @defaultValue `true`
   */
  divider?: boolean;
  /** Stable identifier for tests. */
  testID?: string;
}

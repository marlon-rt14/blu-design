import type { TTabSize } from '../atoms/tabItem.types';

export type { TTabSize };

/**
 * How the bar distributes its Tab items. Matches Figma's `layout` axis.
 *
 * - `scrollable`: each tab hugs its label; the bar scrolls if it overflows.
 * - `fitted`: tabs split the width equally. Indicator still hugs content.
 *
 * @defaultValue `'scrollable'`
 */
export type TTabsLayout = 'scrollable' | 'fitted';

/**
 * Shared Tabs contract. The tab **bar**: 2–6 Tab items plus the bottom
 * divider the selected indicator sits on.
 *
 * Figma's `showItem3`–`showItem6` are instance-visibility toggles on a
 * 6-slot master. Code uses `children` (min 2, max 6). `showDivider`
 * stays a real independent boolean, default `true`.
 *
 * `isSelected` / `state` do **not** live here — they go on each TabItem.
 * A bar with no selected tab is a usage error.
 */
export interface ITabsBaseProps {
  /**
   * @defaultValue `'scrollable'`
   */
  layout?: TTabsLayout;
  /**
   * Must match the Tab items inside.
   *
   * @defaultValue `'md'`
   */
  size?: TTabSize;
  /**
   * @defaultValue `true`
   */
  showDivider?: boolean;
  testID?: string;
}

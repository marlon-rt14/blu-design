import type { ReactNode } from 'react';

/**
 * Physical size of a Tab item. Matches Figma's `size` axis.
 *
 * - `md`: 44 tall, `text/label/md` (14).
 * - `lg`: 56 tall, `text/label/lg` (16).
 *
 * @defaultValue `'lg'`
 */
export type TTabSize = 'md' | 'lg';

/**
 * Shared Tab item contract. One option in a Tabs bar: label, selected
 * indicator, optional leading icon and count badge.
 *
 * Live Figma set is named **Tab item** (`97:14033`); search still lists
 * it as `Tab`. Public name is `TabItem`. The live selected axis is
 * `isSelected` (Supernova's import still says `selected` — Figma wins).
 *
 * `showLeadingIcon` / `showBadge` are independent booleans, never inferred
 * from content. Glyph default is `user`. Badge count is edited on the
 * nested Badge instance — default `"9"`.
 *
 * Hover / pressed / focus are not props: each platform derives them from
 * real interaction. `isDisabled` is the `state=disabled` axis.
 */
export interface ITabItemBaseProps {
  /**
   * @defaultValue `'Label'`
   */
  label?: string;
  /**
   * @defaultValue `false`
   */
  isSelected?: boolean;
  /**
   * @defaultValue `'lg'`
   */
  size?: TTabSize;
  /**
   * @defaultValue `false`
   */
  showLeadingIcon?: boolean;
  /**
   * The leading glyph. Only rendered when `showLeadingIcon` is on.
   *
   * **A node, not a name**, so Figma's own default of `icon/user` does not
   * survive: the library publishes 1170 glyphs across 19 sections and no
   * name-to-component registry, so the caller imports the one it wants.
   *
   * ```tsx
   * <TabItem label="Movimientos" leadingIcon={<IconUser01 size="sm" />} showLeadingIcon />
   * ```
   */
  leadingIcon?: ReactNode;
  /**
   * @defaultValue `false`
   */
  showBadge?: boolean;
  /**
   * Count painted on the nested Badge. Only visible when `showBadge`
   * is on.
   *
   * @defaultValue `'9'`
   */
  badge?: string;
  /**
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  testID?: string;
}

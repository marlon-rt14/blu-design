import type { TIconName } from './icon.types';

/**
 * Physical size of a Tab item. Matches Figma's `size` axis.
 *
 * - `md`: 44 tall, `text/label/md` (14).
 * - `lg`: 56 tall, `text/label/lg` (16).
 *
 * @defaultValue `'md'`
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
   * @defaultValue `'md'`
   */
  size?: TTabSize;
  /**
   * @defaultValue `false`
   */
  showLeadingIcon?: boolean;
  /**
   * Instance-swap of the leading glyph. Only visible when `showLeadingIcon`
   * is on. Figma default: `icon/user`.
   *
   * @defaultValue `'user'`
   */
  leadingIcon?: TIconName;
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

import type { TAvatarTone, TAvatarType } from '../atoms/avatar.types';
import type { TIconName } from '../atoms/icon.types';

/**
 * What renders at the start of the row.
 *
 * `none` leaves the row as text alone; `icon` and `avatar` reuse the atoms'
 * own `sm`/`md` steps directly — ListItem's own `size` axis shares their
 * names on purpose, so there is no separate mapping to keep in sync.
 */
export type TListItemLeadingContent = 'none' | 'icon' | 'avatar';

/**
 * Physical size of the row.
 *
 * Both steps share the same touch-target floor — `size/target/min` (48) — the
 * row never shrinks under it even at `sm`, and it never has a fixed height:
 * a longer description or a larger font scale is free to grow it.
 */
export type TListItemSize = 'sm' | 'md';

/**
 * Interaction state the row resolves its colours for.
 *
 * Mirrors the `state` axis of the bDS Figma component. It is **internal** —
 * each platform derives it from real interaction and from `isDisabled` — and
 * only applies when the row is interactive (see `IListItemBaseProps`'s note
 * on `onPress`/`onClick`).
 */
export type TListItemState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

/**
 * Platform-agnostic contract for the ListItem.
 *
 * **The row of a list** — the most repeated piece of the app: a transaction, a
 * contact, a product. It composes Avatar and Icon, which makes it the
 * component that validates the rest of the system fits together.
 *
 * Not every row navigates. When neither `onPress` (mobile) nor `onClick`
 * (web) is set, the row renders as plain content with no role, no focus ring
 * and no hover/pressed painting — the `state` axis only exists for the rows
 * that are actually a target. bDS classifies ListItem as having **one**
 * target: putting another interactive control in `trailing` creates a second
 * one and a second focus order, which is a pattern to document elsewhere, not
 * a prop this component exposes.
 *
 * `trailing` (an Icon, Badge, Tag or IconButton in Figma's own instance-swap)
 * is declared per platform rather than here, since the shared contract stays
 * free of `ReactNode` — see each platform's `IListItemProps`.
 */
export interface IListItemBaseProps {
  /** The row's primary line. */
  label: string;
  /** @defaultValue `'none'` */
  leadingContent?: TListItemLeadingContent;
  /** Glyph shown when `leadingContent='icon'`. @defaultValue `'user'` */
  icon?: TIconName;
  /** What the leading Avatar shows when `leadingContent='avatar'`. @defaultValue `'initials'` */
  avatarType?: TAvatarType;
  /** Shown when `avatarType='initials'`. */
  avatarInitials?: string;
  /** Image source when `avatarType='image'` or `'logo'`. */
  avatarImageUrl?: string;
  /** Background tone of the leading Avatar. @defaultValue `'brand'` */
  avatarTone?: TAvatarTone;
  /** @defaultValue `'md'` */
  size?: TListItemSize;
  /** @defaultValue `false` */
  showDescription?: boolean;
  /** Second line under the label. Rendered only when `showDescription`. */
  description?: string;
  /** @defaultValue `false` */
  showTrailingText?: boolean;
  /**
   * Trailing amount or shortcut, e.g. `"$1.250,00"`. Fixed at `body/md/strong`
   * with tabular figures regardless of `size`, so a column of amounts lines up.
   */
  trailingText?: string;
  /** Whether the `trailing` slot renders. @defaultValue `false` */
  showTrailing?: boolean;
  /** Hairline under the row, starting where the text starts rather than at the leading content. @defaultValue `false` */
  showDivider?: boolean;
  /** Blocks interaction and applies disabled colors. Has no effect on a non-interactive row. @defaultValue `false` */
  isDisabled?: boolean;
  testID?: string;
}

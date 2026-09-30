import type { ReactNode } from 'react';

import type { IAvatarBaseProps } from '../atoms/avatar.types';

/**
 * Physical size of the row.
 *
 * Both steps share the same touch-target floor — `size/target/min` (48) — the
 * row never shrinks under it even at `sm`, and it never has a fixed height:
 * a longer description or a larger font scale is free to grow it. It also
 * propagates to whatever is in {@link IListItemBaseProps.leading}.
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
 * What renders at the start of the row: **a glyph or an avatar, never both**.
 *
 * In Figma this is a three-value axis (`none · icon · avatar`); in code it is
 * a union, which is the contract's own framing — *"o icono, o avatar, o
 * nada"*. `none` needs no member: it is the absence of the prop.
 *
 * The avatar cannot set its own `size` — the row propagates it — and cannot
 * turn on its ring or its status dot, because the row draws neither. That
 * second omission is a gap the contract declares rather than hides: *"una
 * lista de contactos con estado en línea es un caso real y hoy no se puede
 * armar"*, open and owned by design.
 */
export type TListItemLeading =
  | { icon: ReactNode; avatar?: never }
  | { avatar: Omit<IAvatarBaseProps, 'size' | 'showRing' | 'showIndicator' | 'status'>; icon?: never };

/**
 * Platform-agnostic contract for the ListItem.
 *
 * **The row of a list** — the most repeated piece of the app: a transaction, a
 * contact, a product. It composes Avatar and Icon, which makes it the
 * component that validates the rest of the system fits together.
 *
 * ### Nothing here is a visibility boolean
 *
 * Figma has four (`showDescription`, `showTrailing`, `showTrailingText`,
 * `showDivider`) and none survive: the presence of the content is the switch.
 * `divider` is the one exception that keeps its boolean, because there is no
 * content to infer it from — a row does not know whether it is the last one
 * in its group, which is why `ListGroup` is the thing that turns it off.
 *
 * ### One target, and only if it was asked for
 *
 * When neither `onPress` (mobile) nor `onClick` (web) is set, the row renders
 * as plain content with no role, no focus ring and no hover/pressed painting
 * — *"sin handler la fila no es interactiva y no debe tener estados de
 * toque"*. The handler keeps each platform's own name; it is the one place
 * this contract diverges from the Figma one, which writes `onPress` for both.
 *
 * bDS classifies ListItem as having **one** target, and the `trailing` slot is
 * where that promise leaks: it accepts anything today, and a row with a Switch
 * inside looks right and breaks accessibility — the row is already the
 * control. The contract logs it as open, to be narrowed to Icon and Badge or
 * written as a hard rule; until then, keep it decorative.
 */
export interface IListItemBaseProps {
  /** The row's primary line. Required. */
  label: string;
  /** Second line under the label. Its presence turns the slot on. */
  description?: string;
  /** A glyph or an avatar at the start of the row. See {@link TListItemLeading}. */
  leading?: TListItemLeading;
  /**
   * What sits at the end of the row — a chevron, a Badge, a Tag. Its presence
   * turns the slot on, and it is **decorative**: never a second interactive
   * target. See the note on the contract above.
   */
  trailing?: ReactNode;
  /** Amount or datum at the end of the row. Its presence turns the slot on. */
  trailingText?: string;
  /**
   * Physical size. Propagates to `leading`.
   *
   * @defaultValue `'md'`
   */
  size?: TListItemSize;
  /**
   * Whether the row draws its bottom divider.
   *
   * The one boolean the contract keeps, because nothing can be inferred from
   * content: a row cannot know it is the last of its group. `ListGroup` is
   * what turns it off on the last child.
   *
   * @defaultValue `false`
   */
  divider?: boolean;
  /**
   * Blocks interaction and applies the disabled styling. The only value of
   * Figma's `state` axis that is a public prop.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /** Stable identifier for tests. */
  testID?: string;
}

import type { ReactNode } from 'react';

import type { TAvatarSize, TAvatarTone, TAvatarType } from '../atoms/avatar.types';

/**
 * One person or entity inside an AvatarGroup.
 *
 * Deliberately narrower than {@link IAvatarBaseProps}: `size` and `showRing`
 * are missing on purpose — the group owns both, for every item alike.
 */
export interface IAvatarGroupItem {
  /** @defaultValue `'initials'` */
  type?: TAvatarType;
  initials?: string;
  /**
   * Glyph shown when `type='icon'`. No default: it used to fall back to
   * `icon/user`, and a node cannot be conjured.
   *
   * **A node, not a name.** The library publishes 1170 glyphs across 19
   * sections and no name-to-component registry, so the caller imports the one
   * it wants and passes it in:
   *
   * ```tsx
   * icon: <IconUser01 size="md" />, // from '@dsm/web/icons/users'
   * ```
   */
  icon?: ReactNode;
  imageUrl?: string;
  accessibilityLabel?: string;
  /** @defaultValue `'brand'` */
  tone?: TAvatarTone;
}

/**
 * Platform-agnostic contract for the AvatarGroup.
 *
 * Several people in a single line, each cut out from the one behind it by its
 * ring. **Deliberately takes no slot** — a group has to guarantee that every
 * item is an Avatar, at the group's own `size`, with its ring on; a free slot
 * would let anything in and the overlap would stop reading as a stack of
 * circles. `avatars` is a plain data array instead.
 *
 * More than five people stops being a list of individuals and starts being
 * texture — pass at most five in `avatars` and set `showOverflow` to summarize
 * the rest as a trailing "+N" tile.
 */
export interface IAvatarGroupBaseProps {
  /** The people or entities to render, left to right, each overlapping the previous. */
  avatars: IAvatarGroupItem[];
  /** @defaultValue `'md'` */
  size?: TAvatarSize;
  /**
   * Whether the trailing "+N" tile renders after `avatars`.
   *
   * @defaultValue `false`
   */
  showOverflow?: boolean;
  /** Text shown in the overflow tile. @defaultValue `'+3'` */
  overflowLabel?: string;
  testID?: string;
}

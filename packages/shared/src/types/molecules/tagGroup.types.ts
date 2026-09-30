import type { ITagBaseProps, TTagSize } from '../atoms/tag.types';

/**
 * One tag inside a TagGroup.
 *
 * Deliberately narrower than {@link ITagBaseProps}: `size` is missing on
 * purpose — the group owns it, for every item alike, which is why the group's
 * own signature carries it instead.
 */
export type ITagGroupItem = Omit<ITagBaseProps, 'size' | 'testID'>;

/**
 * Platform-agnostic contract for the TagGroup — a row of Tags with overflow;
 * what AvatarGroup is to Avatar.
 *
 * **No slot.** The group has to guarantee that every item is a Tag at its own
 * `size`, and inside a field a free slot would break the height that
 * `size/field/height/*` promises.
 *
 * **It does not decide how many fit.** That depends on the width of whatever
 * contains it — a 320-wide `lg` Combobox fits two tags of 74 and 80 plus the
 * chevron and the clear, with no room for a third. Pass every tag in `tags`
 * and cap the visible ones with {@link ITagGroupBaseProps.max}; the rest
 * collapse into a trailing "+N" tile that carries no remove control, since a
 * counter is not a selection.
 */
export interface ITagGroupBaseProps {
  /** Every tag, left to right. What renders is capped by `max`. */
  tags: ITagGroupItem[];
  /**
   * How many tags render before the rest collapse into the "+N" tile.
   *
   * **The number in the tile is counted, never written** — the contract is
   * explicit: *"el '+3' sale de la cuenta, no se escribe"*. That is why there
   * is no `showOverflow` and no `overflowLabel`: leaving this unset renders
   * every tag and no tile, and setting it to fewer than `tags.length` is the
   * only way to get one.
   */
  max?: number;
  /** @defaultValue `'sm'` */
  size?: TTagSize;
  /** Stable identifier for tests. */
  testID?: string;
}

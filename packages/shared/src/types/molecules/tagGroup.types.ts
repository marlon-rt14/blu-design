import type { TIconName } from '../atoms/icon.types';
import type { TTagAppearance, TTagPalette, TTagSize } from '../atoms/tag.types';

/**
 * One tag inside a TagGroup.
 *
 * Deliberately narrower than {@link ITagBaseProps}: `size` is missing on
 * purpose — the group owns it, for every item alike.
 */
export interface ITagGroupItem {
  label: string;
  /** @defaultValue `'soft'` */
  appearance?: TTagAppearance;
  /** @defaultValue `'neutral'` */
  palette?: TTagPalette;
  /** @defaultValue `false` */
  showLeadingIcon?: boolean;
  icon?: TIconName;
}

/**
 * Platform-agnostic contract for the TagGroup.
 *
 * A row of Tags with overflow — what AvatarGroup is to Avatar. **Deliberately
 * takes no slot**: the group has to guarantee that every item is a Tag at its
 * own `size`, and inside a field a free slot would break the height that
 * `size/field/height/*` promises.
 *
 * **It does not decide how many fit.** That depends on the width of whatever
 * contains it — a 320-wide `lg` Combobox fits two tags of 74 and 80 plus the
 * chevron and the clear, with no room for a third. Pass however many already
 * fit in `tags`, and set `showOverflow` once there are more to summarize as a
 * trailing "+N" tile. That tile carries no remove control — a counter is not
 * a selection.
 */
export interface ITagGroupBaseProps {
  /** The tags to render, left to right. */
  tags: ITagGroupItem[];
  /** @defaultValue `'sm'` */
  size?: TTagSize;
  /**
   * Whether the trailing "+N" tile renders after `tags`.
   *
   * @defaultValue `false`
   */
  showOverflow?: boolean;
  /** Text shown in the overflow tile. @defaultValue `'+3'` */
  overflowLabel?: string;
  /** Accessible name for the overflow tile — a bare "+3" tells a screen reader nothing. */
  overflowAccessibilityLabel?: string;
  testID?: string;
}

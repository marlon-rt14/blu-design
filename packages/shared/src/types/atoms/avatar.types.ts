import type { TIconName } from './icon.types';
import type { TAvatarStatus } from './avatarIndicator.types';

/**
 * What the Avatar shows. Falls back in order when its content is missing:
 * for a person, photo -> initials -> icon; for an entity, logo -> initials -> icon.
 */
export type TAvatarType = 'initials' | 'icon' | 'image' | 'logo';

/**
 * Background tone. **Never chosen by hand** — derive it from the contact's own
 * identifier (a hash of it, same idea as eBay's contact colors) so the same
 * person keeps the same color everywhere. `brand` is the default: it is what
 * every avatar already looked like before this axis existed, used when there is
 * nobody to distinguish (a lone avatar, or the current user). The other eight
 * are in color-wheel order and skip red on purpose, so a tone never reads as
 * `danger`. The tone never means anything — it is not status, not category, not
 * priority; its only job is telling two different people apart.
 */
export type TAvatarTone =
  | 'brand'
  | 'sky'
  | 'teal'
  | 'green'
  | 'lime'
  | 'amber'
  | 'orange'
  | 'pink'
  | 'violet';

/**
 * Physical size. `size/avatar/*`: `xs` 24 · `sm` 32 · `md` 40 · `lg` 56.
 */
export type TAvatarSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Platform-agnostic contract for the Avatar.
 *
 * A person's identity: their photo if there is one, their initials if not,
 * an icon as the last resort. It is never the only way to identify someone —
 * always pair it with their name in text.
 *
 * The shape clips on purpose (this is the one component in the system that
 * clips content deliberately), which is what lets the status indicator sit on
 * the border without being cut off. `showRing` draws an inset stroke — it
 * never grows the box — used to separate overlapping avatars in a group.
 *
 * There is no state axis: when an Avatar acts as a control (a profile button, a
 * contact row) the state belongs to whatever contains it.
 */
export interface IAvatarBaseProps {
  /** @defaultValue `'initials'` */
  type?: TAvatarType;
  /** Shown when `type='initials'`. Two letters is the practical maximum. */
  initials?: string;
  /** Glyph shown when `type='icon'` (or as the final fallback). @defaultValue `'user'` */
  icon?: TIconName;
  /** Image source for `type='image'` (a photo, cover-fit) or `type='logo'` (fit, inside a square). */
  imageUrl?: string;
  /** Describes who/what the avatar represents, for assistive tech. */
  accessibilityLabel?: string;
  /**
   * Background tone. Derive it from the contact's identifier — see {@link TAvatarTone}.
   *
   * @defaultValue `'brand'`
   */
  tone?: TAvatarTone;
  /** @defaultValue `'md'` */
  size?: TAvatarSize;
  /**
   * Inset ring, colored like the surface it sits on. Used to cut an avatar out
   * from whatever overlaps it — always on inside an AvatarGroup.
   *
   * @defaultValue `false`
   */
  showRing?: boolean;
  /**
   * Whether the status dot renders. Forced off at `size='xs'` — a dot with its
   * ring would cover the content at that size.
   *
   * @defaultValue `false`
   */
  showIndicator?: boolean;
  /** @defaultValue `'online'` */
  status?: TAvatarStatus;
  testID?: string;
}

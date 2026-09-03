import type { TAvatarSize } from './avatar.types';

/**
 * Presence status shown by the AvatarIndicator dot.
 */
export type TAvatarStatus = 'online' | 'away' | 'busy' | 'offline';

/**
 * Platform-agnostic contract for the AvatarIndicator.
 *
 * The status dot that sits on an Avatar's border. It never sizes itself —
 * `size` is the size of the *Avatar* it decorates, and the dot resolves its own
 * diameter from `size/avatar/indicator/*`. Not meant for `size='xs'`: at that
 * size a status dot with its ring would cover the avatar's content.
 */
export interface IAvatarIndicatorBaseProps {
  /** @defaultValue `'online'` */
  status?: TAvatarStatus;
  /** Size of the Avatar this indicator decorates, not of the dot itself. */
  size?: TAvatarSize;
  testID?: string;
}

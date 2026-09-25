import type { IBadgeBaseProps } from '@dsm/shared';

/**
 * Props of the web Badge — identical to the shared contract; there is
 * nothing web-only to add. No event handlers: Badge has no interaction
 * states at all, and it doesn't position itself (anchoring it to a corner
 * is the caller's job).
 */
export type IBadgeProps = IBadgeBaseProps;

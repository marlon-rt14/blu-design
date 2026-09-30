import type { ITagBaseProps } from '@dsm/shared';

/**
 * Props of the mobile Tag.
 *
 * Nothing to add: the contract's six props are all platform-agnostic, and
 * `onRemove` is in the shared base, where the contract puts it — its presence
 * is what draws the ×.
 */
export type ITagProps = ITagBaseProps;

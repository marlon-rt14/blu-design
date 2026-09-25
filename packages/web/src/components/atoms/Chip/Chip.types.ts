import type { IChipBaseProps } from '@dsm/shared';

/**
 * Props of the web Chip.
 *
 * Nothing to add: the contract's seven props are all platform-agnostic, and
 * both handlers — `onToggle` and `onRemove` — are in the shared base, where
 * the contract puts them. Kept as its own type so the component's signature
 * reads the same as every other one in the package.
 */
export type IChipProps = IChipBaseProps;

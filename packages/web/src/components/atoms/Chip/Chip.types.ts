import type { IChipBaseProps } from '@dsm/shared';

/**
 * Props of the web Chip.
 *
 * `onToggle` and `onRemove` are declared here rather than in the shared
 * contract, which stays free of event handlers — same convention as every
 * other component's.
 */
export interface IChipProps extends IChipBaseProps {
  /** Fired with the next `selected` value when the chip is activated. */
  onToggle: (selected: boolean) => void;
  /** Fired when the remove control is activated. Its presence draws the ×. */
  onRemove?: () => void;
}

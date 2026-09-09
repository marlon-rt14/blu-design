import type { ITagBaseProps } from '@dsm/shared';

/**
 * Props of the web Tag.
 *
 * `onRemove` is declared here rather than in the shared contract, which stays
 * free of event handlers — same convention as every other component's.
 */
export interface ITagProps extends ITagBaseProps {
  /** Fired when the remove control is activated. */
  onRemove?: () => void;
}

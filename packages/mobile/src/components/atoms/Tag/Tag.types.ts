import type { ITagBaseProps } from '@dsm/shared';

/** Props of the mobile Tag — no platform-specific additions needed. */
export interface ITagProps extends ITagBaseProps {
  /** Fired when the remove control is activated. */
  onRemove?: () => void;
}

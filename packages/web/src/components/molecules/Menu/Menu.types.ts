import type { IMenuBaseProps } from '@dsm/shared';

/**
 * Props of the web Menu.
 *
 * `onSelect` is declared here rather than in the shared contract, which
 * stays free of event handlers — same convention as every other component's.
 */
export interface IMenuProps extends IMenuBaseProps {
  /** Fired with the activated row's `value`. Never called for a disabled row. */
  onSelect: (value: string) => void;
}

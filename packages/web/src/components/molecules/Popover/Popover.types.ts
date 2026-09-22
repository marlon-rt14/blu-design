import type { IPopoverBaseProps } from '@dsm/shared';

/**
 * Props of the web Popover — identical to the shared contract; there is
 * nothing web-only to add. `trigger` and `children` are both plain
 * `ReactNode`s already, and what opens/closes the panel (a click, Esc, an
 * outside press) is wired by the component itself.
 */
export type IPopoverProps = IPopoverBaseProps;

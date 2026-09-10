import type { ISelectBaseProps } from '@dsm/shared';

/**
 * Props of the mobile Select — matches the dev contract's own code signature.
 *
 * `onChange` is required, unlike every other handler in this library: the
 * dev contract's own `SelectProps` declares it with no `?`.
 */
export interface ISelectProps extends ISelectBaseProps {
  onChange: (value: string) => void;
}

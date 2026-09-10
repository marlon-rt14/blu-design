import type { ISelectBaseProps } from '@dsm/shared';

/**
 * Props of the web Select — matches the dev contract's own code signature.
 *
 * `onChange` is required, unlike every other handler in this library: the
 * dev contract's own `SelectProps` declares it with no `?`, since a Select
 * with no way to report a choice cannot function at all.
 */
export interface ISelectProps extends ISelectBaseProps {
  onChange: (value: string) => void;
}

import type { IButtonProps } from './Button.types';

/** Values the Button needs to render, derived from its props. */
interface IUseButtonResult {
  /** Composed class list, e.g. `'dsm-button dsm-button--primary dsm-button--medium'`. */
  className: string;
  /** Normalized disabled flag, safe to hand straight to the DOM element. */
  isDisabled: boolean;
}

/**
 * Resolves the Button class names from its props.
 *
 * Keeping this out of the component means the styling decisions live in one
 * place and can be unit tested without rendering. The actual declarations live
 * in `Button.css`, and the values they reference in `styles/tokens.css`.
 *
 * @param props - The Button props. Only `variant`, `size` and `isDisabled` are read.
 * @returns The class list and the normalized disabled flag.
 */
export const useButton = ({
  variant = 'primary',
  size = 'medium',
  isDisabled = false,
}: IButtonProps): IUseButtonResult => {
  const className = [
    'dsm-button',
    `dsm-button--${variant}`,
    `dsm-button--${size}`,
  ].join(' ');

  return { className, isDisabled };
};

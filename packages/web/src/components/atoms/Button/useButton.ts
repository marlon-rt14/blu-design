import type { IButtonProps } from './Button.types';

interface IUseButtonResult {
  className: string;
  isDisabled: boolean;
}

/**
 * Resolves the Button class names from its props.
 * The styles live in `Button.css` and the values in `styles/tokens.css`.
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

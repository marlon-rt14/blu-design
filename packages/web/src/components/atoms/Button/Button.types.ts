import type { IButtonBaseProps } from '@dsm/shared';
import type { MouseEvent } from 'react';

export interface IButtonProps extends IButtonBaseProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

import type { ReactElement } from 'react';

import './Button.css';
import type { IButtonProps } from './Button.types';
import { useButton } from './useButton';

export const Button = (props: IButtonProps): ReactElement => {
  const { label, onClick, testID, type = 'button' } = props;
  const { className, isDisabled } = useButton(props);

  return (
    <button
      className={className}
      data-testid={testID}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
};

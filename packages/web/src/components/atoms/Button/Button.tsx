import type { ReactElement } from 'react';

import './Button.css';
import type { IButtonProps } from './Button.types';
import { useButton } from './useButton';

/**
 * Web Button — the primary way to trigger an action.
 *
 * Renders a real `<button>` element, so keyboard activation, focus rings and
 * form semantics come for free. Styling is driven entirely by the design tokens
 * exposed as CSS custom properties.
 *
 * @example
 * ```tsx
 * <Button label="Save" onClick={handleSave} />
 * <Button label="Cancel" variant="secondary" size="small" onClick={close} />
 * <Button label="Save" isDisabled />
 * ```
 */
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

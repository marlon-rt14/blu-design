import type { ReactElement } from 'react';

import './Button.css';
import type { IButtonProps } from './Button.types';
import { useButton } from './useButton';

/**
 * Web Button — the primary way to trigger an action.
 *
 * Renders a real `<button>` element, so keyboard activation, focus rings and
 * form semantics come for free.
 *
 * Visually it diverges from the React Native Button on purpose — pill shape,
 * uppercase label, resting shadow and a lift on hover — because those are
 * browser affordances that mean nothing on a touch surface. The props contract
 * and the colour and spacing scales are the same on both platforms. See
 * `Button.css` for the reasoning.
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

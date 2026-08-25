import { useId } from 'react';
import type { ReactElement } from 'react';

import './TextField.css';
import type { ITextFieldProps } from './TextField.types';
import { useTextField } from './useTextField';

/**
 * Web TextField — a single-line text input with a label, helper/error text
 * and an optional character counter.
 *
 * Renders a real `<input>`, so native keyboard, autofill and form semantics
 * come for free. Interaction states (hover, focus) are driven by CSS
 * pseudo-classes — see `TextField.css` — the same approach the web Button
 * uses, so there is no local state to keep in sync with the DOM.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * <TextField label="Email" value={value} onChange={(e) => setValue(e.target.value)} />
 * <TextField label="Email" value={value} onChange={onChange} errorMessage="Invalid email" />
 * <TextField label="Account" value="1234 5678" isReadOnly />
 * ```
 */
export const TextField = (props: ITextFieldProps): ReactElement => {
  const { value, label, placeholder, onChange, onFocus, onBlur, type = 'text', name, testID } = props;
  const { containerClassName, isDisabled, isReadOnly, isInvalid, displayedHelperText, counterText } =
    useTextField(props);
  const inputId = useId();
  const footerId = `${inputId}-footer`;
  const hasFooter = Boolean(displayedHelperText) || Boolean(counterText);

  return (
    <div className={containerClassName}>
      {label ? (
        <label className="dsm-textfield__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        aria-describedby={hasFooter ? footerId : undefined}
        aria-invalid={isInvalid}
        className="dsm-textfield__input"
        data-testid={testID}
        disabled={isDisabled}
        id={inputId}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        readOnly={isReadOnly}
        type={type}
        value={value}
      />
      {hasFooter ? (
        <div className="dsm-textfield__footer" id={footerId}>
          {displayedHelperText ? (
            <span className="dsm-textfield__helper">{displayedHelperText}</span>
          ) : null}
          {counterText ? <span className="dsm-textfield__counter">{counterText}</span> : null}
        </div>
      ) : null}
    </div>
  );
};

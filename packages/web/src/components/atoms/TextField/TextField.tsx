import { useId, useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import type { ITextFieldProps } from './TextField.types';
import { useTextField } from './useTextField';

/**
 * Web TextField — a single-line text input with a label, helper/error text
 * and an optional character counter.
 *
 * Renders a real `<input>`, so native keyboard, autofill and form semantics
 * come for free. Every style comes from `useTextField`, resolved from the
 * active theme's tokens — hover and focus are tracked here as local state
 * and fed into it, since there are no CSS pseudo-classes to lean on anymore.
 * The one exception is `::placeholder`, which cannot be an inline style — see
 * `styles/pseudo.css` and the `dsm-input` class below.
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
  const { value, label, placeholder, onChange, onFocus, onBlur, type = 'text', name, maxLength, testID } =
    props;
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const {
    containerStyle,
    labelStyle,
    inputStyle,
    footerStyle,
    helperStyle,
    counterStyle,
    isDisabled,
    isReadOnly,
    isInvalid,
    displayedHelperText,
    counterText,
  } = useTextField({ ...props, isHovered, isFocused });
  const inputId = useId();
  const footerId = `${inputId}-footer`;
  const hasFooter = Boolean(displayedHelperText) || Boolean(counterText);

  const handleMouseEnter = (): void => setIsHovered(true);
  const handleMouseLeave = (): void => setIsHovered(false);
  const handleFocus = (event: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(true);
    onFocus?.(event);
  };
  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <div style={containerStyle}>
      {label ? (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
        </label>
      ) : null}
      <input
        aria-describedby={hasFooter ? footerId : undefined}
        aria-invalid={isInvalid}
        className="dsm-input"
        data-testid={testID}
        disabled={isDisabled}
        id={inputId}
        maxLength={maxLength}
        name={name}
        onBlur={handleBlur}
        onChange={onChange}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        placeholder={placeholder}
        readOnly={isReadOnly}
        style={inputStyle}
        type={type}
        value={value}
      />
      {hasFooter ? (
        <div id={footerId} style={footerStyle}>
          {displayedHelperText ? (
            // role="alert" only for actual errors — plain helper text
            // shouldn't interrupt the screen reader.
            <span role={isInvalid ? 'alert' : undefined} style={helperStyle}>
              {displayedHelperText}
            </span>
          ) : null}
          {counterText ? <span style={counterStyle}>{counterText}</span> : null}
        </div>
      ) : null}
    </div>
  );
};

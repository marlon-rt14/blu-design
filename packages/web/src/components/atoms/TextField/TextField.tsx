import { useId, useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';


import type { ITextFieldProps } from './TextField.types';
import { useTextField } from './useTextField';

/**
 * Web TextField — a single-line text input with a label, helper/error text
 * and an optional character counter.
 *
 * `label` lives inside the same bordered box as the value — it acts as the
 * `<input>`'s `placeholder` while empty, and floats above the value once
 * there is one (never at `size='sm'`; see `useTextField`'s
 * `showFloatingLabel`). `placeholder` only shows once the label has floated —
 * while it has not, the label *is* the placeholder, because a placeholder that
 * disappears leaves the field without a name.
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
 * <TextField label="Correo" onChangeText={setValue} value={value} />
 * <TextField error="Correo inválido" label="Correo" onChangeText={setValue} value={value} />
 * <TextField label="Cuenta" onChangeText={noop} readOnly value="1234 5678" />
 * ```
 */
export const TextField = (props: ITextFieldProps): ReactElement => {
  const {
    value,
    label,
    placeholder,
    onChangeText,
    onFocus,
    onBlur,
    type = 'text',
    name,
    maxLength,
    testID,
    leadingText,
    trailingText,
    leadingIcon,
    trailingIcon,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const {
    wrapperStyle,
    fieldStyle,
    contentStyle,
    inputRowStyle,
    labelStyle,
    inputStyle,
    affixStyle,
    iconStyle,
    footerStyle,
    helperStyle,
    counterStyle,
    isDisabled,
    isReadOnly,
    isInvalid,
    showFloatingLabel,
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
    <div style={wrapperStyle}>
      <div style={fieldStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div style={contentStyle}>
          {showFloatingLabel && label ? (
            <label htmlFor={inputId} style={labelStyle}>
              {label}
            </label>
          ) : null}
          <div style={inputRowStyle}>
            {leadingIcon ? (
              // The box and the `color` live on the wrapper, so a glyph sized
              // by the caller still lands on the field's grid and still follows
              // the disabled state through `currentColor`.
              <span style={iconStyle}>{leadingIcon}</span>
            ) : null}
            {leadingText ? <span style={affixStyle}>{leadingText}</span> : null}
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
              onChange={(event) => onChangeText(event.target.value)}
              onFocus={handleFocus}
              placeholder={showFloatingLabel ? placeholder : label}
              readOnly={isReadOnly}
              style={inputStyle}
              type={type}
              value={value}
            />
            {trailingText ? <span style={affixStyle}>{trailingText}</span> : null}
            {trailingIcon ? <span style={iconStyle}>{trailingIcon}</span> : null}
          </div>
        </div>
      </div>
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

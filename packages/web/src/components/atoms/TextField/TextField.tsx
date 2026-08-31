import { useId, useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import type { TIconSize, TTextFieldSize } from '@dsm/shared';

import { FieldIcon } from './FieldIcon';
import type { ITextFieldProps } from './TextField.types';
import { useTextField } from './useTextField';

/**
 * Maps TextField `size` onto Icon `size`. Live Figma: sm+md fields bind
 * `size.icon.sm` (16); lg binds `size.icon.md` (24). Exhaustive so a new
 * `TTextFieldSize` fails the build until mapped.
 */
const iconSizeForField = (size: TTextFieldSize): TIconSize => {
  switch (size) {
    case 'small':
    case 'medium':
      return 'sm';
    case 'large':
      return 'md';
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
};

/**
 * Web TextField — a single-line text input with a label, helper/error text
 * and an optional character counter.
 *
 * `label` lives inside the same bordered box as the value — it acts as the
 * `<input>`'s `placeholder` while empty, and floats above the value once
 * there is one (never at `size='small'`; see `useTextField`'s
 * `showFloatingLabel`). There is no separate `placeholder` prop.
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
  const {
    value,
    label,
    onChange,
    onFocus,
    onBlur,
    type = 'text',
    name,
    maxLength,
    testID,
    prefix,
    suffix,
    prefixIcon = 'search',
    suffixIcon = 'search',
    showPrefixText = false,
    showSuffixText = false,
    showPrefixIcon = false,
    showSuffixIcon = false,
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
  const iconSize = iconSizeForField(props.size ?? 'medium');

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
            {showPrefixIcon ? (
              <span style={iconStyle}>
                <FieldIcon
                  color={isDisabled ? 'disabled' : 'secondary'}
                  name={prefixIcon}
                  size={iconSize}
                />
              </span>
            ) : null}
            {showPrefixText && prefix ? <span style={affixStyle}>{prefix}</span> : null}
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
              placeholder={showFloatingLabel ? undefined : label}
              readOnly={isReadOnly}
              style={inputStyle}
              type={type}
              value={value}
            />
            {showSuffixText && suffix ? <span style={affixStyle}>{suffix}</span> : null}
            {showSuffixIcon ? (
              <span style={iconStyle}>
                <FieldIcon
                  color={isDisabled ? 'disabled' : 'secondary'}
                  name={suffixIcon}
                  size={iconSize}
                />
              </span>
            ) : null}
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

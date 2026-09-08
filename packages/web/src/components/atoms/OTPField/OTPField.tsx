import { OTP_FIELD_ACCESSIBILITY_LABEL } from '@dsm/shared';
import { useId, useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';

import type { IOTPFieldProps } from './OTPField.types';
import { useOTPField } from './useOTPField';

/**
 * Web OTPField — a one-time code as N boxes, one digit each.
 *
 * **The boxes are presentation. This renders one `<input>`, never N.** That is
 * what keeps `autocomplete="one-time-code"` working, what lets someone paste
 * six digits at once, and what bDS asks for outright — *"N inputs rompen el
 * pegado y el autorrelleno"*. The input is transparent and covers the whole
 * row, so a click anywhere focuses it; the boxes behind it are painted from
 * `value` and take no pointer events.
 *
 * There is no caret and no hover: the ring on the active box is the caret, and
 * with one input there is nothing per digit to hover.
 *
 * @example
 * ```tsx
 * const [code, setCode] = useState('');
 * <OTPField value={code} onValueChange={setCode} helperText="Reenviar código en 00:30" />
 * <OTPField value={code} onValueChange={setCode} length={6} errorMessage="Código incorrecto" />
 * ```
 */
export const OTPField = (props: IOTPFieldProps): ReactElement => {
  const {
    value,
    onValueChange,
    onFocus,
    onBlur,
    name,
    autoFocus = false,
    accessibilityLabel = OTP_FIELD_ACCESSIBILITY_LABEL,
    length = 4,
    testID,
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const helperId = useId();
  const {
    wrapperStyle,
    rowStyle,
    boxStyle,
    activeBoxStyle,
    inputStyle,
    helperStyle,
    digits,
    activeIndex,
    isDisabled,
    isInvalid,
    displayedHelperText,
    sanitize,
  } = useOTPField({ ...props, isFocused });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onValueChange?.(sanitize(event.target.value));
  };

  return (
    <div style={wrapperStyle}>
      <div style={rowStyle}>
        {digits.map((digit, index) => (
          <div
            data-testid={testID ? `${testID}-digit-${index}` : undefined}
            // The index is the identity here: these are positions in a code, not
            // a reorderable list, and two boxes can hold the same digit.
            key={index}
            style={index === activeIndex && activeBoxStyle ? { ...boxStyle, ...activeBoxStyle } : boxStyle}
          >
            {digit}
          </div>
        ))}
        <input
          aria-describedby={displayedHelperText ? helperId : undefined}
          aria-invalid={isInvalid || undefined}
          aria-label={accessibilityLabel}
          // The OS needs all three to offer the code from an SMS: the token
          // itself, a numeric keyboard, and a length to know when it is done.
          autoComplete="one-time-code"
          autoFocus={autoFocus}
          data-testid={testID}
          disabled={isDisabled}
          inputMode="numeric"
          maxLength={length}
          name={name}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onChange={handleChange}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          style={inputStyle}
          type="text"
          value={value}
        />
      </div>
      {displayedHelperText ? (
        <p aria-live={isInvalid ? 'assertive' : undefined} id={helperId} style={helperStyle}>
          {displayedHelperText}
        </p>
      ) : null}
    </div>
  );
};

import { PASSWORD_FIELD_ACTION_LABEL } from '@dsm/shared';
import type { TPasswordFieldVisibility } from '@dsm/shared';
import { useId, useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import { LinkButton } from '../LinkButton';
import type { IPasswordFieldProps } from './PasswordField.types';
import { usePasswordField } from './usePasswordField';

/**
 * Web PasswordField — a password input revealed by a **text action**, not an
 * eye icon.
 *
 * The action is a real `LinkButton`, which is also how Figma builds it: the
 * component instance sits inside the field. Its label is the accessible name
 * and flips between "Mostrar" and "Ocultar", so the toggle announces itself
 * without an extra live region. It only renders once there is a value — there
 * is nothing to reveal on an empty field.
 *
 * Masking is the browser's, through `type="password"`; the `value` prop is
 * always the real one. `autoComplete` stays on so password managers keep
 * working.
 *
 * `label` acts as the placeholder while the field is empty and floats above the
 * value once there is one — except at `size='sm'`, where it never floats.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * <PasswordField label="Contraseña" value={value} onChange={(e) => setValue(e.target.value)} />
 * <PasswordField label="Nueva contraseña" value={value} onChange={onChange} autoComplete="new-password" />
 * ```
 */
export const PasswordField = (props: IPasswordFieldProps): ReactElement => {
  const {
    value,
    label,
    onChange,
    onFocus,
    onBlur,
    name,
    autoComplete = 'current-password',
    visibility = 'hidden',
    onVisibilityChange,
    testID,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // Controlled when the caller passes a handler: from then on `visibility` is
  // the single source of truth and the action only reports the next value.
  // Without it the component owns the state, and a *new* `visibility` still
  // overrides whatever the action last set.
  const isControlled = onVisibilityChange !== undefined;
  const [internalIsVisible, setInternalIsVisible] = useState(visibility === 'visible');
  const [lastVisibility, setLastVisibility] = useState(visibility);
  if (!isControlled && visibility !== lastVisibility) {
    // Adjusting state during render rather than in an effect: React re-runs the
    // render before committing, so there is no frame with the stale value.
    setLastVisibility(visibility);
    setInternalIsVisible(visibility === 'visible');
  }
  const isVisible = isControlled ? visibility === 'visible' : internalIsVisible;

  const handleToggleVisibility = (): void => {
    const next: TPasswordFieldVisibility = isVisible ? 'hidden' : 'visible';
    if (isControlled) {
      onVisibilityChange(next);
      return;
    }
    setInternalIsVisible(next === 'visible');
  };
  const {
    wrapperStyle,
    fieldStyle,
    contentStyle,
    labelStyle,
    inputStyle,
    actionSlotStyle,
    helperStyle,
    isDisabled,
    isReadOnly,
    isInvalid,
    showFloatingLabel,
    showAction,
    actionSize,
    displayedHelperText,
  } = usePasswordField({ ...props, isHovered, isFocused });
  const inputId = useId();
  const helperId = `${inputId}-helper`;

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
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={fieldStyle}
      >
        <div style={contentStyle}>
          {showFloatingLabel && label ? (
            <label htmlFor={inputId} style={labelStyle}>
              {label}
            </label>
          ) : null}
          <input
            aria-describedby={displayedHelperText ? helperId : undefined}
            aria-invalid={isInvalid}
            autoComplete={autoComplete}
            className="dsm-input"
            data-testid={testID}
            disabled={isDisabled}
            id={inputId}
            name={name}
            onBlur={handleBlur}
            onChange={onChange}
            onFocus={handleFocus}
            placeholder={showFloatingLabel ? undefined : label}
            readOnly={isReadOnly}
            style={inputStyle}
            // The browser does the masking. Never substitute characters in the
            // value to fake it — that breaks selection, paste and managers.
            type={isVisible ? 'text' : 'password'}
            value={value}
          />
        </div>
        {showAction ? (
          <div style={actionSlotStyle}>
            <LinkButton
              isDisabled={isDisabled}
              label={PASSWORD_FIELD_ACTION_LABEL[isVisible ? 'visible' : 'hidden']}
              onClick={handleToggleVisibility}
              size={actionSize}
              testID={testID ? `${testID}-action` : undefined}
              // Inside a field the underline competes with the input's own
              // chrome, so this is the app-link treatment rather than web's.
              underline={false}
            />
          </div>
        ) : null}
      </div>
      {displayedHelperText ? (
        <span
          aria-live={isInvalid ? undefined : 'polite'}
          id={helperId}
          role={isInvalid ? 'alert' : undefined}
          style={helperStyle}
        >
          {displayedHelperText}
        </span>
      ) : null}
    </div>
  );
};

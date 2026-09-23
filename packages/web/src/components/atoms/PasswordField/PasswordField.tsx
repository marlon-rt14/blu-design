import {
  PASSWORD_FIELD_ACTION_LABEL,
  PASSWORD_REQUIREMENTS_TITLE,
  PASSWORD_STRENGTH_LABEL,
  PASSWORD_STRENGTH_STATUS,
  PASSWORD_STRENGTH_VALUE,
} from '@dsm/shared';
import { useId, useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import { IconCapsLock, IconCheckCircle, IconCircle } from '../../../icons';
import { LinkButton } from '../LinkButton';
import { ProgressBar } from '../ProgressBar';
import type { IPasswordFieldProps } from './PasswordField.types';
import { usePasswordField } from './usePasswordField';

/**
 * Visually hidden but present for a screen reader. Clipped rather than
 * `display: none`, which would take it out of the accessibility tree with the
 * pixels.
 */
const CLIPPED = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
} as const;

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
 * <PasswordField label="Contraseña" onChangeText={setValue} value={value} />
 * <PasswordField autoComplete="new-password" label="Nueva contraseña" onChangeText={setValue} value={value} />
 * ```
 */
export const PasswordField = (props: IPasswordFieldProps): ReactElement => {
  const {
    value,
    label,
    onChangeText,
    onFocus,
    onBlur,
    name,
    autoComplete = 'current-password',
    capsLock = false,
    strength,
    requirements,
    visible = false,
    onToggleVisible,
    testID,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // Controlled when the caller passes a handler: from then on `visible` is the
  // single source of truth and the action only reports that it was pressed.
  // Without it the component owns the state, and a *new* `visible` still
  // overrides whatever the action last set. bDS leaves this undecided; both is
  // the answer that costs nothing.
  const isControlled = onToggleVisible !== undefined;
  const [internalIsVisible, setInternalIsVisible] = useState(visible);
  const [lastVisible, setLastVisible] = useState(visible);
  if (!isControlled && visible !== lastVisible) {
    // Adjusting state during render rather than in an effect: React re-runs the
    // render before committing, so there is no frame with the stale value.
    setLastVisible(visible);
    setInternalIsVisible(visible);
  }
  const isVisible = isControlled ? visible : internalIsVisible;

  const handleToggleVisibility = (): void => {
    if (isControlled) {
      onToggleVisible();
      return;
    }
    setInternalIsVisible((current) => !current);
  };
  const {
    wrapperStyle,
    fieldStyle,
    contentStyle,
    labelStyle,
    inputStyle,
    actionSlotStyle,
    helperStyle,
    disabled,
    readOnly,
    isInvalid,
    showFloatingLabel,
    showAction,
    actionSize,
    displayedHelperText,
    capsLockStyle,
    blockStyle,
    strengthWordStyle,
    requirementsTitleStyle,
    requirementListStyle,
    requirementRowStyle,
    requirementTextStyle,
    requirementIconColor,
  } = usePasswordField({ ...props, isHovered, isFocused });
  const inputId = useId();
  const requirementsId = `${inputId}-requirements`;
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
            disabled={disabled}
            id={inputId}
            name={name}
            onBlur={handleBlur}
            onChange={(event) => onChangeText(event.target.value)}
            onFocus={handleFocus}
            placeholder={showFloatingLabel ? undefined : label}
            readOnly={readOnly}
            style={inputStyle}
            // The browser does the masking. Never substitute characters in the
            // value to fake it — that breaks selection, paste and managers.
            type={isVisible ? 'text' : 'password'}
            value={value}
          />
        </div>
        {capsLock ? (
          // A live region, because it appears while someone is typing and
          // nothing else would announce it: *"el aviso de Bloq Mayús va como
          // región viva"*. The glyph is frozen in Figma — no size, no colour,
          // no choice.
          <span aria-live="polite" style={capsLockStyle}>
            <IconCapsLock size="sm" />
            <span style={CLIPPED}>Bloq Mayús activado</span>
          </span>
        ) : null}
        {showAction ? (
          <div style={actionSlotStyle}>
            <LinkButton
              isDisabled={disabled}
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
      {strength === undefined ? null : (
        <div style={blockStyle}>
          {/* The word is the information and it carries its own colour, which
              the bar's header could not give it. */}
          <span style={strengthWordStyle}>{PASSWORD_STRENGTH_LABEL[strength]}</span>
          {/* A real ProgressBar, because that is what Figma instances here —
              measured: `bar` is a header plus a track, and the fill is 25, 50,
              75 or 100 per cent of it. Its header is off; the word above is
              this component's. */}
          <ProgressBar
            label={`Fuerza de la contraseña: ${PASSWORD_STRENGTH_LABEL[strength]}`}
            showHeader={false}
            size="sm"
            status={PASSWORD_STRENGTH_STATUS[strength]}
            testID={testID ? `${testID}-strength` : undefined}
            value={PASSWORD_STRENGTH_VALUE[strength]}
          />
        </div>
      )}
      {requirements === undefined ? null : (
        <div style={blockStyle}>
          <span id={requirementsId} style={requirementsTitleStyle}>
            {PASSWORD_REQUIREMENTS_TITLE}
          </span>
          <ul aria-labelledby={requirementsId} style={requirementListStyle}>
            {requirements.map((requirement) => (
              <li key={requirement.label} style={requirementRowStyle}>
                {/* The glyph is decoration; the state travels as text, because
                    *"la lista tiene que anunciar cuáles se cumplieron, no solo
                    pintarlos de verde"*. */}
                <span
                  aria-hidden="true"
                  style={{ color: requirementIconColor(requirement.met), display: 'inline-flex' }}
                >
                  {requirement.met ? (
                    <IconCheckCircle size="sm" />
                  ) : (
                    <IconCircle size="sm" />
                  )}
                </span>
                <span style={requirementTextStyle}>
                  {requirement.label}
                  <span style={CLIPPED}>{requirement.met ? ' — cumplido' : ' — pendiente'}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

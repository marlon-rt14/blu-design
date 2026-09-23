import {
  PASSWORD_FIELD_ACTION_LABEL,
  PASSWORD_REQUIREMENTS_TITLE,
  PASSWORD_STRENGTH_LABEL,
  PASSWORD_STRENGTH_STATUS,
  PASSWORD_STRENGTH_VALUE,
} from '@dsm/shared';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Text, TextInput, View } from 'react-native';

import { IconCheckCircle, IconCircle } from '../../../icons';
import { LinkButton } from '../LinkButton';
import { ProgressBar } from '../ProgressBar';
import { passwordFieldStyles } from './PasswordField.styles';
import type { IPasswordFieldProps } from './PasswordField.types';
import { usePasswordField } from './usePasswordField';

/**
 * React Native PasswordField — a password input revealed by a **text action**,
 * not an eye icon.
 *
 * The action is a real `LinkButton`, which is how Figma builds it too. Its label
 * is the accessible name and flips between "Mostrar" and "Ocultar", so the
 * toggle announces itself. It only renders once there is a value.
 *
 * Masking is `TextInput`'s own `secureTextEntry`; the `value` prop is always the
 * real one. `autoComplete` stays on so password managers keep working.
 *
 * `label` acts as the placeholder while empty and floats above the value once
 * there is one — except at `size='sm'`, where it never floats.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * <PasswordField label="Contraseña" value={value} onChangeText={setValue} />
 * <PasswordField label="Nueva contraseña" value={value} onChangeText={setValue} autoComplete="new-password" />
 * ```
 */
export const PasswordField = (props: IPasswordFieldProps): ReactElement => {
  const {
    value,
    label,
    onChangeText,
    onFocus,
    onBlur,
    autoComplete = 'current-password',
    strength,
    requirements,
    visible = false,
    onToggleVisible,
    testID,
  } = props;
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
        fieldStyle,
    labelStyle,
    inputStyle,
    actionSlotStyle,
    helperStyle,
    placeholderTextColor,
    disabled,
    readOnly,
    isInvalid,
    showFloatingLabel,
    showAction,
    actionSize,
    displayedHelperText,
    blockStyle,
    strengthWordStyle,
    requirementsTitleStyle,
    requirementRowStyle,
    requirementTextStyle,
    requirementIconColor,
  } = usePasswordField({ ...props, isFocused });

  return (
    <View style={passwordFieldStyles.wrapper}>
      <View style={fieldStyle}>
        <View style={passwordFieldStyles.content}>
          {showFloatingLabel && label ? <Text style={labelStyle}>{label}</Text> : null}
          <TextInput
            accessibilityLabel={label}
            autoComplete={autoComplete}
            editable={!disabled && !readOnly}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            onChangeText={onChangeText}
            onFocus={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            placeholder={showFloatingLabel ? undefined : label}
            placeholderTextColor={placeholderTextColor}
            // TextInput does the masking. Never substitute characters in the
            // value to fake it — that breaks selection, paste and managers.
            secureTextEntry={!isVisible}
            style={inputStyle}
            testID={testID}
            value={value}
          />
        </View>
        {showAction ? (
          <View style={actionSlotStyle}>
            <LinkButton
              isDisabled={disabled}
              label={PASSWORD_FIELD_ACTION_LABEL[isVisible ? 'visible' : 'hidden']}
              onPress={handleToggleVisibility}
              size={actionSize}
              testID={testID ? `${testID}-action` : undefined}
            />
          </View>
        ) : null}
      </View>
      {displayedHelperText ? (
        <Text accessibilityLiveRegion={isInvalid ? 'assertive' : 'polite'} style={helperStyle}>
          {displayedHelperText}
        </Text>
      ) : null}
      {strength === undefined ? null : (
        <View style={blockStyle}>
          {/* The word is the information and it carries its own colour, which
              the bar's header could not give it. */}
          <Text style={strengthWordStyle}>{PASSWORD_STRENGTH_LABEL[strength]}</Text>
          {/* A real ProgressBar, because that is what Figma instances here —
              measured: the fill is 25, 50, 75 or 100 per cent of the track. */}
          <ProgressBar
            label={`Fuerza de la contraseña: ${PASSWORD_STRENGTH_LABEL[strength]}`}
            showHeader={false}
            size="sm"
            status={PASSWORD_STRENGTH_STATUS[strength]}
            testID={testID ? `${testID}-strength` : undefined}
            value={PASSWORD_STRENGTH_VALUE[strength]}
          />
        </View>
      )}
      {requirements === undefined ? null : (
        <View accessibilityRole="list" style={blockStyle}>
          <Text style={requirementsTitleStyle}>{PASSWORD_REQUIREMENTS_TITLE}</Text>
          {requirements.map((requirement) => (
            // The state travels in the label, not in the colour: *"la lista
            // tiene que anunciar cuáles se cumplieron, no solo pintarlos de
            // verde"*.
            <View
              accessibilityLabel={`${requirement.label} — ${requirement.met ? 'cumplido' : 'pendiente'}`}
              accessible
              key={requirement.label}
              style={requirementRowStyle}
            >
              {requirement.met ? (
                <IconCheckCircle size="sm" tintColor={requirementIconColor(true)} />
              ) : (
                <IconCircle size="sm" tintColor={requirementIconColor(false)} />
              )}
              <Text style={requirementTextStyle}>{requirement.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

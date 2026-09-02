import { PASSWORD_FIELD_ACTION_LABEL } from '@dsm/shared';
import type { TPasswordFieldVisibility } from '@dsm/shared';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Text, TextInput, View } from 'react-native';

import { LinkButton } from '../LinkButton';
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
    visibility = 'hidden',
    onVisibilityChange,
    testID,
  } = props;
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
        fieldStyle,
    labelStyle,
    inputStyle,
    actionSlotStyle,
    helperStyle,
    placeholderTextColor,
    isDisabled,
    isReadOnly,
    isInvalid,
    showFloatingLabel,
    showAction,
    actionSize,
    displayedHelperText,
  } = usePasswordField({ ...props, isFocused });

  return (
    <View style={passwordFieldStyles.wrapper}>
      <View style={fieldStyle}>
        <View style={passwordFieldStyles.content}>
          {showFloatingLabel && label ? <Text style={labelStyle}>{label}</Text> : null}
          <TextInput
            accessibilityLabel={label}
            autoComplete={autoComplete}
            editable={!isDisabled && !isReadOnly}
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
              isDisabled={isDisabled}
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
    </View>
  );
};

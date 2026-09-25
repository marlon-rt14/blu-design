import { useState } from 'react';
import type { ReactElement } from 'react';
import { Text, TextInput, View } from 'react-native';


import { textFieldStyles } from './TextField.styles';
import type { ITextFieldProps } from './TextField.types';
import { tintNode } from '../Icon';
import { useTextField } from './useTextField';

/**
 * React Native TextField — a single-line text input with a label, helper/error
 * text and an optional character counter.
 *
 * `label` lives inside the same bordered box as the value — it fills
 * `TextInput`'s `placeholder` while empty, and floats above the value once
 * there is one (never at `size='sm'`; see `useTextField`'s
 * `showFloatingLabel`). There is no separate `placeholder` prop.
 *
 * Focus is tracked locally (`TextInput` has no `:focus` pseudo-class) and fed
 * into `useTextField`, which resolves every color from the active theme via
 * `useThemeMode()`. See `packages/mobile/src/theme` for how the theme mode is
 * provided.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * <TextField label="Correo" onChangeText={setValue} value={value} />
 * <TextField error="Correo inválido" label="Correo" onChangeText={setValue} value={value} />
 * <TextField label="Cuenta" onChangeText={noop} readOnly value="1234 5678" />
 * ```
 */
export const TextField = ({
  onFocus,
  onBlur,
  keyboardType = 'default',
  isSecure = false,
  leadingIcon,
  trailingIcon,
  leadingText,
  trailingText,
  ...props
}: ITextFieldProps): ReactElement => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    ringStyle,
    gapStyle,
    fieldStyle,
    contentStyle,
    inputRowStyle,
    inputStyle,
    labelStyle,
    affixStyle,
    iconStyle,
    iconColor,
    helperStyle,
    counterStyle,
    placeholderTextColor,
    isDisabled,
    isReadOnly,
    isInvalid,
    showFloatingLabel,
    displayedHelperText,
    counterText,
  } = useTextField({ ...props, isFocused });
  const hasFooter = Boolean(displayedHelperText) || Boolean(counterText);

  return (
    <View style={textFieldStyles.wrapper}>
      <View style={ringStyle}>
        <View style={gapStyle}>
          <View style={fieldStyle}>
            <View style={contentStyle}>
              {showFloatingLabel && props.label ? <Text style={labelStyle}>{props.label}</Text> : null}
              <View style={inputRowStyle}>
                {leadingIcon ? (
                  <View style={iconStyle}>{tintNode(leadingIcon, iconColor)}</View>
                ) : null}
                {leadingText ? <Text style={affixStyle}>{leadingText}</Text> : null}
                <TextInput
                  accessibilityLabel={props.label}
                  accessibilityState={{ disabled: isDisabled }}
                  editable={!isDisabled && !isReadOnly}
                  keyboardType={keyboardType}
                  maxLength={props.maxLength}
                  onBlur={() => {
                    setIsFocused(false);
                    onBlur?.();
                  }}
                  onChangeText={props.onChangeText}
                  onFocus={() => {
                    setIsFocused(true);
                    onFocus?.();
                  }}
                  placeholder={showFloatingLabel ? props.placeholder : props.label}
                  placeholderTextColor={placeholderTextColor}
                  secureTextEntry={isSecure}
                  style={[textFieldStyles.input, inputStyle]}
                  testID={props.testID}
                  value={props.value}
                />
                {trailingText ? <Text style={affixStyle}>{trailingText}</Text> : null}
                {trailingIcon ? <View style={iconStyle}>{tintNode(trailingIcon, iconColor)}</View> : null}
              </View>
            </View>
          </View>
        </View>
      </View>
      {hasFooter ? (
        <View style={textFieldStyles.footer}>
          {displayedHelperText ? (
            // Error text interrupts VoiceOver/TalkBack immediately; plain
            // helper text is announced only when the screen reader reaches it.
            <Text accessibilityLiveRegion={isInvalid ? 'assertive' : 'none'} style={helperStyle}>
              {displayedHelperText}
            </Text>
          ) : null}
          {counterText ? <Text style={counterStyle}>{counterText}</Text> : null}
        </View>
      ) : null}
    </View>
  );
};

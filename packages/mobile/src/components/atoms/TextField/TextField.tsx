import { useState } from 'react';
import type { ReactElement } from 'react';
import { Text, TextInput, View } from 'react-native';

import { textFieldStyles } from './TextField.styles';
import type { ITextFieldProps } from './TextField.types';
import { useTextField } from './useTextField';

/**
 * React Native TextField — a single-line text input with a label, helper/error
 * text and an optional character counter.
 *
 * Focus is tracked locally (`TextInput` has no `:focus` pseudo-class) and fed
 * into `useTextField`, which resolves every color from the active theme via
 * `useThemeMode()`. See `packages/mobile/src/theme` for how the theme mode is
 * provided.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * <TextField label="Email" value={value} onChangeText={setValue} />
 * <TextField label="Email" value={value} onChangeText={setValue} errorMessage="Invalid email" />
 * <TextField label="Account" value="1234 5678" isReadOnly />
 * ```
 */
export const TextField = ({
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  keyboardType = 'default',
  isSecure = false,
  ...props
}: ITextFieldProps): ReactElement => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    containerStyle,
    inputStyle,
    labelStyle,
    helperStyle,
    counterStyle,
    placeholderTextColor,
    isDisabled,
    isReadOnly,
    displayedHelperText,
    counterText,
  } = useTextField({ ...props, isFocused });
  const hasFooter = Boolean(displayedHelperText) || Boolean(counterText);

  return (
    <View style={textFieldStyles.wrapper}>
      {props.label ? <Text style={labelStyle}>{props.label}</Text> : null}
      <View style={containerStyle}>
        <TextInput
          editable={!isDisabled && !isReadOnly}
          keyboardType={keyboardType}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onChangeText={onChangeText}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={isSecure}
          style={[textFieldStyles.input, inputStyle]}
          testID={props.testID}
          value={props.value}
        />
      </View>
      {hasFooter ? (
        <View style={textFieldStyles.footer}>
          {displayedHelperText ? <Text style={helperStyle}>{displayedHelperText}</Text> : null}
          {counterText ? <Text style={counterStyle}>{counterText}</Text> : null}
        </View>
      ) : null}
    </View>
  );
};

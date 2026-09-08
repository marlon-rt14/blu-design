import { OTP_FIELD_ACCESSIBILITY_LABEL } from '@dsm/shared';
import { useRef, useState } from 'react';
import type { ComponentRef, ReactElement } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { IOTPFieldProps } from './OTPField.types';
import { useOTPField } from './useOTPField';

/**
 * React Native OTPField — a one-time code as N boxes, one digit each.
 *
 * **The boxes are presentation. This renders one `TextInput`, never N.** That
 * is what lets iOS offer the code above the keyboard (`textContentType`
 * `oneTimeCode`) and Android autofill it from the SMS (`autoComplete`
 * `sms-otp`), and it is what bDS asks for outright — *"N inputs rompen el
 * pegado y el autorrelleno"*. The input is transparent and covers the whole
 * row, so a tap anywhere focuses it and brings the number pad up; the boxes
 * behind it are painted from `value`.
 *
 * There is no caret and no hover: the ring on the active box is the caret, and
 * a touch screen has no hover to begin with.
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
    autoFocus = false,
    accessibilityLabel = OTP_FIELD_ACCESSIBILITY_LABEL,
    length = 4,
    testID,
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  // `ComponentRef<typeof TextInput>`, not `TextInput`: on this version the
  // instance type is not the component class.
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const {
    wrapperStyle,
    rowStyle,
    boxStyle,
    activeBoxStyle,
    digitStyle,
    inputStyle,
    helperStyle,
    digits,
    activeIndex,
    isDisabled,
    isInvalid,
    displayedHelperText,
    sanitize,
  } = useOTPField({ ...props, isFocused });

  return (
    <View style={wrapperStyle}>
      {/* The row focuses the input on press, which makes the tap work regardless
          of whether the invisible TextInput on top of it received the touch
          itself. That is not paranoia: UIKit's hit testing is sensitive to how
          the input is hidden, and a field you cannot type into is the worst
          possible failure here. The input stays on top so that when it *does*
          get the touch, iOS handles it natively — including the long-press
          paste menu, which is how most people enter a code.

          `accessible={false}` keeps this from becoming a second node competing
          with the input for the screen reader. */}
      <Pressable
        accessible={false}
        onPress={() => inputRef.current?.focus()}
        style={rowStyle}
      >
        {digits.map((digit, index) => (
          <View
            // The index is the identity here: these are positions in a code, not
            // a reorderable list, and two boxes can hold the same digit.
            key={index}
            style={index === activeIndex ? [boxStyle, activeBoxStyle] : boxStyle}
            testID={testID ? `${testID}-digit-${index}` : undefined}
          >
            <Text style={digitStyle}>{digit}</Text>
          </View>
        ))}
        <TextInput
          accessibilityLabel={accessibilityLabel}
          autoFocus={autoFocus}
          // Android reads the code straight out of the SMS with this one.
          autoComplete="sms-otp"
          // The ring on the active box is the caret, so the real one would be a
          // second, competing one. Both of these go with the transparent text
          // colour in `inputStyle` — see the note there on why the input cannot
          // simply be `opacity: 0` on this platform.
          caretHidden
          editable={!isDisabled}
          keyboardType="number-pad"
          maxLength={length}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onChangeText={(raw) => onValueChange?.(sanitize(raw))}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          selectionColor="transparent"
          style={inputStyle}
          testID={testID}
          // iOS offers the code above the keyboard with this one.
          ref={inputRef}
          textContentType="oneTimeCode"
          value={value}
        />
      </Pressable>
      {displayedHelperText ? (
        <Text accessibilityLiveRegion={isInvalid ? 'assertive' : 'polite'} style={helperStyle}>
          {displayedHelperText}
        </Text>
      ) : null}
    </View>
  );
};

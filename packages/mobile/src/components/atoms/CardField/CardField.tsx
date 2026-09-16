import type { ReactElement } from 'react';
import { Text, TextInput, View } from 'react-native';

import { CardBrandLogo } from './CardBrandLogo';
import type { ICardFieldProps } from './CardField.types';
import { useCardField } from './useCardField';

/**
 * React Native CardField — one of the three fields a card needs.
 *
 * `part` picks which, and with it the keypad, the accepted length, the OS
 * autofill hint and whether the characters are masked. Everything else — the
 * box, the floating label, the helper line, the three sizes — is shared, which
 * is why the three parts are one component and not three.
 *
 * **It does not format the value**, and **the brand is detected, not chosen**.
 * Same as on web; see the shared contract.
 *
 * Two differences from the web implementation, both from the platform:
 *
 * - **No hover.** There is no pointer, and bDS's platform table says the axis
 *   exists in Figma only because the file documents both platforms.
 * - **Focus is the border, not a ring.** There is no `box-shadow` here, so the
 *   offset two-tone ring the web field draws has no equivalent; the border
 *   colour and the caret carry it, like every other `@dsm/mobile` field.
 *
 * @example
 * ```tsx
 * <CardField part="number" label="Numero de tarjeta" value={number} onChangeText={setNumber} />
 * <CardField part="expiry" label="Vencimiento" value={expiry} onChangeText={setExpiry} />
 * <CardField part="cvv" label="CVV" value={cvv} onChangeText={setCvv} error={cvvError} />
 * ```
 */
export const CardField = (props: ICardFieldProps): ReactElement => {
  const { label, value, onChangeText, readOnly = false, disabled = false, testID } = props;
  const {
    containerStyle,
    labelStyle,
    inputStyle,
    helperStyle,
    brandPlate,
    inputProps,
    brand,
    isFloating,
    message,
    handlers,
  } = useCardField(props);

  return (
    <View>
      <View style={containerStyle}>
        <View style={{ flex: 1 }}>
          {/* Floated, the label is a caption inside the same box, above the
              value — not a caption above the field, which is a different
              anatomy. Unfloated it is the placeholder instead, so only one of
              the two is ever on screen. */}
          <Text style={labelStyle}>{label}</Text>
          <TextInput
            {...inputProps}
            accessibilityHint={message?.isError === true ? message.text : undefined}
            // The field's own name, never a shared "Datos de la tarjeta": bDS
            // is explicit that a single label for the three "deja al lector de
            // pantalla sin saber en cual esta".
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            editable={!disabled && !readOnly}
            onBlur={handlers.onBlur}
            onChangeText={onChangeText}
            onFocus={handlers.onFocus}
            placeholder={isFloating ? undefined : label}
            style={inputStyle}
            testID={testID}
            value={value}
          />
        </View>
        {brand === undefined ? null : <CardBrandLogo {...brandPlate} brand={brand} />}
      </View>
      {message === undefined ? null : (
        // `role="alert"` announces the error when it appears. A helper line gets
        // no role: announcing it on every render is noise.
        <Text role={message.isError ? 'alert' : undefined} style={helperStyle}>
          {message.text}
        </Text>
      )}
    </View>
  );
};

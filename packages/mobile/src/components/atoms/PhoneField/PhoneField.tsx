import type { TCountryCode } from '@dsm/shared';
import type { ReactElement } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';

import { IconChevronDown, IconSearch } from '../../../icons';
import { CountryFlag } from './CountryFlag';
import type { IPhoneFieldProps } from './PhoneField.types';
import { usePhoneField } from './usePhoneField';

/**
 * Native PhoneField — a phone number with a country selector in front of it.
 *
 * What makes it a PhoneField rather than a TextField is **the data, not the
 * drawing**: a phone pad, a `telephoneNumber` autofill hint and a country whose
 * dial prefix rides along.
 *
 * **The country is one datum.** The flag and the prefix both come out of
 * `country`; in Figma they are two loose properties that can contradict each
 * other, which is that file's largest declared divergence.
 *
 * **It does not format the number.** `value` is what the user typed, ungrouped.
 *
 * ### Two controls, not one
 *
 * bDS is explicit: *"el selector de país es un control aparte del campo de
 * número"*. So the trigger is a `Pressable` with `accessibilityRole="button"`
 * and its own `size/target/min` height, and the number is a `TextInput` with its
 * own label. The prefix is folded into the input's
 * `accessibilityLabel` — there is no `aria-describedby` here, and *"el prefijo
 * tiene que llegar al lector junto con el número"*.
 *
 * ### The list is a bottom sheet with a search box
 *
 * There is no Menu on this platform; the sheet follows the Select's precedent,
 * for the same reason it gave. The rows are a `FlatList` rather than a mapped
 * `ScrollView`: at 243 countries, mounting every row up front is what the Select
 * gets away with at a dozen options and this component would not.
 *
 * @example
 * ```tsx
 * <PhoneField
 *   label="Numero de celular"
 *   value={phone}
 *   onChangeText={setPhone}
 *   country={country}
 *   onCountryChange={setCountry}
 * />
 * ```
 */
export const PhoneField = (props: IPhoneFieldProps): ReactElement => {
  const {
    label,
    value,
    onChangeText,
    onCountryChange,
    leadingContent = 'select',
    disabled = false,
    testID,
  } = props;
  // Half of Figma's 144 variants are `leadingContent=none`, where the field is
  // *"limpio, como un input de texto, y el valor arranca en el borde"*. It stays
  // a PhoneField: the keypad, the autofill hint and the validation are what make
  // it one, and none of them come from the prefix.
  const hasSelect = leadingContent === 'select';
  const {
    containerStyle,
    labelStyle,
    inputStyle,
    helperStyle,
    triggerStyle,
    dialCodeStyle,
    dividerStyle,
    chevronStyle,
    scrimStyle,
    sheetStyle,
    sheetHeaderStyle,
    searchWrapperStyle,
    searchInputStyle,
    searchPlaceholderColor,
    rowStyle,
    rowLabelStyle,
    rowDialCodeStyle,
    emptyStyle,
    flag,
    placeholderColor,
    inputProps,
    country,
    dialCode,
    countryRows,
    isOpen,
    isFloating,
    search,
    message,
    setSearch,
    open,
    close,
    handlers,
  } = usePhoneField(props);

  const commit = (next: TCountryCode): void => {
    onCountryChange?.(next);
    close();
  };

  return (
    <View>
      <View style={containerStyle}>
        {hasSelect ? (
          <>
            <Pressable
              accessibilityLabel={`País: ${countryRows.find((row) => row.code === country)?.label ?? country}`}
              accessibilityRole="button"
              accessibilityState={{ disabled, expanded: isOpen }}
              disabled={disabled}
              onPress={isOpen ? close : open}
              style={triggerStyle}
            >
              <CountryFlag {...flag} announce={false} country={country} />
              <Text style={dialCodeStyle}>{dialCode}</Text>
              <View style={chevronStyle}>
                <IconChevronDown color={disabled ? 'disabled' : 'secondary'} size="sm" />
              </View>
            </Pressable>
            <View style={dividerStyle} />
          </>
        ) : null}
        <View style={{ flex: 1 }}>
          {isFloating ? <Text style={labelStyle}>{label}</Text> : null}
          <TextInput
            {...inputProps}
            // The prefix travels with the name, since there is no separate
            // description node on this platform — and only when there is one.
            accessibilityLabel={hasSelect ? `${label}, ${dialCode}` : label}
            editable={!disabled}
            onBlur={handlers.onBlur}
            onChangeText={onChangeText}
            onFocus={handlers.onFocus}
            // Floated, the label is already on screen; unfloated it *is* the
            // placeholder. One string, never two to keep in step.
            placeholder={isFloating ? undefined : label}
            placeholderTextColor={placeholderColor}
            style={inputStyle}
            testID={testID}
            value={value}
          />
        </View>
      </View>
      {message === undefined ? null : (
        <Text accessibilityLiveRegion={message.isError ? 'assertive' : 'none'} style={helperStyle}>
          {message.text}
        </Text>
      )}

      {/* No trigger, no sheet: with `leadingContent="none"` there is nothing
          that could open it. */}
      <Modal animationType="slide" onRequestClose={close} transparent visible={hasSelect && isOpen}>
        <Pressable onPress={close} style={scrimStyle}>
          {/* Swallows the tap so a press inside the sheet does not reach the
              scrim behind it and close it. */}
          <Pressable onPress={(event) => event.stopPropagation()} style={sheetStyle}>
            <Text style={sheetHeaderStyle}>{label}</Text>
            <View style={searchWrapperStyle}>
              <IconSearch color="secondary" size="sm" />
              <TextInput
                accessibilityLabel="Buscar país o código"
                onChangeText={setSearch}
                placeholder="Buscar país o código"
                placeholderTextColor={searchPlaceholderColor}
                style={searchInputStyle}
                value={search}
              />
            </View>
            <FlatList
              data={countryRows}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(row) => row.code}
              ListEmptyComponent={<Text style={emptyStyle}>Sin resultados</Text>}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: item.code === country }}
                  onPress={() => commit(item.code)}
                  style={rowStyle}
                >
                  {/* Silent: the row's own label already says the country, and a
                      second copy would read every country twice. */}
                  <CountryFlag {...flag} announce={false} country={item.code} />
                  <Text numberOfLines={1} style={rowLabelStyle}>
                    {item.label}
                  </Text>
                  <Text style={rowDialCodeStyle}>{item.dialCode}</Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

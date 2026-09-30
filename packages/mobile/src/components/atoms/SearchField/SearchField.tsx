import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { IconSearch, IconXCircle } from '../../../icons';
import type { ISearchFieldProps } from './SearchField.types';
import { useSearchField } from './useSearchField';

/** Accessible name of the clear control. */
const CLEAR_LABEL = 'Borrar búsqueda';

/**
 * React Native SearchField — the native search bar.
 *
 * Grey, borderless, pill. `clearButtonMode` stays off so the platform clear
 * glyph does not stack on top of ours. The clear control is `IconXCircle`,
 * with `hitSlop` out to `size/target/min`. `returnKeyType="search"` fires
 * `onSubmit`.
 *
 * The search glyph is decorative. `placeholder` is the accessible name.
 */
export const SearchField = ({
  value,
  placeholder,
  onChangeText,
  onClear,
  onSubmit,
  trailingAccessory,
  autoFocus = false,
  testID,
  ...rest
}: ISearchFieldProps): ReactElement => {
  const [isFocused, setIsFocused] = useState(false);
  const { fieldStyle, inputStyle, iconColor, placeholderColor, clearHitSlop, isDisabled } = useSearchField({
    ...rest,
    value,
    placeholder,
    autoFocus,
    isFocused,
  });

  const hasValue = value.length > 0;

  const handleClear = (): void => {
    if (onClear) {
      onClear();
      return;
    }
    onChangeText?.('');
  };

  return (
    <View style={fieldStyle}>
      <IconSearch size="sm" tintColor={iconColor} />
      <TextInput
        style={inputStyle}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        accessibilityLabel={placeholder}
        editable={!isDisabled}
        autoFocus={autoFocus}
        testID={testID}
        returnKeyType="search"
        clearButtonMode="never"
        onChangeText={onChangeText}
        onSubmitEditing={() => onSubmit?.(value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {hasValue ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={CLEAR_LABEL}
          accessibilityState={{ disabled: isDisabled }}
          disabled={isDisabled}
          hitSlop={clearHitSlop}
          onPress={handleClear}
        >
          <IconXCircle size="sm" tintColor={iconColor} />
        </Pressable>
      ) : (
        trailingAccessory
      )}
    </View>
  );
};

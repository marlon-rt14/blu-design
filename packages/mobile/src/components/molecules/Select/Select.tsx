import type { TIconSize, TSelectSize } from '@dsm/shared';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { FieldIcon } from '../../atoms/TextField/FieldIcon';
import { IconCheck, IconChevronDown, IconSearch } from '../../../icons';
import { ListItem } from '../ListItem';
import type { ISelectProps } from './Select.types';
import { useSelect } from './useSelect';

/** Select's field steps map onto Icon's the same way TextField's do: sm/md share `sm`, lg steps to `md`. */
const iconSizeForField = (size: TSelectSize): TIconSize => (size === 'lg' ? 'md' : 'sm');

/**
 * Mobile Select — a field whose value comes from a fixed catalog through a
 * native bottom sheet, not from typing. If real text filtering is needed,
 * this is not the right component — that is Combobox.
 *
 * The sheet is pinned to the bottom edge on purpose: a desktop-style
 * dropdown on a phone leaves the list flush against the border with no room
 * for a thumb. `isOpen` is never a prop — it is local state, same case as
 * `showMenu` on PhoneField.
 *
 * `isSearchable` adds a search box inside the sheet that narrows which rows
 * show — the field itself stays a non-editable button either way.
 *
 * @example
 * ```tsx
 * <Select
 *   label="País"
 *   options={[{ value: 'ec', label: 'Ecuador' }, { value: 'pe', label: 'Perú' }]}
 *   value={country}
 *   onChange={setCountry}
 * />
 * ```
 */
export const Select = (props: ISelectProps): ReactElement => {
  const {
    label,
    options,
    value,
    size = 'md',
    placeholder,
    leadingIcon,
    helperText,
    error,
    readOnly = false,
    disabled = false,
    isSearchable = false,
    onChange,
    testID,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isInteractive = !disabled && !readOnly;
  const hasFooter = Boolean(error) || Boolean(helperText);
  const selectedOption = options.find((option) => option.value === value);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleOptions =
    isSearchable && normalizedQuery
      ? options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
      : options;

  const {
    fieldStyle,
    contentStyle,
    labelStyle,
    valueStyle,
    iconColor,
    helperStyle,
    scrimStyle,
    sheetStyle,
    sheetHeaderStyle,
    searchWrapperStyle,
    searchInputStyle,
    searchPlaceholderColor,
    noOptionsStyle,
    showFloatingLabel,
    hasError,
  } = useSelect({ ...props, isPressed, isFocused: false, isOpen });

  const openSheet = (): void => {
    if (!isInteractive) return;
    setSearchQuery('');
    setIsOpen(true);
  };

  const closeSheet = (): void => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const commit = (nextValue: string): void => {
    onChange(nextValue);
    closeSheet();
  };

  return (
    <View>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: isOpen }}
        disabled={!isInteractive}
        onPress={openSheet}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={fieldStyle}
        testID={testID}
      >
        {leadingIcon ? <FieldIcon color={disabled ? 'disabled' : 'secondary'} name={leadingIcon} size={iconSizeForField(size)} tintColor={iconColor} /> : null}
        <View style={contentStyle}>
          {showFloatingLabel ? <Text style={labelStyle}>{label}</Text> : null}
          <Text numberOfLines={1} style={valueStyle}>
            {selectedOption?.label ?? placeholder ?? label}
          </Text>
        </View>
        <IconChevronDown color={disabled ? 'disabled' : 'secondary'} size={iconSizeForField(size)} />
      </Pressable>
      {hasFooter ? (
        <Text accessibilityLiveRegion={hasError ? 'assertive' : 'none'} style={helperStyle}>
          {error ?? helperText}
        </Text>
      ) : null}

      <Modal animationType="slide" onRequestClose={closeSheet} transparent visible={isOpen}>
        <Pressable onPress={closeSheet} style={scrimStyle}>
          <Pressable onPress={(event) => event.stopPropagation()} style={sheetStyle}>
            <Text style={sheetHeaderStyle}>{label}</Text>
            {isSearchable ? (
              <View style={searchWrapperStyle}>
                <IconSearch size={iconSizeForField(size)} tintColor={iconColor} />
                <TextInput
                  accessibilityLabel={`Buscar en ${label}`}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar..."
                  placeholderTextColor={searchPlaceholderColor}
                  style={searchInputStyle}
                  value={searchQuery}
                />
              </View>
            ) : null}
            <ScrollView>
              {visibleOptions.length === 0 ? (
                <Text style={noOptionsStyle}>Sin resultados</Text>
              ) : (
                visibleOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <ListItem
                      icon={option.icon}
                      key={option.value}
                      label={option.label}
                      leadingContent={option.icon ? 'icon' : 'none'}
                      onPress={() => commit(option.value)}
                      showTrailing={isSelected}
                      trailing={isSelected ? <IconCheck color="brand" size="sm" /> : null}
                    />
                  );
                })
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

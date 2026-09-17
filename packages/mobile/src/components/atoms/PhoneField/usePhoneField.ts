import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
  countryDialCode,
  countryMatches,
  countryName,
  phoneFieldTokens,
  sortCountries,
} from '@dsm/shared';
import type { TCountryCode } from '@dsm/shared';
import { useMemo, useState } from 'react';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IPhoneFieldProps } from './PhoneField.types';

/** Everything the native PhoneField needs to render. */
interface IUsePhoneFieldResult {
  containerStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  inputStyle: StyleProp<TextStyle>;
  helperStyle: StyleProp<TextStyle>;
  triggerStyle: StyleProp<ViewStyle>;
  dialCodeStyle: StyleProp<TextStyle>;
  dividerStyle: StyleProp<ViewStyle>;
  chevronStyle: StyleProp<ViewStyle>;
  scrimStyle: StyleProp<ViewStyle>;
  sheetStyle: StyleProp<ViewStyle>;
  sheetHeaderStyle: StyleProp<TextStyle>;
  searchWrapperStyle: StyleProp<ViewStyle>;
  searchInputStyle: StyleProp<TextStyle>;
  searchPlaceholderColor: string;
  rowStyle: StyleProp<ViewStyle>;
  rowLabelStyle: StyleProp<TextStyle>;
  rowDialCodeStyle: StyleProp<TextStyle>;
  emptyStyle: StyleProp<TextStyle>;
  /** Props for the flag, both in the trigger and in every row. */
  flag: { size: number; borderColor: string; radius: number; borderWidth: number };
  placeholderColor: string;
  /** `TextInput` props that come from the component, not from the caller. */
  inputProps: Pick<TextInputProps, 'keyboardType' | 'textContentType' | 'autoComplete'>;
  /** The country in effect, after the default. */
  country: TCountryCode;
  dialCode: string;
  /**
   * The countries to list, sorted by localized name and already filtered by the
   * search box.
   *
   * Same shape as the web hook's, and for the same reason: the rows need a flag
   * element, and building JSX here would make this the only `use*.tsx` among the
   * repo's hooks. The component renders them.
   */
  countryRows: { code: TCountryCode; label: string; dialCode: string }[];
  isOpen: boolean;
  isFloating: boolean;
  search: string;
  message: { text: string; isError: boolean } | undefined;
  setSearch: (value: string) => void;
  open: () => void;
  close: () => void;
  handlers: { onFocus: () => void; onBlur: () => void };
}

/**
 * Resolves the native PhoneField's styles, its country list and its sheet
 * state.
 *
 * **No hover**, unlike the web hook — there is no pointer on a touch screen, and
 * `overlay-hover` is the one colour token this platform never reads.
 *
 * **The list is a bottom sheet, not an anchored panel.** bDS's platform table
 * says so, and it is the same call the Select already made: *"un dropdown de
 * escritorio en un teléfono deja la lista pegada al borde, sin espacio para el
 * pulgar"*.
 *
 * @param props - The PhoneField props.
 * @returns Styles, the resolved country, the filtered rows and the handlers.
 */
export const usePhoneField = ({
  value,
  country = DEFAULT_COUNTRY_CODE,
  countries = COUNTRY_CODES,
  size = 'md',
  helperText,
  error,
  disabled = false,
}: IPhoneFieldProps): IUsePhoneFieldResult => {
  const mode = useThemeMode();
  const { colors, size: sizes, dimension, typography } = phoneFieldTokens[mode];
  const labelFont = useFontFamily(typography.label.fontWeight);
  const valueFont = useFontFamily(typography.value.fontWeight);
  const helperFont = useFontFamily(typography.helper.fontWeight);

  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const metrics = sizes[size];
  const hasValue = value !== '';
  const hasError = error !== undefined && error !== '';
  const isFloating = hasValue && size !== 'sm';

  const borderColor = disabled
    ? colors.container.borderDisabled
    : hasError
      ? colors.container.borderError
      : isFocused || isOpen
        ? colors.container.borderFocus
        : colors.container.border;

  const countryRows = useMemo(
    () =>
      sortCountries(countries)
        .filter((code) => countryMatches(code, search))
        .map((code) => ({ code, label: countryName(code), dialCode: countryDialCode(code) })),
    [countries, search],
  );

  return {
    containerStyle: {
      alignItems: 'center',
      backgroundColor: disabled ? colors.container.backgroundDisabled : colors.container.background,
      borderColor,
      borderRadius: dimension.borderRadius,
      borderWidth: dimension.borderWidth,
      columnGap: dimension.valueGap,
      flexDirection: 'row',
      height: metrics.height,
      paddingHorizontal: metrics.paddingHorizontal,
    },
    labelStyle: {
      color: disabled ? colors.label.disabled : colors.label.default,
      fontFamily: labelFont,
      fontSize: typography.label.fontSize,
      letterSpacing: typography.label.letterSpacing,
      // Pixels, not a ratio: `lineHeight` is a multiplier in CSS and an absolute
      // length on this platform.
      lineHeight: typography.label.fontSize * typography.label.lineHeightRatio,
    },
    inputStyle: {
      color: disabled
        ? colors.value.disabled
        : hasValue
          ? colors.value.filled
          : colors.value.placeholder,
      flex: 1,
      fontFamily: valueFont,
      fontSize: typography.value.fontSize,
      lineHeight: typography.value.fontSize * typography.value.lineHeightRatio,
      // A `TextInput` ships with its own padding on Android; the field's box is
      // what sets the height.
      padding: 0,
    },
    helperStyle: {
      color: disabled
        ? colors.helper.disabled
        : hasError
          ? colors.helper.error
          : colors.helper.default,
      fontFamily: helperFont,
      fontSize: typography.helper.fontSize,
      lineHeight: typography.helper.fontSize * typography.helper.lineHeightRatio,
      marginTop: dimension.helperGap,
    },
    triggerStyle: {
      alignItems: 'center',
      columnGap: dimension.prefixGap,
      flexDirection: 'row',
      // The trigger is its own control with its own target: `size/target/min`
      // (48) as a minimum height, which grows the touch area without moving the
      // 32-tall `sm` box — the same call the web trigger makes with
      // `min-block-size`.
      minHeight: dimension.minTouchTarget,
    },
    dialCodeStyle: {
      color: disabled
        ? colors.prefix.dialCodeDisabled
        : hasValue
          ? colors.prefix.dialCodeFilled
          : colors.prefix.dialCode,
      fontFamily: valueFont,
      fontSize: typography.value.fontSize,
      lineHeight: typography.value.fontSize * typography.value.lineHeightRatio,
    },
    dividerStyle: {
      backgroundColor: colors.prefix.divider,
      height: dimension.dividerHeight,
      width: dimension.dividerWidth,
    },
    chevronStyle: {
      // Rotating rather than swapping glyphs, same as web. There is no
      // transition here: a `transform` on a plain `View` is not animated, and
      // animating it would mean an `Animated.View` for 120ms of travel.
      //
      // **Always an array, never `undefined`.** When a style key disappears
      // between renders, React Native sends `null` to the native side to clear
      // it, and `processTransform`'s `_validateTransforms(null).forEach` throws
      // — *"Cannot read property 'forEach' of null"* on the render that closes
      // the sheet. `0deg` is the identity, so the key never leaves.
      transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
    },
    scrimStyle: {
      // The one literal colour in the component, and the Select's own: the
      // export has no scrim token, `elevation/overlay/*` are the shadows.
      backgroundColor: 'rgba(7, 15, 37, 0.4)',
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheetStyle: {
      backgroundColor: colors.menu.surface,
      borderColor: colors.menu.border,
      borderTopLeftRadius: dimension.menuRadius,
      borderTopRightRadius: dimension.menuRadius,
      borderWidth: dimension.borderWidth,
      // The bottom edge is off screen; a rule there would read as a seam.
      borderBottomWidth: 0,
      maxHeight: '70%',
      paddingBottom: metrics.paddingHorizontal,
    },
    sheetHeaderStyle: {
      color: colors.label.default,
      fontFamily: labelFont,
      fontSize: typography.label.fontSize,
      lineHeight: typography.label.fontSize * typography.label.lineHeightRatio,
      padding: metrics.paddingHorizontal,
    },
    searchWrapperStyle: {
      alignItems: 'center',
      borderColor: colors.menu.border,
      borderTopWidth: dimension.borderWidth,
      columnGap: dimension.prefixGap,
      flexDirection: 'row',
      paddingHorizontal: metrics.paddingHorizontal,
      paddingVertical: dimension.helperGap * 2,
    },
    searchInputStyle: {
      color: colors.value.filled,
      flex: 1,
      fontFamily: valueFont,
      fontSize: typography.value.fontSize,
      lineHeight: typography.value.fontSize * typography.value.lineHeightRatio,
      padding: 0,
    },
    searchPlaceholderColor: colors.value.placeholder,
    rowStyle: {
      alignItems: 'center',
      columnGap: dimension.valueGap,
      flexDirection: 'row',
      minHeight: dimension.minTouchTarget,
      paddingHorizontal: metrics.paddingHorizontal,
    },
    rowLabelStyle: {
      color: colors.value.filled,
      flex: 1,
      fontFamily: valueFont,
      fontSize: typography.value.fontSize,
      lineHeight: typography.value.fontSize * typography.value.lineHeightRatio,
    },
    rowDialCodeStyle: {
      color: colors.prefix.dialCode,
      fontFamily: valueFont,
      fontSize: typography.value.fontSize,
      lineHeight: typography.value.fontSize * typography.value.lineHeightRatio,
    },
    emptyStyle: {
      color: colors.helper.default,
      fontFamily: helperFont,
      fontSize: typography.helper.fontSize,
      lineHeight: typography.helper.fontSize * typography.helper.lineHeightRatio,
      padding: metrics.paddingHorizontal,
    },
    flag: {
      size: dimension.iconSize,
      borderColor: colors.prefix.flagBorder,
      radius: dimension.flagRadius,
      borderWidth: dimension.borderWidth,
    },
    placeholderColor: disabled ? colors.value.disabled : colors.value.placeholder,
    inputProps: {
      // A phone pad, not a numeric one: the number is dialable, so `*` and `#`
      // belong on it.
      keyboardType: 'phone-pad',
      textContentType: 'telephoneNumber',
      autoComplete: 'tel',
    },
    country,
    dialCode: countryDialCode(country),
    countryRows,
    isOpen,
    isFloating,
    search,
    message: hasError
      ? { text: error, isError: true }
      : helperText !== undefined && helperText !== ''
        ? { text: helperText, isError: false }
        : undefined,
    setSearch,
    open: () => {
      if (disabled) return;
      setSearch('');
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
      setSearch('');
    },
    handlers: {
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    },
  };
};

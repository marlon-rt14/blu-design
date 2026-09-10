import { selectTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ISelectProps } from './Select.types';

/** Params of {@link useSelect}: the Select props plus the live interaction state. */
interface IUseSelectParams extends ISelectProps {
  isPressed: boolean;
  /** Only reachable through react-native-web; a no-op on iOS/Android. */
  isFocused: boolean;
  isOpen: boolean;
}

interface IUseSelectResult {
  fieldStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  valueStyle: StyleProp<TextStyle>;
  iconColor: string;
  helperStyle: StyleProp<TextStyle>;
  /** Dimmed backdrop behind the sheet. */
  scrimStyle: StyleProp<ViewStyle>;
  sheetStyle: StyleProp<ViewStyle>;
  sheetHeaderStyle: StyleProp<TextStyle>;
  searchWrapperStyle: StyleProp<ViewStyle>;
  searchInputStyle: StyleProp<TextStyle>;
  searchPlaceholderColor: string;
  noOptionsStyle: StyleProp<TextStyle>;
  hasError: boolean;
  showFloatingLabel: boolean;
}

/**
 * Resolves every style the Select needs. There is no `hover` on this
 * platform — the state ladder is `default`/`pressed`/`focus` only, and the
 * menu itself is a native bottom sheet rather than an anchored popover.
 */
export const useSelect = ({
  size = 'md',
  disabled = false,
  readOnly = false,
  error,
  value,
  options,
  isPressed,
  isFocused,
}: IUseSelectParams): IUseSelectResult => {
  const mode = useThemeMode();
  const tokens = selectTokens[mode];
  const font = resolveMulishFontFamily(tokens.typography.value.fontWeight);
  const helperFont = resolveMulishFontFamily(tokens.typography.helper.fontWeight);
  const labelFont = resolveMulishFontFamily(tokens.typography.label.fontWeight);
  const hasError = Boolean(error);
  const sizeTokens = tokens.sizes[size];
  const isFilled = options.some((option) => option.value === value);
  const showFloatingLabel = isFilled;

  const borderColor = disabled
    ? tokens.colors.container.borderDisabled
    : readOnly
      ? tokens.colors.container.borderReadOnly
      : hasError
        ? tokens.colors.container.borderError
        : isFocused
          ? tokens.colors.container.borderFocus
          : tokens.colors.container.border;

  const backgroundColor = disabled
    ? tokens.colors.container.backgroundDisabled
    : readOnly
      ? tokens.colors.container.backgroundReadOnly
      : isPressed
        ? tokens.colors.container.backgroundPressed
        : tokens.colors.container.background;

  const valueColor = disabled
    ? tokens.colors.value.disabled
    : readOnly
      ? tokens.colors.value.readOnly
      : isFilled
        ? tokens.colors.value.filled
        : tokens.colors.value.placeholder;

  return {
    fieldStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: tokens.dimension.contentGap,
      width: '100%',
      minHeight: sizeTokens.minHeight,
      paddingHorizontal: tokens.dimension.paddingHorizontal,
      paddingVertical: sizeTokens.paddingVertical,
      borderRadius: tokens.dimension.borderRadius,
      borderWidth: tokens.dimension.borderWidth,
      borderColor,
      backgroundColor,
    },
    contentStyle: {
      flex: 1,
      justifyContent: 'center',
      minWidth: 0,
    },
    labelStyle: {
      width: '100%',
      fontFamily: labelFont,
      fontSize: tokens.typography.label.fontSize,
      lineHeight: tokens.typography.label.lineHeight,
      color: disabled ? tokens.colors.label.disabled : tokens.colors.label.default,
    },
    valueStyle: {
      width: '100%',
      fontFamily: font,
      fontSize: tokens.typography.value.fontSize,
      lineHeight: tokens.typography.value.lineHeight,
      color: valueColor,
    },
    iconColor: disabled ? tokens.colors.icon.disabled : tokens.colors.icon.default,
    helperStyle: {
      marginTop: tokens.dimension.footerSlotGap,
      fontFamily: helperFont,
      fontSize: tokens.typography.helper.fontSize,
      lineHeight: tokens.typography.helper.lineHeight,
      color: disabled ? tokens.colors.helper.disabled : hasError ? tokens.colors.helper.error : tokens.colors.helper.default,
    },
    scrimStyle: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(7, 15, 37, 0.4)',
    },
    sheetStyle: {
      maxHeight: '70%',
      borderTopLeftRadius: tokens.dimension.menuBorderRadius,
      borderTopRightRadius: tokens.dimension.menuBorderRadius,
      backgroundColor: tokens.colors.menu.background,
      borderColor: tokens.colors.menu.border,
      borderWidth: tokens.dimension.borderWidth,
      borderBottomWidth: 0,
      paddingBottom: tokens.dimension.paddingHorizontal,
    },
    sheetHeaderStyle: {
      padding: tokens.dimension.paddingHorizontal,
      fontFamily: labelFont,
      fontSize: tokens.typography.label.fontSize,
      lineHeight: tokens.typography.label.lineHeight,
      color: tokens.colors.label.default,
    },
    searchWrapperStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: tokens.dimension.contentGap,
      paddingHorizontal: tokens.dimension.paddingHorizontal,
      paddingVertical: tokens.dimension.searchPaddingVertical,
      borderTopWidth: tokens.dimension.borderWidth,
      borderColor: tokens.colors.menu.border,
    },
    searchInputStyle: {
      flex: 1,
      padding: 0,
      fontFamily: font,
      fontSize: tokens.typography.value.fontSize,
      lineHeight: tokens.typography.value.lineHeight,
      color: tokens.colors.value.filled,
    },
    searchPlaceholderColor: tokens.colors.value.placeholder,
    noOptionsStyle: {
      padding: tokens.dimension.paddingHorizontal,
      fontFamily: helperFont,
      fontSize: tokens.typography.helper.fontSize,
      lineHeight: tokens.typography.helper.lineHeight,
      color: tokens.colors.helper.default,
    },
    hasError,
    showFloatingLabel,
  };
};

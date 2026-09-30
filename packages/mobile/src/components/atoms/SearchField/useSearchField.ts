import { searchFieldTokens } from '@dsm/shared';
import type { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ISearchFieldProps } from './SearchField.types';

/** Params of {@link useSearchField}: props plus the live focus state. No hover. */
interface IUseSearchFieldParams extends ISearchFieldProps {
  isFocused: boolean;
}

/** Styles the native SearchField needs to render. */
interface IUseSearchFieldResult {
  fieldStyle: StyleProp<ViewStyle>;
  inputStyle: StyleProp<TextStyle>;
  iconColor: string;
  placeholderColor: string;
  clearHitSlop: Insets;
  isDisabled: boolean;
}

/**
 * Resolves the native SearchField: grey fill (`color/fill/neutral/subtle`),
 * no border, pill radius. Focus draws an accent border and no outer ring.
 */
export const useSearchField = ({
  size = 'md',
  isDisabled = false,
  isFocused,
}: IUseSearchFieldParams): IUseSearchFieldResult => {
  const mode = useThemeMode();
  const tokens = searchFieldTokens[mode];
  const sizeTokens = tokens.sizes[size];
  const type = tokens.typography[size];
  const fontFamily = resolveMulishFontFamily(type.fontWeight);

  const backgroundColor = isDisabled
    ? tokens.colors.container.backgroundDisabled
    : tokens.colors.container.backgroundNative;

  const showFocusBorder = isFocused && !isDisabled;
  const borderColor = showFocusBorder ? tokens.colors.container.borderFocus : 'transparent';

  const valueColor = isDisabled ? tokens.colors.value.disabled : tokens.colors.value.filled;
  const placeholderColor = isDisabled ? tokens.colors.value.disabled : tokens.colors.value.placeholder;
  const iconColor = isDisabled ? tokens.colors.icon.disabled : tokens.colors.icon.default;

  const fieldStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: sizeTokens.minHeight,
    paddingLeft: sizeTokens.paddingX,
    paddingRight: sizeTokens.paddingX,
    gap: tokens.dimension.gap,
    borderRadius: tokens.dimension.nativeRadius,
    borderWidth: tokens.dimension.borderWidth,
    borderColor,
    backgroundColor,
  };

  // `outlineStyle: 'none'` is CSS for the RN-web <input>. RN's TextStyle only
  // allows solid/dotted/dashed, so the assertion is the seam.
  const inputStyle = {
    flex: 1,
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: valueColor,
    fontFamily,
    fontSize: type.fontSize,
    lineHeight: type.lineHeight,
    outlineWidth: 0,
    outlineStyle: 'none',
  } as unknown as TextStyle;

  const iconBox = tokens.dimension.iconSize;
  const slop = Math.max(0, (tokens.dimension.targetMin - iconBox) / 2);
  const clearHitSlop: Insets = { top: slop, right: slop, bottom: slop, left: slop };

  return {
    fieldStyle,
    inputStyle,
    iconColor,
    placeholderColor,
    clearHitSlop,
    isDisabled,
  };
};

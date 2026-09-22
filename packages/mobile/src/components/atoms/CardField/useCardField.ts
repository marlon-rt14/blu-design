import { CARD_FIELD_PART_RULES, cardFieldTokens, detectCardBrand } from '@dsm/shared';
import type { TCardBrand, TCardFieldPart } from '@dsm/shared';
import { useState } from 'react';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { ICardFieldProps } from './CardField.types';

/**
 * The autofill hint each part gives the OS.
 *
 * `'none'` for the CVV, deliberately: React Native 0.87 *does* offer
 * `creditCardSecurityCode`, and asking for it is exactly what would let the OS
 * store and refill the value — which bDS forbids. *"El CVV no se guarda ni se
 * autocompleta. Es la regla del medio de pago, no una decisión de diseño."*
 */
const CONTENT_TYPE: Record<TCardFieldPart, TextInputProps['textContentType']> = {
  number: 'creditCardNumber',
  expiry: 'creditCardExpiration',
  cvv: 'none',
};

/** Everything the native CardField needs to render. */
interface IUseCardFieldResult {
  containerStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  inputStyle: StyleProp<TextStyle>;
  helperStyle: StyleProp<TextStyle>;
  brandPlate: {
    plateWidth: number;
    plateHeight: number;
    borderRadius: number;
    borderWidth: number;
    background: string;
    borderColor: string;
  };
  /** `TextInput` props that come from `part`, not from the caller. */
  inputProps: Pick<
    TextInputProps,
    'keyboardType' | 'maxLength' | 'secureTextEntry' | 'textContentType'
  >;
  brand: TCardBrand | undefined;
  isFloating: boolean;
  message: { text: string; isError: boolean } | undefined;
  handlers: { onFocus: () => void; onBlur: () => void };
}

/**
 * Resolves the native CardField's styles and input wiring.
 *
 * **No hover**, unlike the web hook: there is no pointer on a touch screen, and
 * bDS's platform table says so — the axis exists in Figma only because the file
 * documents both platforms.
 *
 * @param props - The CardField props.
 * @returns Styles, the input's part-derived props, and the focus handlers.
 */
export const useCardField = (props: ICardFieldProps): IUseCardFieldResult => {
  const { part, value, size = 'md', helperText, error, readOnly = false, disabled = false } = props;
  // The one narrowing the discriminated union costs — `brand` lives only on the
  // `number` arm, which is the point of the union.
  const givenBrand = props.part === 'number' ? props.brand : undefined;

  const mode = useThemeMode();
  const { colors, size: sizes, dimension, typography } = cardFieldTokens[mode];
  const labelFont = useFontFamily(typography.label.fontWeight);
  const valueFont = useFontFamily(typography.value.fontWeight);
  const [isFocused, setIsFocused] = useState(false);

  const rules = CARD_FIELD_PART_RULES[part];
  const metrics = sizes[size];
  const hasValue = value !== '';
  const hasError = error !== undefined && error !== '';
  const isFloating = hasValue && size !== 'sm';
  // The plate is a card, so its width is its height times the 3:2 ratio. Named
  // once because the mark's width is derived from it in turn.
  const brandPlateWidth = metrics.brandPlateHeight * dimension.brandPlateAspect;

  const borderColor = disabled
    ? colors.container.borderDisabled
    : hasError
      ? colors.container.borderError
      : readOnly
        ? colors.container.borderReadOnly
        : isFocused
          ? colors.container.borderFocus
          : colors.container.border;

  return {
    containerStyle: {
      alignItems: 'center',
      backgroundColor: disabled
        ? colors.container.backgroundDisabled
        : readOnly
          ? colors.container.backgroundReadOnly
          : colors.container.background,
      borderColor,
      borderRadius: dimension.borderRadius,
      borderWidth: dimension.borderWidth,
      flexDirection: 'row',
      gap: dimension.brandGap,
      height: metrics.height,
      paddingHorizontal: dimension.paddingHorizontal,
      paddingVertical: dimension.paddingVertical,
      // The offset two-tone ring is a web construction — there is no
      // `box-shadow` ring here. On this platform focus is the border colour plus
      // the caret, which is what every field in `@dsm/mobile` does.
    },
    labelStyle: {
      color: disabled ? colors.label.disabled : colors.label.default,
      display: isFloating ? 'flex' : 'none',
      fontFamily: labelFont,
      fontSize: typography.label.fontSize,
      letterSpacing: typography.label.letterSpacing,
      // Pixels, not a ratio: `lineHeight` is a multiplier in CSS and an absolute
      // length on React Native.
      lineHeight: typography.label.fontSize * typography.label.lineHeightRatio,
    },
    inputStyle: {
      color: disabled
        ? colors.value.disabled
        : readOnly
          ? colors.value.readOnly
          : hasValue
            ? colors.value.filled
            : colors.value.placeholder,
      flex: 1,
      fontFamily: valueFont,
      fontSize: typography.value.fontSize,
      lineHeight: typography.value.fontSize * typography.value.lineHeightRatio,
      // A `TextInput` ships with platform padding that would push the value off
      // the box's own padding.
      padding: 0,
    },
    helperStyle: {
      color: disabled
        ? colors.helper.disabled
        : hasError
          ? colors.helper.error
          : colors.helper.default,
      fontFamily: valueFont,
      fontSize: typography.helper.fontSize,
      lineHeight: typography.helper.fontSize * typography.helper.lineHeightRatio,
      marginTop: dimension.helperGap,
    },
    brandPlate: {
      plateHeight: metrics.brandPlateHeight,
      plateWidth: brandPlateWidth,
      // The rule, not a coincidence: the mark is a fraction of the plate's
      // width, measured at exactly a half on all three sizes.
      borderRadius: dimension.brandRadius,
      borderWidth: dimension.borderWidth,
      background: colors.brandIcon.background,
      borderColor: colors.brandIcon.border,
    },
    inputProps: {
      keyboardType: 'number-pad',
      maxLength: rules.maxLength,
      secureTextEntry: rules.secure,
      textContentType: CONTENT_TYPE[part],
    },
    brand: part === 'number' ? (givenBrand ?? detectCardBrand(value)) : undefined,
    isFloating,
    message: hasError
      ? { text: error, isError: true }
      : helperText !== undefined && helperText !== ''
        ? { text: helperText, isError: false }
        : undefined,
    handlers: {
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    },
  };
};

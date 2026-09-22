import { CARD_FIELD_PART_RULES, cardFieldTokens, detectCardBrand } from '@dsm/shared';
import type { TCardBrand, TCardFieldPart } from '@dsm/shared';
import { useState } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';

import { usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ICardFieldProps } from './CardField.types';

/** The autocomplete hint each part needs for the browser's saved-card fill to work. */
const AUTOCOMPLETE: Record<TCardFieldPart, InputHTMLAttributes<HTMLInputElement>['autoComplete']> = {
  number: 'cc-number',
  expiry: 'cc-exp',
  // **`off`, not `cc-csc`.** The spec token for a security code exists, and
  // asking for it is precisely what invites the browser to store and refill the
  // value — which bDS forbids: "el CVV no se guarda ni se autocompleta. Es la
  // regla del medio de pago, no una decision de diseno."
  cvv: 'off',
};

/** Everything the web CardField needs to render. */
interface IUseCardFieldResult {
  containerStyle: CSSProperties;
  labelStyle: CSSProperties;
  inputStyle: CSSProperties;
  helperStyle: CSSProperties;
  brandPlate: {
    plateWidth: number;
    plateHeight: number;
    borderRadius: number;
    borderWidth: number;
    background: string;
    borderColor: string;
  };
  /** Props for the `<input>` that come from `part`, not from the caller. */
  inputProps: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'autoComplete' | 'inputMode' | 'maxLength' | 'type'
  >;
  /** The brand to draw, or `undefined` when there is nothing to draw. */
  brand: TCardBrand | undefined;
  /** Whether the label has floated above the value. */
  isFloating: boolean;
  /** The message under the field, and whether it is the error one. */
  message: { text: string; isError: boolean } | undefined;
  handlers: {
    onFocus: () => void;
    onBlur: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

/**
 * Resolves the web CardField's styles and native input wiring.
 *
 * Hover and focus are React state rather than CSS pseudo-classes, which is the
 * house pattern — every field here does it, because the styles come from tokens
 * at render time and there is no stylesheet to hang a `:hover` on.
 *
 * @param props - The CardField props.
 * @returns Styles, the input's part-derived props, and the interaction handlers.
 */
export const useCardField = (props: ICardFieldProps): IUseCardFieldResult => {
  const { part, value, size = 'md', helperText, error, readOnly = false, disabled = false } = props;
  // The one narrowing the discriminated union costs. `brand` is only on the
  // `number` arm, so reading it unconditionally would not typecheck — which is
  // the whole point of the union.
  const givenBrand = props.part === 'number' ? props.brand : undefined;

  const mode = useThemeMode();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { colors, size: sizes, dimension, typography, fontFamily } = cardFieldTokens[mode];
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const rules = CARD_FIELD_PART_RULES[part];
  const metrics = sizes[size];
  const hasValue = value !== '';
  const hasError = error !== undefined && error !== '';
  // bDS's rule, and it is about the value alone: "la etiqueta sube solo cuando
  // hay un valor". A focused empty field is focus, not filled. And `sm` never
  // floats — a floating label plus the value occupy 42 and do not fit in 44.
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
          : isHovered
            ? colors.container.borderHover
            : colors.container.border;

  const background = disabled
    ? colors.container.backgroundDisabled
    : readOnly
      ? colors.container.backgroundReadOnly
      : colors.container.background;

  const valueColor = disabled
    ? colors.value.disabled
    : readOnly
      ? colors.value.readOnly
      : hasValue
        ? colors.value.filled
        : colors.value.placeholder;

  return {
    containerStyle: {
      alignItems: 'center',
      backgroundColor: background,
      // The hover wash goes *over* the background rather than replacing it,
      // which is why it is a gradient and not a second colour: there is one
      // background property and two layers to put in it.
      backgroundImage:
        isHovered && !disabled && !readOnly
          ? `linear-gradient(${colors.container.overlayHover}, ${colors.container.overlayHover})`
          : undefined,
      border: `${dimension.borderWidth}px solid ${borderColor}`,
      borderRadius: dimension.borderRadius,
      boxSizing: 'border-box',
      display: 'flex',
      gap: dimension.brandGap,
      height: metrics.height,
      // The ring is offset and two-tone: a gap the width of the container's own
      // border, then the ring. Flush is the bug the team already paid for once.
      boxShadow: isFocused
        ? `0 0 0 ${dimension.focusRingOffset}px ${background}, 0 0 0 ${
            dimension.focusRingOffset + dimension.focusRingSpread
          }px ${colors.container.borderFocus}`
        : undefined,
      paddingInline: dimension.paddingHorizontal,
      paddingBlock: dimension.paddingVertical,
      transition: prefersReducedMotion ? 'none' : 'border-color 120ms ease, box-shadow 120ms ease',
      width: '100%',
    },
    labelStyle: {
      color: disabled ? colors.label.disabled : colors.label.default,
      fontFamily,
      fontSize: typography.label.fontSize,
      fontWeight: typography.label.fontWeight,
      letterSpacing: typography.label.letterSpacing,
      lineHeight: typography.label.lineHeightRatio,
      // Floated: a caption inside the same bordered box, above the value. Not a
      // label above the field — that is a different component's anatomy.
      display: isFloating ? 'block' : 'none',
    },
    inputStyle: {
      appearance: 'none',
      background: 'transparent',
      border: 'none',
      color: valueColor,
      fontFamily,
      fontSize: typography.value.fontSize,
      fontWeight: typography.value.fontWeight,
      lineHeight: typography.value.lineHeightRatio,
      minWidth: 0,
      outline: 'none',
      padding: 0,
      width: '100%',
    },
    helperStyle: {
      color: disabled
        ? colors.helper.disabled
        : hasError
          ? colors.helper.error
          : colors.helper.default,
      fontFamily,
      fontSize: typography.helper.fontSize,
      fontWeight: typography.helper.fontWeight,
      lineHeight: typography.helper.lineHeightRatio,
      marginBlockStart: dimension.helperGap,
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
      autoComplete: AUTOCOMPLETE[part],
      // `numeric`, not `tel`: a card number has no `+` and no parentheses.
      inputMode: 'numeric',
      maxLength: rules.maxLength,
      // The CVV is masked as it is typed. Payment rule, not a design choice.
      type: rules.secure ? 'password' : 'text',
    },
    // Detected from the value, never chosen: "la marca se deduce del numero en
    // codigo, nunca la elige quien disena". The prop overrides, for the cases
    // where the caller already knows.
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
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
  };
};

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
import type { CSSProperties } from 'react';

import { usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IPhoneFieldProps } from './PhoneField.types';

/**
 * How tall the panel is allowed to get, in pixels.
 *
 * **A literal, and the same one the Select uses.** The export has no
 * max-height token — `z/dropdown` is the only `dimension` key that mentions a
 * dropdown at all — so the two components that float a list share one number
 * rather than each inventing its own. At 243 countries this is what makes the
 * difference between a panel and a 10.700px column.
 */
const PANEL_MAX_HEIGHT = 280;

/** Everything the web PhoneField needs to render. */
interface IUsePhoneFieldResult {
  containerStyle: CSSProperties;
  labelStyle: CSSProperties;
  inputStyle: CSSProperties;
  helperStyle: CSSProperties;
  triggerStyle: CSSProperties;
  dialCodeStyle: CSSProperties;
  dividerStyle: CSSProperties;
  chevronStyle: CSSProperties;
  panelStyle: CSSProperties;
  /** The scrolling area between the search box and the panel's bottom edge. */
  listStyle: CSSProperties;
  searchStyle: CSSProperties;
  /** Props for the flag inside the trigger. */
  flag: { size: number; borderColor: string; radius: number; borderWidth: number };
  /** The country in effect, after the default. */
  country: TCountryCode;
  dialCode: string;
  /**
   * The countries to list, sorted by localized name and already filtered by the
   * search box.
   *
   * **Data, not `IMenuOption`s.** The rows need a flag element in their leading
   * slot, and building JSX here would make this the only `use*.tsx` among the
   * repo's 71 hooks. The component maps these into the Menu's options and adds
   * the artwork.
   */
  countryRows: { code: TCountryCode; label: string; dialCode: string }[];
  isOpen: boolean;
  isFloating: boolean;
  search: string;
  message: { text: string; isError: boolean } | undefined;
  setSearch: (value: string) => void;
  open: () => void;
  close: () => void;
  handlers: {
    onFocus: () => void;
    onBlur: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

/**
 * Resolves the web PhoneField's styles, its country list and its open state.
 *
 * **Opening is internal state, not a prop.** Figma documents it as `showMenu`
 * so the open list can be drawn, and bDS is explicit that this is the same trap
 * `isOpen` has in the Select: *"sirve para dibujar, pero en código la apertura
 * es estado interno"*.
 *
 * @param params - The PhoneField props.
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const { colors, size: sizes, dimension, typography, fontFamily } = phoneFieldTokens[mode];

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const metrics = sizes[size];
  const hasValue = value !== '';
  const hasError = error !== undefined && error !== '';
  // bDS's rule, and it is about the value alone: "la etiqueta sube solo cuando
  // hay un valor". A focused empty field is focus, not filled. And `sm` never
  // floats — a floating label plus the value occupy 42 and do not fit in 44.
  const isFloating = hasValue && size !== 'sm';

  const borderColor = disabled
    ? colors.container.borderDisabled
    : hasError
      ? colors.container.borderError
      : isFocused || isOpen
        ? colors.container.borderFocus
        : colors.container.border;

  /**
   * Sorted by localized name and filtered by the search box.
   *
   * Sorting belongs here rather than in the catalogue because the order depends
   * on the locale. The *offered* order — favourites, a pinned home country — is
   * the open product decision the catalogue cannot make.
   */
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
      // The hover wash goes *over* the background rather than replacing it —
      // bDS leaves `border-hover` out of this component's token list and names
      // the overlay instead.
      backgroundImage:
        isHovered && !disabled
          ? `linear-gradient(${colors.container.overlayHover}, ${colors.container.overlayHover})`
          : undefined,
      border: `${dimension.borderWidth}px solid ${borderColor}`,
      borderRadius: dimension.borderRadius,
      boxShadow: isFocused
        ? `0 0 0 ${dimension.focusRingSpread}px ${colors.container.borderFocus}`
        : undefined,
      boxSizing: 'border-box',
      display: 'flex',
      gap: dimension.valueGap,
      height: metrics.height,
      paddingInline: metrics.paddingHorizontal,
      position: 'relative',
      transition: prefersReducedMotion ? 'none' : 'border-color 120ms ease, box-shadow 120ms ease',
      width: '100%',
    },
    labelStyle: {
      color: disabled ? colors.label.disabled : colors.label.default,
      display: isFloating ? 'block' : 'none',
      fontFamily,
      fontSize: typography.label.fontSize,
      fontWeight: typography.label.fontWeight,
      letterSpacing: typography.label.letterSpacing,
      lineHeight: typography.label.lineHeightRatio,
    },
    inputStyle: {
      appearance: 'none',
      background: 'transparent',
      border: 'none',
      color: disabled
        ? colors.value.disabled
        : hasValue
          ? colors.value.filled
          : colors.value.placeholder,
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
    triggerStyle: {
      alignItems: 'center',
      background: 'none',
      border: 'none',
      // The trigger is a control inside the field, with its own touch area:
      // `size/target/min` (48) reached through the block size rather than the
      // height, so it grows the target without moving the 32-tall `sm` box.
      cursor: disabled ? 'default' : 'pointer',
      display: 'inline-flex',
      flexShrink: 0,
      gap: dimension.prefixGap,
      minBlockSize: dimension.minTouchTarget,
      padding: 0,
    },
    dialCodeStyle: {
      color: disabled
        ? colors.prefix.dialCodeDisabled
        : hasValue
          ? colors.prefix.dialCodeFilled
          : colors.prefix.dialCode,
      fontFamily,
      fontSize: typography.value.fontSize,
      fontWeight: typography.value.fontWeight,
      lineHeight: typography.value.lineHeightRatio,
    },
    dividerStyle: {
      backgroundColor: colors.prefix.divider,
      flexShrink: 0,
      // A co-token of its own: the rule is shorter than the box on purpose, so
      // it separates without reaching the edges.
      height: dimension.dividerHeight,
      width: dimension.dividerWidth,
    },
    chevronStyle: {
      color: disabled ? colors.prefix.chevronDisabled : colors.prefix.chevron,
      display: 'inline-flex',
      // **In code the chevron rotates.** In Figma it cannot: `showMenu` is a
      // boolean and *"un booleano prende y apaga, no transforma"*. Select and
      // Combobox keep an `open` axis and rotate there, so this is the platform
      // catching up with them rather than inventing anything.
      transform: isOpen ? 'rotate(180deg)' : undefined,
      transition: prefersReducedMotion ? 'none' : 'transform 120ms ease',
    },
    panelStyle: {
      // **No surface of its own.** `Menu` paints its own background, border and
      // radius, so a second set here would show up as a doubled hairline down
      // both sides. This element only positions, clips and casts the shadow;
      // the search strip below paints the top.
      borderRadius: dimension.menuRadius,
      // Far first, near second: CSS paints the first shadow on top, the same
      // order the Snackbar uses for this ramp.
      boxShadow: [
        `0 ${dimension.menuShadowFarY}px ${dimension.menuShadowFarBlur}px ${colors.menu.shadowFar}`,
        `0 ${dimension.menuShadowNearY}px ${dimension.menuShadowNearBlur}px ${colors.menu.shadowNear}`,
      ].join(', '),
      boxSizing: 'border-box',
      // It covers the form rather than pushing it, and follows the field's
      // width — bDS: *"no empuja el formulario, lo tapa, y acompaña si el campo
      // se ensancha"*.
      display: 'flex',
      flexDirection: 'column',
      insetBlockStart: `calc(100% + ${dimension.menuOffset}px)`,
      insetInline: 0,
      // The cap plus the scrolling child below are what keep 243 rows inside a
      // panel. `Menu` has neither a max height nor an internal scroll — it is
      // pure content, so bounding it is the caller's job.
      maxBlockSize: PANEL_MAX_HEIGHT,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: dimension.menuZIndex,
    },
    listStyle: {
      // `min-block-size: 0` is the load-bearing half: without it a flex child
      // refuses to shrink below its content and the scroll never happens.
      flex: 1,
      minBlockSize: 0,
      overflowY: 'auto',
    },
    searchStyle: {
      appearance: 'none',
      backgroundColor: colors.menu.surface,
      // Its own edges, since the panel has none: a full border with the bottom
      // dropped, because `Menu`'s own top border is already the separator
      // between the search and the rows.
      border: `${dimension.borderWidth}px solid ${colors.menu.border}`,
      borderBlockEndWidth: 0,
      // Matching the panel's radius rather than relying on the clip: a square
      // corner clipped by `overflow: hidden` loses its border along the arc.
      borderStartEndRadius: dimension.menuRadius,
      borderStartStartRadius: dimension.menuRadius,
      boxSizing: 'border-box',
      flexShrink: 0,
      color: colors.value.filled,
      fontFamily,
      fontSize: typography.value.fontSize,
      outline: 'none',
      paddingBlock: dimension.helperGap * 2,
      paddingInline: metrics.paddingHorizontal,
      width: '100%',
    },
    flag: {
      size: dimension.iconSize,
      borderColor: colors.prefix.flagBorder,
      radius: dimension.flagRadius,
      borderWidth: dimension.borderWidth,
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
    close: () => setIsOpen(false),
    handlers: {
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
  };
};

import { selectTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ISelectProps } from './Select.types';

/** Params of {@link useSelect}: the Select props plus the live interaction state. */
interface IUseSelectParams extends ISelectProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
  isOpen: boolean;
}

/** Styles and derived values the Select needs to render. */
interface IUseSelectResult {
  wrapperStyle: CSSProperties;
  fieldStyle: CSSProperties;
  contentStyle: CSSProperties;
  valueRowStyle: CSSProperties;
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
  iconStyle: CSSProperties;
  iconColor: string;
  chevronStyle: CSSProperties;
  footerStyle: CSSProperties;
  helperStyle: CSSProperties;
  /** The floating panel itself — position, border, shadow, clipping. */
  menuStyle: CSSProperties;
  /** The `<ul>` of options inside the panel — scrolls independently of the search box. */
  menuListStyle: CSSProperties;
  /** Wraps the search icon + input shown inside the menu when `isSearchable` is on. */
  searchWrapperStyle: CSSProperties;
  searchInputStyle: CSSProperties;
  /** The "no matches" row shown in place of the list when a search yields nothing. */
  noOptionsStyle: CSSProperties;
  /** Background of the keyboard/mouse-highlighted option row — `container/overlay-hover`. */
  menuOptionHighlightColor: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  hasError: boolean;
  /** `label` only ever floats once a value is chosen — same rule as TextField's, minus the `small`-never-floats exception (Select has no size that skips it). */
  showFloatingLabel: boolean;
}

// Figma's label/sm/strong text style tracks 0.24px — same constant TextField hardcodes for the same reason.
const FLOATING_LABEL_LETTER_SPACING = '0.24px';

/**
 * Resolves every style the Select needs, from the active theme, its size,
 * and its current props and interaction state.
 *
 * Mirrors `useTextField`'s precedence closely — the field chrome is the same
 * shape, just anchored to a menu instead of an `<input>`. `hover` only ever
 * applies on web (see the dev contract's platform-differences table).
 */
export const useSelect = ({
  size = 'md',
  disabled = false,
  readOnly = false,
  error,
  value,
  options,
  isHovered,
  isPressed,
  isFocusVisible,
  isOpen,
}: IUseSelectParams): IUseSelectResult => {
  const mode = useThemeMode();
  const tokens = selectTokens[mode];
  const fontFamily = useFontFamily(tokens.typography.value.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
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
        : isHovered
          ? tokens.colors.container.borderHover
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

  const transition = prefersReducedMotion
    ? 'none'
    : 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease';

  const { focusRingOffset, focusRingSpread } = tokens.dimension;
  const boxShadow =
    isFocusVisible && !disabled && !readOnly
      ? `0 0 0 ${focusRingOffset}px ${tokens.colors.focusRingGap}, 0 0 0 ${focusRingSpread}px ${tokens.colors.container.borderFocus}`
      : undefined;

  const backgroundImage =
    isHovered && !isPressed && !isFocusVisible && !disabled && !readOnly && !hasError
      ? `linear-gradient(${tokens.colors.container.overlayHover}, ${tokens.colors.container.overlayHover})`
      : undefined;

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontFamily,
  };

  const fieldStyle: CSSProperties = {
    // Anchors the menu to the field itself, not the wrapper — so it opens right
    // under the field and overlaps the helper/error text instead of pushing it down.
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.dimension.contentGap,
    width: '100%',
    minHeight: sizeTokens.minHeight,
    padding: `${sizeTokens.paddingVertical}px ${tokens.dimension.paddingHorizontal}px`,
    borderRadius: tokens.dimension.borderRadius,
    border: `${tokens.dimension.borderWidth}px solid ${borderColor}`,
    backgroundColor,
    backgroundImage,
    boxShadow,
    transition,
    cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
  };

  const contentStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  };

  const valueRowStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    minWidth: 0,
  };

  const labelStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.typography.label.fontWeight,
    fontSize: tokens.typography.label.fontSize,
    lineHeight: `${tokens.typography.label.lineHeight}px`,
    letterSpacing: FLOATING_LABEL_LETTER_SPACING,
    color: disabled ? tokens.colors.label.disabled : tokens.colors.label.default,
    width: '100%',
  };

  const valueStyle: CSSProperties = {
    width: '100%',
    fontFamily,
    fontWeight: tokens.typography.value.fontWeight,
    fontSize: tokens.typography.value.fontSize,
    lineHeight: `${tokens.typography.value.lineHeight}px`,
    color: valueColor,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  };

  const iconColor = disabled ? tokens.colors.icon.disabled : tokens.colors.icon.default;
  const iconStyle: CSSProperties = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: tokens.iconSize[size],
    height: tokens.iconSize[size],
    color: iconColor,
  };

  const chevronStyle: CSSProperties = {
    ...iconStyle,
    transform: isOpen ? 'rotate(180deg)' : 'none',
    transition: prefersReducedMotion ? 'none' : 'transform 120ms ease',
  };

  const footerStyle: CSSProperties = {
    paddingTop: tokens.dimension.footerSlotGap,
  };

  const helperStyle: CSSProperties = {
    margin: 0,
    fontFamily,
    fontWeight: tokens.typography.helper.fontWeight,
    fontSize: tokens.typography.helper.fontSize,
    lineHeight: `${tokens.typography.helper.lineHeight}px`,
    color: disabled ? tokens.colors.helper.disabled : hasError ? tokens.colors.helper.error : tokens.colors.helper.default,
  };

  const menuStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: tokens.dimension.menuOffset,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    boxSizing: 'border-box',
    maxHeight: 280,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: tokens.dimension.menuBorderRadius,
    border: `${tokens.dimension.borderWidth}px solid ${tokens.colors.menu.border}`,
    backgroundColor: tokens.colors.menu.background,
    boxShadow: [
      `0 ${tokens.dimension.menuShadowFarY}px ${tokens.dimension.menuShadowFarBlur}px ${tokens.colors.menu.shadowFar}`,
      `0 ${tokens.dimension.menuShadowNearY}px ${tokens.dimension.menuShadowNearBlur}px ${tokens.colors.menu.shadowNear}`,
    ].join(', '),
    zIndex: tokens.dimension.menuZIndex,
  };

  const menuListStyle: CSSProperties = {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  };

  const searchWrapperStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: tokens.dimension.contentGap,
    padding: `${tokens.dimension.searchPaddingVertical}px ${tokens.dimension.paddingHorizontal}px`,
    borderBottom: `${tokens.dimension.borderWidth}px solid ${tokens.colors.menu.border}`,
  };

  const searchInputStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily,
    fontWeight: tokens.typography.value.fontWeight,
    fontSize: tokens.typography.value.fontSize,
    lineHeight: `${tokens.typography.value.lineHeight}px`,
    color: tokens.colors.value.filled,
  };

  const noOptionsStyle: CSSProperties = {
    boxSizing: 'border-box',
    margin: 0,
    padding: `${tokens.dimension.searchPaddingVertical}px ${tokens.dimension.paddingHorizontal}px`,
    fontFamily,
    fontWeight: tokens.typography.helper.fontWeight,
    fontSize: tokens.typography.helper.fontSize,
    lineHeight: `${tokens.typography.helper.lineHeight}px`,
    color: tokens.colors.helper.default,
  };

  return {
    wrapperStyle,
    fieldStyle,
    contentStyle,
    valueRowStyle,
    labelStyle,
    valueStyle,
    iconStyle,
    iconColor,
    chevronStyle,
    footerStyle,
    helperStyle,
    menuStyle,
    menuListStyle,
    searchWrapperStyle,
    searchInputStyle,
    noOptionsStyle,
    menuOptionHighlightColor: tokens.colors.container.overlayHover,
    isDisabled: disabled,
    isReadOnly: readOnly,
    hasError,
    showFloatingLabel,
  };
};

import { searchFieldTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ISearchFieldProps } from './SearchField.types';

/** Params of {@link useSearchField}: props plus the live hover/focus state. */
interface IUseSearchFieldParams extends ISearchFieldProps {
  isHovered: boolean;
  isFocused: boolean;
}

/**
 * `CSSProperties` plus the custom property `pseudo.css`'s `::placeholder` rule
 * reads. That pseudo-element has no inline-style equivalent.
 */
interface IInputStyle extends CSSProperties {
  '--dsm-input-placeholder-color'?: string;
}

/** Styles the web SearchField needs to render. */
interface IUseSearchFieldResult {
  fieldStyle: CSSProperties;
  iconStyle: CSSProperties;
  inputStyle: IInputStyle;
  clearButtonSize: 'xs' | 'sm' | 'md' | 'lg';
  isDisabled: boolean;
}

/**
 * Resolves the web SearchField: white box, 1px border, `radius/field/md`.
 *
 * Focus keeps `border-default` and draws the offset ring outside, same as
 * TextField. Hover only recolors the border — the export has no
 * `overlay-hover` leaf under `component/searchfield`.
 */
export const useSearchField = ({
  size = 'md',
  isDisabled = false,
  isHovered,
  isFocused,
}: IUseSearchFieldParams): IUseSearchFieldResult => {
  const mode = useThemeMode();
  const tokens = searchFieldTokens[mode];
  const sizeTokens = tokens.sizes[size];
  const type = tokens.typography[size];
  const fontFamily = useFontFamily(type.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();

  const borderColor = isDisabled
    ? tokens.colors.container.borderDisabled
    : isHovered && !isFocused
      ? tokens.colors.container.borderHover
      : tokens.colors.container.border;

  const backgroundColor = isDisabled
    ? tokens.colors.container.backgroundDisabled
    : tokens.colors.container.background;

  const valueColor = isDisabled ? tokens.colors.value.disabled : tokens.colors.value.filled;
  const placeholderColor = isDisabled ? tokens.colors.value.disabled : tokens.colors.value.placeholder;
  const iconColor = isDisabled ? tokens.colors.icon.disabled : tokens.colors.icon.default;

  const transition = prefersReducedMotion
    ? 'none'
    : 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease';

  const { focusRingOffset, focusRingSpread } = tokens.dimension;
  const boxShadow =
    isFocused && !isDisabled
      ? `0 0 0 ${focusRingOffset}px ${tokens.colors.focusRingGap}, 0 0 0 ${focusRingSpread}px ${tokens.colors.container.borderFocus}`
      : undefined;

  const fieldStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: sizeTokens.minHeight,
    paddingLeft: sizeTokens.paddingX,
    paddingRight: sizeTokens.paddingX,
    gap: tokens.dimension.gap,
    borderRadius: tokens.dimension.webRadius,
    border: `${tokens.dimension.borderWidth}px solid ${borderColor}`,
    backgroundColor,
    boxShadow,
    transition,
    fontFamily,
  };

  const iconStyle: CSSProperties = {
    display: 'flex',
    flexShrink: 0,
    color: iconColor,
  };

  const inputStyle: IInputStyle = {
    flex: '1 1 0%',
    minWidth: 0,
    margin: 0,
    padding: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: valueColor,
    fontFamily,
    fontWeight: type.fontWeight,
    fontSize: type.fontSize,
    lineHeight: `${type.lineHeight}px`,
    cursor: isDisabled ? 'not-allowed' : undefined,
    '--dsm-input-placeholder-color': placeholderColor,
  };

  return {
    fieldStyle,
    iconStyle,
    inputStyle,
    clearButtonSize: sizeTokens.clearButtonSize,
    isDisabled,
  };
};

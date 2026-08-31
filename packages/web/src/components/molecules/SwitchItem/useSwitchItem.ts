import { switchItemTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { ISwitchItemProps } from './SwitchItem.types';

/** Params of {@link useSwitchItem}: the props plus the live interaction state. */
interface IUseSwitchItemParams extends ISwitchItemProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

/** Styles and derived values the SwitchItem needs to render. */
interface IUseSwitchItemResult {
  rowStyle: CSSProperties;
  overlayStyle: CSSProperties | undefined;
  textColumnStyle: CSSProperties;
  labelStyle: CSSProperties;
  descriptionStyle: CSSProperties;
  dividerStyle: CSSProperties;
  isDisabled: boolean;
}

/**
 * Resolves SwitchItem row styles. Focus ring is on the **row**, not the
 * embedded Switch (Figma). Hover/pressed overlays sit on the row surface.
 */
export const useSwitchItem = ({
  size = 'md',
  isDisabled = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseSwitchItemParams): IUseSwitchItemResult => {
  const mode = useThemeMode();
  const tokens = switchItemTokens[mode];
  const fontFamily = useFontFamily(tokens.typography.label.fontWeight);
  const sizeTokens = tokens.sizes[size];

  const overlayColor = isDisabled
    ? undefined
    : isPressed
      ? tokens.colors.surface.overlayPressed
      : isHovered
        ? tokens.colors.surface.overlayHover
        : undefined;

  const rowStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.dimension.contentGap,
    boxSizing: 'border-box',
    width: '100%',
    minHeight: sizeTokens.minHeight,
    paddingLeft: tokens.dimension.paddingHorizontal,
    paddingRight: tokens.dimension.paddingHorizontal,
    backgroundColor: tokens.colors.surface.background,
    boxShadow:
      isFocusVisible && !isDisabled
        ? `0 0 0 ${tokens.dimension.focusRingSpread}px ${tokens.colors.surface.borderFocus}`
        : undefined,
    cursor: isDisabled ? 'default' : 'pointer',
  };

  const overlayStyle: CSSProperties | undefined = overlayColor
    ? {
        position: 'absolute',
        inset: 0,
        backgroundColor: overlayColor,
        pointerEvents: 'none',
      }
    : undefined;

  const textColumnStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: tokens.dimension.stackGap,
    flex: 1,
    minWidth: 0,
  };

  const labelStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.typography.label.fontWeight,
    fontSize: tokens.typography.label.fontSize,
    lineHeight: `${tokens.typography.label.lineHeight}px`,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
  };

  const descriptionStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.typography.description.fontWeight,
    fontSize: tokens.typography.description.fontSize,
    lineHeight: `${tokens.typography.description.lineHeight}px`,
    color: isDisabled ? tokens.colors.description.disabled : tokens.colors.description.default,
  };

  const dividerStyle: CSSProperties = {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: tokens.dimension.paddingHorizontal,
    height: tokens.dimension.dividerHeight,
    backgroundColor: tokens.colors.divider.background,
    pointerEvents: 'none',
  };

  return {
    rowStyle,
    overlayStyle,
    textColumnStyle,
    labelStyle,
    descriptionStyle,
    dividerStyle,
    isDisabled,
  };
};

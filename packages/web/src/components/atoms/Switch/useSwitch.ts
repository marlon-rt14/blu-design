import { switchTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ISwitchProps } from './Switch.types';

/** Params of {@link useSwitch}: the Switch props plus the live interaction state. */
interface IUseSwitchParams extends ISwitchProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

/** Styles and derived values the Switch needs to render. */
interface IUseSwitchResult {
  hitTargetStyle: CSSProperties;
  trackStyle: CSSProperties;
  overlayStyle: CSSProperties | undefined;
  thumbStyle: CSSProperties;
  travelStyle: CSSProperties;
  labelStyle: CSSProperties;
  inputStyle: CSSProperties;
  isDisabled: boolean;
  isChecked: boolean;
}

/**
 * Resolves every color and metric the web Switch needs from the active
 * theme, its size and its current state.
 *
 * Hover overlay, pressed `bg-on-pressed`, and the focus ring
 * (`inset -2px` + `spread` 3px → 2px visible outside, no gap).
 * `isContained` suppresses the own ring so SwitchItem can own it.
 */
export const useSwitch = ({
  size = 'sm',
  isChecked = false,
  isDisabled = false,
  isContained = false,
  showStateLabel = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseSwitchParams): IUseSwitchResult => {
  const mode = useThemeMode();
  const tokens = switchTokens[mode];
  const fontFamily = useFontFamily(tokens.typography.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
  const sizeTokens = tokens.sizes[size];
  const { thumbSize, minHeight } = sizeTokens;
  const { inset, borderRadius, borderWidth, focusRingOffset, focusRingSpread } = tokens.dimension;

  const trackHeight = thumbSize + 2 * inset;
  const trackWidth = 2 * thumbSize + 2 * inset;

  const trackBackground = isDisabled
    ? tokens.colors.track.backgroundDisabled
    : isChecked && isPressed
      ? tokens.colors.track.backgroundOnPressed
      : isChecked
        ? tokens.colors.track.backgroundOn
        : tokens.colors.track.backgroundOff;

  const overlayColor = isDisabled
    ? undefined
    : isChecked && isPressed
      ? undefined
      : isChecked && isHovered
        ? tokens.colors.track.overlayHoverOn
        : !isChecked && isHovered
          ? tokens.colors.track.overlayHover
          : undefined;

  const showOwnFocusRing = isFocusVisible && !isDisabled && !isContained;
  const trackBorderColor = isDisabled ? tokens.colors.track.borderDisabled : 'transparent';
  // Live focusRing: `inset-[-2px]` + `spread` 3px → 2px outside the track.
  const boxShadow = showOwnFocusRing
    ? `0 0 0 ${focusRingSpread - focusRingOffset}px ${tokens.colors.track.borderFocus}`
    : undefined;

  const hitWidth = trackWidth;
  const hitHeight = isContained ? trackHeight : minHeight;

  const hitTargetStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    minWidth: hitWidth,
    minHeight: hitHeight,
    flexShrink: 0,
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: isChecked ? 'row-reverse' : 'row',
    alignItems: 'center',
    width: showStateLabel ? 'auto' : trackWidth,
    minWidth: trackWidth,
    height: trackHeight,
    padding: inset,
    borderRadius,
    borderWidth,
    borderStyle: 'solid',
    borderColor: trackBorderColor,
    backgroundColor: trackBackground,
    boxShadow,
    overflow: 'hidden',
    pointerEvents: 'none',
    transition: prefersReducedMotion ? 'none' : 'background-color 120ms ease',
  };

  const overlayStyle: CSSProperties | undefined = overlayColor
    ? {
        position: 'absolute',
        inset: 0,
        borderRadius,
        backgroundColor: overlayColor,
        pointerEvents: 'none',
      }
    : undefined;

  const thumbStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    flexShrink: 0,
    width: thumbSize,
    height: thumbSize,
    borderRadius: '50%',
    backgroundColor: tokens.colors.thumb.background,
    boxSizing: 'border-box',
    borderWidth: isDisabled ? borderWidth : 0,
    borderStyle: 'solid',
    borderColor: isDisabled ? tokens.colors.thumb.borderDisabled : 'transparent',
  };

  const travelStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: thumbSize,
    height: thumbSize,
    paddingLeft: showStateLabel ? inset : 0,
    paddingRight: showStateLabel ? inset : 0,
  };

  const labelColor = isDisabled
    ? tokens.colors.label.disabled
    : isChecked
      ? tokens.colors.label.on
      : tokens.colors.label.off;

  const labelStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.typography.fontWeight,
    fontSize: tokens.typography.fontSize,
    lineHeight: `${tokens.typography.lineHeight}px`,
    letterSpacing: tokens.letterSpacing,
    color: labelColor,
    textTransform: 'uppercase',
    userSelect: 'none',
  };

  const inputStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    margin: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: isDisabled ? 'default' : 'pointer',
    zIndex: 2,
  };

  return {
    hitTargetStyle,
    trackStyle,
    overlayStyle,
    thumbStyle,
    travelStyle,
    labelStyle,
    inputStyle,
    isDisabled,
    isChecked,
  };
};

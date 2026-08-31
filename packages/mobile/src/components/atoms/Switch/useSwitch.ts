import { switchTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ISwitchProps } from './Switch.types';

/** Params of {@link useSwitch}: the Switch props plus the live press state. */
interface IUseSwitchParams extends ISwitchProps {
  isPressed: boolean;
}

/** Styles and derived values the Switch needs to render. */
interface IUseSwitchResult {
  hitTargetStyle: StyleProp<ViewStyle>;
  trackStyle: StyleProp<ViewStyle>;
  overlayStyle: StyleProp<ViewStyle> | undefined;
  thumbStyle: StyleProp<ViewStyle>;
  travelStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  isDisabled: boolean;
  isChecked: boolean;
}

/**
 * Resolves every color and metric the native Switch needs. No hover —
 * mobile has no hover concept. Pressed on-track uses `bg-on-pressed`;
 * pressed off uses `color.color.overlay.state.pressed`.
 */
export const useSwitch = ({
  size = 'md',
  isChecked = false,
  isDisabled = false,
  isContained = false,
  showStateLabel = false,
  isPressed,
}: IUseSwitchParams): IUseSwitchResult => {
  const mode = useThemeMode();
  const tokens = switchTokens[mode];
  const sizeTokens = tokens.sizes[size];
  const { thumbSize } = sizeTokens;
  const { inset, borderRadius, borderWidth, targetMin } = tokens.dimension;

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
      : !isChecked && isPressed
        ? tokens.colors.track.overlayPressed
        : undefined;

  const trackBorderColor = isDisabled ? tokens.colors.track.borderDisabled : 'transparent';

  const hitWidth = isContained ? trackWidth : Math.max(trackWidth, targetMin);
  const hitHeight = isContained ? trackHeight : Math.max(trackHeight, targetMin);

  const hitTargetStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: hitWidth,
    minHeight: hitHeight,
    flexShrink: 0,
  };

  const trackStyle: StyleProp<ViewStyle> = {
    position: 'relative',
    flexDirection: isChecked ? 'row-reverse' : 'row',
    alignItems: 'center',
    width: showStateLabel ? undefined : trackWidth,
    minWidth: trackWidth,
    height: trackHeight,
    padding: inset,
    borderRadius,
    borderWidth,
    borderColor: trackBorderColor,
    backgroundColor: trackBackground,
    overflow: 'hidden',
  };

  const overlayStyle: StyleProp<ViewStyle> | undefined = overlayColor
    ? {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius,
        backgroundColor: overlayColor,
      }
    : undefined;

  const thumbStyle: StyleProp<ViewStyle> = {
    width: thumbSize,
    height: thumbSize,
    borderRadius: thumbSize / 2,
    backgroundColor: tokens.colors.thumb.background,
    borderWidth: isDisabled ? borderWidth : 0,
    borderColor: isDisabled ? tokens.colors.thumb.borderDisabled : 'transparent',
  };

  const travelStyle: StyleProp<ViewStyle> = {
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

  const labelStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.fontWeight),
    fontSize: tokens.typography.fontSize,
    lineHeight: tokens.typography.lineHeight,
    letterSpacing: tokens.letterSpacing,
    color: labelColor,
    textTransform: 'uppercase',
  };

  return {
    hitTargetStyle,
    trackStyle,
    overlayStyle,
    thumbStyle,
    travelStyle,
    labelStyle,
    isDisabled,
    isChecked,
  };
};

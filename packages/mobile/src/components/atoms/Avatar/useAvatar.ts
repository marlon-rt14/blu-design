import { avatarTokens } from '@dsm/shared';
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IAvatarProps } from './Avatar.types';

interface IUseAvatarResult {
  containerStyle: StyleProp<ViewStyle>;
  circleStyle: StyleProp<ViewStyle>;
  ringStyle: StyleProp<ViewStyle> | undefined;
  initialsStyle: StyleProp<TextStyle>;
  iconColor: string;
  imageStyle: StyleProp<ImageStyle>;
  logoWrapperStyle: StyleProp<ViewStyle>;
  logoImageStyle: StyleProp<ImageStyle>;
  indicatorWrapperStyle: StyleProp<ViewStyle>;
}

/**
 * The shape clips on purpose — Avatar is the one component in the system that
 * deliberately cuts its content, which is what lets the indicator sit on the
 * border without the circle swallowing it. `showRing` is an absolutely
 * positioned inset border, not a real one, so turning it on never grows the box.
 */
export const useAvatar = ({
  tone = 'brand',
  size = 'md',
  showRing = false,
}: IAvatarProps): IUseAvatarResult => {
  const mode = useThemeMode();
  const tokens = avatarTokens[mode];
  const toneColors = tokens.colors.tones[tone];
  const sizeTokens = tokens.dimension.sizes[size];
  const fontFamily = useFontFamily(tokens.dimension.initialsFontWeight);
  const { diameter } = sizeTokens;

  // Two layers on purpose: the circle clips its content (photo/logo/initials),
  // but the status indicator has to sit on the border, half outside that clip —
  // so it lives in this outer, unclipped container instead.
  const containerStyle: StyleProp<ViewStyle> = {
    position: 'relative',
    width: diameter,
    height: diameter,
    flexShrink: 0,
  };

  const circleStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: diameter / 2,
    overflow: 'hidden',
    backgroundColor: toneColors.background,
  };

  const ringStyle: StyleProp<ViewStyle> | undefined = showRing
    ? {
        position: 'absolute',
        inset: 0,
        borderRadius: diameter / 2,
        borderWidth: tokens.dimension.ringWidth,
        borderColor: tokens.colors.ring,
      }
    : undefined;

  const initialsStyle: StyleProp<TextStyle> = {
    fontFamily,
    fontSize: tokens.dimension.initialsFontSize[size],
    color: toneColors.text,
  };

  const imageStyle: StyleProp<ImageStyle> = {
    width: '100%',
    height: '100%',
  };

  const logoWrapperStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeTokens.logoSize,
    height: sizeTokens.logoSize,
  };

  const logoImageStyle: StyleProp<ImageStyle> = {
    width: '100%',
    height: '100%',
  };

  const indicatorWrapperStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    bottom: 0,
    right: 0,
  };

  return {
    containerStyle,
    circleStyle,
    ringStyle,
    initialsStyle,
    iconColor: toneColors.icon,
    imageStyle,
    logoWrapperStyle,
    logoImageStyle,
    indicatorWrapperStyle,
  };
};

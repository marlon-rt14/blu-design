import { avatarTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IAvatarProps } from './Avatar.types';

interface IUseAvatarResult {
  containerStyle: CSSProperties;
  circleStyle: CSSProperties;
  initialsStyle: CSSProperties;
  iconWrapperStyle: CSSProperties;
  imageStyle: CSSProperties;
  logoWrapperStyle: CSSProperties;
  logoImageStyle: CSSProperties;
  indicatorWrapperStyle: CSSProperties;
}

/**
 * The shape clips on purpose — Avatar is the one component in the system that
 * deliberately cuts its content, which is what lets the indicator sit on the
 * border without the circle swallowing it. `showRing` is an inset shadow, not
 * a real border, so turning it on never grows the box.
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

  // Two layers on purpose: the circle clips its content (photo/logo/initials),
  // but the status indicator has to sit on the border, half outside that clip —
  // so it lives in this outer, unclipped wrapper instead.
  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    width: sizeTokens.diameter,
    height: sizeTokens.diameter,
    flexShrink: 0,
    boxSizing: 'border-box',
  };

  const circleStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: toneColors.background,
    boxShadow: showRing ? `inset 0 0 0 ${tokens.dimension.ringWidth}px ${tokens.colors.ring}` : undefined,
  };

  const initialsStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.dimension.initialsFontWeight,
    fontSize: tokens.dimension.initialsFontSize[size],
    color: toneColors.text,
    lineHeight: 1,
    userSelect: 'none',
  };

  // Icon inherits its color via `currentColor` (see Icon's own docs) instead
  // of a `color` prop — the avatar's per-tone icon color is a literal hex, not
  // one of Icon's semantic roles.
  const iconWrapperStyle: CSSProperties = {
    display: 'inline-flex',
    color: toneColors.icon,
  };

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const logoWrapperStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeTokens.logoSize,
    height: sizeTokens.logoSize,
  };

  const logoImageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  const indicatorWrapperStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
  };

  return {
    containerStyle,
    circleStyle,
    initialsStyle,
    iconWrapperStyle,
    imageStyle,
    logoWrapperStyle,
    logoImageStyle,
    indicatorWrapperStyle,
  };
};

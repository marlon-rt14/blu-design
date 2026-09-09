import { avatarTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { IAvatarIndicatorProps } from './AvatarIndicator.types';

interface IUseAvatarIndicatorResult {
  ringStyle: CSSProperties;
  dotStyle: CSSProperties;
}

/**
 * The dot is the status; the ring around it is what separates it from
 * whatever it sits on (an avatar of the same color would otherwise swallow it).
 */
export const useAvatarIndicator = ({
  status = 'online',
  size = 'md',
}: IAvatarIndicatorProps): IUseAvatarIndicatorResult => {
  const mode = useThemeMode();
  const tokens = avatarTokens[mode];
  const { indicatorSize } = tokens.dimension.sizes[size];
  const { ringWidth } = tokens.dimension;
  const outerDiameter = indicatorSize + ringWidth * 2;

  const ringStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: outerDiameter,
    height: outerDiameter,
    borderRadius: '50%',
    backgroundColor: tokens.colors.ring,
    boxSizing: 'border-box',
  };

  const dotStyle: CSSProperties = {
    width: indicatorSize,
    height: indicatorSize,
    borderRadius: '50%',
    backgroundColor: tokens.colors.indicatorDot[status],
  };

  return { ringStyle, dotStyle };
};

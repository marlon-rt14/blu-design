import { avatarTokens } from '@dsm/shared';
import type { StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IAvatarIndicatorProps } from './AvatarIndicator.types';

interface IUseAvatarIndicatorResult {
  ringStyle: StyleProp<ViewStyle>;
  dotStyle: StyleProp<ViewStyle>;
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

  const ringStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: outerDiameter,
    height: outerDiameter,
    borderRadius: outerDiameter / 2,
    backgroundColor: tokens.colors.ring,
  };

  const dotStyle: StyleProp<ViewStyle> = {
    width: indicatorSize,
    height: indicatorSize,
    borderRadius: indicatorSize / 2,
    backgroundColor: tokens.colors.indicatorDot[status],
  };

  return { ringStyle, dotStyle };
};

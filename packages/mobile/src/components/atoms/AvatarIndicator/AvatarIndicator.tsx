import type { ReactElement } from 'react';
import { View } from 'react-native';

import type { IAvatarIndicatorProps } from './AvatarIndicator.types';
import { useAvatarIndicator } from './useAvatarIndicator';

/**
 * Mobile AvatarIndicator — the status dot on an Avatar's border.
 *
 * Decorative only (no accessible name of its own): the presence status it
 * shows is a secondary detail next to whatever names the person, so it never
 * needs to be the only carrier of that information.
 */
export const AvatarIndicator = (props: IAvatarIndicatorProps): ReactElement => {
  const { testID } = props;
  const { ringStyle, dotStyle } = useAvatarIndicator(props);

  return (
    <View importantForAccessibility="no-hide-descendants" style={ringStyle} testID={testID}>
      <View style={dotStyle} />
    </View>
  );
};

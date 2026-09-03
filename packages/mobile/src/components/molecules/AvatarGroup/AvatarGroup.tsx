import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { Avatar } from '../../atoms/Avatar';
import type { IAvatarGroupProps } from './AvatarGroup.types';
import { useAvatarGroup } from './useAvatarGroup';

/**
 * Mobile AvatarGroup — several people in one line, each cut out from the one
 * behind it by its ring.
 *
 * **No slot.** The group has to guarantee that every item is an Avatar, at its
 * own `size`, with `showRing` on — a free slot could not promise either, and
 * the overlap stops reading as a stack of circles the moment one piece breaks
 * shape. Pass at most five in `avatars`; past that, six overlapping faces stop
 * being individuals and start being texture — set `showOverflow` and summarize
 * the rest as a trailing "+N" tile instead.
 */
export const AvatarGroup = (props: IAvatarGroupProps): ReactElement => {
  const { avatars, size = 'md', showOverflow = false, overflowLabel = '+3', testID } = props;
  const { rowStyle, itemStyle, overflowStyle, overflowRingStyle, overflowTextStyle } = useAvatarGroup(props);

  return (
    <View style={rowStyle} testID={testID}>
      {avatars.map((avatar, index) => (
        <View key={index} style={itemStyle(index)}>
          <Avatar {...avatar} showRing size={size} />
        </View>
      ))}
      {showOverflow ? (
        <View style={itemStyle(avatars.length)}>
          <View style={overflowStyle}>
            <Text style={overflowTextStyle}>{overflowLabel}</Text>
            <View style={overflowRingStyle} />
          </View>
        </View>
      ) : null}
    </View>
  );
};

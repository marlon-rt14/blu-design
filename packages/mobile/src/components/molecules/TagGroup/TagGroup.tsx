import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { Tag } from '../../atoms/Tag';
import type { ITagGroupProps } from './TagGroup.types';
import { useTagGroup } from './useTagGroup';

/**
 * Mobile TagGroup — a row of Tags with overflow, what AvatarGroup is to Avatar.
 *
 * **No slot.** The group has to guarantee that every item is a Tag at its own
 * `size` — a free slot could not promise that, and inside a field it would
 * break the height `size/field/height/*` promises.
 *
 * **Does not decide how many fit** — that is the width of whatever contains
 * it. Pass however many already fit in `tags`, and set `showOverflow` for the
 * rest: the trailing "+N" tile carries no remove control, since a counter is
 * not a selection.
 */
export const TagGroup = (props: ITagGroupProps): ReactElement => {
  const { tags, size = 'sm', showOverflow = false, overflowLabel = '+3', overflowAccessibilityLabel, testID } = props;
  const { rowStyle, overflowStyle, overflowTextStyle } = useTagGroup(props);

  return (
    <View style={rowStyle} testID={testID}>
      {tags.map((tag, index) => (
        <Tag key={index} {...tag} size={size} />
      ))}
      {showOverflow ? (
        <View accessibilityLabel={overflowAccessibilityLabel ?? overflowLabel} accessibilityRole="text" style={overflowStyle}>
          <Text importantForAccessibility="no" style={overflowTextStyle}>
            {overflowLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

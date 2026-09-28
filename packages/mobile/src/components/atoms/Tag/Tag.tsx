import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { tintNode } from '../Icon';
import { IconXClose } from '../../../icons/general';
import type { ITagProps } from './Tag.types';
import { useTag } from './useTag';

/**
 * Mobile Tag — a label that is read: what type something is, or what state
 * it is in. **It is not touched to change it** — that is what Chip is for,
 * and why this component carries no interaction state at all.
 *
 * The Combobox's input chip is still a Tag underneath —
 * `showRemove`, `appearance="outline"`, `palette="neutral"` — removable but
 * never selectable.
 */
export const Tag = (props: ITagProps): ReactElement => {
  const { label, leadingIcon, onRemove, testID } = props;
  const { rootStyle, labelStyle, iconColor, removeButtonStyle } = useTag(props);

  return (
    <View style={rootStyle} testID={testID}>
      {leadingIcon ? tintNode(leadingIcon, iconColor) : null}
      <Text style={labelStyle}>{label}</Text>
      {onRemove ? (
        <Pressable accessibilityLabel={`Quitar ${label}`} accessibilityRole="button" onPress={onRemove} style={removeButtonStyle}>
          <IconXClose size="xs" tintColor={iconColor} />
        </Pressable>
      ) : null}
    </View>
  );
};

import type { TIconSize, TTagSize } from '@dsm/shared';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { FieldIcon } from '../TextField/FieldIcon';
import { IconX } from '../../../icons';
import type { ITagProps } from './Tag.types';
import { useTag } from './useTag';

/** Tag's own `sm`/`xs` steps share their names with Icon's — no mapping needed. */
const toIconSize = (size: TTagSize): TIconSize => size;

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
  const { label, size = 'sm', showLeadingIcon = false, icon, showRemove = false, onRemove, testID } = props;
  const { rootStyle, labelStyle, iconColor, removeButtonStyle } = useTag(props);

  return (
    <View style={rootStyle} testID={testID}>
      {showLeadingIcon && icon ? <FieldIcon name={icon} size={toIconSize(size)} tintColor={iconColor} /> : null}
      <Text style={labelStyle}>{label}</Text>
      {showRemove ? (
        <Pressable accessibilityLabel={`Quitar ${label}`} accessibilityRole="button" onPress={onRemove} style={removeButtonStyle}>
          <IconX size="xs" tintColor={iconColor} />
        </Pressable>
      ) : null}
    </View>
  );
};

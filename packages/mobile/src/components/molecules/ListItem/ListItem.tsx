import type { TIconSize, TListItemSize } from '@dsm/shared';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '../../atoms/Avatar';
import { FieldIcon } from '../../atoms/TextField/FieldIcon';
import type { IListItemProps } from './ListItem.types';
import { useListItem } from './useListItem';

/** ListItem's `size` shares its names with Icon's and Avatar's own steps — no mapping needed. */
const toIconSize = (size: TListItemSize): TIconSize => size;

/**
 * Mobile ListItem — the row of a list: a transaction, a contact, a product.
 *
 * Composes Avatar and Icon for its leading content, which makes it the
 * component that validates the rest of the system fits together. Not every
 * row navigates — pass `onPress` to make it a real target with its own
 * `pressed`/`focus` painting; leave it out for a row that is plain content.
 *
 * `trailing` renders inert on purpose: bDS classifies ListItem as having one
 * target, and a pressable Icon/Badge/Tag/IconButton in this slot would create
 * a second one.
 */
export const ListItem = ({ onPress, ...props }: IListItemProps): ReactElement => {
  const {
    label,
    leadingContent = 'none',
    icon = 'user',
    avatarType = 'initials',
    avatarInitials,
    avatarImageUrl,
    avatarTone = 'brand',
    size = 'md',
    showDescription = false,
    description,
    showTrailingText = false,
    trailingText,
    showTrailing = false,
    trailing,
    isDisabled = false,
    testID,
  } = props;

  const isInteractive = Boolean(onPress);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { rowStyle, leadingStyle, contentStyle, titleStyle, descriptionStyle, trailingTextStyle, iconColor, dividerStyle } =
    useListItem({ ...props, isInteractive, isPressed, isFocused });

  const content = (
    <>
      {leadingContent === 'icon' ? (
        <View style={leadingStyle}>
          <FieldIcon name={icon} size={toIconSize(size)} tintColor={iconColor} />
        </View>
      ) : leadingContent === 'avatar' ? (
        <View style={leadingStyle}>
          <Avatar imageUrl={avatarImageUrl} initials={avatarInitials} size={size} tone={avatarTone} type={avatarType} />
        </View>
      ) : null}
      <View style={contentStyle}>
        <Text style={titleStyle}>{label}</Text>
        {showDescription && description ? <Text style={descriptionStyle}>{description}</Text> : null}
        {dividerStyle ? <View style={dividerStyle} /> : null}
      </View>
      {showTrailingText && trailingText ? <Text style={trailingTextStyle}>{trailingText}</Text> : null}
      {showTrailing && trailing ? (
        <View importantForAccessibility="no-hide-descendants" pointerEvents="none">
          {trailing}
        </View>
      ) : null}
    </>
  );

  if (!isInteractive) {
    return (
      <View style={rowStyle} testID={testID}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={rowStyle}
      testID={testID}
    >
      {content}
    </Pressable>
  );
};

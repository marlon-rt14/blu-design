import type { TAvatarSize, TAvatarType, TIconSize } from '@dsm/shared';
import type { ReactElement } from 'react';
import { Image, Text, View } from 'react-native';

import { AvatarIndicator } from '../AvatarIndicator';
import { FieldIcon } from '../TextField/FieldIcon';
import type { IAvatarProps } from './Avatar.types';
import { useAvatar } from './useAvatar';

/**
 * Avatar's own glyph scale (12/16/20/28) doesn't land on every one of Icon's
 * steps — nearest fit, same approach TextField uses for its affix icons.
 */
const iconSizeForAvatar = (size: TAvatarSize): TIconSize => {
  switch (size) {
    case 'xs':
      return 'xs';
    case 'sm':
      return 'sm';
    case 'md':
      return 'md';
    case 'lg':
      return 'lg';
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
};

/** Person: photo -> initials -> icon. Entity: logo -> initials -> icon. */
const resolveType = (type: TAvatarType, imageUrl: string | undefined, initials: string | undefined): TAvatarType => {
  if ((type === 'image' || type === 'logo') && !imageUrl) {
    return initials ? 'initials' : 'icon';
  }
  return type;
};

/**
 * Mobile Avatar — a person's (or entity's) identity: their photo if there is
 * one, their initials if not, an icon as the last resort.
 *
 * Never the only way to identify someone — always pair it with their name in
 * text. The background tone is not a design choice made per screen: derive it
 * from the contact's own identifier so the same person keeps the same color
 * everywhere (see `TAvatarTone`).
 */
export const Avatar = (props: IAvatarProps): ReactElement => {
  const {
    type = 'initials',
    initials,
    icon = 'user',
    imageUrl,
    accessibilityLabel,
    size = 'md',
    showIndicator = false,
    status = 'online',
    testID,
  } = props;

  const { containerStyle, circleStyle, ringStyle, initialsStyle, iconColor, imageStyle, logoWrapperStyle, logoImageStyle, indicatorWrapperStyle } =
    useAvatar(props);
  const resolvedType = resolveType(type, imageUrl, initials);
  // A status dot with its ring covers the content at `xs` — see `IAvatarBaseProps.showIndicator`.
  const displayIndicator = showIndicator && size !== 'xs';
  const isDecorative = accessibilityLabel === undefined;

  return (
    <View
      accessibilityElementsHidden={isDecorative}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={isDecorative ? 'none' : 'image'}
      importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'yes'}
      style={containerStyle}
      testID={testID}
    >
      <View style={circleStyle}>
        {resolvedType === 'image' && imageUrl ? (
          <Image resizeMode="cover" source={{ uri: imageUrl }} style={imageStyle} />
        ) : resolvedType === 'logo' && imageUrl ? (
          <View style={logoWrapperStyle}>
            <Image resizeMode="contain" source={{ uri: imageUrl }} style={logoImageStyle} />
          </View>
        ) : resolvedType === 'icon' ? (
          <FieldIcon name={icon} size={iconSizeForAvatar(size)} tintColor={iconColor} />
        ) : (
          <Text style={initialsStyle}>{initials}</Text>
        )}
      </View>
      {ringStyle ? <View style={ringStyle} /> : null}
      {displayIndicator ? (
        <View style={indicatorWrapperStyle}>
          <AvatarIndicator size={size} status={status} />
        </View>
      ) : null}
    </View>
  );
};

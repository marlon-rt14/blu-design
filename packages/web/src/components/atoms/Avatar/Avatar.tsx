import type { TAvatarType } from '@dsm/shared';
import type { ReactElement } from 'react';

import { AvatarIndicator } from '../AvatarIndicator';
import type { IAvatarProps } from './Avatar.types';
import { useAvatar } from './useAvatar';

/** Person: photo -> initials -> icon. Entity: logo -> initials -> icon. */
const resolveType = (type: TAvatarType, imageUrl: string | undefined, initials: string | undefined): TAvatarType => {
  if ((type === 'image' || type === 'logo') && !imageUrl) {
    return initials ? 'initials' : 'icon';
  }
  return type;
};

/**
 * Web Avatar — a person's (or entity's) identity: their photo if there is
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
    icon,
    imageUrl,
    accessibilityLabel,
    size = 'md',
    showIndicator = false,
    status = 'online',
    testID,
  } = props;

  const { containerStyle, circleStyle, initialsStyle, iconWrapperStyle, imageStyle, logoWrapperStyle, logoImageStyle, indicatorWrapperStyle } =
    useAvatar(props);
  const resolvedType = resolveType(type, imageUrl, initials);
  // A status dot with its ring covers the content at `xs` — see `IAvatarBaseProps.showIndicator`.
  const displayIndicator = showIndicator && size !== 'xs';
  const isDecorative = accessibilityLabel === undefined;

  return (
    <span
      aria-hidden={isDecorative || undefined}
      aria-label={accessibilityLabel}
      data-testid={testID}
      role={isDecorative ? undefined : 'img'}
      style={containerStyle}
    >
      <span style={circleStyle}>
        {resolvedType === 'image' && imageUrl ? (
          <img alt="" src={imageUrl} style={imageStyle} />
        ) : resolvedType === 'logo' && imageUrl ? (
          <span style={logoWrapperStyle}>
            <img alt="" src={imageUrl} style={logoImageStyle} />
          </span>
        ) : resolvedType === 'icon' ? (
          <span style={iconWrapperStyle}>{icon}</span>
        ) : (
          <span style={initialsStyle}>{initials}</span>
        )}
      </span>
      {displayIndicator ? (
        <span style={indicatorWrapperStyle}>
          <AvatarIndicator size={size} status={status} />
        </span>
      ) : null}
    </span>
  );
};

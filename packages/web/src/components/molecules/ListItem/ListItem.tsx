import type { TIconSize, TListItemSize } from '@dsm/shared';
import { useState } from 'react';
import type { FocusEvent, KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { Avatar } from '../../atoms/Avatar';
import { FieldIcon } from '../../atoms/TextField/FieldIcon';
import type { IListItemProps } from './ListItem.types';
import { useListItem } from './useListItem';

/** ListItem's `size` shares its names with Icon's and Avatar's own steps — no mapping needed. */
const toIconSize = (size: TListItemSize): TIconSize => size;

/**
 * Web ListItem — the row of a list: a transaction, a contact, a product.
 *
 * Composes Avatar and Icon for its leading content, which makes it the
 * component that validates the rest of the system fits together. Not every
 * row navigates — pass `onClick` to make it a real target with its own
 * `hover`/`pressed`/`focus` painting; leave it out for a row that is plain
 * content, and the `state` axis simply never applies.
 *
 * `trailing` renders inert on purpose: bDS classifies ListItem as having one
 * target, and a clickable Icon/Badge/Tag/IconButton in this slot would create
 * a second one with its own focus order.
 *
 * @example
 * ```tsx
 * <ListItem
 *   avatarInitials="JG"
 *   description="Hoy, 14:32"
 *   label="Envío a Juan García"
 *   leadingContent="avatar"
 *   onClick={() => open(id)}
 *   showDescription
 *   showTrailingText
 *   trailingText="$1.250,00"
 * />
 * ```
 */
export const ListItem = (props: IListItemProps): ReactElement => {
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
    onClick,
  } = props;

  const isInteractive = Boolean(onClick);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const { rowStyle, leadingStyle, contentStyle, titleStyle, descriptionStyle, trailingTextStyle, iconColor, dividerStyle } =
    useListItem({ ...props, isInteractive, isHovered, isPressed, isFocusVisible });

  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (!isInteractive || isDisabled) return;
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!isInteractive || isDisabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>): void => {
    if (!isInteractive) return;
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));
  };

  const handleBlur = (): void => setIsFocusVisible(false);

  return (
    <div
      aria-disabled={isInteractive && isDisabled ? true : undefined}
      data-testid={testID}
      onBlur={isInteractive ? handleBlur : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onFocus={isInteractive ? handleFocus : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      onMouseEnter={isInteractive ? () => setIsHovered(true) : undefined}
      onMouseLeave={
        isInteractive
          ? () => {
              setIsHovered(false);
              setIsPressed(false);
            }
          : undefined
      }
      onPointerDown={isInteractive ? () => setIsPressed(true) : undefined}
      onPointerUp={isInteractive ? () => setIsPressed(false) : undefined}
      role={isInteractive ? 'button' : undefined}
      style={rowStyle}
      tabIndex={isInteractive ? (isDisabled ? -1 : 0) : undefined}
    >
      {leadingContent === 'icon' ? (
        <span style={{ ...leadingStyle, color: iconColor }}>
          <FieldIcon name={icon} size={toIconSize(size)} />
        </span>
      ) : leadingContent === 'avatar' ? (
        <span style={leadingStyle}>
          <Avatar
            imageUrl={avatarImageUrl}
            initials={avatarInitials}
            size={size}
            tone={avatarTone}
            type={avatarType}
          />
        </span>
      ) : null}
      <span style={contentStyle}>
        <span style={titleStyle}>{label}</span>
        {showDescription && description ? <span style={descriptionStyle}>{description}</span> : null}
        {dividerStyle ? <span style={dividerStyle} /> : null}
      </span>
      {showTrailingText && trailingText ? <span style={trailingTextStyle}>{trailingText}</span> : null}
      {showTrailing && trailing ? (
        <span aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {trailing}
        </span>
      ) : null}
    </div>
  );
};

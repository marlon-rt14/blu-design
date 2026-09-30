import { useState } from 'react';
import type { FocusEvent, KeyboardEvent, MouseEvent, ReactElement } from 'react';

import { Avatar } from '../../atoms/Avatar';
import type { IListItemProps } from './ListItem.types';
import { useListItem } from './useListItem';

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
 *   description="Hoy, 14:32"
 *   label="Envío a Juan García"
 *   leading={{ avatar: { initials: 'JG' } }}
 *   onClick={() => open(id)}
 *   trailingText="$1.250,00"
 * />
 * ```
 */
export const ListItem = (props: IListItemProps): ReactElement => {
  const {
    label,
    leading,
    size = 'md',
    description,
    trailingText,
    trailing,
    disabled = false,
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
    if (!isInteractive || disabled) return;
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!isInteractive || disabled) return;
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
      aria-disabled={isInteractive && disabled ? true : undefined}
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
      tabIndex={isInteractive ? (disabled ? -1 : 0) : undefined}
    >
      {leading?.icon !== undefined ? (
        <span style={{ ...leadingStyle, color: iconColor }}>{leading.icon}</span>
      ) : leading?.avatar !== undefined ? (
        <span style={leadingStyle}>
          <Avatar {...leading.avatar} size={size} />
        </span>
      ) : null}
      <span style={contentStyle}>
        <span style={titleStyle}>{label}</span>
        {description ? <span style={descriptionStyle}>{description}</span> : null}
        {dividerStyle ? <span style={dividerStyle} /> : null}
      </span>
      {trailingText ? <span style={trailingTextStyle}>{trailingText}</span> : null}
      {trailing ? (
        <span aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {trailing}
        </span>
      ) : null}
    </div>
  );
};

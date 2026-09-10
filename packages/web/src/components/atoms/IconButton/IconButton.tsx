import { useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import type { IIconButtonProps } from './IconButton.types';
import { useIconButton } from './useIconButton';

/**
 * Web IconButton — the same action as a Button, without the label.
 *
 * Use it only when the icon is unambiguous on its own, or when there is no room
 * for text: *"si hay duda sobre qué hace, lleva etiqueta y entonces es Button"*.
 *
 * **`label` is required and is the only name this control has.** There is no
 * visible text, so it becomes the `aria-label`. Say the action, not the
 * drawing: `"Cerrar aviso"`, never `"equis"`.
 *
 * Three of the seven appearances describe the surface underneath rather than a
 * shape — `on-scene`, `on-media` and `on-inverse` — and are not interchangeable.
 * `neutral` has a known problem on a Card in dark; see `TIconButtonAppearance`.
 *
 * @example
 * ```tsx
 * <IconButton icon={IconTrash} label="Eliminar" onPress={remove} />
 * <IconButton appearance="veil" icon={IconX} label="Cerrar aviso" onPress={close} size="sm" />
 * ```
 */
export const IconButton = (props: IIconButtonProps): ReactElement => {
  const { icon: Icon, label, onPress, testID, type = 'button' } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const { buttonStyle, iconSize, isDisabled } = useIconButton({
    ...props,
    isHovered,
    isPressed,
    isFocusVisible,
  });

  const handleMouseEnter = (): void => setIsHovered(true);
  // Also clears the press: releasing the pointer outside the button never fires
  // pointerup on it, which would leave it stuck in `pressed`.
  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setIsPressed(false);
  };
  // `:focus-visible` rather than plain focus, so clicking does not light the ring.
  const handleFocus = (event: FocusEvent<HTMLButtonElement>): void =>
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));

  return (
    <button
      aria-label={label}
      data-testid={testID}
      disabled={isDisabled}
      onBlur={() => setIsFocusVisible(false)}
      onClick={onPress}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={buttonStyle}
      type={type}
    >
      {/* No colour is passed: the glyph resolves to `currentColor` and inherits
          what the style above already set. A colour of its own here would break
          the six modes, which is exactly what the design documentation warns
          about. */}
      <Icon size={iconSize} />
    </button>
  );
};

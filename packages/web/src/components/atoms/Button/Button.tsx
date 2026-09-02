import { useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import type { IButtonProps } from './Button.types';
import { useButton } from './useButton';

/**
 * Web Button — the primary way to trigger an action.
 *
 * Renders a real `<button>`, so keyboard activation, form semantics and the
 * accessibility tree come from the platform rather than being reimplemented.
 *
 * Two independent axes drive the look: `variant` says what the action *means*
 * (`primary`, `danger`) and `appearance` says how much weight it carries
 * (`fill` › `soft` › `outline` › `ghost`, plus `on-inverse` for inverted
 * surfaces). Lower the hierarchy with `appearance`, never by changing `variant`.
 *
 * Styling is resolved inline from `buttonTokens[mode]` at render time — wrap the
 * app in `BluProvider`. Hover, press and focus are tracked here and handed to
 * `useButton`, the same way `TextArea` does it: with tokens resolved in
 * JavaScript there is no stylesheet to hang `:hover` off.
 *
 * @example
 * ```tsx
 * <Button label="Publicar" onClick={publish} />
 * <Button label="Guardar borrador" appearance="outline" onClick={saveDraft} />
 * <Button label="Eliminar" variant="danger" size="sm" onClick={remove} />
 * <Button label="Agregar" leadingIcon={IconPlus} onClick={add} />
 * ```
 */
export const Button = (props: IButtonProps): ReactElement => {
  const {
    label,
    onClick,
    testID,
    type = 'button',
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const { buttonStyle, iconSize, isDisabled } = useButton({
    ...props,
    isHovered,
    isPressed,
    isFocusVisible,
  });

  const handleMouseEnter = (): void => setIsHovered(true);
  // Also clears the press: releasing the pointer outside the button never fires
  // pointerup on it, which would otherwise leave it stuck in `pressed`.
  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handlePointerDown = (): void => setIsPressed(true);
  const handlePointerUp = (): void => setIsPressed(false);
  // `:focus-visible` rather than plain focus, so clicking does not light the ring.
  const handleFocus = (event: FocusEvent<HTMLButtonElement>): void =>
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));
  const handleBlur = (): void => setIsFocusVisible(false);

  return (
    <button
      data-testid={testID}
      disabled={isDisabled}
      onBlur={handleBlur}
      onClick={onClick}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={buttonStyle}
      type={type}
    >
      {/* No colour is passed: the icons resolve to `currentColor` and inherit
          the label colour the style above already set. bDS publishes
          `icon-default` and `icon-disabled` per group, but all 28 of them are
          byte-identical to their `text-*` twin in both themes, so inheriting is
          exact. If they ever diverge, this is the line that changes. */}
      {LeadingIcon ? <LeadingIcon size={iconSize} /> : null}
      {label}
      {TrailingIcon ? <TrailingIcon size={iconSize} /> : null}
    </button>
  );
};

import { useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import type { ILinkButtonProps } from './LinkButton.types';
import { useLinkButton } from './useLinkButton';

/**
 * Web LinkButton — an action wearing a link's face.
 *
 * **It does not change the URL.** It acts on the page it is on: opens, expands,
 * undoes. If the destination is another page or an external site, this is the
 * wrong component — that is a navigation, and it belongs in an anchor.
 *
 * Because it is an action, it renders a `<button>` with the button chrome
 * stripped, not an `<a>`. That also means the browser's `:visited` never
 * applies, which is why `isVisited` is a prop.
 *
 * `appearance` picks the surface the link sits on, and each one carries its own
 * colours — including the focus ring, which goes white on `on-inverse` and
 * `on-scene` because blue does not read there.
 *
 * @example
 * ```tsx
 * <LinkButton label="Ver más" onClick={expand} />
 * <LinkButton label="Deshacer" appearance="on-inverse" size="sm" onClick={undo} />
 * ```
 */
export const LinkButton = (props: ILinkButtonProps): ReactElement => {
  const { label, onClick, testID, type = 'button' } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const { linkStyle, isDisabled } = useLinkButton({
    ...props,
    isHovered,
    isPressed,
    isFocusVisible,
  });

  const handleMouseEnter = (): void => setIsHovered(true);
  // Also clears the press: releasing the pointer outside never fires pointerup
  // here, which would otherwise leave the link stuck in `pressed`.
  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleFocus = (event: FocusEvent<HTMLButtonElement>): void =>
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));

  return (
    <button
      data-testid={testID}
      disabled={isDisabled}
      onBlur={() => setIsFocusVisible(false)}
      onClick={onClick}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={linkStyle}
      type={type}
    >
      {label}
    </button>
  );
};

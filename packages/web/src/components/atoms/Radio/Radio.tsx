import { useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import type { IRadioProps } from './Radio.types';
import { useRadio } from './useRadio';

/**
 * Web Radio — one exclusive choice inside a group.
 *
 * **It never stands alone.** bDS is explicit: if there is only one option, that
 * is a Checkbox. And a group cannot be cleared once chosen — if the user has to
 * be able to go back to "none", the group is missing an explicit option for it.
 *
 * Renders a real `<input type="radio">`, hidden but present, with the visible
 * circle drawn beside it. That is deliberate: radios sharing a `name` get
 * arrow-key navigation, a roving tab order and form submission from the browser,
 * which is exactly what bDS asks for in code and is not worth reimplementing.
 * The `<label>` wraps both, so the whole row activates the option — bDS makes
 * the row the touch target, not just the circle.
 *
 * Controlled: the selection always comes from `isChecked` and the Radio never
 * changes it. Coordinating a group belongs to whatever owns it.
 *
 * Selection and focus share the same blue on purpose: *"lo que distingue
 * seleccionado de enfocado es la forma, no el color"*. The dot says selected,
 * the ring says focused, and both can be true at once.
 *
 * @example
 * ```tsx
 * <Radio label="Débito" name="metodo" value="debito" isChecked={m === 'debito'} onChange={pick} />
 * <Radio label="Crédito" name="metodo" value="credito" isChecked={m === 'credito'} onChange={pick} />
 * ```
 */
export const Radio = (props: IRadioProps): ReactElement => {
  const { label, showLabel = true, name, value, onChange, testID, isChecked = false } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const { rowStyle, boxStyle, dotStyle, labelStyle, inputStyle, isDisabled } = useRadio({
    ...props,
    isHovered,
    isPressed,
    isFocusVisible,
  });

  // Releasing the pointer outside never fires pointerup here, which would
  // otherwise leave the row stuck in `pressed`.
  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleFocus = (event: FocusEvent<HTMLInputElement>): void =>
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));

  return (
    <label
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={rowStyle}
    >
      <input
        // Only when the text is hidden: with it rendered, the wrapping `<label>`
        // already names the input, and both would be redundant.
        aria-label={showLabel ? undefined : label}
        data-testid={testID}
        disabled={isDisabled}
        name={name}
        onBlur={() => setIsFocusVisible(false)}
        checked={isChecked}
        onChange={onChange}
        onFocus={handleFocus}
        style={inputStyle}
        type="radio"
        value={value}
      />
      <span style={boxStyle}>{dotStyle ? <span style={dotStyle} /> : null}</span>
      {showLabel ? <span style={labelStyle}>{label}</span> : null}
    </label>
  );
};

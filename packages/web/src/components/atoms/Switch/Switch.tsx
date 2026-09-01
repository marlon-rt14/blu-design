import { useState } from 'react';
import type { ChangeEvent, FocusEvent, ReactElement } from 'react';

import type { ISwitchProps } from './Switch.types';
import { useSwitch } from './useSwitch';

/**
 * Web Switch — a binary on/off control with no label of its own.
 *
 * Renders a visually hidden `<input type="checkbox" role="switch">` over a
 * token-painted track + thumb. Hover overlay, pressed `bg-on-pressed` and
 * a 2px outer focus ring (`spread` − `offset`, no gap) come from `useSwitch`.
 *
 * Apple HIG iOS: a bare switch is not a screen piece — put it in
 * `SwitchItem` (list row). Outside a list, use a toggle button, not a
 * labelled switch. Do not add a `label` prop here.
 *
 * @example
 * ```tsx
 * const [on, setOn] = useState(false);
 * <Switch isChecked={on} onChange={setOn} />
 * <Switch isChecked={on} onChange={setOn} size="sm" showStateLabel />
 * ```
 */
export const Switch = (props: ISwitchProps): ReactElement => {
  const {
    isChecked = false,
    isDisabled = false,
    showStateLabel = false,
    onLabel = 'ON',
    offLabel = 'OFF',
    onChange,
    onFocus,
    onBlur,
    id,
    name,
    testID,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const {
    hitTargetStyle,
    trackStyle,
    overlayStyle,
    thumbStyle,
    travelStyle,
    labelStyle,
    inputStyle,
  } = useSwitch({ ...props, isChecked, isDisabled, isHovered, isPressed, isFocusVisible });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(event.target.checked);
  };
  const handleFocus = (event: FocusEvent<HTMLInputElement>): void => {
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));
    onFocus?.(event);
  };
  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    setIsFocusVisible(false);
    onBlur?.(event);
  };

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={hitTargetStyle}
    >
      <input
        aria-checked={isChecked}
        checked={isChecked}
        data-testid={testID}
        disabled={isDisabled}
        id={id}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        role="switch"
        style={inputStyle}
        type="checkbox"
      />
      <span style={trackStyle}>
        {overlayStyle ? <span style={overlayStyle} /> : null}
        <span style={thumbStyle} />
        <span style={travelStyle}>
          {showStateLabel ? <span style={labelStyle}>{isChecked ? onLabel : offLabel}</span> : null}
        </span>
      </span>
    </span>
  );
};

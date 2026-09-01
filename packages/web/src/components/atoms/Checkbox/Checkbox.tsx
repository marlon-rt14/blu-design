import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, ReactElement } from 'react';

import { IconCheck, IconMinus } from '../../../icons';
import type { ICheckboxProps } from './Checkbox.types';
import { useCheckbox } from './useCheckbox';

export const Checkbox = (props: ICheckboxProps): ReactElement => {
  const {
    isChecked = false,
    isIndeterminate = false,
    isDisabled = false,
    label,
    showLabel = true,
    accessibilityLabel,
    onChange,
    onFocus,
    onBlur,
    id,
    name,
    testID,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const {
    rowStyle,
    boxSlotStyle,
    boxStyle,
    overlayStyle,
    labelStyle,
    inputStyle,
    isSelected,
    markIconSize,
  } = useCheckbox({ ...props, isChecked, isIndeterminate, isDisabled, isHovered, isPressed, isFocusVisible });

  // Native `indeterminate` is a DOM property, not an attribute.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

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

  const ariaChecked: boolean | 'mixed' = isIndeterminate ? 'mixed' : isChecked;
  const markColor = isDisabled ? 'disabled' : 'fixed.white';
  const Mark = isIndeterminate ? IconMinus : IconCheck;

  return (
    <label
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={rowStyle}
    >
      <input
        aria-checked={ariaChecked}
        aria-label={showLabel ? undefined : accessibilityLabel}
        checked={isIndeterminate ? false : isChecked}
        data-testid={testID}
        disabled={isDisabled}
        id={id}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        ref={inputRef}
        style={inputStyle}
        type="checkbox"
      />
      <span style={boxSlotStyle}>
        <span style={boxStyle}>
          {overlayStyle ? <span style={overlayStyle} /> : null}
          {isSelected ? <Mark color={markColor} size={markIconSize} /> : null}
        </span>
      </span>
      {showLabel && label ? <span style={labelStyle}>{label}</span> : null}
    </label>
  );
};

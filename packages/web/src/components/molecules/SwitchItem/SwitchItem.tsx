import { useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import { Switch } from '../../atoms/Switch';
import type { ISwitchItemProps } from './SwitchItem.types';
import { useSwitchItem } from './useSwitchItem';

/**
 * Web SwitchItem — the iOS-canonical Switch usage. A list row whose
 * content is the label; the entire row is the control (`<label>` wrapping
 * the Switch input). Focus ring is on the row, not the thumb.
 *
 * Apple HIG: use switch style only in a list row. Immediate toggle, no
 * confirm. Do not put a label on the Switch itself.
 *
 * @example
 * ```tsx
 * const [on, setOn] = useState(true);
 * <SwitchItem label="Notifications" isChecked={on} onChange={setOn} />
 * <SwitchItem label="Wi-Fi" description="Connected" showDescription isChecked={on} onChange={setOn} />
 * ```
 */
export const SwitchItem = (props: ISwitchItemProps): ReactElement => {
  const {
    isChecked = false,
    size = 'md',
    label,
    showDescription = false,
    description,
    showDivider = true,
    isDisabled = false,
    showStateLabel = false,
    onLabel,
    offLabel,
    onChange,
    onFocus,
    onBlur,
    testID,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const { rowStyle, overlayStyle, textColumnStyle, labelStyle, descriptionStyle, dividerStyle } = useSwitchItem({
    ...props,
    isHovered,
    isPressed,
    isFocusVisible,
  });

  const handleFocus = (event: FocusEvent<HTMLInputElement>): void => {
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));
    onFocus?.(event);
  };
  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    setIsFocusVisible(false);
    onBlur?.(event);
  };

  return (
    <label
      data-testid={testID}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={rowStyle}
    >
      {overlayStyle ? <span style={overlayStyle} /> : null}
      <span style={textColumnStyle}>
        <span style={labelStyle}>{label}</span>
        {showDescription && description ? <span style={descriptionStyle}>{description}</span> : null}
      </span>
      <Switch
        isChecked={isChecked}
        isContained
        isDisabled={isDisabled}
        offLabel={offLabel}
        onBlur={handleBlur}
        onChange={onChange}
        onFocus={handleFocus}
        onLabel={onLabel}
        showStateLabel={showStateLabel}
        size={size}
      />
      {showDivider ? <span style={dividerStyle} /> : null}
    </label>
  );
};

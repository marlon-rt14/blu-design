import { useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import { useCheckbox } from '../../atoms/Checkbox/useCheckbox';
import { useRadio } from '../../atoms/Radio/useRadio';
import { IconCheck, IconMinus } from '../../../icons';
import type { IChoiceItemProps } from './ChoiceItem.types';
import { useChoiceItem } from './useChoiceItem';

/** The live interaction state every control needs to paint itself. */
interface IControlProps {
  isChecked: boolean;
  isDisabled: boolean;
  label: string;
  size: 'sm' | 'md';
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

/**
 * The radio circle, borrowed from the `Radio` atom.
 *
 * Only its `boxStyle` and `dotStyle` are used: the row owns the `<label>` and
 * the `<input>`, so the atom's own wrapper would nest one label inside another
 * — invalid HTML. Reusing the hook keeps a single source of truth for how the
 * circle looks without touching the atom.
 *
 * It is a component rather than an inline call because hooks cannot be called
 * conditionally, and the control depends on the `control` prop.
 */
const RadioControl = (props: IControlProps): ReactElement => {
  const { boxStyle, dotStyle } = useRadio(props);

  return <span style={boxStyle}>{dotStyle ? <span style={dotStyle} /> : null}</span>;
};

/** The checkbox box, borrowed from the `Checkbox` atom for the same reason. */
const CheckboxControl = (props: IControlProps): ReactElement => {
  const { boxSlotStyle, boxStyle, overlayStyle, isSelected, isIndeterminate, markIconSize } =
    useCheckbox(props);
  const Mark = isIndeterminate ? IconMinus : IconCheck;

  return (
    <span style={boxSlotStyle}>
      <span style={boxStyle}>
        {overlayStyle ? <span style={overlayStyle} /> : null}
        {isSelected ? (
          <Mark color={props.isDisabled ? 'disabled' : 'fixed.white'} size={markIconSize} />
        ) : null}
      </span>
    </span>
  );
};

/**
 * Web ChoiceItem — a selectable option as a whole row.
 *
 * Unlike a bare `Radio` or `Checkbox`, **the touch target is the entire row**
 * and the control on the left only says what kind of choice it is. The row is
 * the `<label>` and owns the `<input>`, so a click anywhere in it toggles the
 * option, and the focus ring is drawn on the row rather than only on the
 * control.
 *
 * **A chosen row is never tinted.** The control changes shape, which satisfies
 * WCAG 1.4.1 without colouring the row — bDS removed the tint and the 3px
 * indicator bar on 2025-09-01 because at full width they read as a *highlighted*
 * row rather than a chosen option.
 *
 * With `control="radio"`, give every row in the group the same `name`: that is
 * what hands the arrow keys and the roving tab order to the browser.
 *
 * @example
 * ```tsx
 * <RadioGroup legend="Plan">
 *   {planes.map((p) => (
 *     <ChoiceItem
 *       description={p.detalle}
 *       isChecked={plan === p.id}
 *       key={p.id}
 *       label={p.nombre}
 *       name="plan"
 *       onChange={() => setPlan(p.id)}
 *       showDescription
 *       showTrailingText
 *       trailingText={p.cuota}
 *     />
 *   ))}
 * </RadioGroup>
 * ```
 */
export const ChoiceItem = (props: IChoiceItemProps): ReactElement => {
  const {
    label,
    control = 'radio',
    isChecked = false,
    size = 'sm',
    showDescription = false,
    description,
    showTrailingText = false,
    trailingText,
    name,
    value,
    onChange,
    testID,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const {
    rowStyle,
    contentStyle,
    labelStyle,
    descriptionStyle,
    trailingStyle,
    dividerStyle,
    inputStyle,
    isDisabled,
  } = useChoiceItem({ ...props, isHovered, isPressed, isFocusVisible });

  const controlProps = { isChecked, isDisabled, label, size, isHovered, isPressed, isFocusVisible };
  const Control = control === 'radio' ? RadioControl : CheckboxControl;

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
        checked={isChecked}
        data-testid={testID}
        disabled={isDisabled}
        name={name}
        onBlur={() => setIsFocusVisible(false)}
        onChange={onChange}
        onFocus={handleFocus}
        style={inputStyle}
        type={control}
        value={value}
      />
      <Control {...controlProps} />
      <span style={contentStyle}>
        <span style={labelStyle}>{label}</span>
        {showDescription && description ? (
          <span style={descriptionStyle}>{description}</span>
        ) : null}
        {dividerStyle ? <span style={dividerStyle} /> : null}
      </span>
      {showTrailingText && trailingText ? (
        <span style={trailingStyle}>{trailingText}</span>
      ) : null}
    </label>
  );
};

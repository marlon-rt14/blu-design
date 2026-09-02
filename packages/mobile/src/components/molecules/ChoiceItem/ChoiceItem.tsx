import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

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
  isPressed: boolean;
  isFocused: boolean;
}

/**
 * The radio circle, borrowed from the `Radio` atom.
 *
 * Only its `boxStyle` and `dotStyle` are used: the row owns the `Pressable`, so
 * the atom's own would nest one pressable inside another and split the touch
 * target in two. Reusing the hook keeps a single source of truth for how the
 * circle looks without touching the atom.
 *
 * It is a component rather than an inline call because hooks cannot be called
 * conditionally, and the control depends on the `control` prop.
 */
const RadioControl = (props: IControlProps): ReactElement => {
  const { boxStyle, dotStyle } = useRadio(props);

  return (
    <View style={[boxStyle, { alignItems: 'center', justifyContent: 'center' }]}>
      {dotStyle ? <View style={dotStyle} /> : null}
    </View>
  );
};

/** The checkbox box, borrowed from the `Checkbox` atom for the same reason. */
const CheckboxControl = (props: IControlProps): ReactElement => {
  const { boxStyle, isSelected, isIndeterminate, markIconSize } = useCheckbox(props);
  const Mark = isIndeterminate ? IconMinus : IconCheck;

  return (
    <View style={boxStyle}>
      {isSelected ? (
        <Mark size={markIconSize} tintColor={props.isDisabled ? undefined : '#ffffff'} />
      ) : null}
    </View>
  );
};

/**
 * React Native ChoiceItem — a selectable option as a whole row.
 *
 * Unlike a bare `Radio` or `Checkbox`, **the touch target is the entire row**
 * and the control on the left only says what kind of choice it is.
 *
 * **A chosen row is never tinted.** The control changes shape, which satisfies
 * WCAG 1.4.1 without colouring the row — bDS removed the tint and the 3px
 * indicator bar on 2025-09-01 because at full width they read as a *highlighted*
 * row rather than a chosen option.
 *
 * The selection has to be held above the row: there is no native grouping here,
 * so nothing unmarks a sibling when another is picked. `RadioGroup` is where
 * that lives.
 *
 * @example
 * ```tsx
 * <ChoiceItem
 *   isChecked={plan === 'anual'}
 *   label="Anual"
 *   onPress={() => setPlan('anual')}
 *   showTrailingText
 *   trailingText="$ 1.200"
 * />
 * ```
 */
export const ChoiceItem = ({ onPress, ...props }: IChoiceItemProps): ReactElement => {
  const {
    label,
    control = 'radio',
    isChecked = false,
    size = 'sm',
    showDescription = false,
    description,
    showTrailingText = false,
    trailingText,
    testID,
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const {
    rowStyle,
    contentStyle,
    labelStyle,
    descriptionStyle,
    trailingStyle,
    dividerStyle,
    isDisabled,
  } = useChoiceItem({ ...props, isPressed, isFocused });

  const controlProps = { isChecked, isDisabled, label, size, isPressed, isFocused };
  const Control = control === 'radio' ? RadioControl : CheckboxControl;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={control}
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      disabled={isDisabled}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={rowStyle}
      testID={testID}
    >
      <Control {...controlProps} />
      <View style={contentStyle}>
        <Text style={labelStyle}>{label}</Text>
        {showDescription && description ? (
          <Text style={descriptionStyle}>{description}</Text>
        ) : null}
        {dividerStyle ? <View style={dividerStyle} /> : null}
      </View>
      {showTrailingText && trailingText ? (
        <Text style={trailingStyle}>{trailingText}</Text>
      ) : null}
    </Pressable>
  );
};

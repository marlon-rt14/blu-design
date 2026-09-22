import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import type { ICheckboxGroupProps } from './CheckboxGroup.types';
import { useCheckboxGroup } from './useCheckboxGroup';

/**
 * React Native CheckboxGroup — a group of options where several or none
 * may be chosen.
 *
 * The native counterpart of the `<fieldset>` and `<legend>`: it asks the
 * question, groups the rows and shows the helper or the error. It does not
 * draw the rows — they arrive as children. The canonical row is
 * `ChoiceItem` with `control="checkbox"`.
 *
 * The wrapping `View` is not `accessible` and has no `radiogroup` role —
 * that would swallow the nested checkboxes. Legend is visible text; helper
 * uses a live region when `isInvalid`.
 *
 * Three things it deliberately does not do: no lateral padding (that is
 * screen margin), no disabled state (disable each row instead), and no
 * tinting of the chosen row (the control already says so by changing shape).
 *
 * @example
 * ```tsx
 * <CheckboxGroup helperText="Elige al menos una" legend="Notificaciones">
 *   {CANALES.map((c) => (
 *     <ChoiceItem
 *       control="checkbox"
 *       isChecked={seleccion.has(c)}
 *       key={c}
 *       label={c}
 *       onPress={() => toggle(c)}
 *     />
 *   ))}
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup = (props: ICheckboxGroupProps): ReactElement => {
  const {
    children,
    legend,
    showLegend = true,
    helperText,
    showHelper = true,
    isInvalid = false,
    testID,
  } = props;
  const { groupStyle, legendStyle, rowsStyle, helperStyle } = useCheckboxGroup(props);
  const hasHelper = showHelper && helperText !== undefined;

  return (
    <View style={groupStyle} testID={testID}>
      {showLegend ? <Text style={legendStyle}>{legend}</Text> : null}
      <View style={rowsStyle}>{children}</View>
      {hasHelper ? (
        <Text accessibilityLiveRegion={isInvalid ? 'assertive' : 'polite'} style={helperStyle}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

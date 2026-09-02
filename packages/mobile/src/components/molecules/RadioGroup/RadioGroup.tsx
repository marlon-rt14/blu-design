import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import type { IRadioGroupProps } from './RadioGroup.types';
import { useRadioGroup } from './useRadioGroup';

/**
 * React Native RadioGroup — a group of options where exactly one is chosen.
 *
 * The native counterpart of the `<fieldset>` and `<legend>` bDS describes: it
 * asks the question, groups the rows and shows the helper or the error. It does
 * not draw the rows — they arrive as children.
 *
 * `accessibilityRole="radiogroup"` is what tells VoiceOver and TalkBack that the
 * rows belong together. Unlike web there is no native grouping underneath, so
 * **the selection has to be held above the group** — nothing here unmarks a
 * sibling when another is picked.
 *
 * Three things it deliberately does not do: no lateral padding (that is screen
 * margin), no disabled state (disable each row instead — a slot cannot promise
 * what is inside it), and no tinting of the chosen row (the control already says
 * so by changing shape).
 *
 * @example
 * ```tsx
 * <RadioGroup helperText="Se puede cambiar después" legend="Método de pago">
 *   {METODOS.map((m) => (
 *     <Radio isChecked={metodo === m} key={m} label={m} onPress={() => setMetodo(m)} />
 *   ))}
 * </RadioGroup>
 * ```
 */
export const RadioGroup = (props: IRadioGroupProps): ReactElement => {
  const {
    children,
    legend,
    showLegend = true,
    helperText,
    showHelper = true,
    isInvalid = false,
    testID,
  } = props;
  const { groupStyle, legendStyle, rowsStyle, helperStyle } = useRadioGroup(props);
  const hasHelper = showHelper && helperText !== undefined;

  return (
    <View
      accessibilityLabel={legend}
      accessibilityRole="radiogroup"
      style={groupStyle}
      testID={testID}
    >
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

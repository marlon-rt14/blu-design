import type { ReactElement } from 'react';

import type { IRadioGroupProps } from './RadioGroup.types';
import { useRadioGroup } from './useRadioGroup';

/**
 * Web RadioGroup — a group of options where exactly one is chosen.
 *
 * **It is the `<fieldset>` with its `<legend>`**, which is what bDS calls it and
 * what this renders: the question, the rows, and the helper or the error. It
 * does not draw the rows — they arrive as children.
 *
 * Reach for this and not a checkbox group when **one** option is chosen. The
 * difference is semantic rather than visual, and it lands here as
 * `role="radiogroup"`. Because there is always one chosen, bring a selection in
 * by default.
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
 *     <Radio isChecked={metodo === m} key={m} label={m} name="metodo" onChange={() => setMetodo(m)} />
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
    testID,
  } = props;
  const { fieldsetStyle, legendStyle, rowsStyle, helperStyle } = useRadioGroup(props);
  const hasHelper = showHelper && helperText !== undefined;

  return (
    <fieldset
      // `role` on a fieldset is what turns it into a radiogroup for assistive
      // tech; the element alone only groups. The arrow-key behaviour comes from
      // the native inputs sharing a `name`, not from here.
      aria-label={showLegend ? undefined : legend}
      data-testid={testID}
      role="radiogroup"
      style={fieldsetStyle}
    >
      {/* Hidden visually keeps the fieldset's accessible name coming from
          `aria-label` above instead — a `<legend>` that renders nothing would
          leave the group unnamed. */}
      {showLegend ? <legend style={legendStyle}>{legend}</legend> : null}
      <div style={rowsStyle}>{children}</div>
      {hasHelper ? (
        <p aria-live={props.isInvalid ? 'assertive' : undefined} style={helperStyle}>
          {helperText}
        </p>
      ) : null}
    </fieldset>
  );
};

import type { ReactElement } from 'react';

import type { ICheckboxGroupProps } from './CheckboxGroup.types';
import { useCheckboxGroup } from './useCheckboxGroup';

/**
 * Web CheckboxGroup — a group of options where several or none may be chosen.
 *
 * **It is the `<fieldset>` with its `<legend>`**: the question, the rows, and
 * the helper or the error. It does not draw the rows — they arrive as
 * children. The canonical row is `ChoiceItem` with `control="checkbox"`.
 *
 * Reach for this and not a radio group when **several** options or none are
 * chosen. Leave the fieldset as a group — do not set `role="radiogroup"`.
 *
 * Three things it deliberately does not do: no lateral padding (that is
 * screen margin), no disabled state (disable each row instead — a slot
 * cannot promise what is inside it), and no tinting of the chosen row (the
 * control already says so by changing shape).
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
 *       onChange={() => toggle(c)}
 *     />
 *   ))}
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup = (props: ICheckboxGroupProps): ReactElement => {
  const { children, legend, showLegend = true, helperText, showHelper = true, testID } = props;
  const { fieldsetStyle, legendStyle, rowsStyle, helperStyle } = useCheckboxGroup(props);
  const hasHelper = showHelper && helperText !== undefined;

  return (
    <fieldset
      aria-label={showLegend ? undefined : legend}
      data-testid={testID}
      style={fieldsetStyle}
    >
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

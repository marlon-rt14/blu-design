import { useId } from 'react';
import type { ReactElement } from 'react';

import type { IProgressBarProps } from './ProgressBar.types';
import { useProgressBar } from './useProgressBar';

/**
 * Web ProgressBar — how far along something with a beginning and an end is.
 *
 * **It informs; it is not a control.** No disabled, no hover, no pressed, no
 * state axis: *"la barra informa, no se toca"*.
 *
 * ### `role="progressbar"`, not a div with a width
 *
 * A `<progress>` element would also do — bDS allows either — and this is the
 * div, because `<progress>` is barely styleable across browsers while the role
 * gives the same semantics. What matters is that the value is announced
 * through `aria-valuenow`, **and that nothing announces every change**: a bar
 * that speaks at each percent *"es inusable con lector"*, so there is no live
 * region here on purpose.
 *
 * `label` names the bar, because *"'75 %' sin contexto no es información"*.
 * Without it the bar is unnamed — it still reports its value, but nothing says
 * what the value is about.
 *
 * ### `status` is meaning, not palette
 *
 * *"Un ProgressBar en danger no es una barra roja bonita, es un progreso que va
 * mal."* Pick it by what the number means, never by the colour you want.
 *
 * @example
 * ```tsx
 * <ProgressBar label="Subiendo el documento" value={upload} />
 * <ProgressBar label="Cupo usado" status="warning" value={82} />
 * ```
 */
export const ProgressBar = (props: IProgressBarProps): ReactElement => {
  const { label, showValue = true, testID } = props;
  const {
    trackStyle,
    fillStyle,
    headerStyle,
    labelStyle,
    valueStyle,
    clamped,
    percentage,
    hasHeader,
    labelVisible,
  } = useProgressBar(props);

  const labelId = useId();

  return (
    <div data-testid={testID} style={{ width: '100%' }}>
      {hasHeader ? (
        <div style={headerStyle}>
          {labelVisible ? (
            <span id={labelId} style={labelStyle}>
              {label}
            </span>
          ) : null}
          {showValue ? <span style={valueStyle}>{percentage}</span> : null}
        </div>
      ) : null}
      <div
        // Two ways to the same name, and which one depends on whether the text
        // is on screen: point at it when it is, carry it when it is not.
        // Hiding the label never costs the bar its name.
        aria-label={label !== undefined && !labelVisible ? label : undefined}
        aria-labelledby={labelVisible ? labelId : undefined}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={clamped}
        role="progressbar"
        style={trackStyle}
      >
        <div style={fillStyle} />
      </div>
    </div>
  );
};

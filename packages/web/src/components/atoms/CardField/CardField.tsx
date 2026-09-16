import { useId } from 'react';
import type { ReactElement } from 'react';

import { CardBrandLogo } from './CardBrandLogo';
import type { ICardFieldProps } from './CardField.types';
import { useCardField } from './useCardField';

/**
 * Web CardField — one of the three fields a card needs.
 *
 * `part` picks which, and with it the keyboard hint, the accepted length, the
 * autocomplete token and whether the characters are masked. Everything else —
 * the box, the floating label, the helper line, the three sizes — is shared,
 * which is why the three parts are one component and not three. See
 * `ICardFieldBaseProps` for the reasoning and `docs/pendientes-diseno.md` for
 * the open decision behind it.
 *
 * **It does not format the value.** `4539 1488 0343 6467` arrives grouped from
 * a formatter; the component stores and emits what it is given. bDS: *"el
 * formato lo pone el formateador, no el componente"*.
 *
 * **The brand is detected, not chosen.** With `part='number'` the logo comes
 * from the digits typed so far. Passing `brand` overrides that; nothing else
 * can.
 *
 * ### Two rules that are not about drawing
 *
 * - **Never store or show the full number.** The component masks nothing by
 *   itself for `part='number'` — masking on blur belongs to the screen that owns
 *   the value, because the component never sees it twice.
 * - **The CVV is masked as typed and never autocompleted.** That one *is* here:
 *   `type="password"` and an autocomplete token browsers do not fill.
 *
 * @example
 * ```tsx
 * <CardField part="number" label="Numero de tarjeta" value={number} onChangeText={setNumber} />
 * <CardField part="expiry" label="Vencimiento" value={expiry} onChangeText={setExpiry} />
 * <CardField part="cvv" label="CVV" value={cvv} onChangeText={setCvv} error={cvvError} />
 * ```
 */
export const CardField = (props: ICardFieldProps): ReactElement => {
  const { label, value, onChangeText, readOnly = false, disabled = false, testID } = props;
  const {
    containerStyle,
    labelStyle,
    inputStyle,
    helperStyle,
    brandPlate,
    inputProps,
    brand,
    isFloating,
    message,
    handlers,
  } = useCardField(props);

  const inputId = useId();
  const messageId = `${inputId}-message`;

  return (
    <div style={{ width: '100%' }}>
      {/* The label is a real `<label>` so a click lands in the input and the
          accessible name is the field's own — bDS: "los tres campos son tres
          campos: cada uno con su etiqueta propia". */}
      <label htmlFor={inputId} style={containerStyle} {...handlers}>
        <span style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
          <span style={labelStyle}>{label}</span>
          <input
            {...inputProps}
            aria-describedby={message === undefined ? undefined : messageId}
            aria-invalid={message?.isError === true ? true : undefined}
            data-testid={testID}
            disabled={disabled}
            id={inputId}
            onBlur={handlers.onBlur}
            onChange={(event) => onChangeText(event.target.value)}
            onFocus={handlers.onFocus}
            // While the label is floated it is already on screen, so repeating
            // it inside the box would show the same words twice. Unfloated, the
            // label *is* the placeholder — one string, never two to maintain.
            placeholder={isFloating ? undefined : label}
            readOnly={readOnly}
            style={inputStyle}
            value={value}
          />
        </span>
        {brand === undefined ? null : <CardBrandLogo {...brandPlate} brand={brand} />}
      </label>
      {message === undefined ? null : (
        // `role="alert"` only on the error: a helper line that announces itself
        // every render is noise, and bDS puts the error in the message — "el
        // error lo comunica el mensaje, no el color".
        <span
          id={messageId}
          role={message.isError ? 'alert' : undefined}
          style={helperStyle}
        >
          {message.text}
        </span>
      )}
    </div>
  );
};

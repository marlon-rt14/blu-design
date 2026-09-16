import type { TCardBrand } from '../../data/cardBrands';

/**
 * Which of the three card fields this is.
 *
 * **Required, and it decides the behaviour**: the keyboard, the accepted length,
 * the autocomplete hint and whether the characters are masked. The values live
 * in `CARD_FIELD_PART_RULES`.
 *
 * bDS keeps the three in one Figma component *"solo para que compartan estilo"*,
 * and is candid that whether they should be one component or three is an open
 * architecture decision. They are one here, with this as the discriminant — see
 * `docs/pendientes-diseno.md` for why, and for what makes splitting them
 * mechanical if that decision lands the other way.
 */
export type TCardFieldPart = 'number' | 'expiry' | 'cvv';

/**
 * Edge of the field: `sm` 32 · `md` 44 · `lg` 56 — the same ramp as the Button
 * and the other fields.
 *
 * Three anatomies rather than three scales, like every field in bDS: `sm` is a
 * single line and **never floats the label**, because a floating label plus the
 * value occupy 42 and do not fit in 44 even with zero padding. The
 * placeholder-or-value split still holds in `sm` — a full `sm` field shows the
 * value, not the label.
 */
export type TCardFieldSize = 'sm' | 'md' | 'lg';

/** Everything the three parts share, which is nearly all of it. */
export interface ICardFieldCommonProps {
  /**
   * The field's name, and its placeholder: in `md` and `lg` it sits inside the
   * box until there is a value and then floats above it.
   *
   * **One per instance, deliberately.** In Figma there are three label
   * properties — `label`, `labelExpiry`, `labelCvv` — and only one applies per
   * variant; `part` already says which. bDS calls that *"la divergencia más
   * grande del componente"*, because an exporter reading Figma literally would
   * emit six props.
   *
   * It also carries an accessibility rule: *"los tres campos son tres campos:
   * cada uno con su etiqueta propia y su propio mensaje de error. Un solo 'Datos
   * de la tarjeta' para los tres deja al lector de pantalla sin saber en cuál
   * está."*
   */
  label: string;
  /**
   * The value, **already formatted**. The component does not group the digits —
   * *"el formato lo pone el formateador, no el componente"*.
   */
  value: string;
  /** Called on every keystroke with what the field now holds. */
  onChangeText: (value: string) => void;
  /**
   * Edge of the field.
   *
   * @defaultValue `'md'`
   *
   * Figma's panel reports the largest value because its axis runs from largest
   * to smallest; the development documentation fixes the default at `md`.
   */
  size?: TCardFieldSize;
  /**
   * Supporting text under the field. Its presence replaces Figma's `showHelper`
   * boolean — there is nothing to show without a string.
   */
  helperText?: string;
  /**
   * The error message. **Its presence puts the field in the error state**, which
   * is why there is no separate `isInvalid`, and it has to say something:
   * *"el error lo comunica el mensaje, no el color"*.
   */
  error?: string;
  /**
   * Whether the value is shown but not editable.
   *
   * @defaultValue `false`
   */
  readOnly?: boolean;
  /**
   * Whether the field is unavailable.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile.
   */
  testID?: string;
}

/**
 * Platform-agnostic contract for the CardField.
 *
 * One of the three fields a card needs. `part` picks which, and with it the
 * keyboard, the length, the autocomplete hint and the masking — everything that
 * makes a card field a card field rather than a text input.
 *
 * ### It is a discriminated union, and that is the point
 *
 * `brand` only exists when `part` is `'number'`. A card brand means nothing next
 * to an expiry date or a CVV, so the type makes `<CardField part="cvv"
 * brand="visa" />` a compile error instead of a no-op. That is what a single
 * component with a `part` prop otherwise gives up against three separate
 * components, and it is the only thing it gives up.
 *
 * The second arm simply **omits** `brand` rather than declaring it `never`, and
 * that was measured rather than assumed. Omitting it gives
 * `TS2353: Object literal may only specify known properties, and 'brand' does
 * not exist in type …`, which names the problem; `brand?: never` gives
 * `TS2322: Type 'string' is not assignable to type 'TCardBrand | undefined'`,
 * which names the wrong thing. The cost is one narrowing inside the component —
 * `props.part === 'number' ? props.brand : undefined` — and it is worth it.
 *
 * ### What is not a prop
 *
 * - **`isFilled`** is a Figma-only axis. Whether the field is full is derived
 *   from `value`, the only thing that can be true at runtime.
 * - **`validation`** is a Figma axis with `warning` and `success` alongside
 *   `error`. The contract has only `error`, so those two states are not
 *   reachable and their tokens are deliberately left unread.
 * - **`brand` is not really chosen either**, even where it exists: *"la marca se
 *   deduce del número en código, nunca la elige quien diseña"*. `detectCardBrand`
 *   does that from `value`; the prop is an override for the cases where the
 *   caller already knows, and for Storybook.
 *
 * ### Two rules that are not about drawing
 *
 * - **Never store or show the full number.** bDS states it twice, in the
 *   component description and in the a11y notes.
 * - **The CVV is not persisted and not autocompleted.** It is a payment rule,
 *   not a design decision.
 *
 * @example
 * ```tsx
 * <CardField part="number" label="Numero de tarjeta" value={number} onChangeText={setNumber} />
 * <CardField part="expiry" label="Vencimiento" value={expiry} onChangeText={setExpiry} />
 * <CardField part="cvv" label="CVV" value={cvv} onChangeText={setCvv} />
 * ```
 */
export type ICardFieldBaseProps =
  | (ICardFieldCommonProps & {
      part: 'number';
      /**
       * The detected brand, whose logo sits at the end of the field.
       *
       * Leave it out and the component detects it from `value`, which is the
       * intended behaviour. Pass it to override — never to decide.
       */
      brand?: TCardBrand;
    })
  | (ICardFieldCommonProps & {
      part: 'expiry' | 'cvv';
    });

import type { TCountryCode } from '../../data/countries';

/**
 * Edge of the field: `sm` 32 · `md` 44 · `lg` 56 — the same ramp as the Button
 * and the other fields, so an `md` button and an `md` field line up.
 *
 * **These are three different anatomies, not three scales of one.** `sm` is a
 * single line and **never floats the label**; `md` and `lg` do. bDS gives the
 * measurement behind it: a floating label plus the value occupy 42, which does
 * not fit in 44 even with zero padding. So `sm` is for filters and dense rows,
 * `md` for compact forms and `lg` for normal ones.
 *
 * In `sm` the placeholder-or-value split still holds: a full `sm` field shows
 * the value, not the label.
 */
export type TPhoneFieldSize = 'sm' | 'md' | 'lg';

/**
 * Whether the field carries the country selector in front of the number.
 *
 * A Figma variant axis, and **half the component set**: 72 of its 144 variants
 * are `none`. bDS describes both:
 *
 * - `select` — *"trae el bloque de la izquierda (bandera, codigo y chevron) con
 *   su propia area tocable de `size/target/min`"*.
 * - `none` — *"no trae nada a la izquierda. El campo queda limpio, como un
 *   input de texto, y el valor arranca en el borde. Para cuando el pais es fijo
 *   y ya se sabe cual, o cuando el codigo se pide en otra parte del
 *   formulario."*
 *
 * **It is still a PhoneField with `none`**, not a TextField: what distinguishes
 * the component is the data — the phone keypad, the autofill hint and the
 * validation — and none of that comes from the prefix. *"Si el campo no captura
 * un telefono, es un TextField."*
 *
 * The name matches Figma's axis. Not to be confused with `Menu`'s
 * `leadingContent`, which is a `ReactNode`; this one is an enum naming *what
 * kind* of thing the slot holds, the same shape `ListItem`'s has.
 *
 * @defaultValue `'select'`
 */
export type TPhoneFieldLeadingContent = 'none' | 'select';

/**
 * Platform-agnostic contract for the PhoneField.
 *
 * A phone number with a country selector in front of it. What makes it a
 * PhoneField rather than a TextField is **the data, not the drawing**: a phone
 * mask, a numeric keypad and number validation. *"Si el campo no captura un
 * telefono, es un TextField."*
 *
 * ### The country is one datum
 *
 * The flag and the dial prefix are not two things — they are the country, and
 * both come out of {@link IPhoneFieldBaseProps.country}. In Figma they are two
 * loose properties that can contradict each other, which is the file's first
 * declared divergence: an instance can show Ecuador's flag next to `+57` and
 * look perfectly fine while describing something that cannot exist in code.
 *
 * ### What is not a prop, and why
 *
 * - **`showMenu`** exists in Figma so the open list can be drawn. Opening is
 *   internal state here, the same trap `isOpen` has in the Select.
 * - **`isFilled`** is a Figma-only axis. Whether the field is full is derived
 *   from `value`, which is the only thing that can be true at runtime.
 * - **There is no suffix**, by definition. And no `prefix` string either: the
 *   prefix is an interactive control, not text, so it cannot be the TextField's
 *   `prefix` prop.
 *
 * ### It does not format the number
 *
 * `value` is what the user typed and what the caller stores, ungrouped. The
 * spacing in `99 123 4567` comes from a formatter outside the component, the
 * same arrangement the amount fields use.
 *
 * @example
 * ```tsx
 * <PhoneField
 *   label="Numero de celular"
 *   value={phone}
 *   onChangeText={setPhone}
 *   country={country}
 *   onCountryChange={setCountry}
 * />
 * ```
 */
export interface IPhoneFieldBaseProps {
  /**
   * The field's name. **Required**, and it doubles as the placeholder: in
   * `md` and `lg` it sits inside the box until there is a value and then floats
   * above it; in `sm` it never floats.
   */
  label: string;
  /**
   * The number, **without the prefix**. The prefix is not part of the value —
   * it belongs to `country`.
   */
  value: string;
  /**
   * Called on every keystroke with the new number.
   *
   * Named `onChangeText` on both platforms, which is what the development
   * documentation specifies — it is not `onChange` on web.
   */
  onChangeText: (value: string) => void;
  /**
   * The selected country. The flag **and** the dial prefix both come from here.
   *
   * @defaultValue `'EC'`
   */
  country?: TCountryCode;
  /**
   * Called when the user picks another country from the selector.
   *
   * Absent in Figma — the file has no property for it, which is expected: a
   * design file has no callbacks. Declared as a divergence so nobody reads its
   * absence as "the selector does not report".
   */
  onCountryChange?: (country: TCountryCode) => void;
  /**
   * The catalogue the selector offers.
   *
   * @defaultValue every country in `COUNTRY_CODES`
   *
   * In Figma the catalogue is four hand-drawn rows — Ecuador, Colombia, Peru and
   * the United States. Those are **a sample, not the catalogue**: which
   * countries a product offers, in what order, and whether there are favourites
   * is an open product decision.
   */
  countries?: readonly TCountryCode[];
  /**
   * Edge of the field.
   *
   * @defaultValue `'md'`
   *
   * Figma's panel reports `lg`, but only because its variant axis runs from
   * largest to smallest and the panel shows the first value. The development
   * documentation fixes the real default at `md`.
   */
  size?: TPhoneFieldSize;
  /**
   * Whether the country selector rides in front of the number.
   *
   * `'none'` drops the flag, the dial code, the chevron and the divider, and the
   * value starts at the edge — *"para cuando el pais es fijo y ya se sabe
   * cual"*. {@link IPhoneFieldBaseProps.country} still says which country the
   * number belongs to; it simply stops being drawn, and
   * {@link IPhoneFieldBaseProps.onCountryChange} is never called because there
   * is nothing to open.
   *
   * @defaultValue `'select'`
   */
  leadingContent?: TPhoneFieldLeadingContent;
  /**
   * Supporting text under the field.
   *
   * **The presence of the text replaces Figma's `showHelper` boolean** — there
   * is nothing to show when the string is absent, so a separate flag would only
   * be able to contradict it.
   */
  helperText?: string;
  /**
   * The error message. **Its presence puts the field in the error state**, which
   * is why there is no separate `isInvalid`.
   *
   * It also has to say something: bDS is explicit that *"el error lo comunica el
   * mensaje, no el color"*. A red border with no text is not an error state, it
   * is a field nobody can fix.
   */
  error?: string;
  /**
   * Whether the field is unavailable. The only state that is a prop — hover and
   * focus are produced by interaction, and `filled` is derived from `value`.
   *
   * @defaultValue `false`
   *
   * The country selector cannot open while disabled. A field nobody can touch
   * opens nothing.
   */
  disabled?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile.
   */
  testID?: string;
}

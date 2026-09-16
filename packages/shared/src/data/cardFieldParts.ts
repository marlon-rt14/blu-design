import type { TCardFieldPart } from '../types/atoms/cardField.types';

/** What a part decides, on both platforms alike. */
export interface ICardFieldPartRules {
  /**
   * Longest value the field accepts, **counting the separators the formatter
   * adds** — 19 for `4532 1488 0343 6467`, 5 for `12/34`, 4 for a CVV.
   *
   * Wired to the native input, not only used to derive a counter: bDS's own
   * skill lists "wire native constraints, not just derived text" as a bug that
   * already happened once.
   */
  maxLength: number;
  /** Digits the value holds once the separators are stripped. */
  digits: number;
  /**
   * Whether the characters are masked as they are typed.
   *
   * Only the CVV. bDS: *"part=cvv usa secureTextEntry y no se persiste"*, and
   * the platform table repeats it — *"el CVV no se guarda ni se autocompleta.
   * Es la regla del medio de pago, no una decisión de diseño."*
   */
  secure: boolean;
}

/**
 * The per-part rules, as a table.
 *
 * **This table is the whole argument for one component instead of three.** What
 * changes with `part` is data — a length, a digit count, a flag — not logic, so
 * three components would triple the barrels, stories and demos in order to
 * express three rows. The keyboard and the autocomplete hint live in each
 * platform's hook instead, because their names differ: `inputMode` and
 * `autocomplete` on web against `keyboardType` and `textContentType` on native.
 *
 * Grouping is **not** here on purpose. bDS is explicit that *"el formato lo pone
 * el formateador, no el componente"*: the value arrives grouped and leaves as
 * the user typed it.
 */
export const CARD_FIELD_PART_RULES: Record<TCardFieldPart, ICardFieldPartRules> = {
  // 16 digits plus the three spaces the four-group format adds.
  number: { maxLength: 19, digits: 16, secure: false },
  // MM/YY — four digits and the slash.
  expiry: { maxLength: 5, digits: 4, secure: false },
  // Three digits on most brands, four on some. The field takes the longer one.
  cvv: { maxLength: 4, digits: 4, secure: true },
};

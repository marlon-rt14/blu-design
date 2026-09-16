/**
 * The card brands the CardField recognizes.
 *
 * **These four and no more, because these four are what bDS declares**: *"las
 * marcas de tarjeta (Visa, Mastercard, Discover, Diners) llevan su color de
 * marca, sin token, a propósito"*. American Express is deliberately absent — it
 * is not in that list, and adding it would be inventing a product rule.
 *
 * Which brands a product accepts, and what happens with one that is not
 * recognized, is an open decision owned by product — the file says so: *"el
 * catálogo de marcas de tarjeta no está declarado en ningún lado"*. See
 * `docs/pendientes-diseno.md`.
 */
export type TCardBrand = 'visa' | 'mastercard' | 'discover' | 'diners';

/** Every brand, in the order bDS lists them. */
export const CARD_BRANDS: readonly TCardBrand[] = ['visa', 'mastercard', 'discover', 'diners'];

/**
 * The brand's name as a reader should hear it.
 *
 * Needed because the logo itself is decorative and hidden: *"el logo de la marca
 * es decorativo y va oculto al lector: la marca detectada, si importa, se anuncia
 * como texto"*. Proper nouns, so they are not translated.
 */
export const CARD_BRAND_NAMES: Record<TCardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  discover: 'Discover',
  diners: 'Diners Club',
};

/**
 * Issuer Identification Number ranges, as predicates over the leading digits.
 *
 * Ordered most specific first: Diners' `3095` has to be tested before its `30`
 * range and before Discover's `65`, or a `3095…` card would match the wrong
 * brand. The ranges are ITU/ISO 7812 reference data, not a product choice.
 */
const IIN_MATCHERS: readonly (readonly [TCardBrand, (digits: string) => boolean])[] = [
  ['visa', (d) => d.startsWith('4')],
  [
    'mastercard',
    (d) => {
      const two = Number(d.slice(0, 2));
      const four = Number(d.slice(0, 4));
      return (
        (d.length >= 2 && two >= 51 && two <= 55) ||
        (d.length >= 4 && four >= 2221 && four <= 2720)
      );
    },
  ],
  [
    'diners',
    (d) => {
      const three = Number(d.slice(0, 3));
      return (
        (d.length >= 3 && three >= 300 && three <= 305) ||
        d.startsWith('3095') ||
        d.startsWith('36') ||
        d.startsWith('38') ||
        d.startsWith('39')
      );
    },
  ],
  [
    'discover',
    (d) => {
      const three = Number(d.slice(0, 3));
      return (
        d.startsWith('6011') ||
        d.startsWith('65') ||
        (d.length >= 3 && three >= 644 && three <= 649)
      );
    },
  ],
];

/**
 * Detects the brand from the digits typed so far.
 *
 * **The caller does not choose the brand** — bDS is explicit: *"brandIcon es un
 * slot: la marca se deduce del número en código, nunca la elige quien diseña"*.
 * This is that deduction.
 *
 * It tolerates a partly-typed, formatted value: everything that is not a digit
 * is stripped first, so `"4532 11"` detects Visa just as `"453211"` does. That
 * matters because the number arrives already grouped — the component does not
 * format it, the formatter does.
 *
 * @param value - The card number as it stands, grouped or not, complete or not.
 * @returns The brand, or `undefined` when the digits match none of the four.
 *   Showing no logo is the neutral answer; what a product *should* do with an
 *   unrecognized card is the open decision in `docs/pendientes-diseno.md`.
 */
export const detectCardBrand = (value: string): TCardBrand | undefined => {
  const digits = value.replace(/\D/g, '');
  if (digits === '') return undefined;
  return IIN_MATCHERS.find(([, matches]) => matches(digits))?.[0];
};

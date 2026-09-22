import { COUNTRY_NAMES_ES } from './countryNames.generated';

/**
 * The country catalogue the PhoneField's selector offers.
 *
 * **This file is the answer to an open divergence, not a closed decision.** bDS
 * declares it plainly: *"El catalogo de paises no existe: en Figma son cuatro
 * instancias dibujadas a mano. Que paises se ofrecen, en que orden y que pasa
 * con la busqueda es una decision de producto que el componente hoy no dice."*
 * It is owned by product, and until it lands this is the neutral answer: every
 * assigned territory, in one place, so the component is usable and the decision
 * stays data rather than code.
 *
 * ### Where each half comes from
 *
 * - **The dial codes are a table**, because nothing derives them. They are
 *   reference data (ITU E.164) written here by hand; the common ones are
 *   certain, and the small territories are worth a review before this ships to
 *   production.
 * - **The names come from CLDR, never from hand-written Spanish.** Through
 *   `Intl.DisplayNames` where it exists, and through a table generated from
 *   Node's ICU — the same data — where it does not, which is Hermes. Checked
 *   against the design: `EC` resolves to `Ecuador`, `CO` to `Colombia`, `PE` to
 *   `Peru` and `US` to `Estados Unidos`, which is exactly what Figma draws.
 *
 * All 243 codes below were validated against CLDR — `Intl.DisplayNames` knows
 * every one of them, so none is a typo.
 */
const COUNTRY_DIAL_CODES = {
  AD: '+376',
  AE: '+971',
  AF: '+93',
  AG: '+1',
  AI: '+1',
  AL: '+355',
  AM: '+374',
  AO: '+244',
  AR: '+54',
  AS: '+1',
  AT: '+43',
  AU: '+61',
  AW: '+297',
  AX: '+358',
  AZ: '+994',
  BA: '+387',
  BB: '+1',
  BD: '+880',
  BE: '+32',
  BF: '+226',
  BG: '+359',
  BH: '+973',
  BI: '+257',
  BJ: '+229',
  BL: '+590',
  BM: '+1',
  BN: '+673',
  BO: '+591',
  BQ: '+599',
  BR: '+55',
  BS: '+1',
  BT: '+975',
  BW: '+267',
  BY: '+375',
  BZ: '+501',
  CA: '+1',
  CC: '+61',
  CD: '+243',
  CF: '+236',
  CG: '+242',
  CH: '+41',
  CI: '+225',
  CK: '+682',
  CL: '+56',
  CM: '+237',
  CN: '+86',
  CO: '+57',
  CR: '+506',
  CU: '+53',
  CV: '+238',
  CW: '+599',
  CX: '+61',
  CY: '+357',
  CZ: '+420',
  DE: '+49',
  DJ: '+253',
  DK: '+45',
  DM: '+1',
  DO: '+1',
  DZ: '+213',
  EC: '+593',
  EE: '+372',
  EG: '+20',
  EH: '+212',
  ER: '+291',
  ES: '+34',
  ET: '+251',
  FI: '+358',
  FJ: '+679',
  FK: '+500',
  FM: '+691',
  FO: '+298',
  FR: '+33',
  GA: '+241',
  GB: '+44',
  GD: '+1',
  GE: '+995',
  GF: '+594',
  GG: '+44',
  GH: '+233',
  GI: '+350',
  GL: '+299',
  GM: '+220',
  GN: '+224',
  GP: '+590',
  GQ: '+240',
  GR: '+30',
  GT: '+502',
  GU: '+1',
  GW: '+245',
  GY: '+592',
  HK: '+852',
  HN: '+504',
  HR: '+385',
  HT: '+509',
  HU: '+36',
  ID: '+62',
  IE: '+353',
  IL: '+972',
  IM: '+44',
  IN: '+91',
  IO: '+246',
  IQ: '+964',
  IR: '+98',
  IS: '+354',
  IT: '+39',
  JE: '+44',
  JM: '+1',
  JO: '+962',
  JP: '+81',
  KE: '+254',
  KG: '+996',
  KH: '+855',
  KI: '+686',
  KM: '+269',
  KN: '+1',
  KP: '+850',
  KR: '+82',
  KW: '+965',
  KY: '+1',
  KZ: '+7',
  LA: '+856',
  LB: '+961',
  LC: '+1',
  LI: '+423',
  LK: '+94',
  LR: '+231',
  LS: '+266',
  LT: '+370',
  LU: '+352',
  LV: '+371',
  LY: '+218',
  MA: '+212',
  MC: '+377',
  MD: '+373',
  ME: '+382',
  MF: '+590',
  MG: '+261',
  MH: '+692',
  MK: '+389',
  ML: '+223',
  MM: '+95',
  MN: '+976',
  MO: '+853',
  MP: '+1',
  MQ: '+596',
  MR: '+222',
  MS: '+1',
  MT: '+356',
  MU: '+230',
  MV: '+960',
  MW: '+265',
  MX: '+52',
  MY: '+60',
  MZ: '+258',
  NA: '+264',
  NC: '+687',
  NE: '+227',
  NF: '+672',
  NG: '+234',
  NI: '+505',
  NL: '+31',
  NO: '+47',
  NP: '+977',
  NR: '+674',
  NU: '+683',
  NZ: '+64',
  OM: '+968',
  PA: '+507',
  PE: '+51',
  PF: '+689',
  PG: '+675',
  PH: '+63',
  PK: '+92',
  PL: '+48',
  PM: '+508',
  PN: '+64',
  PR: '+1',
  PS: '+970',
  PT: '+351',
  PW: '+680',
  PY: '+595',
  QA: '+974',
  RE: '+262',
  RO: '+40',
  RS: '+381',
  RU: '+7',
  RW: '+250',
  SA: '+966',
  SB: '+677',
  SC: '+248',
  SD: '+249',
  SE: '+46',
  SG: '+65',
  SH: '+290',
  SI: '+386',
  SJ: '+47',
  SK: '+421',
  SL: '+232',
  SM: '+378',
  SN: '+221',
  SO: '+252',
  SR: '+597',
  SS: '+211',
  ST: '+239',
  SV: '+503',
  SX: '+1',
  SY: '+963',
  SZ: '+268',
  TC: '+1',
  TD: '+235',
  TG: '+228',
  TH: '+66',
  TJ: '+992',
  TK: '+690',
  TL: '+670',
  TM: '+993',
  TN: '+216',
  TO: '+676',
  TR: '+90',
  TT: '+1',
  TV: '+688',
  TW: '+886',
  TZ: '+255',
  UA: '+380',
  UG: '+256',
  US: '+1',
  UY: '+598',
  UZ: '+998',
  VA: '+39',
  VC: '+1',
  VE: '+58',
  VG: '+1',
  VI: '+1',
  VN: '+84',
  VU: '+678',
  WF: '+681',
  WS: '+685',
  YE: '+967',
  YT: '+262',
  ZA: '+27',
  ZM: '+260',
  ZW: '+263',} as const;

/**
 * An ISO 3166-1 alpha-2 territory code — `'EC'`, `'CO'`, `'US'`.
 *
 * Derived from the table rather than written as a union, so the two can never
 * drift apart: adding a row adds the code to the type.
 */
export type TCountryCode = keyof typeof COUNTRY_DIAL_CODES;

/**
 * Every code in the catalogue, in ISO order.
 *
 * ISO order and not alphabetical-by-name on purpose: the display order depends
 * on the locale, so sorting belongs to whoever renders the list. `sortCountries`
 * does it. The *offered* order — favourites, frequent countries, a pinned
 * home country — is the product decision this file cannot make.
 */
export const COUNTRY_CODES = Object.keys(COUNTRY_DIAL_CODES) as readonly TCountryCode[];

/**
 * The country the PhoneField starts on: Ecuador, as the development
 * documentation specifies (`country?: CountryCode // 'EC'`).
 */
export const DEFAULT_COUNTRY_CODE: TCountryCode = 'EC';

/** The dial prefix of a country, with its `+` — `'+593'` for `'EC'`. */
export const countryDialCode = (code: TCountryCode): string => COUNTRY_DIAL_CODES[code];

const displayNamesCache = new Map<string, Intl.DisplayNames | null>();

const displayNamesFor = (locale: string): Intl.DisplayNames | null => {
  const cached = displayNamesCache.get(locale);
  if (cached !== undefined) return cached;
  let resolved: Intl.DisplayNames | null = null;
  try {
    // Guarded rather than assumed: `Intl.DisplayNames` is standard on every
    // browser this library targets, but React Native runs on Hermes, whose Intl
    // surface is narrower and varies by platform and version. A missing
    // implementation has to degrade, not throw.
    if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
      resolved = new Intl.DisplayNames([locale], { type: 'region' });
    }
  } catch {
    resolved = null;
  }
  displayNamesCache.set(locale, resolved);
  return resolved;
};

/**
 * The country's name in the given locale, from CLDR.
 *
 * **Falls back to a bundled Spanish table when `Intl.DisplayNames` is
 * missing**, which on React Native is not hypothetical: measured on an
 * iPhone 17 Pro simulator, Hermes has no `DisplayNames` and the country sheet
 * listed `EC` instead of `Ecuador`. The table is generated from Node's ICU —
 * the same CLDR data the browser answers with — so the two platforms agree.
 *
 * The fallback is Spanish only. Ask for another locale on a runtime without
 * `Intl` and you get Spanish, not the code: a readable name in the wrong
 * language beats `EC`. A second locale there would need a second table.
 *
 * @param code - The ISO 3166-1 alpha-2 code.
 * @param locale - BCP 47 tag. Defaults to Spanish, the product's language.
 * @returns The localized name. Never the bare code: without `Intl` it is the
 *   Spanish table, which covers every code in the catalogue.
 */
export const countryName = (code: TCountryCode, locale = 'es'): string =>
  displayNamesFor(locale)?.of(code) ?? COUNTRY_NAMES_ES[code];

/**
 * Sorts codes by their localized name, which is the only neutral order for a
 * list of 243 items.
 *
 * Uses `Intl.Collator` when it exists so that accented names land where a reader
 * expects — `Perú` after `Panamá`, not after `Portugal`. Without it, a plain
 * comparison is used, which is wrong for accents but still stable.
 *
 * @param codes - The codes to sort. Not mutated.
 * @param locale - BCP 47 tag, matching {@link countryName}.
 * @returns A new, sorted array.
 */
export const sortCountries = (
  codes: readonly TCountryCode[],
  locale = 'es',
): TCountryCode[] => {
  const named = codes.map((code) => [code, countryName(code, locale)] as const);
  let compare: (a: string, b: string) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.Collator === 'function') {
      const collator = new Intl.Collator(locale);
      compare = collator.compare.bind(collator);
    }
  } catch {
    // keep the plain comparison
  }
  return named.sort((a, b) => compare(a[1], b[1])).map(([code]) => code);
};

/**
 * Lowercases and strips diacritics so that `Perú` and `peru` compare equal.
 *
 * Uses `normalize('NFD')` and drops the combining marks. Hermes supports
 * `String.prototype.normalize`, unlike parts of `Intl`, so this needs no guard.
 */
const foldAccents = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Matches a country against a search query, by name or by dial code.
 *
 * Needed because bDS requires the list to be searchable on **both** platforms,
 * not only on the mobile sheet: *"una lista de paises necesita busqueda por
 * teclado: doscientos elementos sin filtro no son navegables"*.
 *
 * Accent- and case-insensitive, so typing `peru` finds `Perú`. The `+` of a
 * dial code is optional in the query — `593` and `+593` both match.
 *
 * @param code - The country to test.
 * @param query - What the user typed. Blank matches everything.
 * @param locale - BCP 47 tag, matching {@link countryName}.
 */
export const countryMatches = (code: TCountryCode, query: string, locale = 'es'): boolean => {
  const needle = foldAccents(query.trim());
  if (needle === '') return true;
  if (foldAccents(countryName(code, locale)).includes(needle)) return true;
  const dial = countryDialCode(code);
  return dial.includes(needle) || dial.slice(1).startsWith(needle.replace('+', ''));
};

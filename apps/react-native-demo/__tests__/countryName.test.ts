/**
 * @format
 *
 * Pins the PhoneField's country names against a runtime with no
 * `Intl.DisplayNames`.
 *
 * **This is not hypothetical and it is not caught by types.** Measured on an
 * iPhone 17 Pro simulator: Hermes has no `DisplayNames`, so the country sheet
 * listed `EC` instead of `Ecuador` while web — same code, same data — read
 * fine. Typecheck, lint and the browser all stayed green through it.
 *
 * It lives in the demo app because this is the repo's only Jest project, and
 * the platform it stands in for is this one.
 */
import { countryName, sortCountries } from '@dsm/shared';

describe('countryName without Intl.DisplayNames', () => {
  // `Intl.DisplayNames` is typed read-only, so the swap goes through the object
  // rather than the property — which is also closer to what Hermes does: the
  // key is simply not there.
  const intl = Intl as unknown as Record<string, unknown>;
  const original = intl.DisplayNames;

  beforeAll(() => {
    delete intl.DisplayNames;
    jest.resetModules();
  });

  afterAll(() => {
    intl.DisplayNames = original;
  });

  it('still answers with real names', () => {
    expect(countryName('EC')).toBe('Ecuador');
    expect(countryName('DE')).toBe('Alemania');
    expect(countryName('US')).toBe('Estados Unidos');
  });

  it('never falls back to the bare code', () => {
    const codes = ['EC', 'JP', 'CH', 'FI', 'AD'] as const;
    for (const code of codes) expect(countryName(code)).not.toBe(code);
  });

  it('still sorts by name rather than by code', () => {
    expect(sortCountries(['ZW', 'EC', 'DE', 'AF']).map((c) => countryName(c))).toEqual([
      'Afganistán',
      'Alemania',
      'Ecuador',
      'Zimbabue',
    ]);
  });
});

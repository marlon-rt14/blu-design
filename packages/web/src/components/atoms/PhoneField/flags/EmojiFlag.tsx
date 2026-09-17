import type { TCountryCode } from '@dsm/shared';
import type { ReactElement } from 'react';

import type { IFlagProps } from './flag.types';

/**
 * Turns an ISO 3166-1 alpha-2 code into its regional-indicator pair — `EC`
 * becomes the two code points the platform's font renders as 🇪🇨.
 *
 * The two letters map to `U+1F1E6`–`U+1F1FF`. Nothing is looked up and nothing
 * is bundled, so all 243 countries are covered the moment the catalogue lists
 * them.
 */
const flagEmoji = (code: TCountryCode): string =>
  String.fromCodePoint(...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));

/**
 * A country's flag as an emoji — the stand-in until the real artwork is
 * reachable.
 *
 * **Deliberate, not a shortcut.** bDS does publish the artwork: `Flag icon` in
 * `BDS3 - Assets` points at a base set of **265 entries**, with the country on a
 * nested instance's `Country` property. We have no access to that file yet, so
 * the choice was between four hand-copied flags and 239 identical placeholders,
 * or this — complete coverage, derived from the code, at zero bundle cost.
 *
 * What it costs: the glyph comes from the platform's font, so it is a **real
 * flag on iOS, macOS and Android 11+**, and on Windows and older Android the
 * font has none and the two letters show instead. That reads as `EC` — still
 * correct information, never a broken image.
 *
 * `size` is the height; the emoji's own aspect gives the width. The font size is
 * set slightly under it so the glyph sits inside the circle its container draws
 * rather than touching the hairline.
 */
export const EmojiFlag = ({ size, country }: IFlagProps & { country: TCountryCode }): ReactElement => (
  <span
    aria-hidden="true"
    style={{ fontSize: size * 0.85, lineHeight: 1 }}
  >
    {flagEmoji(country)}
  </span>
);

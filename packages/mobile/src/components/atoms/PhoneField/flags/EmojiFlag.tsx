import type { TCountryCode } from '@dsm/shared';
import type { ReactElement } from 'react';
import { Text } from 'react-native';

import type { IFlagProps } from './flag.types';

/**
 * Turns an ISO 3166-1 alpha-2 code into its regional-indicator pair — `EC`
 * becomes the two code points the platform's font renders as 🇪🇨.
 */
const flagEmoji = (code: TCountryCode): string =>
  String.fromCodePoint(...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));

/**
 * A country's flag as an emoji — the stand-in until the real artwork is
 * reachable. Same reasoning as the web file; see `docs/pendientes-diseno.md`.
 *
 * **`allowFontScaling` is off, and that is a decision this platform has to
 * make.** The size comes from `size/icon/*` in absolute pixels, so with the
 * system font scale turned up the glyph would grow past the circle its container
 * clips it to. A flag is not body text: it does not carry meaning that a larger
 * size helps read, and the country's name — which does — is announced and scales
 * normally.
 */
export const EmojiFlag = ({
  size,
  country,
}: IFlagProps & { country: TCountryCode }): ReactElement => (
  <Text allowFontScaling={false} style={{ fontSize: size * 0.85, lineHeight: size }}>
    {flagEmoji(country)}
  </Text>
);

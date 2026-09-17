import type { TCountryCode } from '@dsm/shared';
import type { ComponentType, ReactElement } from 'react';

import { EmojiFlag } from './EmojiFlag';
import type { IFlagProps } from './flag.types';

/**
 * Countries whose real artwork is in the repo.
 *
 * **`Partial` on purpose**, unlike `CardField/marks/`, which is exhaustive. A
 * missing card brand hides a product question; a missing country does not — the
 * set is open and mechanical, and demanding every key would mean 243 entries
 * whose only purpose is to name the fallback.
 *
 * When the real set arrives it will be a generated data module plus one
 * renderer, not 243 components. See the web file and
 * `docs/pendientes-diseno.md`.
 */
const FLAG_ART: Partial<Record<TCountryCode, ComponentType<IFlagProps>>> = {};

/** Props of {@link CountryFlagArt}. */
interface ICountryFlagArtProps extends IFlagProps {
  country: TCountryCode;
}

/**
 * A country's flag, and **the only thing that knows where flag artwork comes
 * from**.
 *
 * `CountryFlag` draws the circle and the hairline and names the country without
 * ever mentioning emoji or code points. The day the real set lands, only
 * `flags/` changes.
 */
export const CountryFlagArt = ({ country, ...props }: ICountryFlagArtProps): ReactElement => {
  const Art = FLAG_ART[country];
  return Art === undefined ? <EmojiFlag {...props} country={country} /> : <Art {...props} />;
};

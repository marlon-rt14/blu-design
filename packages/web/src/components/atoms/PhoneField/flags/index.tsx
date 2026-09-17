import type { TCountryCode } from '@dsm/shared';
import type { ComponentType, ReactElement } from 'react';

import { EmojiFlag } from './EmojiFlag';
import type { IFlagProps } from './flag.types';

/**
 * Countries whose real artwork is in the repo.
 *
 * **`Partial` on purpose, and the asymmetry with `CardField/marks/` is the
 * decision, not an oversight.** That registry is exhaustive because a missing
 * card brand hides a product question — is American Express accepted? Here
 * there is no question behind a missing country: the set is open and mechanical,
 * `TCountryCode` grows with `COUNTRY_DIAL_CODES`, and demanding exhaustiveness
 * would mean 243 entries whose only purpose is to name the fallback.
 *
 * Partial coverage is the stable state for as long as the artwork is out of
 * reach, so the type says so.
 *
 * When the real set arrives it will **not** be 243 components. The flags differ
 * only in their paths, so the shape is a generated data module plus one
 * renderer — `flags/flagPaths.ts` and `flags/SvgFlag.tsx` — and this map becomes
 * a lookup into it. Worth knowing before then: 243 flags is roughly 200–500 kB
 * of source, and tree-shaking cannot help because the country is chosen at
 * runtime. See `docs/pendientes-diseno.md`.
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
 * This folder is the isolation seam: `CountryFlag` draws the circle and the
 * hairline and names the country for a screen reader without ever mentioning
 * emoji, code points or a path. The day the real set lands, only `flags/`
 * changes.
 */
export const CountryFlagArt = ({ country, ...props }: ICountryFlagArtProps): ReactElement => {
  const Art = FLAG_ART[country];
  return Art === undefined ? <EmojiFlag {...props} country={country} /> : <Art {...props} />;
};

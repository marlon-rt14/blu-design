import { FLAG_ASPECT_RATIO, FLAG_PATHS, FLAG_VIEW_BOX } from '@dsm/shared';
import type { TCountryCode } from '@dsm/shared';
import type { ReactElement } from 'react';

import type { IFlagProps } from './flag.types';

/** Props of {@link CountryFlagArt}. */
interface ICountryFlagArtProps extends IFlagProps {
  country: TCountryCode;
}

/**
 * A country's flag, and **the only thing that knows where flag artwork comes
 * from**.
 *
 * `CountryFlag` draws the circle and the hairline and names the country; this
 * draws the flag and nothing else. The paths come from
 * `FLAG_PATHS` — one generated module for the whole catalogue rather than 243
 * components, since every flag is the same `<svg>` around a different list of
 * shapes.
 *
 * **Decorative here, deliberately.** The country's name is announced by
 * `CountryFlag` one level up, so this is hidden from the accessibility tree —
 * otherwise a screen reader would meet the same country twice in a row.
 */
export const CountryFlagArt = ({ country, size }: ICountryFlagArtProps): ReactElement => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size}
    // The height is what bDS sizes a flag by; the width follows from the 3:2
    // box every flag is drawn in. The circle around it crops the sides.
    viewBox={FLAG_VIEW_BOX}
    width={size * FLAG_ASPECT_RATIO}
    xmlns="http://www.w3.org/2000/svg"
  >
    {FLAG_PATHS[country].map((path, index) => (
      // The index is a stable key: the list is generated data that only changes
      // when the flag is redrawn, and the whole flag re-renders when it does.
      <path key={index} {...path} />
    ))}
  </svg>
);

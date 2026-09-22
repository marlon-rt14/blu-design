import { FLAG_ASPECT_RATIO, FLAG_PATHS, FLAG_VIEW_BOX } from '@dsm/shared';
import type { TCountryCode } from '@dsm/shared';
import type { ReactElement } from 'react';
import Svg, { Path } from 'react-native-svg';

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
 * draws the flag and nothing else. The paths come from `FLAG_PATHS`, the same
 * generated module the web renderer reads — the platforms differ in which
 * element draws a path, not in what the path is.
 *
 * The country's name is announced by `CountryFlag` one level up, which also
 * hides this subtree from the screen reader.
 */
export const CountryFlagArt = ({ country, size }: ICountryFlagArtProps): ReactElement => (
  <Svg height={size} viewBox={FLAG_VIEW_BOX} width={size * FLAG_ASPECT_RATIO}>
    {FLAG_PATHS[country].map((path, index) => (
      // The index is a stable key: the list is generated data that only changes
      // when the flag is redrawn.
      <Path key={index} {...path} />
    ))}
  </Svg>
);

import { countryName } from '@dsm/shared';
import type { TCountryCode } from '@dsm/shared';
import type { ReactElement } from 'react';
import { View } from 'react-native';

import { CountryFlagArt } from './flags';

/** Props of {@link CountryFlag}. */
interface ICountryFlagProps {
  country: TCountryCode;
  /** Edge of the circle, `size/icon/*`. bDS treats this size as the **height**. */
  size: number;
  /** `component/phonefield/flag/border-default` — the hairline around the circle. */
  borderColor: string;
  /** `radius/pill`. */
  radius: number;
  /** `border/width/default`. */
  borderWidth: number;
  /**
   * Whether to announce the country's name.
   *
   * `false` inside a row that already says the name in its own label, where a
   * second copy would make a screen reader read every country twice.
   */
  announce?: boolean;
}

/**
 * A country's flag, as a circle.
 *
 * **It draws the circle and names the country; it does not know what a flag
 * looks like.** The artwork lives in `./flags`, which is the seam.
 *
 * The hairline is not decoration for its own sake — bDS puts it there *"para que
 * JP, FI y CH no se pierdan sobre fondo claro"*: Japan, Finland and Switzerland
 * have white fields that would bleed into the container.
 *
 * ### The flag is decorative; the country is the accessible label
 *
 * There is no visually-hidden text on React Native, so the circle itself carries
 * the name through `accessibilityLabel` and hides the artwork below it. Same
 * outcome as the web's clipped span, by the platform's own means.
 */
export const CountryFlag = ({
  country,
  size,
  borderColor,
  radius,
  borderWidth,
  announce = true,
}: ICountryFlagProps): ReactElement => (
  <View
    accessibilityLabel={announce ? countryName(country) : undefined}
    accessible={announce}
    importantForAccessibility={announce ? 'yes' : 'no-hide-descendants'}
    style={{
      alignItems: 'center',
      borderColor,
      borderRadius: radius,
      borderWidth,
      height: size,
      justifyContent: 'center',
      // The circle clips the artwork: an emoji is a character and cannot be
      // clipped to a shape on its own, and bDS says Circle *"recorta al centro"*.
      overflow: 'hidden',
      width: size,
    }}
  >
    <CountryFlagArt country={country} size={size} />
  </View>
);

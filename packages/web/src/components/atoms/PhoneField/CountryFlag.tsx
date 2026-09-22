import { countryName } from '@dsm/shared';
import type { TCountryCode } from '@dsm/shared';
import type { ReactElement } from 'react';

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
 * ### Why there is a hairline at all
 *
 * bDS spells it out on the `Flag icon` component: the border exists *"para que
 * JP, FI y CH no se pierdan sobre fondo claro"*. Japan, Finland and Switzerland
 * have white fields that would bleed into the container without it. It reads
 * `color/border/divider/subtle` at `border/width/default`.
 *
 * ### The flag is decorative; the country is text
 *
 * The circle and the art are `aria-hidden`, and the country's name is rendered
 * as visually-hidden text. bDS: *"la bandera es decorativa y va oculta al lector
 * de pantalla: lo que se anuncia es el nombre del país, no la imagen"*.
 */
export const CountryFlag = ({
  country,
  size,
  borderColor,
  radius,
  borderWidth,
  announce = true,
}: ICountryFlagProps): ReactElement => (
  <span
    aria-hidden={announce ? undefined : 'true'}
    style={{
      alignItems: 'center',
      border: `${borderWidth}px solid ${borderColor}`,
      borderRadius: radius,
      boxSizing: 'border-box',
      display: 'inline-flex',
      flexShrink: 0,
      height: size,
      justifyContent: 'center',
      // The circle is drawn and clipped by this box, not by the artwork: every
      // flag is a 3:2 rectangle, so the circle crops its sides — bDS says Circle
      // *"recorta al centro"*.
      overflow: 'hidden',
      width: size,
    }}
  >
    <CountryFlagArt country={country} size={size} />
    {announce ? (
      // The accessible name, not the image. Clipped rather than `display: none`,
      // which would take it out of the accessibility tree along with the pixels.
      <span
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: 1,
          margin: -1,
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: 1,
        }}
      >
        {countryName(country)}
      </span>
    ) : null}
  </span>
);

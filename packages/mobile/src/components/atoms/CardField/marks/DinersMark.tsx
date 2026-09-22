import type { ReactElement } from 'react';
import Svg, { Path } from 'react-native-svg';

import { MARK_VIEW_BOX } from './mark.types';
import type { IMarkProps } from './mark.types';

/**
 * Diners Club — **a white plate with a blue mark**.
 *
 * The one brand whose plate is light, which is exactly what made us generalise
 * the wrong rule: with only this logo in the repo, a neutral plate drawn from a
 * token and a coloured glyph on top looked correct. It is correct for Diners
 * and for nobody else. Measured on the `__test-borde` specimen (`2094:1078`).
 *
 * **The colours are written in, not read from tokens, and that is declared
 * rather than debt**: *"las marcas de tarjeta llevan su color de marca, sin
 * token, a propósito. Son logos de terceros: su color no es del sistema y no
 * cambia con el tema ni con el modo de contraste. Una auditoría que cuente
 * rellenos crudos va a encontrarlos acá; no son deuda y no se corrigen."*
 *
 * **It paints no background, and that is not a theme surface**: in `.Brand
 * rect` this brand's own plate is white, which is why the field's own plate —
 * `component/cardfield/brandicon/bg-default`, white in light — is left to show
 * through instead of repainting the same colour. It is also what made three
 * different wrong readings of the plate look correct: Diners is right under
 * all of them.
 */
export const DinersMark = ({ width, height }: IMarkProps): ReactElement => (
  <Svg height={height} viewBox={MARK_VIEW_BOX} width={width}>
    <Path
      d="M25.1512 5.55C30.8231 5.54957 36 9.85487 36 16.0855C36 21.7812 30.8231 26.4388 25.1512 26.4388H22.4612C16.7241 26.466 12 21.7842 12 16.0855C12 9.85748 16.7241 5.54957 22.4612 5.55H25.1512ZM22.4836 6.41193C17.2399 6.4154 12.9914 10.696 12.9897 15.977C12.9914 21.2575 17.2399 25.5363 22.4836 25.5363C27.7308 25.5363 31.9805 21.2575 31.9805 15.977C31.9805 10.696 27.7308 6.4154 22.4836 6.41193ZM24.6397 10.3191C26.8981 11.1914 28.4996 13.3938 28.5044 15.977C28.4996 18.5593 26.8981 20.7604 24.6397 21.6314V10.3191ZM20.3309 10.3209V21.6293C18.0734 20.757 16.4739 18.5568 16.467 15.9771C16.4739 13.3939 18.0734 11.1946 20.3309 10.3209Z"
      fill="#046AA9"
    />
  </Svg>
);

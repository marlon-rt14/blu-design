import type { ReactElement } from 'react';

import { MARK_VIEW_BOX } from './mark.types';
import type { IMarkProps } from './mark.types';

/**
 * Mastercard — **a navy plate with the two interlocking circles**.
 *
 * Three paths, not two: the red circle, the yellow circle, and the overlap in
 * `#FF5F00` drawn on top of both. Dropping the third would leave a flat
 * intersection and stop being the mark.
 *
 * **The colours are written in, not read from tokens, and that is declared
 * rather than debt**: *"las marcas de tarjeta llevan su color de marca, sin
 * token, a propósito. Son logos de terceros: su color no es del sistema y no
 * cambia con el tema ni con el modo de contraste. Una auditoría que cuente
 * rellenos crudos va a encontrarlos acá; no son deuda y no se corrigen."*
 *
 * **It paints its own background**, and that is the split: Visa and Mastercard
 * bring a plate the brand owns, while Diners, Discover and Amex sit on the
 * field's themed surface. Measured brand by brand on the real component —
 * there is no rule to derive it from.
 */
export const MastercardMark = ({ width, height }: IMarkProps): ReactElement => (
  <svg
    aria-hidden="true"
    fill="none"
    height={height}
    viewBox={MARK_VIEW_BOX}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="#232B3D" height="32" width="48" />
    <path
      d="M28.219 8.41296H19.7824V23.5735H28.219V8.41296Z"
      fill="#FF5F00"
    />
    <path
      d="M20.318 15.9928C20.3154 13.0343 21.6733 10.2393 24.0004 8.4122C19.814 5.12123 13.7522 5.84779 10.4619 10.0342C7.17093 14.2206 7.89749 20.2825 12.0839 23.5728C15.5807 26.3215 20.5037 26.3215 24.0004 23.5728C21.6733 21.7463 20.3154 18.9513 20.318 15.9928Z"
      fill="#EB001B"
    />
    <path
      d="M39.6 15.9929C39.6 21.3174 35.2835 25.6346 29.959 25.6346C27.7981 25.6346 25.6995 24.9087 24.0004 23.5729C28.1868 20.2812 28.912 14.2187 25.6204 10.0316C25.1465 9.42908 24.603 8.88549 24.0004 8.41162C28.1868 5.12133 34.248 5.84722 37.5383 10.0336C38.8741 11.7327 39.6 13.832 39.6 15.9929Z"
      fill="#F79E1B"
    />
  </svg>
);

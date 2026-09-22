import type { ReactElement } from 'react';

import { MARK_VIEW_BOX } from './mark.types';
import type { IMarkProps } from './mark.types';

/**
 * Visa — **a blue plate with a white wordmark**.
 *
 * The plate is `#1434CB`, Visa's own blue, and it covers the whole 48x32 box:
 * the background belongs to the brand, not to a token.
 *
 * It is also the counterexample to the other rule we had wrong — that a mark is
 * half the plate's width. A wordmark spans nearly the whole plate; only Diners'
 * circle is half.
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
export const VisaMark = ({ width, height }: IMarkProps): ReactElement => (
  <svg
    aria-hidden="true"
    fill="none"
    height={height}
    viewBox={MARK_VIEW_BOX}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="#1434CB" height="32" width="48" />
    <path
      d="M19.8256 10.5983L15.265 21.4788H12.2894L10.0455 12.7953C9.90937 12.2606 9.79107 12.0643 9.37665 11.8395C8.7005 11.4727 7.58284 11.1284 6.60001 10.9142L6.66676 10.5983H11.456C12.0667 10.5983 12.6153 11.0048 12.7541 11.708L13.9392 18.0042L16.8685 10.5983H19.8256ZM31.4834 17.9269C31.4953 15.0551 27.5124 14.8971 27.5395 13.6142C27.5481 13.2236 27.9196 12.8085 28.7332 12.7027C29.1364 12.6499 30.2474 12.6095 31.5078 13.1899L32.0022 10.8825C31.3248 10.6366 30.4536 10.4 29.3697 10.4C26.5877 10.4 24.6294 11.8792 24.6128 13.9969C24.595 15.5633 26.0101 16.4371 27.0768 16.9579C28.174 17.4913 28.5422 17.8337 28.5375 18.3102C28.5296 19.0399 27.6624 19.3625 26.8521 19.375C25.4377 19.3968 24.6168 18.9923 23.9618 18.6876L23.4515 21.0717C24.1092 21.3737 25.3233 21.6368 26.5818 21.65C29.5389 21.65 31.4735 20.1893 31.4821 17.9275M38.8298 21.4795H41.4333L39.161 10.5989H36.7584C36.2178 10.5989 35.7624 10.9136 35.5608 11.3974L31.3373 21.4801H34.2931L34.88 19.8549H38.4914L38.8311 21.4801L38.8298 21.4795ZM35.6897 17.6242L37.1708 13.5388L38.0235 17.6242H35.6897ZM23.8475 10.5983L21.5203 21.4788H18.7059L21.0345 10.5983H23.8481H23.8475Z"
      fill="white"
    />
  </svg>
);

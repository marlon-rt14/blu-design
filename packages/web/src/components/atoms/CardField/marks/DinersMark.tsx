import type { ReactElement } from 'react';

import type { IMarkProps } from './mark.types';

/**
 * The mark's intrinsic box, straight from the `viewBox` of the SVG exported
 * from Figma (`877:75484`). **Not square** — 18 wide by 15.6667 tall.
 *
 * Each mark owns its own box rather than sharing a constant: Visa's wordmark and
 * Mastercard's circles have nothing to do with these proportions, so a shared
 * aspect would be wrong the moment the second logo lands.
 */
const BOX = { width: 18, height: 15.6667 } as const;

/**
 * Diners Club.
 *
 * **The colour is written in, not read from a token, and that is declared, not
 * debt**: *"las marcas de tarjeta llevan su color de marca, sin token, a
 * propósito. Son logos de terceros: su color no es del sistema y no cambia con
 * el tema ni con el modo de contraste. Una auditoría que cuente rellenos crudos
 * va a encontrarlos acá; no son deuda y no se corrigen."*
 *
 * That is also why it does **not** go through `Icon`: that container sets
 * `fill` from a theme token and forces a square `0 0 24 24` viewBox, which would
 * repaint this blue in dark mode and squash the artwork onto the wrong grid.
 *
 * Only the width is given — it comes from the token ramp as half the plate's
 * width, so 12, 18 or 24 — and the height follows from {@link BOX}.
 */
export const DinersMark = ({ width }: IMarkProps): ReactElement => (
  <svg
    aria-hidden="true"
    fill="none"
    height={(width * BOX.height) / BOX.width}
    viewBox={`0 0 ${BOX.width} ${BOX.height}`}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.86337 2.46321e-08C14.1173 -0.000325641 18 3.22865 18 7.90164C18 12.1734 14.1173 15.6666 9.86337 15.6666H7.84587C3.54308 15.687 0 12.1757 0 7.90164C0 3.23061 3.54308 -0.000325641 7.84587 2.46321e-08H9.86337ZM7.86269 0.646447C3.92989 0.649052 0.743545 3.85947 0.742251 7.82022C0.743545 11.7806 3.92989 14.9898 7.86269 14.9898C11.7981 14.9898 14.9854 11.7806 14.9854 7.82022C14.9854 3.85947 11.7981 0.649052 7.86269 0.646447ZM9.4798 3.57682C11.1736 4.23109 12.3747 5.88286 12.3783 7.82025C12.3747 9.75699 11.1736 11.4078 9.4798 12.0611V3.57682ZM6.24814 3.57819V12.0595C4.55503 11.4052 3.35546 9.7551 3.35029 7.82032C3.35546 5.88293 4.55503 4.23343 6.24814 3.57819Z"
      fill="#046AA9"
    />
  </svg>
);

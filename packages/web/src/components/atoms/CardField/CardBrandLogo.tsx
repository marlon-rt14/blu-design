import { CARD_BRAND_NAMES } from '@dsm/shared';
import type { TCardBrand } from '@dsm/shared';
import type { ReactElement } from 'react';

import { CardBrandMark } from './marks';

/** Props of {@link CardBrandLogo}. */
interface ICardBrandLogoProps {
  brand: TCardBrand;
  /** Width of the plate. The plate is a card, so this is its height times 3:2. */
  plateWidth: number;
  plateHeight: number;
  borderRadius: number;
  borderWidth: number;
  background: string;
  borderColor: string;
}

/**
 * The detected brand's logo, on its plate.
 *
 * **It draws the box and names the brand; it does not know what any brand looks
 * like.** The artwork lives in `./marks`, which is the seam. Nothing here
 * mentions a brand.
 *
 * ### The plate's colour is the brand's, not a token's
 *
 * What the design file hands over is the whole card: the background comes with
 * the artwork — white for Diners, `#1434CB` for Visa, navy for Mastercard and
 * Discover. So the mark covers this box edge to edge, and `background` is only what shows
 * underneath it.
 *
 * The radius and the hairline stay here, and the radius is why the box clips:
 * Figma keeps it at 2 for all three plate sizes, so it cannot be drawn inside a
 * viewBox that scales with the plate.
 *
 * ### The logo is decorative; the brand is text
 *
 * The plate and the mark are `aria-hidden`, and the brand name is rendered as
 * visually-hidden text instead. bDS asks for exactly that: *"el logo de la marca
 * es decorativo y va oculto al lector: la marca detectada, si importa, se
 * anuncia como texto"*. A screen reader hears "Visa"; it does not hear "image".
 */
export const CardBrandLogo = ({
  brand,
  plateWidth,
  plateHeight,
  borderRadius,
  borderWidth,
  background,
  borderColor,
}: ICardBrandLogoProps): ReactElement => (
  <span
    style={{
      alignItems: 'center',
      backgroundColor: background,
      border: `${borderWidth}px solid ${borderColor}`,
      borderRadius,
      boxSizing: 'border-box',
      display: 'inline-flex',
      flexShrink: 0,
      height: plateHeight,
      justifyContent: 'center',
      // The artwork reaches the edges, so the rounded corners have to cut it.
      overflow: 'hidden',
      // The name is clipped text inside this box, so the box has to be the
      // positioning context for it.
      position: 'relative',
      width: plateWidth,
    }}
  >
    <CardBrandMark brand={brand} height={plateHeight} width={plateWidth} />
    {/* The accessible name, not the image. Clipped rather than `display: none`,
        which would take it out of the accessibility tree along with the pixels. */}
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
      {CARD_BRAND_NAMES[brand]}
    </span>
  </span>
);

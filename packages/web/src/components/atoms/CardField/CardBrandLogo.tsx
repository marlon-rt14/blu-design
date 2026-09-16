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
  /** Width of the mark inside, half the plate's. */
  logoWidth: number;
  borderRadius: number;
  borderWidth: number;
  background: string;
  borderColor: string;
}

/**
 * The detected brand's logo, on its plate.
 *
 * **It draws the plate and names the brand; it does not know what any brand
 * looks like.** The artwork lives in `./marks`, which is the seam: when the
 * missing logos arrive, only that folder changes. Nothing here mentions a brand
 * or the generic fallback glyph.
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
  logoWidth,
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
      width: plateWidth,
    }}
  >
    <CardBrandMark brand={brand} width={logoWidth} />
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

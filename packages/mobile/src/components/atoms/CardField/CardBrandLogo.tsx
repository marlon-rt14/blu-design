import { CARD_BRAND_NAMES } from '@dsm/shared';
import type { TCardBrand } from '@dsm/shared';
import type { ReactElement } from 'react';
import { View } from 'react-native';

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
 * **It draws the plate and names the brand; it does not know what any brand
 * looks like.** The artwork lives in `./marks`, which is the seam: when the
 * missing logos arrive, only that folder changes.
 *
 * ### The logo is decorative; the brand is the accessible label
 *
 * There is no visually-hidden text on React Native — no `clip` and no off-screen
 * trick worth doing — so the plate itself carries the name through
 * `accessibilityLabel`, and `CardBrandMark` hides the artwork from the tree.
 * Same outcome as the web's clipped span, by the platform's own means, and what
 * bDS asks for: *"el logo de la marca es decorativo y va oculto al lector: la
 * marca detectada, si importa, se anuncia como texto"*.
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
  <View
    accessibilityLabel={CARD_BRAND_NAMES[brand]}
    accessible
    style={{
      alignItems: 'center',
      backgroundColor: background,
      borderColor,
      borderRadius,
      borderWidth,
      height: plateHeight,
      justifyContent: 'center',
      // The artwork reaches the edges, so the rounded corners have to cut it.
      overflow: 'hidden',
      width: plateWidth,
    }}
  >
    <CardBrandMark brand={brand} height={plateHeight} width={plateWidth} />
  </View>
);

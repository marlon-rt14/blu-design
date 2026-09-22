import type { TCardBrand } from '@dsm/shared';
import type { ComponentType, ReactElement } from 'react';
import { View } from 'react-native';

import type { IMarkProps } from './mark.types';
import { AmexMark } from './AmexMark';
import { DinersMark } from './DinersMark';
import { DiscoverMark } from './DiscoverMark';
import { MastercardMark } from './MastercardMark';
import { VisaMark } from './VisaMark';

/**
 * Brand to artwork.
 *
 * **`satisfies Record<TCardBrand, …>` on purpose, and the exhaustiveness is the
 * point**: adding a fifth brand to `TCardBrand` breaks this file until somebody
 * says what it draws. A `Partial<Record<…>>` with a fallback would compile and
 * silently give the new brand somebody else's artwork, or none — and there *is* a fifth brand
 * coming, because the artwork set in `BDS3 - Assets`
 * (Figma `EjuudbnL2TbkjnSCwBNztw`, component `Card network icon`) includes
 * American Express while `TCardBrand` does not. That decision should surface as a type error, not
 * as a wrong pixel.
 *
 * Same shape as `FieldIcon`'s `FIELD_ICONS` map, which is this repo's canonical
 * way of turning a union into a component.
 *
 * Today only Diners has real artwork. The other three point at the generic glyph
 * explicitly rather than by omission, so the gap is visible in one place — see
 * `docs/pendientes-diseno.md` for why.
 */
const BRAND_MARKS = {
  diners: DinersMark,
  amex: AmexMark,
  visa: VisaMark,
  mastercard: MastercardMark,
  discover: DiscoverMark,
} as const satisfies Record<TCardBrand, ComponentType<IMarkProps>>;

/** Props of {@link CardBrandMark}. */
interface ICardBrandMarkProps extends IMarkProps {
  brand: TCardBrand;
}

/**
 * The artwork for a brand, and **the only thing that knows which brand draws
 * what**.
 *
 * This folder is the isolation seam: `CardBrandLogo` draws the plate and names
 * the brand for a screen reader without ever mentioning a brand, so the day the four missing logos arrive, only `marks/` changes.
 *
 * The wrapper is what hides the artwork from the accessibility tree — there is
 * no `aria-hidden` here, and the plate above carries the name instead.
 *
 * ### Adding a mark
 *
 * 1. A file named after the component — `AmexMark.tsx` — drawing the **whole
 *    plate**: the background rect in the brand's colour plus the logo, inside
 *    the shared `MARK_VIEW_BOX`. The background belongs to the brand; only
 *    Diners' happens to be white.
 * 2. A line in the map below.
 * 3. **On web, the `<svg>` needs its own `aria-hidden="true"`.** The marks do not
 *    go through `Icon`, which is what adds it for the generic glyph, so a mark
 *    that forgets the attribute leaks into the accessibility tree. On mobile
 *    there is nothing to remember — `CardBrandMark` wraps every mark in a view
 *    that hides it, and the plate carries the name.
 * 4. Keep the path and the fill identical to the other platform's file. bDS says
 *    the logo is the *"mismo archivo, sin teñir, en las dos"*, and nothing
 *    enforces it — diff the `d` strings between platforms.
 *
 * Why searching Figma for "Visa" finds nothing, which is the thing that costs an
 * afternoon: in `Card network icon` the **brand is a property on a nested
 * instance**, not a variant axis. The set's own axes are `Shape` and `Size`.
 * `docs/pendientes-diseno.md` has the whole trail.
 */
export const CardBrandMark = ({ brand, ...props }: ICardBrandMarkProps): ReactElement => {
  const Mark = BRAND_MARKS[brand];
  return (
    <View importantForAccessibility="no-hide-descendants">
      <Mark {...props} />
    </View>
  );
};

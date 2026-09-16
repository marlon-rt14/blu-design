import type { TCardBrand } from '@dsm/shared';
import type { ComponentType, ReactElement } from 'react';

import { IconCreditCard } from '../../../../icons';
import type { IMarkProps } from './mark.types';
import { DinersMark } from './DinersMark';

/**
 * The generic payment glyph, standing in for a brand whose artwork is not here
 * yet.
 *
 * It is `icon/credit-card` from the system set, and its own description sanctions
 * this use: *"marca todo lo que es medio de pago: el brandIcon de CardField y el
 * media por defecto de ChoiceBox"*. Unlike a real mark it **does** go through
 * `Icon`, and that is right — it is a monochrome system glyph, so the theme
 * should paint it.
 *
 * **It takes no props at all**, and so ignores the width: `Icon` sizes from the
 * `size/icon/*` ramp as a square, and 18 is not on that ramp. A zero-parameter
 * function is assignable to `ComponentType<IMarkProps>`, so the registry below
 * still accepts it.
 *
 * The consequence, which is real but preexisting: it draws 16x16 at every size,
 * so in `lg` — a 48x32 plate — the glyph is small for its plate. It goes away
 * when the artwork arrives; noted in `docs/pendientes-diseno.md` rather than
 * papered over.
 */
const GenericMark = (): ReactElement => <IconCreditCard size="sm" />;

/**
 * Brand to artwork.
 *
 * **`satisfies Record<TCardBrand, …>` on purpose, and the exhaustiveness is the
 * point**: adding a fifth brand to `TCardBrand` breaks this file until somebody
 * says what it draws. A `Partial<Record<…>>` with a fallback would compile and
 * silently give the new brand the generic glyph — and there *is* a fifth brand
 * coming, because the artwork set in `BDS3 - Assets`
 * (Figma `EjuudbnL2TbkjnSCwBNztw`, component `Card network icon`) includes
 * American Express while `TCardBrand` does not. That decision should surface as a type error, not
 * as a wrong pixel.
 *
 * Same shape as `FieldIcon`'s `FIELD_ICONS` map, which is this repo's canonical
 * way of turning a union into a component: `as const satisfies Record<…>` keeps
 * the literal types while still demanding every key.
 *
 * Today only Diners has real artwork. The other three point at the generic glyph
 * explicitly rather than by omission, so the gap is visible in one place —
 * see `docs/pendientes-diseno.md` for why (the artwork lives in a Figma file we
 * have no access to yet).
 */
const BRAND_MARKS = {
  diners: DinersMark,
  visa: GenericMark,
  mastercard: GenericMark,
  discover: GenericMark,
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
 * the brand for a screen reader without ever mentioning a brand or the generic
 * glyph, so the day the four missing logos arrive, only `marks/` changes — a new
 * file per brand and a line each in the map above.
 *
 * ### Adding a mark
 *
 * 1. A file named after the component — `VisaMark.tsx` — owning its own `BOX`
 *    taken from the export's `viewBox`. No shared aspect constant: the brands do
 *    not share proportions.
 * 2. A line in the map below, replacing `GenericMark`.
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
  return <Mark {...props} />;
};

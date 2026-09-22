/**
 * The box every brand mark is drawn in.
 *
 * **Shared now, and it was not before.** Each mark used to own its own box,
 * on the reasoning that Visa's wordmark and Mastercard's circles have nothing
 * to do with each other's proportions. That was right about the logos and wrong
 * about the artwork: what the design file hands over is not a logo, it is the
 * **whole plate** — a 48x32 card with the brand's own background and the logo
 * already placed on it. So the box is the plate's, and it is the same 3:2 for
 * everybody. Measured on the `__test-borde` specimen (`2094:1078`).
 *
 * The plate's corner radius is **not** in here on purpose: Figma keeps it at 2
 * for every size (24x16, 36x24 and 48x32 all measured `rx=2`), so it cannot
 * live inside a viewBox that scales. `CardBrandLogo` draws it, and clips.
 */
export const MARK_VIEW_BOX = '0 0 48 32';

/**
 * What every brand mark takes.
 *
 * In its own file rather than in `marks/index.tsx` so each mark can import it
 * without a resolution cycle back through the registry that imports *them*.
 *
 * Both dimensions, and no derivation: the mark now fills the plate it is given
 * rather than sizing itself from a width. The plate's size comes from the token
 * ramp — 24x16, 36x24, 48x32.
 */
export interface IMarkProps {
  width: number;
  height: number;
}

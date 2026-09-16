/**
 * What every brand mark takes.
 *
 * In its own file rather than in `marks/index.tsx` so each mark can import it
 * without a resolution cycle back through the registry that imports *them*. It
 * is one property today and will stay small: the mark is given a width and
 * derives its own height from its own box, because no two brands share
 * proportions.
 */
export interface IMarkProps {
  /**
   * Width in pixels, from the token ramp — half the plate's width, so 12, 18 or
   * 24. The height is each mark's business.
   */
  width: number;
}

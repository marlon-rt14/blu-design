/**
 * Geometry of the placeholder — what the real content will look like.
 *
 * - `text`: pill bar(s) at line-height height.
 * - `block`: rounded rect; height comes from the host (fills the parent).
 * - `circle`: avatar diameter (`component/avatar/size/*`).
 *
 * @defaultValue `'text'`
 */
export type TSkeletonShape = 'text' | 'block' | 'circle';

/**
 * Size axis — meaning depends on {@link TSkeletonShape}:
 *
 * - `text`: line height of caption/md · body/sm · body/md (18 / 21 / 24).
 * - `circle`: avatar diameter sm / md / lg.
 * - `block`: `radius/surface/{sm,md,lg}` only — width/height from the host.
 *
 * @defaultValue `'md'`
 */
export type TSkeletonSize = 'sm' | 'md' | 'lg';

/**
 * Platform-agnostic contract for the Skeleton.
 *
 * Loading placeholder that reserves the exact footprint of content that has
 * not arrived yet. Same `component/skeleton/{bg,highlight}` pair as Image's
 * loading state. Sheen sweeps in code; reduced motion freezes the band.
 *
 * Use when the **shape** of the incoming content is known. Prefer Spinner
 * when it is not (action in flight, unknown layout).
 *
 * @example
 * ```tsx
 * <Skeleton />
 * <Skeleton shape="circle" size="md" />
 * <Skeleton shape="text" lines={2} width="80%" />
 * <Skeleton shape="block" width={200} height={96} />
 * ```
 */
export interface ISkeletonBaseProps {
  /**
   * @defaultValue `'text'`
   */
  shape?: TSkeletonShape;
  /**
   * Dev default `md` (Figma/Supernova property default is `lg` — Dev wins).
   *
   * @defaultValue `'md'`
   */
  size?: TSkeletonSize;
  /**
   * How many text bars to stack. Only applies when `shape="text"`.
   * Missing in Figma (stack instances there) — code-only.
   *
   * @defaultValue `1`
   */
  lines?: number;
  /**
   * Width of text/block bones. Circles ignore it (diameter is `size`).
   * Missing in Figma — code-only. Default fills the host.
   *
   * @defaultValue `'100%'`
   */
  width?: number | string;
  /**
   * Height of `block` bones. Text/circle ignore it (size sets the edge).
   * Missing in Figma — code-only, same class as `width`. When unset, fills the
   * host (`100%`); the host must have a definite height or the block collapses.
   *
   * @defaultValue `'100%'`
   */
  height?: number | string;
  /**
   * Single screen-reader announcement on the wrapper — shapes are hidden.
   *
   * @defaultValue `'Cargando'`
   */
  label?: string;
  testID?: string;
}

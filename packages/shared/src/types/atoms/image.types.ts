/**
 * Aspect ratio of the Image frame. Matches Figma's `ratio` axis — the hole's
 * proportion, not the bitmap's. Width comes from the host; height falls out of
 * the ratio so layout does not jump when the image arrives.
 */
export type TImageRatio = '1:1' | '4:3' | '3:2' | '16:9';

/**
 * Corner radius of the frame. `none` when the host already clips — two stacked
 * radii read as a dirty edge (Figma).
 */
export type TImageRadius = 'none' | 'sm' | 'md';

/**
 * Visual status of the frame. Figma exposes this as a VARIANT axis for the
 * matrix; Dev contract says callers do **not** pick it — it derives from the
 * load lifecycle. Optional override remains for Storybook / tests.
 *
 * - `default` — bitmap painted
 * - `loading` — skeleton sheen while the resource travels
 * - `empty` — no `src` assigned (dashed border + IconImage)
 * - `error` — load failed (solid border + IconAlertTriangle)
 */
export type TImageStatus = 'default' | 'loading' | 'empty' | 'error';

/** How the bitmap sits inside the ratio box. */
export type TImageFit = 'cover' | 'contain' | 'fill';

/** Internal load phase used to derive {@link TImageStatus} when no override. */
export type TImageLoadPhase = 'idle' | 'loading' | 'loaded' | 'error';

/** CSS `aspect-ratio` strings for each {@link TImageRatio}. */
export const IMAGE_RATIO_CSS: Record<TImageRatio, string> = {
  '1:1': '1 / 1',
  '4:3': '4 / 3',
  '3:2': '3 / 2',
  '16:9': '16 / 9',
};

/** Numeric aspect ratios for React Native `aspectRatio`. */
export const IMAGE_RATIO_NUMBER: Record<TImageRatio, number> = {
  '1:1': 1,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
  '16:9': 16 / 9,
};

/**
 * Derive the painted status from `src` + load phase. An explicit `status`
 * override wins (Storybook matrices). No `src` → `empty` regardless of phase.
 */
export const resolveImageStatus = ({
  src,
  loadPhase,
  statusOverride,
}: {
  src: string | undefined;
  loadPhase: TImageLoadPhase;
  statusOverride?: TImageStatus;
}): TImageStatus => {
  if (statusOverride !== undefined) {
    return statusOverride;
  }
  if (src === undefined || src === '') {
    return 'empty';
  }
  switch (loadPhase) {
    case 'idle':
    case 'loading':
      return 'loading';
    case 'error':
      return 'error';
    case 'loaded':
      return 'default';
    default: {
      const _exhaustive: never = loadPhase;
      return _exhaustive;
    }
  }
};

/**
 * Shared Image contract — Dev frame `Image · Dev` (`1020:118882`).
 *
 * Fixed-ratio content image: reserves space before the bitmap arrives so the
 * layout does not jump. Axes from Figma: `ratio` × `radius` × `status`. Code
 * adds `src`, `alt`, and `fit` (none exist as Figma properties — Dev §07).
 *
 * `status` is listed on the firma but is **not** for callers in production —
 * it derives from the load. Pass it only to force a variant in stories/tests.
 *
 * No accessible name of its own in Figma: `alt` is required; empty string means
 * decorative (web `alt=""`, mobile `accessible={false}`).
 */
export interface IImageBaseProps {
  /**
   * Image URL. Omit / empty → `empty` status (never assigned). Dev types this
   * as required `ImageSource`; empty is the deliberate no-src case.
   */
  src?: string;
  /**
   * Accessible description. Empty string only when decorative — an explicit
   * decision (Dev).
   */
  alt: string;
  /**
   * @defaultValue `'1:1'`
   */
  ratio?: TImageRatio;
  /**
   * @defaultValue `'md'`
   */
  radius?: TImageRadius;
  /**
   * Force a painted status. Omit in product code — derived from load.
   *
   * @defaultValue derived
   */
  status?: TImageStatus;
  /**
   * How the bitmap fills the ratio box.
   * - `cover` — crops to fill (Figma FILL / Dev default)
   * - `contain` — letterbox, keeps aspect (logos)
   * - `fill` — stretch to the box (distorts). Web `object-fit: fill`; RN `stretch`.
   *
   * Dev firma only listed cover|contain; `fill` added for parity with CSS/RN fit modes.
   *
   * @defaultValue `'cover'`
   */
  fit?: TImageFit;
  /** `data-testid` on web, `testID` on mobile. */
  testID?: string;
}

/**
 * Surface the Spinner sits on — picks indicator + track colours.
 *
 * - `brand`: page / default surface (`component/spinner/indicator/brand`).
 * - `primary`: neutral ink (`indicator/default`) — denser UI chrome.
 * - `on-brand`: brand fill scenes (`indicator/on-brand` + `track/on-brand`).
 *
 * Spinner · Dev: *"Se elige por la superficie sobre la que se monta, no por gusto."*
 *
 * @defaultValue `'brand'`
 */
export type TSpinnerAppearance = 'brand' | 'primary' | 'on-brand';

/**
 * Box size — maps 1:1 to `size/icon/{sm,md,lg}` (16 / 24 / 32).
 *
 * @defaultValue `'md'`
 */
export type TSpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Platform-agnostic contract for the Spinner.
 *
 * Indeterminate loading indicator. Rotation is platform-native (CSS keyframes /
 * `Animated` with `useNativeDriver`) — never a JS timer loop. With reduced
 * motion the arc **stops and stays** (Spinner · Dev); the set description's
 * "reemplaza por opacidad" is superseded by Dev.
 *
 * Not for measurable waits (use ProgressBar) or known-shape content (Skeleton).
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner appearance="on-brand" size="sm" label="Procesando pago" />
 * ```
 */
export interface ISpinnerBaseProps {
  /**
   * @defaultValue `'brand'`
   */
  appearance?: TSpinnerAppearance;
  /**
   * @defaultValue `'md'`
   */
  size?: TSpinnerSize;
  /**
   * Screen-reader announcement. Not rendered visually.
   *
   * @defaultValue `'Cargando'`
   */
  label?: string;
  testID?: string;
}

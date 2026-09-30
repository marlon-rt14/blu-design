/**
 * Physical size of a SearchField.
 *
 * `lg` is 56 (`size/field/height/lg`), `md` is 44 (`component/searchfield/height/md`),
 * `sm` is 32 (`component/searchfield/height/sm`). Figma's variant default is `lg`;
 * the Dev firma fixes the code default at `md`.
 */
export type TSearchFieldSize = 'lg' | 'md' | 'sm';

/**
 * Platform-agnostic contract for the SearchField.
 *
 * The search glyph is fixed and is the visible label. `placeholder` is required,
 * starts with "Buscar", and is also the accessible name — it disappears once
 * the user types, so each platform maps it to `aria-label` / `accessibilityLabel`
 * as well as the native placeholder.
 *
 * Not props: `isFilled` (derived from `value`), `state` (hover/focus are local),
 * and `platform` (each package is its own build). Suggestions are Combobox.
 * Cancel sits beside the field, on the screen.
 *
 * Handlers, `trailingAccessory`, and the clear control stay on the platform
 * props. The clear glyph shows only while `value` is non-empty and replaces
 * `trailingAccessory`; the accessory shows only while the field is empty.
 */
export interface ISearchFieldBaseProps {
  /** Current query. Controlled — the field never owns its own text. */
  value: string;
  /**
   * Shown while `value` is empty, and the accessible name of the field.
   *
   * Required. Copy starts with "Buscar" (e.g. "Buscar movimientos").
   */
  placeholder: string;
  /**
   * Height of the bar.
   *
   * @defaultValue `'md'`
   */
  size?: TSearchFieldSize;
  /**
   * Whether the field ignores input.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Focus the field on mount.
   *
   * Only for a screen whose whole job is search. A field in a header stays `false`.
   *
   * @defaultValue `false`
   */
  autoFocus?: boolean;
  /** Stable identifier for tests. `data-testid` on web, `testID` on mobile. */
  testID?: string;
}

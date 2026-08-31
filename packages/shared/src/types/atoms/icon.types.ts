/**
 * Temporary Icon glyph names.
 *
 * This stub ships a single `icon` name — the Figma `icon/placeholder`
 * instance-swap — until the real Icon set lands. The `name` + `size`
 * contract is stable; expanding this union later does not change
 * TextField's affix API (`prefixIcon` / `suffixIcon` stay `TIconName`).
 */
export type TIconName = 'icon';

/**
 * Physical size of the Icon. Matches Figma's size axis and
 * `dimension.size.icon.*` (8 / 12 / 16 / 24 / 32 / 40). `2xs` is on the
 * live node even though some Figma copy still lists xs–xl only.
 */
export type TIconSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Shared Icon contract. Both `@dsm/web` and `@dsm/mobile` honour this;
 * neither platform adds extra props — the glyph is SVG on web and the
 * same path (or a View fallback) on native.
 *
 * Temporary: replaced later by the real Icon set. Keep this shape.
 */
export interface IIconBaseProps {
  /**
   * Which glyph to render. The stub only has `'icon'`.
   *
   * @defaultValue `'icon'`
   */
  name?: TIconName;
  /**
   * Physical size. Maps 1:1 onto `dimension.size.icon.*`.
   *
   * @defaultValue `'md'`
   */
  size?: TIconSize;
  /**
   * Fill color. Defaults to `color.color.icon.primary`. TextField passes
   * `color.component.textfield.icon.*` so affixes follow the field, not
   * the standalone Icon default.
   */
  color?: string;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the
   * native `testID` on mobile.
   */
  testID?: string;
}

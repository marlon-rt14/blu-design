/**
 * Which way the line runs.
 *
 * `vertical` needs the cross axis resolved by whoever places it: a vertical
 * divider with no height is invisible, and bDS says so outright — *"un divisor
 * vertical sin alto explicito no se ve"*. Each platform's hook stretches it to
 * its container, which covers the common case of a flex row.
 */
export type TDividerOrientation = 'horizontal' | 'vertical';

/**
 * How much weight the line carries: `component/divider/line/{subtle,default,strong}`.
 *
 * Figma's variant axis reads `strong · default · subtle`, heaviest first,
 * because its panel is ordered by weight. This union reads the other way and
 * **the values are the same** — the development documentation calls that out so
 * nobody takes the order for a different set.
 *
 * bDS has **not written down when to use each one yet**; it is a declared open
 * divergence, owned by design, with the consequence spelled out: *"sin esa regla
 * los tres se eligen a ojo, y el resultado es que la misma pantalla mezcla
 * dos"*. Until it lands, `default` is the answer unless there is a reason.
 */
export type TDividerAppearance = 'subtle' | 'default' | 'strong';

/**
 * Platform-agnostic contract for the Divider.
 *
 * A decorative rule, and nothing more. Two props, no children, no text, and —
 * deliberately — **no states**: *"El Divider no tiene estados y no deberia
 * tenerlos. Es decorativo: no se toca, no recibe foco y no cambia con la
 * interaccion."*
 *
 * ### It is not a border
 *
 * `color/border/divider/*` sits at about **1.5 contrast on purpose**, so it does
 * not delimit a control and it does not outline an input. For a load-bearing
 * edge the token is `color/border/input/*`, which runs 3.79 to 8.81. Reaching
 * for a Divider to draw the edge of a field is the mistake this component is
 * documented to prevent.
 *
 * ### It has no thickness axis
 *
 * The line is always `border/width/divider` — **1 in light and dark, 2 in both
 * high-contrast modes**, and never written by hand: in those modes the
 * separation cannot rely on tint, so hardcoding the 1 is what breaks them. There
 * is no dotted or heavier variant either, and bDS keeps that declared rather
 * than open: *"si aparece la necesidad de una punteada o de una mas gruesa, es
 * CHG"*.
 *
 * ### It is always decorative to a screen reader
 *
 * bDS asks for `role="separator"` when the line separates groups that carry
 * meaning, and for it to be hidden when it only groups visually. This component
 * always takes the second path, for two reasons that point the same way:
 *
 * - **React Native has no separator role.** `AccessibilityRole` runs from
 *   `'none'` to `'iconmenu'` and does not include one, so the semantic case
 *   would be a web-only behaviour behind a contract that is symmetric
 *   everywhere else in this library.
 * - **bDS answers the meaningful case itself**: *"Agrupar no es nombrar. Un
 *   divisor no reemplaza a un encabezado."* If the grouping carries meaning, what
 *   is missing is a heading, not a line that announces itself.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider appearance="subtle" />
 * <Divider orientation="vertical" />
 * ```
 */
export interface IDividerBaseProps {
  /**
   * Which way the line runs.
   *
   * @defaultValue `'horizontal'`
   */
  orientation?: TDividerOrientation;
  /**
   * How much weight the line carries.
   *
   * @defaultValue `'default'`
   *
   * Figma's panel reports `strong`, but only because its variant axis is ordered
   * heaviest first and the panel shows the first value. The development
   * documentation fixes the real default at `default` — the same trap the
   * IconButton's `size` had.
   */
  appearance?: TDividerAppearance;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile.
   */
  testID?: string;
}

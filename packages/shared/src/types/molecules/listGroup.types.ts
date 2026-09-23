import type { ReactNode } from 'react';

/**
 * Platform-agnostic contract for the ListGroup.
 *
 * **The card a settings screen is made of.** It puts down the surface, the
 * radius and the clip, and stacks the rows — *"no pone padding lateral, ese es
 * margen de la pantalla"*. It has no states and no axes: *"es un componente
 * con un hueco"*, and the states live in each row.
 *
 * ### It owns the dividers, and that is the whole job
 *
 * bDS is emphatic about this, twice. A loose `ListItem` ships **without** a
 * divider, because Core serves web and app and a divider is a grouped-list
 * pattern. ListGroup *is* that pattern, so here they come on — *"este es el
 * único lugar donde el divisor viene encendido"* — and the last one goes off.
 *
 * **The caller does not do that, the group does**: *"en Figma se apaga fila por
 * fila; en código lo maneja el grupo, incluido apagar el de la última"*. The
 * file itself is the argument — those hand-set booleans were already lost once,
 * in the property reorder of 20-ago, and had to be rebuilt by hand.
 *
 * The divider belongs to the row rather than to the group for a reason worth
 * keeping: it starts where the row's **text** starts, not at the edge, so a row
 * with an avatar indents its own hairline. A line drawn by the group could not
 * know that.
 *
 * ### What it is not
 *
 * - **Not a scroller.** *"El grupo no hace scroll propio: lo hace la
 *   pantalla."*
 * - **Not a spacer.** There is no gap between rows; *"lo que separa es el
 *   divisor, no el margen"*.
 * - **Not a row factory.** It receives rows already built and configures
 *   nothing about them except the divider.
 *
 * @example
 * ```tsx
 * <ListGroup header="Hoy">
 *   <ListItem label="Transferencia" trailingText="$1.250,00" showTrailingText />
 *   <ListItem label="Pago de servicios" trailingText="$320,00" showTrailingText />
 * </ListGroup>
 * ```
 */
export interface IListGroupBaseProps {
  /**
   * The rows, in order — Figma's `rows` slot.
   *
   * **`ListItem`s.** The dev contract says *"ListItem, y solo ListItem"* while
   * the component's own description says *"pueden ser ListItem, ChoiceItem o
   * las dos mezcladas"*. The looser one is what the type allows, because a
   * `ReactNode` cannot promise otherwise and a settings screen mixing a row
   * with a switch row is the obvious case. Registered as a divergence.
   */
  children: ReactNode;
  /**
   * The section's title — `"Hoy"`, `"Ayer"`, `"Esta semana"`.
   *
   * **In the signature but not in Figma**, which is the file's first declared
   * divergence on this component: *"una lista de secciones es el caso más común
   * de una app bancaria y hoy hay que armarlo por fuera"*. Implemented because
   * the signature is the contract; drawn from the semantic layer because there
   * is no co-token to read. See `docs/pendientes-diseno.md`.
   *
   * When present it **names the list** for a screen reader, which is the other
   * reason it belongs to the group rather than to the screen.
   */
  header?: string;
  /**
   * Whether the rows carry their hairline, last one excluded.
   *
   * `false` for a list that is not in a card — and then, bDS says, it is not a
   * ListGroup either.
   *
   * @defaultValue `true`
   */
  dividers?: boolean;
  testID?: string;
}

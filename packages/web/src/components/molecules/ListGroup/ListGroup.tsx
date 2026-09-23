import { Children, cloneElement, isValidElement, useId } from 'react';
import type { ReactElement } from 'react';

import type { IListGroupProps } from './ListGroup.types';
import { useListGroup } from './useListGroup';

/** What the group sets on each row, and the only thing it touches. */
interface IRowWithDivider {
  showDivider?: boolean;
}

/**
 * Web ListGroup — the card a settings screen is made of.
 *
 * It puts down the surface, the radius and the clip, stacks the rows and
 * **owns their dividers**. Nothing else: no states, no axes, no size, no
 * lateral padding — *"ese es margen de la pantalla"*.
 *
 * ### The dividers are the job
 *
 * A loose `ListItem` ships without one. Here they come on and the last goes
 * off, and **the group does that, not the caller**: *"en Figma se apaga fila
 * por fila; en código lo maneja el grupo, incluido apagar el de la última"*.
 * The file itself is the argument — those hand-set booleans were lost once
 * already, in the property reorder of 20-ago.
 *
 * Setting a prop on the children means cloning them, which is the same thing
 * `ButtonGroup`, `Tabs` and `Tooltip` do here. `Children.toArray` is what makes
 * "the last one" mean the last *row*: it drops the `null`s and `false`s a
 * conditional row leaves behind, so `{show && <ListItem/>}` at the end does not
 * silently take the turn.
 *
 * ### A list, announced as a list
 *
 * `<ul>` and `<li>`, because *"un montón de divs no le dice nada a quien no ve
 * la pantalla"* — the semantics are what let a screen reader say how many items
 * there are. The rows keep their own roles inside; the group does not interfere.
 *
 * @example
 * ```tsx
 * <ListGroup header="Hoy">
 *   <ListItem label="Transferencia" showTrailingText trailingText="$1.250,00" />
 *   <ListItem label="Pago de servicios" showTrailingText trailingText="$320,00" />
 * </ListGroup>
 * ```
 */
export const ListGroup = (props: IListGroupProps): ReactElement => {
  const { children, header, dividers = true, testID } = props;
  const { listStyle, headerStyle } = useListGroup(props);

  const headerId = useId();
  // `toArray` rather than `Children.map`: it strips the nullish children, so the
  // last element is the last *row* and not a conditional that rendered nothing.
  const rows = Children.toArray(children).filter(isValidElement<IRowWithDivider>);
  const lastIndex = rows.length - 1;

  return (
    <div data-testid={testID}>
      {/* Above the card rather than inside it: bDS does not draw this header at
          all, and a section title outside the surface is the settings-screen
          shape the description evokes. Declared in `docs/pendientes-diseno.md`. */}
      {header === undefined ? null : (
        <h3 id={headerId} style={headerStyle}>
          {header}
        </h3>
      )}
      <ul aria-labelledby={header === undefined ? undefined : headerId} style={listStyle}>
        {rows.map((row, index) => (
          <li key={row.key}>
            {cloneElement(row, { showDivider: dividers && index !== lastIndex })}
          </li>
        ))}
      </ul>
    </div>
  );
};

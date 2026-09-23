import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import type { IListGroupProps } from './ListGroup.types';
import { useListGroup } from './useListGroup';

/** What the group sets on each row, and the only thing it touches. */
interface IRowWithDivider {
  showDivider?: boolean;
}

/**
 * Native ListGroup — the card a settings screen is made of.
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
 *
 * `Children.toArray` is what makes "the last one" mean the last *row*: it drops
 * the `null`s a conditional row leaves behind, so `{show && <ListItem/>}` at the
 * end does not silently take the turn.
 *
 * ### A View, not a FlatList
 *
 * The signature takes `children`, and a `FlatList` needs `data` and
 * `renderItem` — the two cannot both be true. bDS asks for virtualisation on
 * long lists, so **a list of three hundred rows is not this component**: it
 * wants a screen-level `FlatList` rendering `ListItem`s directly, and the
 * divider rule comes back to the caller there. Noted in
 * `docs/pendientes-diseno.md` rather than half-solved here.
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

  const rows = Children.toArray(children).filter(isValidElement<IRowWithDivider>);
  const lastIndex = rows.length - 1;

  return (
    <View testID={testID}>
      {/* Above the card rather than inside it: bDS does not draw this header at
          all, and a section title outside the surface is the settings-screen
          shape the description evokes. Declared in `docs/pendientes-diseno.md`. */}
      {header === undefined ? null : (
        <Text accessibilityRole="header" style={headerStyle}>
          {header}
        </Text>
      )}
      {/* `list` is a real role on this platform — checked, unlike `separator`,
          which the Divider had to do without. The header names the list when
          there is one. */}
      <View
        accessibilityLabel={header}
        accessibilityRole="list"
        style={listStyle}
      >
        {rows.map((row, index) =>
          cloneElement(row, { showDivider: dividers && index !== lastIndex }),
        )}
      </View>
    </View>
  );
};

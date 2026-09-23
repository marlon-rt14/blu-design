import { ListGroup as NativeListGroup, ListItem as NativeListItem } from '@dsm/mobile';
import type { IListGroupBaseProps } from '@dsm/shared';
import { ListGroup as WebListGroup, ListItem as WebListItem } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** One row, as the controls panel can express it. */
export interface IPlatformListGroupRow {
  label: string;
  description?: string;
  trailingText?: string;
}

/** Props of {@link PlatformListGroup}: the shared contract plus the story's own knobs. */
export interface IPlatformListGroupProps extends Omit<IListGroupBaseProps, 'children'> {
  /** The rows to render. */
  rows?: readonly IPlatformListGroupRow[];
  /**
   * Implementation to render.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

const DEFAULT_ROWS: IPlatformListGroupRow[] = [
  { label: 'Transferencia a Ana', description: 'Hoy, 10:24', trailingText: '$1.250,00' },
  { label: 'Pago de servicios', description: 'Hoy, 09:02', trailingText: '$320,00' },
  { label: 'Recarga de celular', description: 'Ayer, 18:41', trailingText: '$15,00' },
];

/**
 * Renders either the web or the React Native ListGroup with matching rows.
 *
 * It builds the rows rather than taking children, for the same reason the
 * CheckboxGroup bridge does: a web row inside the native group would not render
 * at all.
 *
 * **Nothing here sets `showDivider`**, and that is the point of the story —
 * the group sets it on every row and unsets it on the last one.
 */
export const PlatformListGroup = ({
  rows = DEFAULT_ROWS,
  platform = 'web',
  ...props
}: IPlatformListGroupProps): ReactElement => {
  if (platform === 'native') {
    return (
      <NativeListGroup {...props}>
        {rows.map((row) => (
          <NativeListItem
            description={row.description}
            key={row.label}
            label={row.label}
            showDescription={row.description !== undefined}
            showTrailingText={row.trailingText !== undefined}
            trailingText={row.trailingText}
          />
        ))}
      </NativeListGroup>
    );
  }
  return (
    <WebListGroup {...props}>
      {rows.map((row) => (
        <WebListItem
          description={row.description}
          key={row.label}
          label={row.label}
          showDescription={row.description !== undefined}
          showTrailingText={row.trailingText !== undefined}
          trailingText={row.trailingText}
        />
      ))}
    </WebListGroup>
  );
};

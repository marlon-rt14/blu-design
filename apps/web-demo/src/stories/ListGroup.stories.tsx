import { readThemeToken, themeSources } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { themeFromGlobals } from './themeGlobals';
import { PlatformListGroup } from './PlatformListGroup';
import type { IPlatformListGroupProps, TPlatform } from './PlatformListGroup';

/** The group is a card, so it needs a page behind it — never the surface it is drawn on. */
const Page = ({ themeKey, children }: { themeKey: string; children: ReactNode }): ReactNode => (
  <div
    style={{
      backgroundColor: readThemeToken(
        themeSources[themeKey as keyof typeof themeSources].color,
        'color.color.canvas.background.page',
      ),
      // The screen's margin, which is exactly what the group refuses to carry:
      // *"no pone padding lateral — ese es margen de la pantalla"*.
      padding: 16,
      width: 375,
    }}
  >
    {children}
  </div>
);

const meta = {
  title: 'Molecules/ListGroup',
  component: PlatformListGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The card a settings screen is made of. It puts down the surface, the radius and the ' +
          'clip, stacks the rows, and **owns their dividers** — *"es un componente con un ' +
          'hueco"*, with no states, no axes and no size of its own.\n\n' +
          '**The dividers are the whole job.** A loose `ListItem` ships without one, because ' +
          'Core serves web and app and a divider is a grouped-list pattern. ListGroup *is* that ' +
          'pattern: *"este es el único lugar donde el divisor viene encendido"*, and the last ' +
          'row turns its own off. **The caller does not do that** — *"en Figma se apaga fila ' +
          'por fila; en código lo maneja el grupo"*. The file is the argument: those hand-set ' +
          'booleans were lost once already, in the property reorder of 20-ago.\n\n' +
          'The divider belongs to the row rather than to the group for a reason worth keeping: ' +
          'it starts where the row’s **text** starts, so a row with an avatar indents its own ' +
          'hairline. A line drawn by the group could not know that.\n\n' +
          '**No lateral padding** — *"ese es margen de la pantalla"* — **no gap between rows** ' +
          '— *"lo que separa es el divisor, no el margen"* — and **no scroll of its own**.\n\n' +
          '**Four tokens, not the six the contract lists**, measured by subtraction: asking ' +
          'Figma for the component’s variables returns thirteen and asking for one `ListItem`’s ' +
          'returns eleven of them. What is left is the surface and `radius/surface/md`. The ' +
          'other four belong to the rows. And the surface is `component/card/surface/bg`: there ' +
          'is no `listgroup` group in the export at all, which is the second divergence.\n\n' +
          '**`header` is in the signature and not in Figma.** A list of sections — *"Hoy", ' +
          '"Ayer", "Esta semana"* — is the most common shape of a banking app and today it is ' +
          'built outside the component. It is implemented here reading the semantic layer, and ' +
          'placed above the card; both are choices, not measurements. See ' +
          '`docs/pendientes-diseno.md`.',
      },
    },
  },
  argTypes: {
    header: {
      control: 'text',
      description:
        'The section’s title. Names the list for a screen reader when present. Not in Figma yet.',
      table: { category: 'Content' },
    },
    dividers: {
      control: 'boolean',
      description:
        'Whether the rows carry their hairline, last one excluded. `false` for a list that is ' +
        'not in a card — and then, bDS says, it is not a ListGroup either.',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    rows: { control: 'object', table: { category: 'Content' } },
    testID: { control: 'text', table: { category: 'Other' } },
    platform: { table: { disable: true } },
  },
  args: {
    header: 'Hoy',
    testID: 'list-group',
  },
  render: function Render(args, { globals }) {
    return (
      <Page themeKey={themeFromGlobals(globals).key}>
        <PlatformListGroup {...args} platform={globals.platform as TPlatform} />
      </Page>
    );
  },
} satisfies Meta<IPlatformListGroupProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {
  args: { dividers: true },
};

/**
 * The same group with and without its header, and with the dividers off.
 *
 * Look at the last row in the first two: its hairline is gone, and nothing in
 * the story asked for that — the group unsets it.
 */
export const Variants: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const themeKey = themeFromGlobals(globals).key;
    return (
      <Page themeKey={themeKey}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PlatformListGroup header="Hoy" platform={platform} testID="con-encabezado" />
          <PlatformListGroup platform={platform} testID="sin-encabezado" />
          <PlatformListGroup dividers={false} platform={platform} testID="sin-divisores" />
        </div>
      </Page>
    );
  }
};

/**
 * One row, which is the case that proves the rule: with a single row the
 * divider is off, because that row is also the last one.
 */
export const SingleRow: TStory = {
  args: {
    header: 'Una sola fila',
    rows: [{ label: 'Transferencia a Ana', description: 'Hoy, 10:24', trailingText: '$1.250,00' }],
  },
};

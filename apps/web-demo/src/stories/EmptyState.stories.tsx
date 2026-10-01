import type { TEmptyStateLayout } from '@dsm/shared';
import { IconCreditCard01 } from '@dsm/web/icons/finance-ecommerce';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { PlatformEmptyState } from './PlatformEmptyState';
import type { IPlatformEmptyStateProps, TPlatform } from './PlatformEmptyState';

const LAYOUTS: TEmptyStateLayout[] = ['page', 'inline'];

const meta = {
  title: 'Atoms/EmptyState',
  component: PlatformEmptyState,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "What renders when a screen or a block has no content, saying why it's empty and " +
          "what to do next.\n\n" +
          '**It is never an error.** If something failed — didn\'t load, the connection ' +
          'dropped, the service doesn\'t respond — that\'s `Alert`, not this.\n\n' +
          '**Load first.** While content is still arriving, show a `Skeleton`, not this — ' +
          "showing the empty state before knowing whether there's data makes it look like " +
          "there isn't any.\n\n" +
          '**Every optional slot is presence-based** — no `showGraphic`, `showAction` or ' +
          '`showSecondaryAction`. `secondaryAction` only renders paired with `action` — never ' +
          'a lone secondary, never a third.\n\n' +
          '**`layout` changes alignment, typography, padding and the action\'s shape — never ' +
          'colour.** `page` centres and anchors to the top (not the vertical middle, which ' +
          'reads as a gap waiting to load); `inline` is left-aligned text with no padding of ' +
          "its own, since the block it sits in already has that.",
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: '40–60 characters, no full stop. Says why it\'s empty.',
      table: { category: 'Content' },
    },
    body: {
      control: 'text',
      description: 'One sentence, up to 180 characters, no full stop. Says what comes next.',
      table: { category: 'Content' },
    },
    graphic: { table: { disable: true } },
    action: { table: { disable: true } },
    secondaryAction: { table: { disable: true } },
    layout: {
      control: 'inline-radio',
      options: LAYOUTS,
      table: { category: 'Appearance', defaultValue: { summary: 'page' } },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    title: 'Aún no tienes movimientos',
    body: 'Cuando uses tu tarjeta, tus compras y pagos van a aparecer acá',
    graphic: <IconCreditCard01 />,
    action: { label: 'Ver mis tarjetas', onPress: fn() },
    testID: 'empty-state',
  },
  render: (args, { globals }) => (
    <div style={{ maxWidth: args.layout === 'inline' ? 400 : undefined, padding: args.layout === 'inline' ? 24 : 0 }}>
      <PlatformEmptyState {...args} platform={globals.platform as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformEmptyStateProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** The two layouts side by side — same content, different shape. */
export const Layouts: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {LAYOUTS.map((layout) => (
          <div key={layout} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12, opacity: 0.65, padding: '0 24px' }}>{layout}</span>
            <div style={{ maxWidth: layout === 'inline' ? 400 : undefined, padding: layout === 'inline' ? 24 : 0 }}>
              <PlatformEmptyState {...args} layout={layout} platform={platform} />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/** `action`'s presence draws the primary Button — without it, no actions render at all. */
export const NoAction: TStory = {
  args: { action: undefined },
};

/** `secondaryAction` only renders paired with `action` — never a lone secondary. */
export const WithSecondaryAction: TStory = {
  args: {
    secondaryAction: { label: 'Ver cómo funciona', onPress: fn() },
  },
};

/** No `graphic` — the slot is presence-based, same convention as Callout's icon. */
export const NoGraphic: TStory = {
  args: { graphic: undefined },
};

/** The three real-world copies this component covers — the type of empty is never a prop, only the text. */
export const TypesOfEmpty: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    const variants = [
      {
        title: 'Agrega tu primera tarjeta',
        body: 'Sumá una tarjeta para empezar a ver tus movimientos acá',
        action: 'Agregar tarjeta',
      },
      { title: 'Ya pagaste todo lo pendiente', body: 'No tenés pagos programados por ahora', action: 'Ver historial' },
      {
        title: 'No hay movimientos en esas fechas',
        body: 'Probá con un rango más amplio para ver tus compras y pagos',
        action: 'Cambiar fechas',
      },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {variants.map((variant) => (
          <PlatformEmptyState
            {...args}
            action={{ label: variant.action, onPress: fn() }}
            body={variant.body}
            key={variant.title}
            platform={platform}
            title={variant.title}
          />
        ))}
      </div>
    );
  },
};

import type { TAlertPlacement, TAlertTone } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';

import { PlatformAlert } from './PlatformAlert';
import type { IPlatformAlertProps, TPlatform } from './PlatformAlert';

const TONES: TAlertTone[] = ['danger', 'warning', 'success', 'info', 'neutral'];
const PLACEMENTS: TAlertPlacement[] = ['page', 'section', 'inline'];

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>{children}</div>
);

const meta = {
  title: 'Atoms/Alert',
  component: PlatformAlert,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'In-flow notice — occupies space, does not auto-dismiss (that is Snackbar). ' +
          '`tone` × `placement` (15 variants). No border; muted fill + circular chip. ' +
          'Action is a LinkButton `on-muted` `sm`. Dismiss is a 24px veil control with a 48pt hit target.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: TONES,
      description: 'Semantic tone. Chip fill + glyph carry meaning together.',
      table: { category: 'Appearance', defaultValue: { summary: 'danger' } },
    },
    placement: {
      control: 'inline-radio',
      options: PLACEMENTS,
      description: 'page: body md / 16 pad. section: body sm / 16 pad. inline: body sm / 12 pad.',
      table: { category: 'Appearance', defaultValue: { summary: 'page' } },
    },
    showTitle: {
      control: 'boolean',
      description: 'Whether the title renders. Independent of `title` being set.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    title: {
      control: 'text',
      description: 'Headline. Hidden when `showTitle` is false.',
      table: { category: 'Content' },
    },
    body: {
      control: 'text',
      description: 'Supporting copy. Always visible.',
      table: { category: 'Content' },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether the tone chip renders. Glyph is locked to `tone`.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    showAction: {
      control: 'boolean',
      description: 'Whether the action LinkButton renders.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    actionLabel: {
      control: 'text',
      description: 'Label of the nested LinkButton.',
      table: { category: 'Content', defaultValue: { summary: 'Ver detalle' } },
    },
    showDismiss: {
      control: 'boolean',
      description: 'Whether the dismiss control renders. Guideline: info/neutral/success, not danger/warning.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    dismissAccessibilityLabel: {
      control: 'text',
      description: 'Accessible name of the dismiss control.',
      table: { category: 'Content', defaultValue: { summary: 'Cerrar aviso' } },
    },
    testID: { table: { disable: true } },
    onAction: { table: { disable: true } },
    onDismiss: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    tone: 'danger',
    placement: 'page',
    showTitle: true,
    title: 'Título del aviso',
    body: 'Descripción breve de la condición y de lo que se puede hacer.',
    showIcon: true,
    showAction: false,
    actionLabel: 'Ver detalle',
    showDismiss: false,
  },
  render: (args, { globals }) => (
    <div style={{ maxWidth: 500 }}>
      <PlatformAlert {...args} platform={globals['platform'] as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformAlertProps>;

export default meta;

type TStory = StoryObj<IPlatformAlertProps>;

export const Playground: TStory = {};

export const Tones: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {TONES.map((tone) => (
          <PlatformAlert key={tone} platform={platform} title={tone} tone={tone} />
        ))}
      </Column>
    );
  },
};

export const Placements: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {PLACEMENTS.map((placement) => (
          <PlatformAlert key={placement} placement={placement} platform={platform} title={placement} />
        ))}
      </Column>
    );
  },
};

export const WithAction: TStory = {
  args: { showAction: true, actionLabel: 'Resolver ahora', tone: 'danger' },
};

export const WithDismiss: TStory = {
  args: { showDismiss: true, tone: 'info' },
};

export const WithActionAndDismiss: TStory = {
  args: { showAction: true, showDismiss: true, tone: 'success', actionLabel: 'Ver detalle' },
};

export const WithoutTitle: TStory = {
  args: { showTitle: false },
};

export const WithoutIcon: TStory = {
  args: { showIcon: false },
};

export const Inline: TStory = {
  args: { placement: 'inline', showTitle: false },
};

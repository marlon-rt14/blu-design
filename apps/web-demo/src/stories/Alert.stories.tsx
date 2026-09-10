import type { TAlertPlacement, TAlertStatus } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';

import { PlatformAlert } from './PlatformAlert';
import type { IPlatformAlertProps, TPlatform } from './PlatformAlert';

const STATUSES: TAlertStatus[] = ['danger', 'warning', 'success', 'info', 'neutral'];
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
          '`status` × `placement` (15 variants). `showAction` / `showDismiss` default false. ' +
          'Action is a LinkButton `on-muted` `sm`. Dismiss is a 24px veil IconButton with a 48pt hit target. ' +
          '`inline` has no title layer.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: STATUSES,
      description: 'Semantic status. Chip fill + glyph carry meaning together.',
      table: { category: 'Appearance', defaultValue: { summary: 'danger' } },
    },
    placement: {
      control: 'inline-radio',
      options: PLACEMENTS,
      description: 'page: body md / 16 pad. section: body sm / 16 pad. inline: body sm / 12 pad, no title.',
      table: { category: 'Appearance', defaultValue: { summary: 'page' } },
    },
    showTitle: {
      control: 'boolean',
      description: 'Whether the title renders. No-op on inline — that placement has no title layer.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    title: {
      control: 'text',
      description: 'Headline. Hidden when `showTitle` is false or `placement` is inline.',
      table: { category: 'Content' },
    },
    body: {
      control: 'text',
      description: 'Supporting copy. Always visible.',
      table: { category: 'Content' },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether the status chip renders. Glyph is locked to `status`.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    showAction: {
      control: 'boolean',
      description: 'Whether the action LinkButton renders.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    actionLabel: {
      control: 'text',
      description: 'Label of the nested LinkButton. Edited on the nested instance in Figma.',
      table: { category: 'Content', defaultValue: { summary: 'Resolver ahora' } },
    },
    showDismiss: {
      control: 'boolean',
      description: 'Whether the dismiss control renders. Usage: on for info / neutral / success.',
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
    status: 'danger',
    placement: 'page',
    showTitle: true,
    title: 'Título del aviso',
    body: 'Descripción breve de la condición y de lo que se puede hacer.',
    showIcon: true,
    showAction: false,
    actionLabel: 'Resolver ahora',
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

export const Statuses: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {STATUSES.map((status) => (
          <PlatformAlert key={status} platform={platform} status={status} title={status} />
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

export const WithoutTitle: TStory = {
  args: { showTitle: false },
};

export const WithoutIcon: TStory = {
  args: { showIcon: false },
};

export const Inline: TStory = {
  args: { placement: 'inline' },
};

export const WithAction: TStory = {
  args: { showAction: true },
};

export const WithDismiss: TStory = {
  args: { showDismiss: true, status: 'info' },
};

export const WithActionAndDismiss: TStory = {
  args: { showAction: true, showDismiss: true, status: 'info' },
};

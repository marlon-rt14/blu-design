import type { TSnackbarStatus } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { PlatformSnackbar } from './PlatformSnackbar';
import type { IPlatformSnackbarProps, TPlatform } from './PlatformSnackbar';

const STATUSES: TSnackbarStatus[] = ['info', 'success', 'warning', 'danger'];

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 448, padding: 24 }}>
    {children}
  </div>
);

const DurationDemo = ({
  platform,
  ...props
}: IPlatformSnackbarProps): ReactElement => {
  const [visible, setVisible] = useState(true);
  const [mountId, setMountId] = useState(0);
  const durationMs = props.duration ?? 2000;

  const show = (): void => {
    setMountId((id) => id + 1);
    setVisible(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 448, padding: 24 }}>
      <button onClick={show} style={{ alignSelf: 'flex-start', cursor: 'pointer' }} type="button">
        Mostrar otra vez ({durationMs} ms)
      </button>
      {visible ? (
        <PlatformSnackbar
          {...props}
          duration={durationMs}
          key={mountId}
          onDismiss={() => setVisible(false)}
          platform={platform}
          showAction={false}
        />
      ) : (
        <p style={{ margin: 0, opacity: 0.6 }}>Cerrado por autoclose / dismiss</p>
      )}
    </div>
  );
};

const meta = {
  title: 'Atoms/Snackbar',
  component: PlatformSnackbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Ephemeral overlay toast — confirms something just happened and leaves on its own. ' +
          'One axis: `status` (info default). Inverse bar; glyph + `on-inverse.{status}` colour. ' +
          'Action is a LinkButton `on-inverse` `sm`. Dismiss is a 32px on-inverse IconButton with a 48pt hit target. ' +
          'Autoclose: `motion/dwell/default` (6s) without action, `motion/dwell/long` (10s) with `showAction`; ' +
          '`duration` overrides. Timer starts on mount and does not restart. Host unmounts on `onDismiss`.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: STATUSES,
      description: 'Semantic status. Glyph + on-inverse colour carry meaning together. Bar fill never changes.',
      table: { category: 'Appearance', defaultValue: { summary: 'info' } },
    },
    message: {
      control: 'text',
      description: 'Past tense, no trailing period, max two lines.',
      table: { category: 'Content' },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether the status glyph renders. Glyph is locked to `status`.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    showAction: {
      control: 'boolean',
      description: 'Whether the action LinkButton renders. Pairs with `onAction`.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    actionLabel: {
      control: 'text',
      description: 'Label of the nested LinkButton. Max two words, infinitive.',
      table: { category: 'Content', defaultValue: { summary: 'Deshacer' } },
    },
    showDismiss: {
      control: 'boolean',
      description: 'Whether the dismiss control renders. Pairs with `onDismiss`.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    dismissAccessibilityLabel: {
      control: 'text',
      description: 'Accessible name of the dismiss control.',
      table: { category: 'Content', defaultValue: { summary: 'Cerrar' } },
    },
    duration: {
      control: 'number',
      description: 'Autoclose dwell in ms. Overrides motion/dwell/{default|long}.',
      table: { category: 'Behavior' },
    },
    testID: { table: { disable: true } },
    onAction: { table: { disable: true } },
    onDismiss: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    status: 'info',
    message: 'Se guardó el cambio en tu tarjeta',
    showIcon: true,
    showAction: true,
    actionLabel: 'Deshacer',
    showDismiss: false,
  },
  render: (args, { globals }) => (
    <div style={{ maxWidth: 448, padding: 24 }}>
      <PlatformSnackbar {...args} platform={globals['platform'] as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformSnackbarProps>;

export default meta;

type TStory = StoryObj<IPlatformSnackbarProps>;

export const Playground: TStory = {};

export const Statuses: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {STATUSES.map((status) => (
          <PlatformSnackbar key={status} platform={platform} status={status} />
        ))}
      </Column>
    );
  },
};

export const WithDismiss: TStory = {
  args: { showDismiss: true },
};

export const WithoutAction: TStory = {
  args: { showAction: false },
};

export const WithoutIcon: TStory = {
  args: { showIcon: false },
};

export const TwoLines: TStory = {
  args: {
    message: 'Programamos el pago de tu tarjeta Diners para el 28 de agosto',
  },
};

export const Duration: TStory = {
  args: {
    duration: 2000,
    message: 'Se cierra solo en 2 s',
    showAction: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Autoclose con `duration` override (2 s). Host unmounts on `onDismiss`. ' +
          'Sin action → dwell default sería 6 s; aquí el prop gana.',
      },
    },
  },
  render: (args, { globals }) => (
    <DurationDemo {...args} platform={globals['platform'] as TPlatform} />
  ),
};

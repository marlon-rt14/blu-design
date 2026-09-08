import type { TSnackbarTone } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';

import { PlatformSnackbar } from './PlatformSnackbar';
import type { IPlatformSnackbarProps, TPlatform } from './PlatformSnackbar';

const TONES: TSnackbarTone[] = ['info', 'success', 'warning', 'danger'];

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 448, padding: 24 }}>
    {children}
  </div>
);

const meta = {
  title: 'Atoms/Snackbar',
  component: PlatformSnackbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Ephemeral overlay toast — confirms something just happened and leaves on its own. ' +
          'One axis: `tone` (info default). Inverse bar; glyph + `on-inverse.{tone}` colour. ' +
          'Action is a LinkButton `on-inverse` `sm`. Close is a 32px on-inverse IconButton with a 48pt hit target. ' +
          'Auto-dismisses after 6s from mount (timer does not restart). Host unmounts on `onDismiss`.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: TONES,
      description: 'Semantic tone. Glyph + on-inverse colour carry meaning together. Bar fill never changes.',
      table: { category: 'Appearance', defaultValue: { summary: 'info' } },
    },
    message: {
      control: 'text',
      description: 'Past tense, no trailing period, max two lines.',
      table: { category: 'Content' },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether the tone glyph renders. Glyph is locked to `tone`.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    showAction: {
      control: 'boolean',
      description: 'Whether the action LinkButton renders.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    actionLabel: {
      control: 'text',
      description: 'Label of the nested LinkButton. Max two words, infinitive.',
      table: { category: 'Content', defaultValue: { summary: 'Deshacer' } },
    },
    showClose: {
      control: 'boolean',
      description: 'Whether the close control renders.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    closeAccessibilityLabel: {
      control: 'text',
      description: 'Accessible name of the close control.',
      table: { category: 'Content', defaultValue: { summary: 'Cerrar' } },
    },
    testID: { table: { disable: true } },
    onAction: { table: { disable: true } },
    onDismiss: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    tone: 'info',
    message: 'Se guardó el cambio en tu tarjeta',
    showIcon: true,
    showAction: true,
    actionLabel: 'Deshacer',
    showClose: false,
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

export const Tones: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {TONES.map((tone) => (
          <PlatformSnackbar key={tone} platform={platform} tone={tone} />
        ))}
      </Column>
    );
  },
};

export const WithClose: TStory = {
  args: { showClose: true },
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

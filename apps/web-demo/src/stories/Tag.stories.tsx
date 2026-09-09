import type { TTagAppearance, TTagPalette, TTagSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';

import { PlatformTag } from './PlatformTag';
import type { IPlatformTagProps, TPlatform } from './PlatformTag';

const APPEARANCES: TTagAppearance[] = ['fill', 'soft', 'outline'];
const PALETTES: TTagPalette[] = [
  'neutral',
  'brand',
  'success',
  'warning',
  'danger',
  'info',
  'tangerine',
  'aqua',
  'indigo',
];
const SIZES: TTagSize[] = ['sm', 'xs'];

const Row = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>{children}</div>
);

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
);

const meta = {
  title: 'Atoms/Tag',
  component: PlatformTag,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A label that is read — what type something is, or what state it is in. It is not touched to ' +
          'change it; that is what Chip is for. `palette` is a choice, not a signal — the label carries the meaning.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    appearance: {
      control: 'inline-radio',
      options: APPEARANCES,
      table: { category: 'Appearance', defaultValue: { summary: 'soft' } },
    },
    palette: {
      control: 'select',
      options: PALETTES,
      table: { category: 'Appearance', defaultValue: { summary: 'neutral' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    showLeadingIcon: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    icon: { control: 'select', options: ['check-circle', 'store', 'user'], table: { category: 'Content' } },
    showRemove: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    testID: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Etiqueta',
    appearance: 'soft',
    palette: 'neutral',
    size: 'sm',
    showLeadingIcon: false,
    icon: 'check-circle',
    showRemove: false,
  },
  render: (args, { globals }) => <PlatformTag {...args} platform={globals['platform'] as TPlatform} />,
} satisfies Meta<IPlatformTagProps>;

export default meta;

type TStory = StoryObj<IPlatformTagProps>;

export const Playground: TStory = {};

export const Appearances: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {APPEARANCES.map((appearance) => (
          <Row key={appearance}>
            {PALETTES.map((palette) => (
              <PlatformTag appearance={appearance} key={palette} label="Etiqueta" palette={palette} platform={platform} />
            ))}
          </Row>
        ))}
      </Column>
    );
  },
};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        {SIZES.map((size) => (
          <PlatformTag key={size} label="Etiqueta" platform={platform} size={size} />
        ))}
      </Row>
    );
  },
};

export const WithLeadingIcon: TStory = {
  args: { showLeadingIcon: true, icon: 'check-circle', palette: 'success' },
};

export const ComboboxChip: TStory = {
  args: { appearance: 'outline', palette: 'neutral', showRemove: true },
};

export const StatusPalette: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        <PlatformTag label="Aprobado" palette="success" platform={platform} />
        <PlatformTag label="Pendiente" palette="warning" platform={platform} />
        <PlatformTag label="Rechazado" palette="danger" platform={platform} />
      </Row>
    );
  },
};

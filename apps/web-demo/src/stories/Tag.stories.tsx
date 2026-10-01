import type { TTagAppearance, TTagPalette, TTagSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { ReactElement, ReactNode } from 'react';

import { PlatformTag } from './PlatformTag';
import type { IPlatformTagProps } from './PlatformTag';
import { implementationFor } from './themeGlobals';

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
    leadingIcon: {
      control: 'select',
      options: [undefined, 'IconCheckCircle', 'IconStore', 'IconUser01'],
      description:
        'The glyph, by export name — the real prop is a `ReactNode`, and its ' +
        'presence is what turns the slot on. There is no `showLeadingIcon`.',
      table: { category: 'Content' },
    },
    onRemove: {
      description:
        'Its presence is what draws the ×. There is no `showRemove`: a × that ' +
        'removes nothing is a trap.',
      table: { category: 'Content' },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Etiqueta',
    appearance: 'soft',
    palette: 'neutral',
    size: 'sm',
  },
  render: (args, { globals }) => <PlatformTag {...args} platform={implementationFor(globals)} />,
} satisfies Meta<IPlatformTagProps>;

export default meta;

type TStory = StoryObj<IPlatformTagProps>;

export const Playground: TStory = {};

export const Appearances: TStory = {
  render: (_args, { globals }) => {
    const platform = implementationFor(globals);
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
    const platform = implementationFor(globals);
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
  args: { leadingIcon: 'IconCheckCircle', palette: 'success' },
};

export const ComboboxChip: TStory = {
  args: { appearance: 'outline', palette: 'neutral', onRemove: fn() },
};

export const StatusPalette: TStory = {
  render: (_args, { globals }) => {
    const platform = implementationFor(globals);
    return (
      <Row>
        <PlatformTag label="Aprobado" palette="success" platform={platform} />
        <PlatformTag label="Pendiente" palette="warning" platform={platform} />
        <PlatformTag label="Rechazado" palette="danger" platform={platform} />
      </Row>
    );
  },
};

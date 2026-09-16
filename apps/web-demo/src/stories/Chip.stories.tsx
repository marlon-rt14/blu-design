import type { TChipSize } from '@dsm/shared';
import { Chip } from '@dsm/web';
import type { IChipProps } from '@dsm/web';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';

const SIZES: TChipSize[] = ['sm', 'xs'];

const FILTERS = ['Todos', 'Activos', 'Pendientes', 'Archivados'];

/** A chip needs its own `onToggle` wired to real state to be interactive outside the Playground story. */
const IsolatedChip = (props: Omit<IChipProps, 'onToggle'>): ReactElement => {
  const [selected, setSelected] = useState(props.selected);
  return <Chip {...props} onToggle={setSelected} selected={selected} />;
};

/** Demonstrates a real `onRemove`: the chip actually leaves the row once removed. */
const RemovableChip = (props: Omit<IChipProps, 'onToggle' | 'onRemove'>): ReactElement => {
  const [selected, setSelected] = useState(props.selected);
  const [isRemoved, setIsRemoved] = useState(false);
  if (isRemoved) return <span>Se quitó el chip.</span>;
  return <Chip {...props} onRemove={() => setIsRemoved(true)} onToggle={setSelected} selected={selected} />;
};

/** A row of mutually-independent filters — each chip owns its own boolean, none exclude another. */
const FilterGroup = (): ReactElement => {
  const [active, setActive] = useState<Record<string, boolean>>({ Activos: true });
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {FILTERS.map((filter) => (
        <Chip
          key={filter}
          label={filter}
          onToggle={(selected) => setActive((current) => ({ ...current, [filter]: selected }))}
          selected={Boolean(active[filter])}
        />
      ))}
    </div>
  );
};

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A filter that is touched, not a label that is read — that is Tag. Chip toggles: `aria-pressed` ' +
          'carries the state, not a checkbox role. The × is an icon inside the chip, not a nested IconButton — ' +
          'it has no focus stop or hit target of its own yet, a documented gap in the live component.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    selected: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    leadingIcon: { control: 'select', options: ['store', 'user', 'check'], table: { category: 'Content' } },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    disabled: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    testID: { table: { disable: true } },
    onToggle: { table: { disable: true } },
    onRemove: { table: { disable: true } },
  },
  args: {
    label: 'Activos',
    selected: false,
    size: 'sm',
    disabled: false,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return <Chip {...args} onToggle={(selected) => updateArgs({ selected })} />;
  },
} satisfies Meta<IChipProps>;

export default meta;

type TStory = StoryObj<IChipProps>;

export const Playground: TStory = {};

export const Selected: TStory = {
  args: { selected: true },
};

export const Sizes: TStory = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <IsolatedChip key={size} label={`Tamaño ${size}`} selected={size === 'sm'} size={size} />
      ))}
    </div>
  ),
};

export const WithLeadingIcon: TStory = {
  args: { leadingIcon: 'store', selected: true },
};

export const Removable: TStory = {
  args: { selected: true },
  render: (args) => <RemovableChip {...args} />,
};

export const Disabled: TStory = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IsolatedChip disabled label="Sin seleccionar" selected={false} />
      <IsolatedChip disabled label="Seleccionado" selected />
    </div>
  ),
};

export const FilterRow: TStory = {
  render: () => <FilterGroup />,
};

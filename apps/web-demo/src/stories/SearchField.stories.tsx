import type { TSearchFieldSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { PlatformSearchField } from './PlatformSearchField';
import type { IPlatformSearchFieldProps, TPlatform } from './PlatformSearchField';

const SIZES: TSearchFieldSize[] = ['lg', 'md', 'sm'];

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 343 }}>{children}</div>
);

/** Holds `value` so the canvas can be typed. Storybook does not own the string. */
const Controlled = (props: IPlatformSearchFieldProps): ReactElement => {
  const [value, setValue] = useState(props.value);
  return <PlatformSearchField {...props} value={value} onValueChange={setValue} />;
};

const meta = {
  title: 'Atoms/SearchField',
  component: PlatformSearchField,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Search bar. Dev firma (`1290:70570`): `value`, required `placeholder` ' +
          '(also the accessible name), `size` default `md`, `isDisabled`, `onClear`, ' +
          '`onSubmit`, `trailingAccessory` (host slot, only while empty), `autoFocus`.\n\n' +
          '`isFilled` and `state` are not props. The field does not ship a trailing ' +
          'glyph — mic, camera or filters are whatever the screen passes. With text, ' +
          'that slot is replaced by the clear control ("Borrar búsqueda"): web ' +
          'IconButton veil + x, native `IconXCircle` (iOS glyph; Android\'s veil ' +
          'button is the same control on web, and this package is one build). ' +
          'Web: white box, 1px border, `radius/field/md`. Native: ' +
          '`color/fill/neutral/subtle`, no border, pill, accent border on focus. ' +
          'Search glyph is 16 at every size.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    isDisabled: { control: 'boolean', table: { category: 'State' } },
    autoFocus: { control: 'boolean', table: { category: 'State' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    value: { table: { disable: true } },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    onClear: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    trailingAccessory: { table: { disable: true } },
  },
  args: {
    size: 'md',
    isDisabled: false,
    autoFocus: false,
    placeholder: 'Buscar movimientos',
    value: '',
  },
  render: (args, { globals }) => (
    <div style={{ padding: 24, width: 343, boxSizing: 'border-box' }}>
      <Controlled {...args} platform={globals['platform'] as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformSearchFieldProps>;

export default meta;

type TStory = StoryObj<IPlatformSearchFieldProps>;

export const Playground: TStory = {};

/** lg 56 / md 44 / sm 32, empty. */
export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24 }}>
        <Column>
          {SIZES.map((size) => (
            <Controlled key={size} platform={platform} size={size} placeholder="Buscar movimientos" value="" />
          ))}
        </Column>
      </div>
    );
  },
};

/** Non-empty value swaps the trailing slot for the clear control. */
export const Filled: TStory = {
  args: { value: 'Supermaxi' },
};

export const Disabled: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24 }}>
        <Column>
          <Controlled platform={platform} isDisabled placeholder="Buscar movimientos" value="" />
          <Controlled platform={platform} isDisabled placeholder="Buscar movimientos" value="Supermaxi" />
        </Column>
      </div>
    );
  },
};

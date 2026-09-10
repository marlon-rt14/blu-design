import type { ISelectOption, TSelectSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';

import { PlatformSelect } from './PlatformSelect';
import type { IPlatformSelectProps, TPlatform } from './PlatformSelect';

const SIZES: TSelectSize[] = ['sm', 'md', 'lg'];

const COUNTRIES: ISelectOption[] = [
  { value: 'ec', label: 'Ecuador' },
  { value: 'pe', label: 'Perú' },
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  { value: 'ar', label: 'Argentina' },
];

const MANY_COUNTRIES: ISelectOption[] = [
  ...COUNTRIES,
  { value: 'cl', label: 'Chile' },
  { value: 'uy', label: 'Uruguay' },
  { value: 'py', label: 'Paraguay' },
  { value: 'bo', label: 'Bolivia' },
  { value: 've', label: 'Venezuela' },
  { value: 'br', label: 'Brasil' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'es', label: 'España' },
];

const PAYMENT_METHODS: ISelectOption[] = [
  { value: 'debit', label: 'Débito', icon: 'credit-card' },
  { value: 'credit', label: 'Crédito', icon: 'credit-card' },
  { value: 'transfer', label: 'Transferencia', icon: 'arrow-right' },
];

const IsolatedSelect = (props: Omit<IPlatformSelectProps, 'onChange'>): ReactElement => {
  const [value, setValue] = useState(props.value);
  return <PlatformSelect {...props} onChange={setValue} value={value} />;
};

const meta = {
  title: 'Molecules/Select',
  component: PlatformSelect,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A field whose value comes from a fixed catalog through a menu, not from typing. `isOpen` is not ' +
          'a prop — it is internal state. Web opens a popover anchored to the field; mobile opens a native ' +
          'bottom sheet. If real text filtering is needed, this is not the component — that is Combobox.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    placeholder: { control: 'text', table: { category: 'Content' } },
    leadingIcon: { control: 'select', options: ['search', 'user', 'store'], table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    error: { control: 'text', table: { category: 'State' } },
    readOnly: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    isSearchable: { control: 'boolean', table: { category: 'Behavior', defaultValue: { summary: 'false' } } },
    testID: { table: { disable: true } },
    onChange: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'País',
    options: COUNTRIES,
    size: 'md',
    placeholder: 'Elegí un país',
    helperText: 'Usamos esto para calcular impuestos',
    readOnly: false,
    disabled: false,
  },
  render: (args, { globals }) => {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ width: 320 }}>
        <PlatformSelect {...args} onChange={(value) => updateArgs({ value })} platform={globals['platform'] as TPlatform} />
      </div>
    );
  },
} satisfies Meta<IPlatformSelectProps>;

export default meta;

type TStory = StoryObj<IPlatformSelectProps>;

export const Playground: TStory = {};

export const Filled: TStory = {
  args: { value: 'pe' },
};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
        {SIZES.map((size) => (
          <IsolatedSelect key={size} label={`Tamaño ${size}`} options={COUNTRIES} platform={platform} size={size} />
        ))}
      </div>
    );
  },
};

export const WithLeadingIconAndOptionIcons: TStory = {
  args: {
    label: 'Método de pago',
    options: PAYMENT_METHODS,
    leadingIcon: 'store',
    placeholder: 'Elegí un método',
    helperText: undefined,
  },
};

export const ErrorState: TStory = {
  args: { error: 'Elegí un país para continuar' },
};

export const ReadOnly: TStory = {
  args: { value: 'ec', readOnly: true },
};

export const Disabled: TStory = {
  args: { value: 'ec', disabled: true },
};

export const Searchable: TStory = {
  args: {
    label: 'País',
    options: MANY_COUNTRIES,
    placeholder: 'Elegí un país',
    isSearchable: true,
  },
};

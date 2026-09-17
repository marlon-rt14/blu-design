import type { IMenuOption, TMenuSize } from '@dsm/shared';
import { Menu } from '@dsm/web';
import type { IMenuProps } from '@dsm/web';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';

const SIZES: TMenuSize[] = ['sm', 'md'];

const ACCOUNTS: IMenuOption[] = [
  { value: 'savings', label: 'Cuenta de ahorros' },
  { value: 'checking', label: 'Cuenta corriente' },
  { value: 'credit-card', label: 'Tarjeta de crédito' },
  { value: 'investment', label: 'Cuenta de inversión' },
];

const ACCOUNTS_WITH_DETAIL: IMenuOption[] = [
  { value: 'savings', label: 'Cuenta de ahorros', description: '••• 4821', leading: 'credit-card', trailingText: '$12.400,00' },
  { value: 'checking', label: 'Cuenta corriente', description: '••• 0093', leading: 'credit-card', trailingText: '$3.150,00' },
  { value: 'credit-card', label: 'Tarjeta de crédito', description: '••• 5567', leading: 'credit-card', trailingText: '-$820,00' },
];

const ACCOUNTS_WITH_DISABLED: IMenuOption[] = [
  { value: 'savings', label: 'Cuenta de ahorros' },
  { value: 'checking', label: 'Cuenta corriente' },
  { value: 'credit-card', label: 'Tarjeta de crédito', disabled: true },
  { value: 'investment', label: 'Cuenta de inversión' },
];

/** Menu needs a real `onSelect` wired to state to be interactive outside the Playground story. */
const IsolatedMenu = (props: Omit<IMenuProps, 'onSelect'>): ReactElement => {
  const [value, setValue] = useState(props.value);
  return <Menu {...props} onSelect={setValue} value={value} />;
};

/** `value` as an array — several rows can be marked selected at once. */
const MultiSelectMenu = (props: Omit<IMenuProps, 'onSelect' | 'value'>): ReactElement => {
  const [values, setValues] = useState<string[]>(['savings']);
  return (
    <Menu
      {...props}
      onSelect={(next) => setValues((current) => (current.includes(next) ? current.filter((v) => v !== next) : [...current, next]))}
      value={values}
    />
  );
};

const meta = {
  title: 'Molecules/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The floating list itself — one component for MenuItem, Menu and MenuEmpty. Pure content: there ' +
          'is no `isOpen`/anchor/`onClose` here, mounting and positioning it is the caller\'s job. `isSelected` ' +
          'on a row is never chosen — it comes from `value` being a member (a single value or an array).',
      },
    },
  },
  argTypes: {
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    header: { control: 'text', table: { category: 'Content' } },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    emptyMessage: { control: 'text', table: { category: 'Content', defaultValue: { summary: 'Sin resultados' } } },
    testID: { table: { disable: true } },
    onSelect: { table: { disable: true } },
  },
  args: {
    options: ACCOUNTS,
    size: 'md',
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ width: 280 }}>
        <Menu {...args} onSelect={(value) => updateArgs({ value })} />
      </div>
    );
  },
} satisfies Meta<IMenuProps>;

export default meta;

type TStory = StoryObj<IMenuProps>;

export const Playground: TStory = {
  args: { value: 'checking' },
};

export const WithHeader: TStory = {
  args: { header: 'Selecciona una opción', value: 'savings' },
};

export const Sizes: TStory = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {SIZES.map((size) => (
        <div key={size} style={{ width: 240 }}>
          <IsolatedMenu header={`Tamaño ${size}`} options={ACCOUNTS} size={size} value="savings" />
        </div>
      ))}
    </div>
  ),
};

export const WithDescriptionLeadingAndTrailing: TStory = {
  render: () => (
    <div style={{ width: 320 }}>
      <IsolatedMenu options={ACCOUNTS_WITH_DETAIL} value="savings" />
    </div>
  ),
};

export const DisabledOption: TStory = {
  render: () => (
    <div style={{ width: 280 }}>
      <IsolatedMenu options={ACCOUNTS_WITH_DISABLED} value="savings" />
    </div>
  ),
};

export const MultiSelect: TStory = {
  render: () => (
    <div style={{ width: 280 }}>
      <MultiSelectMenu options={ACCOUNTS} />
    </div>
  ),
};

export const Empty: TStory = {
  args: { options: [] },
};

export const EmptyWithCustomMessage: TStory = {
  args: { options: [], emptyMessage: 'Sin resultados para ese banco' },
};

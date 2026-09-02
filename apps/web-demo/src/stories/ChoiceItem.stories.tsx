import type { TChoiceItemSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { PlatformChoiceItem } from './PlatformChoiceItem';
import type { IPlatformChoiceItemProps, TPlatform } from './PlatformChoiceItem';

const SIZES: TChoiceItemSize[] = ['sm', 'md'];

/** A 320-wide column, the width the Figma master is drawn at. */
const Column = ({ children }: { children: ReactNode }): ReactNode => (
  <div style={{ width: 320, display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const meta = {
  title: 'Molecules/ChoiceItem',
  component: PlatformChoiceItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**A selectable option as a whole row.** Unlike a bare `Radio` or `Checkbox`, the ' +
          'touch target is the entire row and the control on the left only says what kind of ' +
          'choice it is. The row is the `<label>` on web, and the focus ring is drawn on the ' +
          'row rather than only on the control.\n\n' +
          '**A chosen row is never tinted.** The control changes shape, which satisfies WCAG ' +
          '1.4.1 without colouring the row — bDS removed the tint and the 3px indicator bar on ' +
          '2025-09-01 because at full width they read as a *highlighted* row rather than a ' +
          'chosen option.\n\n' +
          'It is one of four row components bDS classifies **by how many targets they have**, ' +
          'not by how they look: `ChoiceItem` and `SwitchItem` have one target that *is* the ' +
          'control, `ListItem` has one that navigates, `MenuItem` one inside a popover.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    control: {
      control: 'inline-radio',
      options: ['radio', 'checkbox'],
      description: 'Which control the row carries. Only the control changes — the row is identical.',
      table: { category: 'Content', defaultValue: { summary: 'radio' } },
    },
    showDescription: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    description: { control: 'text', table: { category: 'Content' } },
    showTrailingText: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    trailingText: { control: 'text', table: { category: 'Content' } },
    showDivider: {
      control: 'boolean',
      description:
        '**Starts off**, and that is deliberate: a divider between rows is an iOS grouped-list ' +
        'pattern, not a property of the row. Turn it on per row and off on the last one. It ' +
        'starts where the *text* starts, clearing the control’s column.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    isChecked: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    isDisabled: {
      control: 'boolean',
      description: 'Quietens the text and the control. **The row’s surface is untouched** — measured against Figma.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Row 48 / 56 tall, control 16 / 24, lateral inset 8 / 12.',
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    testID: { control: 'text', table: { category: 'Other' } },
    name: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Opción',
    description: 'Texto de apoyo',
    trailingText: '$0,00',
    onAction: fn(),
  },
  render: (args, { globals }) => (
    <Column>
      <PlatformChoiceItem {...args} platform={globals.platform as TPlatform} />
    </Column>
  ),
} satisfies Meta<IPlatformChoiceItemProps>;

export default meta;
type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/**
 * The states that are props. Note the chosen row and the disabled row keep the
 * same surface as the default one — only the control and the text move.
 */
export const States: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <Column>
        <PlatformChoiceItem {...args} label="default" platform={platform} testID="ci-default" />
        <PlatformChoiceItem {...args} isChecked label="checked" platform={platform} testID="ci-checked" />
        <PlatformChoiceItem {...args} isDisabled label="disabled" platform={platform} testID="ci-disabled" />
        <PlatformChoiceItem {...args} isChecked isDisabled label="checked + disabled" platform={platform} testID="ci-both" />
      </Column>
    );
  },
};

/** Both sizes, with everything turned on. */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SIZES.map((size) => (
        <Column key={size}>
          <PlatformChoiceItem
            {...args}
            isChecked
            label={`Opción · ${size}`}
            platform={globals.platform as TPlatform}
            showDescription
            showTrailingText
            size={size}
          />
        </Column>
      ))}
    </div>
  ),
};

/** A real radio group. The last row turns the divider off, as bDS asks. */
export const AsAList: TStory = {
  render: function Render(args, { globals }) {
    const [chosen, setChosen] = useState('Débito');
    const options = ['Débito', 'Crédito', 'Transferencia'];
    return (
      <Column>
        {options.map((option, index) => (
          <PlatformChoiceItem
            {...args}
            isChecked={chosen === option}
            key={option}
            label={option}
            name="metodo"
            onAction={() => setChosen(option)}
            platform={globals.platform as TPlatform}
            showDivider={index < options.length - 1}
            showTrailingText
            trailingText={`$ ${(index + 1) * 1200}`}
          />
        ))}
      </Column>
    );
  },
};

/** With a checkbox instead: several options, or none. */
export const WithCheckbox: TStory = {
  args: { control: 'checkbox', label: 'Opción múltiple', showDescription: true },
};

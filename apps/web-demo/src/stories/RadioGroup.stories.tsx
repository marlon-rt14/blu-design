import type { TRadioGroupSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PlatformRadioGroup } from './PlatformRadioGroup';
import type { IPlatformRadioGroupProps, TPlatform } from './PlatformRadioGroup';

const SIZES: TRadioGroupSize[] = ['sm', 'md'];
const METODOS = ['Débito', 'Crédito', 'Transferencia'];

const meta = {
  title: 'Molecules/RadioGroup',
  component: PlatformRadioGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**The `<fieldset>` with its `<legend>`.** It asks the question, groups the rows and ' +
          'shows the helper or the error — it does not draw the rows, which arrive through a ' +
          'slot (`children`).\n\n' +
          'Reach for this and not a checkbox group when **one** option is chosen: the difference ' +
          'is semantic, not visual, and it lands as `role="radiogroup"`. Because there is always ' +
          'one chosen, bring a selection in by default.\n\n' +
          'Three things it deliberately does not do: **no lateral padding** (that is screen ' +
          'margin), **no disabled state** (disable each row — a slot cannot promise what is ' +
          'inside it), and **no tinting of the chosen row** (the control says so by changing shape).',
      },
    },
  },
  argTypes: {
    legend: {
      control: 'text',
      description: 'The question. Required even when hidden — it names the group.',
      table: { category: 'Content' },
    },
    showLegend: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'true' } } },
    helperText: { control: 'text', table: { category: 'Content' } },
    showHelper: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'true' } } },
    isInvalid: {
      control: 'boolean',
      description:
        'Paints the helper with `color/text/danger`. **That is all** — it does not tint the ' +
        'rows and cannot: what comes through the slot belongs to whoever assembled it.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description:
        'Must match the rows’ size: the legend and helper indent follows the row’s own (8 at ' +
        '`sm`, 12 at `md`) so the text starts in the same column as the control.',
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    options: { table: { disable: true } },
    selected: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    legend: 'Título del grupo',
    helperText: 'Texto de ayuda del grupo',
  },
  render: function Render(args, { globals }) {
    const [selected, setSelected] = useState(METODOS[0]);
    return (
      <PlatformRadioGroup
        {...args}
        onSelect={setSelected}
        options={METODOS}
        platform={globals.platform as TPlatform}
        selected={selected}
      />
    );
  },
} satisfies Meta<IPlatformRadioGroupProps>;

export default meta;
type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. Pick an option to see it move. */
export const Playground: TStory = {};

/** The invalid state. Only the helper turns red — the rows are untouched. */
export const Invalid: TStory = {
  args: { isInvalid: true, helperText: 'Elegí un método para continuar' },
};

/** Both sizes. The legend indent follows the row: 8 at `sm`, 12 at `md`. */
export const Sizes: TStory = {
  render: function Render(args, { globals }) {
    const [selected, setSelected] = useState(METODOS[0]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {SIZES.map((size) => (
          <PlatformRadioGroup
            {...args}
            key={size}
            legend={`Título del grupo · ${size}`}
            onSelect={setSelected}
            options={METODOS}
            platform={globals.platform as TPlatform}
            selected={selected}
            size={size}
          />
        ))}
      </div>
    );
  },
};

/** Without the legend or the helper — the group is only the rows. */
export const RowsOnly: TStory = {
  args: { showHelper: false, showLegend: false },
};

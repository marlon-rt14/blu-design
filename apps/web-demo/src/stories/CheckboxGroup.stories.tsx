import { readThemeToken, themeSources } from '@dsm/shared';
import type { TCheckboxGroupSize, TThemeMode } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { PlatformCheckboxGroup } from './PlatformCheckboxGroup';
import type { IPlatformCheckboxGroupProps, TPlatform } from './PlatformCheckboxGroup';

const SIZES: TCheckboxGroupSize[] = ['sm', 'md'];
const CANALES = ['Email', 'Push', 'SMS'] as const;
const INITIAL_CHECKED: string[] = [CANALES[0]];

const toggleIn = (current: string[], option: string): string[] =>
  current.includes(option) ? current.filter((item) => item !== option) : [...current, option];

/** Figma draws the group on `canvas/surface/primary` (white in light), not on `background/page`. */
const Surface = ({ theme, children }: { theme: TThemeMode; children: ReactNode }): ReactNode => (
  <div
    style={{
      width: 375,
      backgroundColor: readThemeToken(themeSources[theme].color, 'color.color.canvas.surface.primary'),
    }}
  >
    {children}
  </div>
);

const meta = {
  title: 'Molecules/CheckboxGroup',
  component: PlatformCheckboxGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**The `<fieldset>` with its `<legend>`.** It asks the question, groups the rows and ' +
          'shows the helper or the error — it does not draw the rows, which arrive through a ' +
          'slot (`children`). The canonical row is `ChoiceItem` with `control="checkbox"`.\n\n' +
          'Reach for this and not a radio group when **several** options or none may be ' +
          'chosen: the difference is semantic, not visual. Leave the fieldset as a group — ' +
          'do not set `role="radiogroup"`.\n\n' +
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
    checked: { table: { disable: true } },
    onToggle: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    legend: 'Título del grupo',
    helperText: 'Texto de ayuda del grupo',
  },
  render: function Render(args, { globals }) {
    const [checked, setChecked] = useState<string[]>(INITIAL_CHECKED);
    return (
      <Surface theme={globals.theme as TThemeMode}>
        <PlatformCheckboxGroup
          {...args}
          checked={checked}
          onToggle={(option) => setChecked((current) => toggleIn(current, option))}
          options={CANALES}
          platform={globals.platform as TPlatform}
        />
      </Surface>
    );
  },
} satisfies Meta<IPlatformCheckboxGroupProps>;

export default meta;
type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. Toggle rows independently. */
export const Playground: TStory = {};

/** The invalid state. Only the helper turns red — the rows are untouched. */
export const Invalid: TStory = {
  args: { isInvalid: true, helperText: 'Elegí al menos una opción para continuar' },
};

/** Both sizes. The legend indent follows the row: 8 at `sm`, 12 at `md`. */
export const Sizes: TStory = {
  render: function Render(args, { globals }) {
    const [checked, setChecked] = useState<string[]>(INITIAL_CHECKED);
    return (
      <Surface theme={globals.theme as TThemeMode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {SIZES.map((size) => (
            <PlatformCheckboxGroup
              {...args}
              checked={checked}
              key={size}
              legend={`Título del grupo · ${size}`}
              onToggle={(option) => setChecked((current) => toggleIn(current, option))}
              options={CANALES}
              platform={globals.platform as TPlatform}
              size={size}
            />
          ))}
        </div>
      </Surface>
    );
  },
};

/** Without the legend or the helper — the group is only the rows. */
export const RowsOnly: TStory = {
  args: { showHelper: false, showLegend: false },
};

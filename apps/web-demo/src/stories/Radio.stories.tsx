import type { TRadioSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';

import { PlatformRadio } from './PlatformRadio';
import type { IPlatformRadioProps, TPlatform } from './PlatformRadio';

const SIZES: TRadioSize[] = ['sm', 'md'];

const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 12, opacity: 0.6 }}>{title}</span>
    {children}
  </div>
);

const meta = {
  title: 'Atoms/Radio',
  component: PlatformRadio,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**One exclusive choice inside a group.** bDS is explicit that it never stands ' +
          'alone — if there is only one option, that is a Checkbox — and that a group cannot ' +
          'be cleared once chosen: if the user must be able to return to "none", the group is ' +
          'missing an explicit option for it.\n\n' +
          'Selection and focus share the same blue on purpose: *"lo que distingue seleccionado ' +
          'de enfocado es la forma, no el color"*. The dot says selected, the ring says focused.\n\n' +
          'The **whole row** is the touch target, sized to `size/target/min` at `md`. On web ' +
          'the component renders a real `<input type="radio">`, so radios sharing a `name` get ' +
          'arrow-key navigation and a roving tab order from the browser.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    showLabel: {
      control: 'boolean',
      description:
        'Whether the text renders. **Unlike the Button’s icon slots this survives into ' +
        'code**: the label is still needed when hidden, because it becomes the accessible name.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    isChecked: {
      control: 'boolean',
      description:
        'Controlled. The Radio never flips it on its own — coordinating a group belongs to ' +
        'whatever owns it.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Box 16/24, dot 8/12 — always exactly half — row 32/48 tall.',
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    isDisabled: {
      control: 'boolean',
      description:
        'Blocks interaction. **A disabled selected radio shows no dot**: `dot/bg-disabled` ' +
        'resolves to the same value as `box/bg-disabled`. Faithful to Figma, reported as a defect.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    testID: { control: 'text', table: { category: 'Other' } },
    name: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: { label: 'Etiqueta de la opción', onAction: fn() },
  render: (args, { globals }) => (
    <PlatformRadio {...args} platform={globals.platform as TPlatform} />
  ),
} satisfies Meta<IPlatformRadioProps>;

export default meta;
type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {
  args: {
    isChecked: true
  }
};

/** The two sizes, selected and not. The dot is always half the box. */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      {SIZES.map((size) => (
        <Group key={size} title={`${size} · box ${size === 'sm' ? 16 : 24} · dot ${size === 'sm' ? 8 : 12}`}>
          <div style={{ display: 'flex', gap: 24 }}>
            <PlatformRadio {...args} platform={globals.platform as TPlatform} size={size} />
            <PlatformRadio {...args} isChecked platform={globals.platform as TPlatform} size={size} />
          </div>
        </Group>
      ))}
    </div>
  ),
};

/**
 * The states that are props. Hover, press and focus come from real interaction —
 * hover composites `box/overlay-hover` over the resting colours rather than
 * swapping a token, and focus draws an outline the Figma component does not
 * (there the ring is clipped away by the circle, so `focus` looks like `default`).
 */
export const States: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <Group title="unselected">
          <PlatformRadio {...args} platform={platform} testID="radio-unselected" />
        </Group>
        <Group title="selected">
          <PlatformRadio {...args} isChecked platform={platform} testID="radio-selected" />
        </Group>
        <Group title="disabled">
          <PlatformRadio {...args} isDisabled platform={platform} testID="radio-disabled" />
        </Group>
        <Group title="disabled + selected — the dot disappears, faithful to Figma">
          <PlatformRadio {...args} isDisabled isChecked platform={platform} testID="radio-disabled-selected" />
        </Group>
        <Group title="hover / pressed / focus — interact to see them">
          <PlatformRadio {...args} platform={platform} testID="radio-interactive" />
        </Group>
      </div>
    );
  },
};

/** With the text hidden the label still names the control for assistive tech. */
export const WithoutLabel: TStory = {
  args: { showLabel: false },
};

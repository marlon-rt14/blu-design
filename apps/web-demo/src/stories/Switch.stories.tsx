import type { TSwitchSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { PlatformSwitch } from './PlatformSwitch';
import type { IPlatformSwitchProps, TPlatform } from './PlatformSwitch';

const SIZES: TSwitchSize[] = ['sm', 'md'];

const Row = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>{children}</div>
);

/**
 * Controlled wrapper so toggling in the canvas sticks. `isChecked` is owned
 * here, not by Storybook's args — same pattern as TextField's value.
 */
const ControlledPlatformSwitch = (props: IPlatformSwitchProps): ReactElement => {
  const [isChecked, setIsChecked] = useState(props.isChecked ?? false);
  return <PlatformSwitch {...props} isChecked={isChecked} onValueChange={setIsChecked} />;
};

const meta = {
  title: 'Atoms/Switch',
  component: PlatformSwitch,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Binary on/off control with **no label of its own**. Apple HIG iOS (and Figma: ' +
          '"Switch suelto no existe como pieza de pantalla") put the accessible name on the ' +
          'list row — use **SwitchItem** for that. Outside a list, HIG wants a toggle button, ' +
          'not a labelled switch. Do not use RN `Switch` / `UISwitch` (Apple green, 51×31); ' +
          'this is a custom track+thumb from `color.component.switch.*`. On-fill is ' +
          '`track.bg-on`, not system green. Immediate: fires on press, no pending state.',
      },
    },
  },
  argTypes: {
    isChecked: {
      control: 'boolean',
      description: 'Whether the switch is on. Controlled.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Track + thumb size. sm 40×24 (thumb 16); md 56×32 (thumb 24).',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and paints the disabled tokens.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    showStateLabel: {
      control: 'boolean',
      description:
        'Overline ON/OFF word inside the track. Visual only — not the accessible name. Default off, matching iOS.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    onLabel: {
      control: 'text',
      description: 'Word shown when `showStateLabel` and `isChecked` are on.',
      table: { category: 'Content', defaultValue: { summary: 'ON' } },
    },
    offLabel: {
      control: 'text',
      description: 'Word shown when `showStateLabel` is on and `isChecked` is off.',
      table: { category: 'Content', defaultValue: { summary: 'OFF' } },
    },
    testID: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    isChecked: false,
    size: 'md',
  },
  render: (args, { globals }) => (
    <ControlledPlatformSwitch {...args} platform={globals['platform'] as TPlatform} />
  ),
} satisfies Meta<IPlatformSwitchProps>;

export default meta;

type TStory = StoryObj<IPlatformSwitchProps>;

export const Playground: TStory = {};

/** Off and on, both sizes. */
export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        {SIZES.map((size) => (
          <ControlledPlatformSwitch key={`${size}-off`} platform={platform} size={size} />
        ))}
        {SIZES.map((size) => (
          <ControlledPlatformSwitch isChecked key={`${size}-on`} platform={platform} size={size} />
        ))}
      </Row>
    );
  },
};

/** Optional overline ON/OFF word inside the track — visual only, default off. */
export const WithStateLabel: TStory = {
  args: { showStateLabel: true, isChecked: true },
};

export const Disabled: TStory = {
  args: { isDisabled: true, isChecked: true },
};

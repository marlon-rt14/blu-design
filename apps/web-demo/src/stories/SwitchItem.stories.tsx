import type { TSwitchItemSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { PlatformSwitchItem } from './PlatformSwitchItem';
import type { IPlatformSwitchItemProps, TPlatform } from './PlatformSwitchItem';

const SIZES: TSwitchItemSize[] = ['sm', 'md'];

const List = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', width: 360 }}>{children}</div>
);

/**
 * Controlled wrapper so toggling in the canvas sticks.
 */
const ControlledPlatformSwitchItem = (props: IPlatformSwitchItemProps): ReactElement => {
  const [isChecked, setIsChecked] = useState(props.isChecked ?? false);
  return <PlatformSwitchItem {...props} isChecked={isChecked} onValueChange={setIsChecked} />;
};

const meta = {
  title: 'Molecules/SwitchItem',
  component: PlatformSwitchItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The iOS-canonical Switch usage: a list row whose content is the label. Apple HIG: ' +
          'use switch style only in a list row; the entire row is the control; focus lands on ' +
          'the row, not the thumb. Immediate toggle, no confirm. Embeds the Switch atom — does ' +
          'not duplicate track styles. `showDivider` defaults true.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Accessible name of the row, rendered as the leading label.',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Supporting text under `label`, gated by `showDescription`.',
      table: { category: 'Content' },
    },
    showDescription: {
      control: 'boolean',
      description: 'Whether `description` renders under the label.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    showDivider: {
      control: 'boolean',
      description: 'Whether a bottom divider paints. Default on.',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    isChecked: {
      control: 'boolean',
      description: 'Whether the embedded Switch is on. Controlled.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Row height and embedded Switch size. sm 48 / md 56.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables the row and the embedded Switch.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    showStateLabel: {
      control: 'boolean',
      description: 'Passthrough to the embedded Switch — visual ON/OFF word, not the accessible name.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    onLabel: { table: { disable: true } },
    offLabel: { table: { disable: true } },
    testID: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Notifications',
    isChecked: true,
    size: 'md',
  },
  render: (args, { globals }) => (
    <div style={{ width: 360 }}>
      <ControlledPlatformSwitchItem {...args} platform={globals['platform'] as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformSwitchItemProps>;

export default meta;

type TStory = StoryObj<IPlatformSwitchItemProps>;

export const Playground: TStory = {};

/** A short iOS-style settings list — this is how Switch is meant to ship. */
export const InAList: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <List>
        <ControlledPlatformSwitchItem isChecked label="Wi-Fi" platform={platform} />
        <ControlledPlatformSwitchItem isChecked={false} label="Bluetooth" platform={platform} />
        <ControlledPlatformSwitchItem
          description="Play sounds for new messages"
          isChecked
          label="Notifications"
          platform={platform}
          showDescription
        />
        <ControlledPlatformSwitchItem isChecked={false} isDisabled label="Airplane Mode" platform={platform} />
      </List>
    );
  },
};

export const WithDescription: TStory = {
  args: {
    label: 'Notifications',
    description: 'Play sounds for new messages',
    showDescription: true,
    isChecked: true,
  },
};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <List>
        {SIZES.map((size) => (
          <ControlledPlatformSwitchItem isChecked key={size} label={size} platform={platform} size={size} />
        ))}
      </List>
    );
  },
};

export const Disabled: TStory = {
  args: { isDisabled: true, isChecked: true, label: 'Airplane Mode' },
};

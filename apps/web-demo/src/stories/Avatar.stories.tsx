import type { TAvatarSize, TAvatarTone } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';

import { PlatformAvatar } from './PlatformAvatar';
import type { IPlatformAvatarProps, TPlatform } from './PlatformAvatar';

const SIZES: TAvatarSize[] = ['xs', 'sm', 'md', 'lg'];
const TONES: TAvatarTone[] = ['brand', 'sky', 'teal', 'green', 'lime', 'amber', 'orange', 'pink', 'violet'];

const Row = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>{children}</div>
);

const meta = {
  title: 'Atoms/Avatar',
  component: PlatformAvatar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A person\'s (or entity\'s) identity: photo, initials, icon or logo. Never the only way to ' +
          'identify someone — always pair it with a name in text. `tone` should come from a hash of the ' +
          "contact's identifier, never chosen by hand — see the `tone` control here only for preview.",
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['initials', 'icon', 'image', 'logo'],
      table: { category: 'Content', defaultValue: { summary: 'initials' } },
    },
    initials: { control: 'text', table: { category: 'Content' } },
    icon: { control: 'select', options: ['user', 'store', 'image'], table: { category: 'Content' } },
    imageUrl: { control: 'text', table: { category: 'Content' } },
    accessibilityLabel: { control: 'text', table: { category: 'Content' } },
    tone: {
      control: 'inline-radio',
      options: TONES,
      table: { category: 'Appearance', defaultValue: { summary: 'brand' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    showRing: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    showIndicator: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    status: {
      control: 'inline-radio',
      options: ['online', 'away', 'busy', 'offline'],
      table: { category: 'State', defaultValue: { summary: 'online' } },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    type: 'initials',
    initials: 'JG',
    icon: 'user',
    tone: 'brand',
    size: 'md',
    showRing: false,
    showIndicator: false,
    status: 'online',
  },
  render: (args, { globals }) => <PlatformAvatar {...args} platform={globals['platform'] as TPlatform} />,
} satisfies Meta<IPlatformAvatarProps>;

export default meta;

type TStory = StoryObj<IPlatformAvatarProps>;

export const Playground: TStory = {};

export const Types: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        <PlatformAvatar initials="JG" platform={platform} type="initials" />
        <PlatformAvatar icon="user" platform={platform} type="icon" />
        <PlatformAvatar imageUrl="https://i.pravatar.cc/160" platform={platform} type="image" />
        <PlatformAvatar imageUrl="https://i.pravatar.cc/160" platform={platform} tone="brand" type="logo" />
      </Row>
    );
  },
};

export const Tones: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        {TONES.map((tone) => (
          <PlatformAvatar initials="JG" key={tone} platform={platform} tone={tone} />
        ))}
      </Row>
    );
  },
};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        {SIZES.map((size) => (
          <PlatformAvatar initials="JG" key={size} platform={platform} size={size} />
        ))}
      </Row>
    );
  },
};

export const WithRing: TStory = {
  args: { showRing: true },
};

export const WithIndicator: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        <PlatformAvatar initials="JG" platform={platform} showIndicator status="online" />
        <PlatformAvatar initials="JG" platform={platform} showIndicator status="away" />
        <PlatformAvatar initials="JG" platform={platform} showIndicator status="busy" />
        <PlatformAvatar initials="JG" platform={platform} showIndicator status="offline" />
      </Row>
    );
  },
};

export const Fallback: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        <PlatformAvatar initials="JG" platform={platform} type="image" />
        <PlatformAvatar platform={platform} type="image" />
      </Row>
    );
  },
};

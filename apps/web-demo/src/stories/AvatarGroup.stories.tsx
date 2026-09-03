import type { IAvatarGroupItem, TAvatarSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlatformAvatarGroup } from './PlatformAvatarGroup';
import type { IPlatformAvatarGroupProps, TPlatform } from './PlatformAvatarGroup';

const SIZES: TAvatarSize[] = ['xs', 'sm', 'md', 'lg'];

const TEAM: IAvatarGroupItem[] = [
  { initials: 'JG', tone: 'sky' },
  { initials: 'MP', tone: 'teal' },
  { initials: 'AL', tone: 'lime' },
  { initials: 'RS', tone: 'violet' },
  { initials: 'CV', tone: 'pink' },
];

const meta = {
  title: 'Molecules/AvatarGroup',
  component: PlatformAvatarGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Several people in one line, each cut out from the one behind it by its ring. Takes no slot — ' +
          'pass a plain data array in `avatars` so the group can guarantee every item is the same size, ' +
          'with its ring on. Past five people, set `showOverflow` and summarize the rest as a "+N" tile.',
      },
    },
  },
  argTypes: {
    avatars: { table: { disable: true } },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    showOverflow: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    overflowLabel: { control: 'text', table: { category: 'Content', defaultValue: { summary: '+3' } } },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    avatars: TEAM,
    size: 'md',
    showOverflow: false,
    overflowLabel: '+3',
  },
  render: (args, { globals }) => <PlatformAvatarGroup {...args} platform={globals['platform'] as TPlatform} />,
} satisfies Meta<IPlatformAvatarGroupProps>;

export default meta;

type TStory = StoryObj<IPlatformAvatarGroupProps>;

export const Playground: TStory = {};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SIZES.map((size) => (
          <PlatformAvatarGroup avatars={TEAM.slice(0, 4)} key={size} platform={platform} size={size} />
        ))}
      </div>
    );
  },
};

export const WithOverflow: TStory = {
  args: {
    avatars: TEAM,
    showOverflow: true,
    overflowLabel: '+4',
  },
};

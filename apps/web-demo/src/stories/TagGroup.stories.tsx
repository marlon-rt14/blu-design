import type { ITagGroupItem, TTagSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlatformTagGroup } from './PlatformTagGroup';
import type { IPlatformTagGroupProps, TPlatform } from './PlatformTagGroup';

const SIZES: TTagSize[] = ['sm', 'xs'];

const CITIES: ITagGroupItem[] = [
  { label: 'Quito' },
  { label: 'Manta' },
  { label: 'Cuenca' },
  { label: 'Ambato' },
  { label: 'Loja' },
];

const meta = {
  title: 'Molecules/TagGroup',
  component: PlatformTagGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A row of Tags with overflow — what AvatarGroup is to Avatar. Takes no slot: pass a plain data ' +
          'array in `tags` so the group can guarantee every item is the same size. Does not decide how many ' +
          'fit — that is the width of whatever contains it.',
      },
    },
  },
  argTypes: {
    tags: { table: { disable: true } },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    showOverflow: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    overflowLabel: { control: 'text', table: { category: 'Content', defaultValue: { summary: '+3' } } },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    tags: CITIES,
    size: 'sm',
    showOverflow: false,
    overflowLabel: '+3',
  },
  render: (args, { globals }) => <PlatformTagGroup {...args} platform={globals['platform'] as TPlatform} />,
} satisfies Meta<IPlatformTagGroupProps>;

export default meta;

type TStory = StoryObj<IPlatformTagGroupProps>;

export const Playground: TStory = {};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SIZES.map((size) => (
          <PlatformTagGroup key={size} platform={platform} size={size} tags={CITIES.slice(0, 3)} />
        ))}
      </div>
    );
  },
};

export const WithOverflow: TStory = {
  args: {
    tags: CITIES,
    showOverflow: true,
    overflowLabel: '+2',
    overflowAccessibilityLabel: 'Ver 2 ciudades más',
  },
};

import type { TListItemSize } from '@dsm/shared';
import { IconChevronRight } from '@dsm/web/icons/arrows';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';

import { PlatformListItem } from './PlatformListItem';
import type { IPlatformListItemProps, TPlatform } from './PlatformListItem';

/** The three shapes of `leading`, as the bridge's two controls express them. */
const LEADINGS = [
  { key: 'none', label: 'Sin leading' },
  { key: 'icon', label: 'Con icono', icon: 'IconUser01' as const },
  { key: 'avatar', label: 'Con avatar', avatarInitials: 'JG' },
];
const SIZES: TListItemSize[] = ['sm', 'md'];

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', width: 320 }}>{children}</div>
);

const meta = {
  title: 'Molecules/ListItem',
  component: PlatformListItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The row of a list — a transaction, a contact, a product. Not every row navigates: pass `onAction` " +
          'to make it a real target with its own hover/pressed/focus painting; leave it out for a row that is ' +
          'plain content.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    icon: {
      control: 'select',
      options: [undefined, 'IconUser01', 'IconStore', 'IconImage01'],
      description:
        'The leading glyph, by export name. The real prop is ' +
        '`leading: { icon } | { avatar }` — a union, so a row cannot have both, ' +
        'and a control can only pass strings. Setting this wins over `avatarInitials`.',
      table: { category: 'Content' },
    },
    avatarInitials: {
      control: 'text',
      description: 'Takes the avatar branch of `leading`. Ignored while `icon` is set.',
      table: { category: 'Content' },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    description: {
      control: 'text',
      description: 'Its presence turns the slot on — there is no `showDescription`.',
      table: { category: 'Content' },
    },
    trailingText: {
      control: 'text',
      description: 'Its presence turns the slot on — there is no `showTrailingText`.',
      table: { category: 'Content' },
    },
    divider: {
      control: 'boolean',
      description: 'The one boolean the contract keeps: a row cannot know it is the last of its group.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    testID: { table: { disable: true } },
    trailing: { table: { disable: true } },
    onAction: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Título del elemento',
    size: 'md',
    divider: false,
    disabled: false,
  },
  render: (args, { globals }) => (
    <Column>
      <PlatformListItem {...args} platform={globals['platform'] as TPlatform} />
    </Column>
  ),
} satisfies Meta<IPlatformListItemProps>;

export default meta;

type TStory = StoryObj<IPlatformListItemProps>;

export const Playground: TStory = {};

export const LeadingContent: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {LEADINGS.map((leading) => (
          <PlatformListItem
            avatarInitials={leading.avatarInitials}
            icon={leading.icon}
            key={leading.key}
            label={leading.label}
            platform={platform}
          />
        ))}
      </Column>
    );
  },
};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {SIZES.map((size) => (
          <PlatformListItem avatarInitials="JG" key={size} label="Título del elemento" platform={platform} size={size} />
        ))}
      </Column>
    );
  },
};

export const WithDescriptionAndTrailingText: TStory = {
  args: {
    avatarInitials: 'JG',
    description: 'Descripción secundaria',
    trailingText: '$1.250,00',
  },
};

export const WithTrailingIcon: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        <PlatformListItem
          icon="IconUser01"
          label="Ver todos los contactos"
          onAction={() => undefined}
          platform={platform}
          trailing={<IconChevronRight color="secondary" size="sm" />}
        />
      </Column>
    );
  },
};

export const WithDivider: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        <PlatformListItem avatarInitials="JG" divider label="Envío a Juan García" platform={platform} />
        <PlatformListItem avatarInitials="MP" label="Pago de servicios" platform={platform} />
      </Column>
    );
  },
};

export const Interactive: TStory = {
  args: { avatarInitials: 'JG' },
  render: (args, { globals }) => (
    <Column>
      <PlatformListItem {...args} onAction={() => undefined} platform={globals['platform'] as TPlatform} />
    </Column>
  ),
};

export const Disabled: TStory = {
  args: { avatarInitials: 'JG', disabled: true },
  render: (args, { globals }) => (
    <Column>
      <PlatformListItem {...args} onAction={() => undefined} platform={globals['platform'] as TPlatform} />
    </Column>
  ),
};

import type { TCardElevation, TCardPadding } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { PlatformCard } from './PlatformCard';
import type { IPlatformCardProps, TPlatform } from './PlatformCard';

const ELEVATIONS: TCardElevation[] = ['flat', 'raised'];
const PADDINGS: TCardPadding[] = ['none', 'md'];

/**
 * Filler for the slot, per platform.
 *
 * The Card's children are the one thing the bridge cannot normalize: the web
 * implementation renders DOM and the native one renders `react-native` views, so
 * a single `<div>` would not survive the platform switch.
 */
const Filler = ({ platform, label }: { platform: TPlatform; label: string }): ReactElement =>
  platform === 'native' ? (
    <View style={{ backgroundColor: '#e5e8f1', height: 72, justifyContent: 'center', paddingLeft: 12 }}>
      <Text style={{ color: '#232b3d', fontSize: 13 }}>{label}</Text>
    </View>
  ) : (
    <div
      style={{
        alignItems: 'center',
        background: '#e5e8f1',
        color: '#232b3d',
        display: 'flex',
        fontSize: 13,
        height: 72,
        paddingLeft: 12,
      }}
    >
      {label}
    </div>
  );

/** A card in a sized container, stacked under its caption. */
const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

/**
 * The props table describes the shared contract from `@dsm/shared`, which both
 * implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package.
 */
const meta = {
  title: 'Atoms/Card',
  component: PlatformCard,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A surface that holds content. It sets the background, the radius and the clipping, and ' +
          '*"lo que va adentro lo decide quien la usa"* — the slot is free, with no preferred ' +
          'contents, no minimum and no promise about what enters.\n\n' +
          '**It is the same surface as ListGroup.** Both read `component/card/surface/bg`, a token ' +
          'renamed from `component/listgroup/surface/bg` on 2026-09-01 keeping its ID, so there is ' +
          'one source of truth for the colour. What separates them is the slot contract: a ' +
          'ListGroup restricts its rows to `ListItem` and `ChoiceItem`, demands at least one, and ' +
          'resolves the dividers. **If what goes inside is list rows, the component is a ' +
          'ListGroup.**\n\n' +
          '**It is not interactive and carries no role.** If the whole card is a destination, the ' +
          'role and the focus come from a link or a button wrapping it, never from the surface.\n\n' +
          'Note what `raised` actually does in the two themes we ship. Figma binds a border *and* ' +
          'a shadow, because in the contrast modes the border is what separates the card from the ' +
          'background — a shadow alone does not survive them. But ' +
          '`color/elevation/raised/border` resolves to `#00000000` in both `light` and `dark`, so ' +
          'today the border is an invisible 1px that only occupies space: a raised card is 2px ' +
          'bigger than a flat one with the same content. It starts showing by itself the day a ' +
          'contrast theme ships. In `dark` the far shadow collapses too, so a dark raised card ' +
          'separates on the near shadow alone.',
      },
    },
  },
  argTypes: {
    children: { table: { disable: true } },
    elevation: {
      control: 'inline-radio',
      options: ELEVATIONS,
      description:
        'How the card separates from the background. `raised` adds the `elevation/raised` ramp — ' +
        'a border **and** two shadow layers.',
      table: { category: 'Appearance', defaultValue: { summary: 'flat' } },
    },
    padding: {
      control: 'inline-radio',
      options: PADDINGS,
      description:
        'Inner padding on all four sides. `md` is `space/inset/md` (12). The axis exists because ' +
        'the lateral padding is the card’s decision, unlike ListGroup, where the margin belongs ' +
        'to the screen and the rows reach the edges.',
      table: { category: 'Appearance', defaultValue: { summary: 'none' } },
    },
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
      table: { category: 'Other' },
    },
    platform: { table: { disable: true } },
  },
  args: { testID: 'card' },
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ width: 280 }}>
        <PlatformCard {...args} platform={platform}>
          <Filler label="Anything at all" platform={platform} />
        </PlatformCard>
      </div>
    );
  },
} satisfies Meta<IPlatformCardProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/**
 * The full matrix: two elevations by two paddings.
 *
 * With `padding="none"` the filler reaches the card's edges and the radius clips
 * its corners — the filler has no radius of its own. That clipping is the Card's
 * job, and bDS's warning goes with it: if the content already clips, do not
 * stack two radii.
 */
export const Matrix: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {ELEVATIONS.flatMap((elevation) =>
          PADDINGS.map((padding) => (
            <Group key={`${elevation}-${padding}`} title={`${elevation} · padding ${padding}`}>
              <PlatformCard
                {...args}
                elevation={elevation}
                padding={padding}
                platform={platform}
                testID={`card-${elevation}-${padding}`}
              >
                <Filler label={`${elevation} / ${padding}`} platform={platform} />
              </PlatformCard>
            </Group>
          )),
        )}
      </div>
    );
  },
};

/**
 * What `raised` buys, side by side against `flat`.
 *
 * Switch the theme in the toolbar to see the ramp change: in `light` both shadow
 * layers are drawn, and in `dark` the far one collapses to nothing, leaving the
 * near one alone.
 */
export const Elevation: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', gap: 24 }}>
        {ELEVATIONS.map((elevation) => (
          <Group key={elevation} title={elevation}>
            <PlatformCard {...args} elevation={elevation} padding="md" platform={platform}>
              <Filler label={elevation} platform={platform} />
            </PlatformCard>
          </Group>
        ))}
      </div>
    );
  },
};

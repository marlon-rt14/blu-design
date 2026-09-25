import type { TBadgeStatus, TBadgeType } from '@dsm/shared';
import { IconUser } from '@dsm/web/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactElement } from 'react';

import { PlatformBadge } from './PlatformBadge';
import type { IPlatformBadgeProps, TPlatform } from './PlatformBadge';

const TYPES: TBadgeType[] = ['count', 'dot'];
const STATUSES: TBadgeStatus[] = ['danger', 'warning', 'success', 'info', 'brand', 'neutral'];

const anchorWrapStyle: CSSProperties = { position: 'relative', display: 'inline-flex' };
const anchorBadgeStyle: CSSProperties = { position: 'absolute', top: -4, right: -4 };

/** Badge doesn't position itself — this is the caller's own corner-anchor pattern. */
const AnchoredDemo = (props: IPlatformBadgeProps): ReactElement => (
  <span style={anchorWrapStyle}>
    <IconUser size="lg" />
    <span style={anchorBadgeStyle}>
      <PlatformBadge {...props} />
    </span>
  </span>
);

const meta = {
  title: 'Atoms/Badge',
  component: PlatformBadge,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The counter or the notice dot. Says how many new things there are, or just that ' +
          "there's something, without taking up room. No nested instances, no interaction " +
          "states — it's a pill with a number, or a point.\n\n" +
          '**`type="dot"` carries no number** — it says something is new, not how much. If the ' +
          "count wouldn't help the person decide anything, it's `dot`.\n\n" +
          '**`count=0` (or omitted) renders nothing** — a zero badge is worse than no badge, a ' +
          'closed decision in the dev contract.\n\n' +
          '**The "9+" cut is derived, not typed by hand** — `count` past `max` (default `9`) ' +
          'always formats as `"{max}+"`, so code and Figma can\'t silently drift apart.\n\n' +
          "**`status` needs a saturated fill, never `subtle`** — subtle measures ~1:1 against the " +
          "page and the pill disappears. The number's colour follows the tone " +
          '(`component/badge/count/text-*`), not a blanket inverse.\n\n' +
          "**Colour never informs alone.** `label` is what turns a bare \"3\" into \"3 mensajes " +
          'sin leer" for someone who can\'t see where the badge sits or distinguish red from ' +
          "green — not in Figma's own panel, but not optional in practice either.\n\n" +
          "**It doesn't position itself.** Anchoring it to a corner is the caller's job — see the " +
          '`Anchored` story.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: TYPES,
      description: '`count` shows a number; `dot` shows only a point.',
      table: { category: 'Appearance', defaultValue: { summary: 'count' } },
    },
    status: {
      control: 'select',
      options: STATUSES,
      description: 'Severity. `neutral` is for a badge that only counts — the other five tint.',
      table: { category: 'Appearance', defaultValue: { summary: 'neutral' } },
    },
    count: {
      control: { type: 'number', min: 0 },
      description: 'Ignored with `type="dot"`. `0` (or omitted) renders nothing.',
      table: { category: 'Content' },
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Ceiling before the count truncates to `"{max}+"`.',
      table: { category: 'Content', defaultValue: { summary: '9' } },
    },
    label: {
      control: 'text',
      description: 'What the number(s) are, for a screen reader. Not optional in practice.',
      table: { category: 'Content' },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    count: 3,
    label: 'mensajes sin leer',
    status: 'danger',
    testID: 'badge',
  },
  render: (args, { globals }) => (
    <div style={{ padding: 24 }}>
      <PlatformBadge {...args} platform={globals.platform as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformBadgeProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** The full matrix — six statuses, both types, matching the design file's own layout. */
export const Statuses: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', gap: 32, padding: 24 }}>
        {TYPES.map((type) => (
          <div key={type} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, opacity: 0.65 }}>{type}</span>
            {STATUSES.map((status) => (
              <PlatformBadge
                key={status}
                {...args}
                platform={platform}
                status={status}
                type={type}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/** `count` past `max` always cuts to `"{max}+"` — never a longer number, never hand-written. */
export const Truncation: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24 }}>
        {[1, 9, 10, 99, 250].map((count) => (
          <PlatformBadge key={count} {...args} count={count} platform={platform} />
        ))}
      </div>
    );
  },
};

/** `count=0` renders nothing — not a `"0"` pill. Compare to `count={1}` beside it. */
export const ZeroCount: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24 }}>
        <PlatformBadge {...args} count={0} platform={platform} />
        <span style={{ fontSize: 12, opacity: 0.65 }}>← renders nothing</span>
        <PlatformBadge {...args} count={1} platform={platform} />
      </div>
    );
  },
};

/** `dot` carries no number — only that something is new. */
export const Dot: TStory = {
  args: {
    label: 'hay actividad nueva',
    type: 'dot',
  },
};

/** Badge doesn't position itself — this is the caller's own absolute-corner pattern. */
export const Anchored: TStory = {
  render: (args, { globals }) => <AnchoredDemo {...args} platform={globals.platform as TPlatform} />,
};

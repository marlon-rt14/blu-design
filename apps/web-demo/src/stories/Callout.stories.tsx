import type { TCalloutPalette } from '@dsm/shared';
import { IconCreditCard } from '@dsm/web/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { PlatformCallout } from './PlatformCallout';
import type { IPlatformCalloutProps, TPlatform } from './PlatformCallout';

const PALETTES: TCalloutPalette[] = ['brand', 'neutral'];

const meta = {
  title: 'Atoms/Callout',
  component: PlatformCallout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A proactive, optional message about information, a feature, or an opportunity in the ' +
          'context of the current task. **It never says something happened** — that is `Alert`, ' +
          'which also carries severity and always renders above a Callout sharing the same space. ' +
          'A message that floats over a specific control is `Coachmark`, not this.\n\n' +
          '**Every optional slot is presence-based** — there is no `showTitle`, `showIcon`, ' +
          '`showAction` or `showDismiss`. The dev contract is explicit about this one, unlike ' +
          '`Alert`, which keeps a `show*` API despite its own contract asking for presence.\n\n' +
          '**`palette` only changes the fill.** Title and body read `text/primary` in both — ' +
          "the tenuous `subtle` fill (not `info/muted`, which is Alert's) is what carries the " +
          'weight. The icon genuinely differs by palette though: `brand` tints it, `neutral` ' +
          'leaves it `icon/primary`.\n\n' +
          '**No live region.** This is page content, not a notification — never announced just ' +
          'because it appeared, unlike Alert.',
      },
    },
  },
  argTypes: {
    body: {
      control: 'text',
      description: 'Up to 120 characters, with a full stop. Required.',
      table: { category: 'Content' },
    },
    title: {
      control: 'text',
      description: 'Up to 55 characters, sentence case, no full stop. Its presence draws it — no `showTitle`.',
      table: { category: 'Content' },
    },
    icon: { table: { disable: true } },
    action: { table: { disable: true } },
    palette: {
      control: 'inline-radio',
      options: PALETTES,
      description: 'Fill only — title, body and (mostly) icon stay the same either way.',
      table: { category: 'Appearance', defaultValue: { summary: 'brand' } },
    },
    onDismiss: {
      description: 'Its presence draws the × (veil, xs) — no separate `showDismiss`.',
      table: { category: 'Other' },
    },
    dismissAccessibilityLabel: {
      control: 'text',
      description: 'Accessible name of the dismiss control.',
      table: { category: 'Other', defaultValue: { summary: 'Cerrar' } },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    body: 'Recibe el 2% de tus compras en supermercados, directo en tu estado de cuenta.',
    icon: <IconCreditCard />,
    title: 'Tu tarjeta ahora tiene cashback',
    testID: 'callout',
  },
  render: (args, { globals }) => (
    <div style={{ maxWidth: 500, padding: 24 }}>
      <PlatformCallout {...args} platform={globals.platform as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformCalloutProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** `palette` only changes the fill — brand for a benefit worth not missing, neutral for a busier screen. */
export const Palettes: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500, padding: 24 }}>
        {PALETTES.map((palette) => (
          <PlatformCallout key={palette} {...args} palette={palette} platform={platform} />
        ))}
      </div>
    );
  },
};

/** `action`'s presence draws the LinkButton — `on-muted`, `sm`, always underlined (unlike Alert's, which isn't). */
export const WithAction: TStory = {
  args: {
    action: { label: 'Activar cashback', onPress: fn() },
  },
};

/** `onDismiss`'s presence draws the ×, a real `veil`/`xs` IconButton — not hand-painted like Alert's. */
export const WithDismiss: TStory = {
  args: {
    onDismiss: fn(),
  },
};

/** `title` and `icon` are both optional — a Callout can be body-only. */
export const BodyOnly: TStory = {
  args: {
    icon: undefined,
    title: undefined,
  },
};

/** Title in `strong`, body in `default` — never bold the body, or the hierarchy the weight carries disappears. */
export const Full: TStory = {
  args: {
    action: { label: 'Activar cashback', onPress: fn() },
    onDismiss: fn(),
  },
};

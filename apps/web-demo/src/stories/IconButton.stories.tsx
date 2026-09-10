import { readThemeToken, themeSources } from '@dsm/shared';
import type { TIconButtonAppearance, TIconButtonSize } from '@dsm/shared';
import { useThemeMode } from '@dsm/web';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { fn } from 'storybook/test';

import { ICON_NAMES } from './iconNames';
import { PlatformIconButton } from './PlatformIconButton';
import type { IPlatformIconButtonProps, TPlatform } from './PlatformIconButton';

const APPEARANCES: TIconButtonAppearance[] = [
  'brand',
  'neutral',
  'ghost',
  'veil',
  'on-scene',
  'on-media',
  'on-inverse',
];
const SIZES: TIconButtonSize[] = ['xs', 'sm', 'md', 'lg'];
const CONTROL_EDGE: Record<TIconButtonSize, number> = { xs: 24, sm: 32, md: 44, lg: 56 };
const GLYPH_EDGE: Record<TIconButtonSize, number> = { xs: 16, sm: 16, md: 24, lg: 32 };

/**
 * The surface an appearance needs behind it, or `undefined` when it needs none.
 *
 * Three of the seven describe what is *underneath* rather than a shape, so on
 * the wrong background they are invisible or a lie. Two of those three are
 * fixed and one is not, which is why this has to be a hook:
 *
 * - `on-scene` is a constant, because bDS says the brand scene is dark in all
 *   six modes — that is also why its glyph is fixed white.
 * - `on-media` stands in for a photo, which does not follow the theme either.
 * - `on-inverse` **does** flip with the mode, so it is read from
 *   `color/canvas/surface/inverse`: `#232b3d` in light, `#e6e8ec` in dark. A
 *   hardcoded navy looked right in light and left the glyph nearly invisible in
 *   dark — caught in the simulator, not in the browser.
 */
const useBackdrop = (appearance: TIconButtonAppearance): string | undefined => {
  const mode = useThemeMode();
  if (appearance === 'on-scene') return '#364481';
  if (appearance === 'on-media') return '#6b7280';
  if (appearance === 'on-inverse') {
    return readThemeToken(themeSources[mode].color, 'color.color.canvas.surface.inverse');
  }
  return undefined;
};

/**
 * One appearance's row: its caption, the backdrop it needs, and a resting plus a
 * disabled button.
 *
 * A component rather than a helper inside `render`, because it reads the theme
 * through a hook.
 */
const Row = ({
  appearance,
  args,
  platform,
  title,
}: {
  appearance: TIconButtonAppearance;
  args: IPlatformIconButtonProps;
  platform: TPlatform;
  title?: string;
}): ReactElement => {
  const backdrop = useBackdrop(appearance);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, opacity: 0.65 }}>{title ?? appearance}</span>
      <div
        style={{
          alignItems: 'center',
          background: backdrop,
          borderRadius: backdrop ? 8 : undefined,
          display: 'flex',
          gap: 16,
          padding: backdrop ? 12 : undefined,
          width: 'fit-content',
        }}
      >
        <PlatformIconButton {...args} appearance={appearance} platform={platform} />
        <PlatformIconButton {...args} appearance={appearance} disabled platform={platform} />
      </div>
    </div>
  );
};

/** One size's row, across two appearances so the glyph ramp is visible. */
const SizeRow = ({
  args,
  platform,
  size,
}: {
  args: IPlatformIconButtonProps;
  platform: TPlatform;
  size: TIconButtonSize;
}): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>
      {size} · control {CONTROL_EDGE[size]} · glyph {GLYPH_EDGE[size]}
    </span>
    <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
      <PlatformIconButton {...args} platform={platform} size={size} />
      <PlatformIconButton {...args} appearance="veil" platform={platform} size={size} />
    </div>
  </div>
);

/**
 * The props table describes the shared contract from `@dsm/shared`, which both
 * implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package.
 */
const meta = {
  title: 'Atoms/IconButton',
  component: PlatformIconButton,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The same action as a Button, without the label. Use it only when the icon is ' +
          'unambiguous on its own, or when there is no room for text — *"si hay duda sobre qué ' +
          'hace, lleva etiqueta y entonces es Button"*.\n\n' +
          '**`label` is required, and it is the only name this control will ever have.** There ' +
          'is no visible text, so it becomes the `aria-label` on web and the ' +
          '`accessibilityLabel` on mobile. Say the action, not the drawing: `"Cerrar aviso"`, ' +
          'never `"equis"`.\n\n' +
          'The seven appearances split in two. `brand`, `neutral`, `ghost` and `veil` describe a ' +
          '*shape*; `on-scene`, `on-media` and `on-inverse` describe the *surface underneath*, ' +
          'and are not interchangeable — `on-scene` is fixed white because the brand scene is ' +
          'dark in all six modes, while `on-inverse` flips with the mode.\n\n' +
          '**`veil` buys silhouette, not contrast.** It is what `ghost` lacked: with no fill at ' +
          'rest, ghost fell outside the disabled-with-border pass. Its states deepen the veil ' +
          'itself rather than stacking an overlay on top, which would double it.\n\n' +
          'Two measured details worth knowing. `xs` and `sm` both take a 16px glyph — `xs` skips ' +
          'its own `size/icon/xs` (12), which inside a control is a smudge. And the focus ring ' +
          'goes *outside* everywhere except `on-media`, where it is painted **inside**, over the ' +
          'veil: outside it lands on the photo and measures 1.37 against light media.\n\n' +
          '**`neutral` has a known problem on a Card in dark**, where its fill and the card ' +
          'surface both resolve to `dark/neutral/800` and it disappears. Against the page ' +
          'background it is fine. Design tracks it as a Foundations fix.',
      },
    },
  },
  argTypes: {
    // --- Content ------------------------------------------------------------
    icon: {
      control: 'select',
      options: ICON_NAMES,
      description:
        'The glyph. **Required** — an IconButton with nothing in it is not anything. The real ' +
        'prop takes the component (`icon={IconTrash}`); this control passes a name because ' +
        'Storybook can only hand over a string.',
      table: { category: 'Content' },
    },
    label: {
      control: 'text',
      description:
        'The accessible name, and the only one this control has. Maps to `aria-label` on web ' +
        'and `accessibilityLabel` on mobile.',
      table: { category: 'Content' },
    },
    // --- Appearance ---------------------------------------------------------
    appearance: {
      control: 'select',
      options: APPEARANCES,
      description:
        'Where the button lives and how much body it has. The three `on-*` values need the ' +
        'matching surface behind them to read at all.',
      table: { category: 'Appearance', defaultValue: { summary: 'brand' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description:
        'Edge of the control: 24 · 32 · 44 · 56, always square. Figma’s panel reports `lg` only ' +
        'because its axis runs largest-first; the real default is `md`.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    // --- State --------------------------------------------------------------
    disabled: {
      control: 'boolean',
      description:
        'Blocks interaction. The only value of Figma’s `state` axis that is a public prop — ' +
        'hover, pressed and focus come from interaction, and hover only exists on web.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    // --- Other --------------------------------------------------------------
    onPress: {
      description: 'Named the same on both platforms, unlike the Button’s `onClick` / `onPress`.',
      table: { category: 'Other' },
    },
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
      table: { category: 'Other' },
    },
    platform: { table: { disable: true } },
  },
  args: {
    icon: 'IconTrash',
    label: 'Eliminar',
    // Required by the contract, so the meta has to supply one or every story
    // would need its own. `fn()` also logs it in the Actions panel.
    onPress: fn(),
    testID: 'icon-button',
  },
  render: (args, { globals }) => (
    <Row
      appearance={args.appearance ?? 'brand'}
      args={args}
      platform={globals.platform as TPlatform}
      title={`${args.appearance ?? 'brand'} — resting and disabled`}
    />
  ),
} satisfies Meta<IPlatformIconButtonProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/**
 * All seven, each on the surface it was drawn for, resting and disabled.
 *
 * `ghost` and `on-inverse` have no fill at rest — what shows through is the
 * backdrop, not a colour of their own. And note what disabled does differently:
 * `brand` and `neutral` gain a border to give back the silhouette their flat
 * fill takes away, while `veil`, `on-media` and `on-scene` keep their veil and
 * only quiet the glyph, because there the veil already *is* the silhouette.
 */
export const Appearances: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {APPEARANCES.map((appearance) => (
        <Row
          appearance={appearance}
          args={args}
          key={appearance}
          platform={globals.platform as TPlatform}
        />
      ))}
    </div>
  ),
};

/**
 * The four sizes, and the glyph ramp that does not follow them.
 *
 * On mobile the three smallest also ship a `hitSlop` that brings the touch
 * target up to 48 without moving the drawing; on web that area is the host's
 * job, which is what bDS means by *"el área la da el padding externo del
 * contenedor"*.
 */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {SIZES.map((size) => (
        <SizeRow args={args} key={size} platform={globals.platform as TPlatform} size={size} />
      ))}
    </div>
  ),
};

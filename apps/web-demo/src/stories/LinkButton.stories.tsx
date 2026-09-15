import { readThemeToken, themeSources } from '@dsm/shared';
import type { TLinkButtonAppearance, TLinkButtonSize, TThemeSourceKey } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';

import { PlatformLinkButton } from './PlatformLinkButton';
import type { IPlatformLinkButtonProps, TPlatform } from './PlatformLinkButton';
import { themeFromGlobals } from './themeGlobals';

const APPEARANCES: TLinkButtonAppearance[] = ['default', 'on-inverse', 'on-muted', 'on-scene'];
const SIZES: TLinkButtonSize[] = ['md', 'sm'];

/**
 * The surface each appearance is named for, read from the theme rather than
 * hardcoded so it follows the Theme dropdown.
 *
 * `default` renders on the page itself, so it needs no wrapper — hence
 * `undefined`. Note `on-inverse` goes *light* in the dark theme: "inverse" means
 * the opposite of the current surface, not "dark".
 */
const SURFACE_TOKEN: Record<TLinkButtonAppearance, string | undefined> = {
  default: undefined,
  'on-inverse': 'color.color.canvas.background.inverse',
  // bDS describes this one as "el relleno tenue de un Alert". There is no Alert
  // group in the token export yet, so the story uses the info fill an Alert
  // would draw from.
  'on-muted': 'color.color.fill.info.subtle',
  // "una foto o un fondo de marca saturado" — the saturated brand canvas.
  'on-scene': 'color.color.canvas.background.brand',
};

/** Puts its children on the surface the given appearance is meant to sit on. */
const Surface = ({
  appearance,
  themeKey,
  children,
}: {
  appearance: TLinkButtonAppearance;
  themeKey: TThemeSourceKey;
  children: ReactNode;
}): ReactNode => {
  const token = SURFACE_TOKEN[appearance];
  if (token === undefined) {
    return <>{children}</>;
  }
  return (
    <div
      style={{
        backgroundColor: readThemeToken(themeSources[themeKey].color, token),
        padding: 16,
        borderRadius: 12,
        display: 'inline-flex',
        gap: 16,
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
};

/** A labelled row, stacked under its caption. */
const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

/**
 * The props table below describes the shared contract from `@dsm/shared`, which
 * both implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package.
 */
const meta = {
  title: 'Atoms/LinkButton',
  component: PlatformLinkButton,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**An action wearing a link’s face.** It does not change the URL: it acts on the ' +
          'page it is on — opens, expands, undoes. If the destination is another page or an ' +
          'external site, this is the wrong component. Because it is an action it renders a ' +
          '`<button>`, not an `<a>`, which is also why `isVisited` has to be a prop: the ' +
          'browser’s `:visited` never applies. `appearance` picks the *surface* the link sits ' +
          'on — there is no weight ladder, because a link has no surface of its own. Unlike ' +
          'every other Core component, hover and press change the **text colour** rather than ' +
          'laying an overlay over a fill.',
      },
    },
  },
  argTypes: {
    // --- Content ------------------------------------------------------------
    label: {
      control: 'text',
      description: 'Text rendered inside the link. Required — there is no icon-only mode.',
      table: { category: 'Content' },
    },
    // --- Appearance ---------------------------------------------------------
    appearance: {
      control: 'inline-radio',
      options: APPEARANCES,
      description:
        'Which surface the link sits on. Each one carries its own colours, including the focus ' +
        'ring — white on `on-inverse` and `on-scene`, where blue does not read.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description:
        'Body size, from the link type scale: `md` 16px (24 tall), `sm` 14px (21 tall). The ' +
        'height is the line box — the link hugs its text.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    underline: {
      control: 'boolean',
      description:
        'Whether the label is underlined. **The default differs by platform**: `true` on web (the ' +
        'web link), `false` on mobile (the app link, since iOS and Android do not underline). ' +
        'Never turn it off for a link inside a paragraph — colour alone is not enough (WCAG 1.4.1).',
      table: { category: 'Appearance' },
    },
    // --- State --------------------------------------------------------------
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and applies the disabled styling.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    isVisited: {
      control: 'boolean',
      description:
        'Renders the visited colour. **Web only** — bDS does not implement `visited` in apps, ' +
        'and the app has to drive it because `:visited` does not apply to a `<button>`.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    // --- Other --------------------------------------------------------------
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
      table: { category: 'Other' },
    },
    onAction: {
      description: 'Mapped to `onClick` on web and to `onPress` on mobile.',
      table: { category: 'Other' },
    },
    // Driven by the toolbar, not by the controls panel.
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Ver más',
    onAction: fn(),
  },
  render: (args, { globals }) => (
    <PlatformLinkButton {...args} platform={globals.platform as TPlatform} />
  ),
} satisfies Meta<IPlatformLinkButtonProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** The four appearances, each on the surface it is named for. */
export const Appearances: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    const { key: themeKey } = themeFromGlobals(globals);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {APPEARANCES.map((appearance) => (
          <Group key={appearance} title={appearance}>
            <Surface appearance={appearance} themeKey={themeKey}>
              <PlatformLinkButton
                {...args}
                appearance={appearance}
                label={args.label}
                platform={platform}
              />
              <PlatformLinkButton
                {...args}
                appearance={appearance}
                isDisabled
                label="disabled"
                platform={platform}
              />
            </Surface>
          </Group>
        ))}
      </div>
    );
  },
};

/** The two sizes. The height is derived from the type, so `md` is 24 tall and `sm` 21. */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <PlatformLinkButton
          {...args}
          key={size}
          label={`Ver más (${size})`}
          platform={globals.platform as TPlatform}
          size={size}
        />
      ))}
    </div>
  ),
};

/**
 * The platform default versus both explicit values.
 *
 * Flip the **Platform** dropdown to see the first one change: web underlines by
 * default, mobile does not.
 */
export const Underline: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <Group title="platform default (web: on · mobile: off)">
          <PlatformLinkButton {...args} label="Ver más" platform={platform} />
        </Group>
        <Group title="underline={true} — required inside a paragraph">
          <PlatformLinkButton {...args} label="Ver más" platform={platform} underline />
        </Group>
        <Group title="underline={false} — standalone app link">
          <PlatformLinkButton {...args} label="Ver más" platform={platform} underline={false} />
        </Group>
      </div>
    );
  },
};

/**
 * `disabled` and `visited` are the two states that are props; hover, press and
 * focus come from real interaction. `visited` renders nothing different on
 * mobile — bDS does not implement it there.
 */
export const States: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <Group title="default">
          <PlatformLinkButton {...args} label="Ver más" platform={platform} />
        </Group>
        <Group title="visited (web only)">
          <PlatformLinkButton {...args} isVisited label="Ver más" platform={platform} />
        </Group>
        <Group title="disabled">
          <PlatformLinkButton {...args} isDisabled label="Ver más" platform={platform} />
        </Group>
        <Group title="hover / pressed / focus — interact to see them">
          <PlatformLinkButton
            {...args}
            label="Pásame el cursor o tabula hasta aquí"
            platform={platform}
            testID="linkbutton-interactive"
          />
        </Group>
      </div>
    );
  },
};

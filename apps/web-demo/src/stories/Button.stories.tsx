import { readThemeToken, themeSources } from '@dsm/shared';
import type { TButtonAppearance, TButtonSize, TButtonVariant, TThemeSourceKey } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';

import { ICON_NAMES } from './iconNames';
import { PlatformButton } from './PlatformButton';
import type { IPlatformButtonProps, TPlatform } from './PlatformButton';
import { themeFromGlobals } from './themeGlobals';

const VARIANTS: TButtonVariant[] = ['primary', 'danger'];
/** `on-inverse` is excluded: it only exists for `primary`, and needs an inverted surface. */
const APPEARANCES: Exclude<TButtonAppearance, 'on-inverse'>[] = ['fill', 'soft', 'outline', 'ghost'];
const SIZES: TButtonSize[] = ['xs', 'sm', 'md', 'lg'];

/** Lays several buttons out in a wrapping row. */
const Row = ({ children }: { children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
);

/** A labelled row, stacked under its caption. */
const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    <Row>{children}</Row>
  </div>
);

/**
 * `on-inverse` is the one appearance that describes a *surface* rather than a
 * weight, so it only reads against the inverted canvas it is named for. Read
 * straight from the theme rather than hardcoded, so it follows the Theme
 * dropdown — note it goes light in the dark theme, because "inverse" means the
 * opposite of the current surface.
 */
const InverseSurface = ({
  themeKey,
  children,
}: {
  themeKey: TThemeSourceKey;
  children: ReactNode;
}): ReactNode => (
  <div
    style={{
      backgroundColor: readThemeToken(
        themeSources[themeKey].color,
        'color.color.canvas.background.inverse',
      ),
      padding: 24,
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <span
      style={{
        fontSize: 12,
        opacity: 0.65,
        color: readThemeToken(themeSources[themeKey].color, 'color.color.text.inverse'),
      }}
    >
      primary · on-inverse
    </span>
    <Row>{children}</Row>
  </div>
);

/**
 * The props table below describes the shared contract from `@dsm/shared`, which
 * both implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package.
 */
const meta = {
  title: 'Atoms/Button',
  component: PlatformButton,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Two independent axes: `variant` says what the action *means* (`primary`, `danger`) ' +
          'and `appearance` says how much weight it carries (`fill` › `soft` › `outline` › ' +
          '`ghost`, plus `on-inverse` for inverted surfaces). Lower the hierarchy with ' +
          '`appearance`, never by changing `variant` — a "save draft" next to a "publish" is ' +
          '`primary` + `outline` or `primary` + `soft`. There is no `secondary`: bDS removed it ' +
          'for being an appearance disguised as a variant. Use the **Platform** dropdown to ' +
          'switch implementations and **Theme** to preview light and dark; both platforms ' +
          'resolve the same tokens, so they look the same.',
      },
    },
  },
  argTypes: {
    // --- Content ------------------------------------------------------------
    label: {
      control: 'text',
      description: 'Text rendered inside the button. Required — there is no icon-only mode.',
      table: { category: 'Content' },
    },
    // --- Appearance ---------------------------------------------------------
    variant: {
      control: 'inline-radio',
      options: VARIANTS,
      description: 'What the action means. Hierarchy is lowered with `appearance`, not with this.',
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    appearance: {
      control: 'inline-radio',
      options: [...APPEARANCES, 'on-inverse'],
      description:
        'How much visual weight the button carries, heaviest to lightest. `on-inverse` is only ' +
        'valid with `variant: primary` and throws otherwise — bDS ships no tokens for that pair.',
      table: { category: 'Appearance', defaultValue: { summary: 'fill' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description:
        'Height ramp shared with the form fields: 24 / 32 / 44 / 56. `xs` is for dense rows and ' +
        'tables, never the main action — mobile applies `hitSlop` for it automatically.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    leadingIcon: {
      control: 'select',
      options: [undefined, ...ICON_NAMES],
      description:
        'Icon before the label. The real prop takes the component — ' +
        '`leadingIcon={IconPlus}` — but a control can only pass a string, so this ' +
        'story resolves it per platform. **There is no `showLeadingIcon`**: passing ' +
        'an icon is what shows it. The size is not the control\'s own — `xs` and `sm` ' +
        'get 16, `md` and `lg` get 24.',
      table: { category: 'Appearance' },
    },
    trailingIcon: {
      control: 'select',
      options: [undefined, ...ICON_NAMES],
      description: 'Icon after the label. See `leadingIcon`.',
      table: { category: 'Appearance' },
    },
    // --- State --------------------------------------------------------------
    isDisabled: {
      control: 'boolean',
      description:
        'Blocks interaction and applies the disabled styling. The only interaction state that is ' +
        'a prop — hover, press and focus come from real interaction.',
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
    label: 'Button',
    onAction: fn(),
  },
  render: (args, { globals }) => (
    <PlatformButton {...args} platform={globals.platform as TPlatform} />
  ),
} satisfies Meta<IPlatformButtonProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** The weight ladder, for both variants, plus `on-inverse` on the surface it needs. */
export const Appearances: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    const { key: themeKey } = themeFromGlobals(globals);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {VARIANTS.map((variant) => (
          <Group key={variant} title={variant}>
            {APPEARANCES.map((appearance) => (
              <PlatformButton
                {...args}
                appearance={appearance}
                key={appearance}
                label={appearance}
                platform={platform}
                variant={variant}
              />
            ))}
          </Group>
        ))}
        <InverseSurface themeKey={themeKey}>
          <PlatformButton
            {...args}
            appearance="on-inverse"
            label="on-inverse"
            platform={platform}
            variant="primary"
          />
        </InverseSurface>
      </div>
    );
  },
};

/** The four heights, so the metric scale is easy to compare. */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <Row>
      {SIZES.map((size) => (
        <PlatformButton
          {...args}
          key={size}
          label={size}
          platform={globals.platform as TPlatform}
          size={size}
        />
      ))}
    </Row>
  ),
};

/**
 * Every appearance disabled. `fill` and `soft` gain a 1px border here — the only
 * state in which they draw one at all, so the box model changes on disable.
 */
export const Disabled: TStory = {
  args: { isDisabled: true },
  render: (args, { globals }) => (
    <Row>
      {APPEARANCES.map((appearance) => (
        <PlatformButton
          {...args}
          appearance={appearance}
          key={appearance}
          label={appearance}
          platform={globals.platform as TPlatform}
        />
      ))}
    </Row>
  ),
};

/**
 * The two icon slots.
 *
 * The icon size is **not** the control's own: `xs` and `sm` both get 16, `md`
 * and `lg` both get 24, because the icon scale has no step at 20. Compare the
 * `sm` and `md` rows below — the buttons grow, the icons jump only once.
 *
 * Colour needs no wiring on web: the `<button>` sets `color` for its label and
 * the icon resolves to `currentColor`. On React Native there is no cascade, so
 * the Button hands the same value over through `tintColor` — flip the Platform
 * dropdown and the result should be identical.
 */
export const Icons: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <PlatformButton {...args} label="Leading" leadingIcon="IconPlus" platform={platform} />
          <PlatformButton {...args} label="Trailing" platform={platform} trailingIcon="IconArrowUpRight" />
          <PlatformButton
            {...args}
            label="Ambos"
            leadingIcon="IconPlus"
            platform={platform}
            trailingIcon="IconChevronRight"
          />
          <PlatformButton
            {...args}
            isDisabled
            label="Disabled"
            leadingIcon="IconTrash"
            platform={platform}
          />
        </div>
        {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, opacity: 0.6, width: 76 }}>
              {size} · icon {size === 'xs' || size === 'sm' ? 16 : 24}
            </span>
            <PlatformButton
              {...args}
              label={size}
              leadingIcon="IconPlus"
              platform={platform}
              size={size}
              trailingIcon="IconChevronRight"
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['fill', 'soft', 'outline', 'ghost'] as const).map((appearance) => (
            <PlatformButton
              {...args}
              appearance={appearance}
              key={appearance}
              label={appearance}
              leadingIcon="IconCheck"
              platform={platform}
            />
          ))}
        </div>
      </div>
    );
  },
};

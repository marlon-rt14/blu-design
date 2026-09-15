import { readThemeToken, themeSources } from '@dsm/shared';
import type { TIconColor, TIconSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { ICON_NAMES, toFigmaName } from './iconNames';
import { PlatformIcon } from './PlatformIcon';
import type { IPlatformIconProps, TPlatform } from './PlatformIcon';
import { themeFromGlobals } from './themeGlobals';

const SIZES: [TIconSize, number][] = [
  ['2xs', 8],
  ['xs', 12],
  ['sm', 16],
  ['md', 24],
  ['lg', 32],
  ['xl', 40],
];

/** The roles that read on the page's own surface, with what each one is for. */
const PAGE_COLORS: [TIconColor, string][] = [
  ['primary', 'the default'],
  ['secondary', 'same value as tertiary'],
  ['tertiary', 'same value as secondary'],
  ['disabled', 'same as both in light'],
  ['brand', ''],
  ['danger', ''],
  ['success', ''],
  ['info', ''],
  ['warning', ''],
  ['partner-deuna', ''],
];

/**
 * Roles that only make sense on a surface the page does not have, each paired
 * with the surface it is named for.
 *
 * `fixed.white` goes on the brand scene rather than on `bg/inverse`: it is white
 * in *both* themes, and `inverse` is light when the theme is dark — white on
 * white is the honest result but a useless swatch.
 */
const SURFACE_COLORS: [TIconColor, string, string][] = [
  ['inverse', 'color.color.canvas.background.inverse', 'on bg/inverse'],
  ['on-scene.default', 'color.color.canvas.background.brand', 'on a brand scene'],
  ['on-scene.secondary', 'color.color.canvas.background.brand', 'on a brand scene'],
  ['fixed.white', 'color.color.canvas.background.brand', 'white in both themes'],
];

const Caption = ({ children }: { children: ReactNode }): ReactNode => (
  <span style={{ fontSize: 11, opacity: 0.6, textAlign: 'center', lineHeight: 1.4 }}>
    {children}
  </span>
);

const Cell = ({ children }: { children: ReactNode }): ReactNode => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      width: 88,
    }}
  >
    {children}
  </div>
);

const meta = {
  title: 'Atoms/Icon',
  component: PlatformIcon,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**The wrapper every icon in the system passes through** — it is not the drawing. ' +
          'It fixes the box from `size/icon/*` and resolves the colour; the paths enter as ' +
          'children. You almost never use it directly: the 31 glyphs bDS publishes come ' +
          'pre-built as `IconTrash`, `IconPlus`… from `@dsm/web/icons` and ' +
          '`@dsm/mobile/icons`.\n\n' +
          '`size` defaults to `sm` (16) — bDS calls it *"el tamaño por defecto del sistema"*, ' +
          'against the `2xs` the Figma properties table reports. `color` is **optional and ' +
          'inherits**, which is what the Figma component does: it has no colour axis at all, ' +
          'so an icon inside a Button matches the label with no props. On web that is ' +
          '`currentColor`; React Native has no cascade, so mobile falls back to ' +
          '`color/icon/primary` and adds `tintColor` for a parent that already resolved one.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: ICON_NAMES,
      description:
        'Which glyph. **Not a real prop** — each glyph is its own component, so this picks ' +
        'which one to import. `<IconTrash size="lg" />`, not `<Icon name="trash" />`.',
      table: { category: 'Story' },
    },
    size: {
      control: 'inline-radio',
      options: SIZES.map(([size]) => size),
      description:
        'Edge length, bound to `size/icon/*`: 8 · 12 · 16 · 24 · 32 · 40. There is no ' +
        'width/height escape hatch — in Figma, resizing the instance breaks the variable ' +
        'binding and the icon stops following the token.',
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    color: {
      control: 'select',
      options: [
        ...PAGE_COLORS.map(([role]) => role),
        ...SURFACE_COLORS.map(([role]) => role),
      ],
      description:
        'Semantic role from `color/icon/*`, all 33 of them. **Leave it unset and the glyph ' +
        'inherits** — that is the default and what bDS intends.',
      table: { category: 'Appearance', defaultValue: { summary: 'inherit' } },
    },
    tintColor: {
      control: 'color',
      description:
        'A literal colour, overriding `color`. **Mobile only**: React Native has no ' +
        '`currentColor`, so a parent that already resolved a colour has no way to lend it ' +
        'implicitly. Switch **Platform** to React Native to see it work.',
      table: { category: 'Appearance' },
    },
    accessibilityLabel: {
      control: 'text',
      description:
        'Describes the icon to assistive technology. **Leave it out for a decorative icon** — ' +
        'without it the icon is hidden from the accessibility tree, because an icon beside a ' +
        'label that already says what it means is noise when announced twice.',
      table: { category: 'Accessibility' },
    },
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
      table: { category: 'Other' },
    },
    platform: { table: { disable: true } },
  },
  args: {
    name: 'IconTrash',
  },
  render: (args, { globals }) => (
    <PlatformIcon {...args} platform={globals.platform as TPlatform} />
  ),
} satisfies Meta<IPlatformIconProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/**
 * All 31 glyphs the library exports, with the bDS name each one came from.
 *
 * This is the list to shop from: the export name is what you import. Flip the
 * **Platform** dropdown and the same set renders through react-native-svg.
 */
export const Gallery: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
      {ICON_NAMES.map((name) => (
        <Cell key={name}>
          <PlatformIcon
            {...args}
            name={name}
            platform={globals.platform as TPlatform}
            size="lg"
          />
          <Caption>{toFigmaName(name)}</Caption>
        </Cell>
      ))}
    </div>
  ),
};

/**
 * The six steps of `size/icon/*`.
 *
 * Note `2xs` (8): bDS says it is *"only the dot of a Radio at size=sm. No es un
 * icono: es una marca"* — and at that size a drawing really is a smudge, which
 * is the argument made visible.
 */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
      {SIZES.map(([size, px]) => (
        <Cell key={size}>
          <PlatformIcon
            {...args}
            platform={globals.platform as TPlatform}
            size={size}
          />
          <Caption>
            {size} · {px}px
          </Caption>
        </Cell>
      ))}
    </div>
  ),
};

/**
 * The roles that read on the page's own surface.
 *
 * `secondary`, `tertiary` and `disabled` resolve to the **same** `#5f6677` in the
 * light theme, so they are indistinguishable there — a defect in the token
 * source, not in the component. In dark, `disabled` separates but `secondary`
 * and `tertiary` still match.
 */
export const Colors: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
      {PAGE_COLORS.map(([role, note]) => (
        <Cell key={role}>
          <PlatformIcon
            {...args}
            color={role}
            name="IconAlertTriangle"
            platform={globals.platform as TPlatform}
            size="lg"
          />
          <Caption>
            {role}
            {note ? <br /> : null}
            {note}
          </Caption>
        </Cell>
      ))}
    </div>
  ),
};

/** The roles that need a surface the page does not have. */
export const OnSurfaces: TStory = {
  render: (args, { globals }) => {
    const { key: themeKey } = themeFromGlobals(globals);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {SURFACE_COLORS.map(([role, token, note]) => (
          <Cell key={role}>
            {/* The caption sits outside the swatch on purpose: inside, it would
                be unreadable on half of these surfaces. */}
            <div
              style={{
                backgroundColor: readThemeToken(themeSources[themeKey].color, token),
                padding: 20,
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <PlatformIcon
                {...args}
                color={role}
                name="IconInfo"
                platform={globals.platform as TPlatform}
                size="lg"
              />
            </div>
            <Caption>
              {role}
              <br />
              {note}
            </Caption>
          </Cell>
        ))}
      </div>
    );
  },
};

/**
 * With no `color`, the glyph takes the colour of whatever contains it.
 *
 * This is the default and the whole point: the Figma component has no colour
 * axis, so an icon inside a Button matches the label with nothing configured.
 * On web it is `currentColor`. **On React Native there is no cascade**, so the
 * same markup falls back to `color/icon/primary` and a parent has to lend a
 * colour through `tintColor` — flip the Platform dropdown to see the difference.
 */
export const Inheritance: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['#174183', '#b22c42', '#008557'].map((color) => (
          <span
            key={color}
            style={{ color, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}
          >
            <PlatformIcon {...args} name="IconPlus" platform={platform} size="md" />
            inherits {color}
            <PlatformIcon {...args} name="IconTrash" platform={platform} size="md" />
          </span>
        ))}
        <span style={{ fontSize: 12, opacity: 0.6 }}>
          {platform === 'native'
            ? 'React Native: no cascade — these fall back to color/icon/primary.'
            : 'Web: currentColor, inherited from the span above.'}
        </span>
      </div>
    );
  },
};

/**
 * Decorative by default. The first icon is hidden from assistive technology
 * because the text beside it already says what it means; the second carries the
 * information alone, so it is labelled and announced as an image.
 */
export const Accessibility: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <PlatformIcon
            {...args}
            color="success"
            name="IconCheckCircle"
            platform={platform}
            testID="icon-decorative"
          />
          Verified account — decorative, hidden from the tree
        </span>
        <PlatformIcon
          {...args}
          accessibilityLabel="Verified account"
          color="success"
          name="IconCheckCircle"
          platform={platform}
          size="md"
          testID="icon-labelled"
        />
      </div>
    );
  },
};

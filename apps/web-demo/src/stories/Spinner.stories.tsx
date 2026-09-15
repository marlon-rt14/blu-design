import type { TSpinnerAppearance, TSpinnerSize } from '@dsm/shared';
import { readThemeToken, themeSources } from '@dsm/shared';
import type { TThemeMode } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

import { PlatformSpinner } from './PlatformSpinner';
import type { IPlatformSpinnerProps, TPlatform } from './PlatformSpinner';

const APPEARANCES: TSpinnerAppearance[] = ['brand', 'primary', 'on-brand'];
const SIZES: TSpinnerSize[] = ['sm', 'md', 'lg'];

const Row = ({ children }: { children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>{children}</div>
);

const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    <Row>{children}</Row>
  </div>
);

const OnBrandSurface = ({
  theme,
  children,
}: {
  theme: TThemeMode;
  children: ReactNode;
}): ReactNode => (
  <div
    style={{
      backgroundColor: readThemeToken(
        themeSources[theme].color,
        'color.color.canvas.background.brand',
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
        opacity: 0.85,
        color: readThemeToken(themeSources[theme].color, 'color.color.icon.on-brand'),
      }}
    >
      appearance=on-brand
    </span>
    <Row>{children}</Row>
  </div>
);

const meta = {
  title: 'Atoms/Spinner',
  component: PlatformSpinner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Indeterminate loading indicator. Appearance follows the surface (brand / primary / on-brand). ' +
          'Reduced motion stops the spin and leaves the arc still. Not for measurable waits (ProgressBar) ' +
          'or known-shape placeholders (Skeleton).',
      },
    },
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: APPEARANCES,
      table: { category: 'Appearance', defaultValue: { summary: 'brand' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Screen-reader announcement. Not rendered visually.',
      table: { category: 'Accessibility', defaultValue: { summary: 'Cargando' } },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    appearance: 'brand',
    size: 'md',
    label: 'Cargando',
  },
  render: (args, { globals }) => (
    <div style={{ padding: 24 }}>
      <PlatformSpinner {...args} platform={globals['platform'] as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformSpinnerProps>;

export default meta;

type TStory = StoryObj<IPlatformSpinnerProps>;

export const Playground: TStory = {};

/** All nine Figma variants: appearance × size. */
export const Matrix: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    const theme = globals['theme'] as TThemeMode;
    const stack: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 24, padding: 24 };

    return (
      <div style={stack}>
        <Group title="brand">
          {SIZES.map((size) => (
            <PlatformSpinner appearance="brand" key={`brand-${size}`} platform={platform} size={size} />
          ))}
        </Group>
        <Group title="primary">
          {SIZES.map((size) => (
            <PlatformSpinner appearance="primary" key={`primary-${size}`} platform={platform} size={size} />
          ))}
        </Group>
        <OnBrandSurface theme={theme}>
          {SIZES.map((size) => (
            <PlatformSpinner
              appearance="on-brand"
              key={`on-brand-${size}`}
              platform={platform}
              size={size}
            />
          ))}
        </OnBrandSurface>
      </div>
    );
  },
};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24 }}>
        <Row>
          {SIZES.map((size) => (
            <Group key={size} title={size}>
              <PlatformSpinner platform={platform} size={size} />
            </Group>
          ))}
        </Row>
      </div>
    );
  },
};

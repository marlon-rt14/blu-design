import type { TImageFit, TImageRadius, TImageRatio, TImageStatus } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';

import { PlatformImage } from './PlatformImage';
import type { IPlatformImageProps, TPlatform } from './PlatformImage';

const RATIOS: TImageRatio[] = ['1:1', '4:3', '3:2', '16:9'];
const RADII: TImageRadius[] = ['md', 'sm', 'none'];
const STATUSES: TImageStatus[] = ['default', 'loading', 'empty', 'error'];
const FITS: TImageFit[] = ['cover', 'contain', 'fill'];

/** Stable demo photo — replace with a brand asset when available. */
const DEMO_SRC =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=640&q=80';

/**
 * Image is `width: 100%` + `aspect-ratio` — height falls out of width.
 * The host **must** set a real width (not only `maxWidth`). Absolute `<img>`
 * does not contribute intrinsic size, so a hug parent collapses to ~0 / icon.
 */
const Frame = ({
  children,
  width = 320,
}: {
  children: ReactNode;
  width?: number;
}): ReactElement => <div style={{ width }}>{children}</div>;

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>{children}</div>
);

const Grid = ({ children }: { children: ReactNode }): ReactElement => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 16,
      width: '100%',
      maxWidth: 720,
    }}
  >
    {children}
  </div>
);

const meta = {
  title: 'Atoms/Image',
  component: PlatformImage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Fixed-ratio content frame. Reserves space before the bitmap arrives. ' +
          '`ratio` × `radius` from Figma; `src` / `alt` / `fit` from Dev contract. ' +
          '`status` derives from load — override only in stories. Error is icon-only; ' +
          '`alt` is the accessible name. ' +
          '**Width is host-owned:** wrap in a sized container (`width: 320`), not only `maxWidth`.',
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Image URL. Omit / empty → empty status.',
      table: { category: 'Content' },
    },
    alt: {
      control: 'text',
      description: 'Required. Empty string only when decorative.',
      table: { category: 'Content' },
    },
    ratio: {
      control: 'inline-radio',
      options: RATIOS,
      description: 'Frame proportion. Width from host; height from ratio.',
      table: { category: 'Appearance', defaultValue: { summary: '1:1' } },
    },
    radius: {
      control: 'inline-radio',
      options: RADII,
      description: 'Corner radius. Use none when the host already clips.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    status: {
      control: 'inline-radio',
      options: STATUSES,
      description: 'Force painted status. Omit in product — derived from load.',
      table: { category: 'State' },
    },
    fit: {
      control: 'inline-radio',
      options: FITS,
      description: 'cover crops; contain letterboxes (logos); fill stretches (may distort).',
      table: { category: 'Appearance', defaultValue: { summary: 'cover' } },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    src: DEMO_SRC,
    alt: 'Persona de ejemplo',
    ratio: '1:1',
    radius: 'md',
    fit: 'cover',
  },
  render: (args, { globals }) => (
    <Frame>
      <PlatformImage {...args} platform={globals['platform'] as TPlatform} />
    </Frame>
  ),
} satisfies Meta<IPlatformImageProps>;

export default meta;

type TStory = StoryObj<IPlatformImageProps>;

export const Playground: TStory = {};

export const Ratios: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {RATIOS.map((ratio) => (
          <div key={ratio}>
            <p style={{ margin: '0 0 8px', fontSize: 12 }}>{ratio}</p>
            <PlatformImage
              alt={`Ejemplo ${ratio}`}
              platform={platform}
              radius="md"
              ratio={ratio}
              src={DEMO_SRC}
            />
          </div>
        ))}
      </Column>
    );
  },
};

export const Radius: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {RADII.map((radius) => (
          <div key={radius}>
            <p style={{ margin: '0 0 8px', fontSize: 12 }}>{radius}</p>
            <PlatformImage
              alt={`Radio ${radius}`}
              platform={platform}
              radius={radius}
              ratio="4:3"
              src={DEMO_SRC}
            />
          </div>
        ))}
      </Column>
    );
  },
};

export const Statuses: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Grid>
        {STATUSES.map((status) => (
          <div key={status}>
            <p style={{ margin: '0 0 8px', fontSize: 12 }}>{status}</p>
            <PlatformImage
              alt={`Estado ${status}`}
              platform={platform}
              radius="md"
              ratio="1:1"
              src={status === 'empty' ? undefined : DEMO_SRC}
              status={status}
            />
          </div>
        ))}
      </Grid>
    );
  },
};

/** Real load failure — bad URL → Figma error frame (icon-only); `alt` for a11y. */
export const FailedToLoad: TStory = {
  args: {
    src: 'https://example.invalid/missing.jpg',
    alt: 'Foto del documento de identidad',
    ratio: '4:3',
  },
};

export const Fit: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {FITS.map((fit) => (
          <div key={fit}>
            <p style={{ margin: '0 0 8px', fontSize: 12 }}>{fit}</p>
            <PlatformImage
              alt={`Fit ${fit}`}
              fit={fit}
              platform={platform}
              radius="md"
              ratio="16:9"
              src={DEMO_SRC}
            />
          </div>
        ))}
      </Column>
    );
  },
};

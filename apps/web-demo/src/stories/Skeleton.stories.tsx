import type { TSkeletonShape, TSkeletonSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

import { PlatformSkeleton } from './PlatformSkeleton';
import type { IPlatformSkeletonProps, TPlatform } from './PlatformSkeleton';

const SHAPES: TSkeletonShape[] = ['text', 'block', 'circle'];
const SIZES: TSkeletonSize[] = ['sm', 'md', 'lg'];

/** Figma matrix block footprint — layout owns size; stories pin it. */
const BLOCK_WIDTH = 200;
const BLOCK_HEIGHT = 96;

const Row = ({ children }: { children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>{children}</div>
);

const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

const meta = {
  title: 'Atoms/Skeleton',
  component: PlatformSkeleton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Loading placeholder that reserves the footprint of known-shape content. ' +
          'Same skeleton tokens as Image loading. Reduced motion freezes the sheen. ' +
          'Prefer Spinner when the incoming layout is unknown. ' +
          '`shape="block"` needs an explicit `height` (or a sized host) — `%` alone collapses.',
      },
    },
  },
  argTypes: {
    shape: {
      control: 'inline-radio',
      options: SHAPES,
      table: { category: 'Appearance', defaultValue: { summary: 'text' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    lines: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Stacked text bars. Only applies when shape is text.',
      table: { category: 'Appearance', defaultValue: { summary: '1' } },
    },
    width: {
      control: 'text',
      description: 'Width of text/block bones. Circles ignore it.',
      table: { category: 'Appearance', defaultValue: { summary: '100%' } },
    },
    height: {
      control: 'text',
      description: 'Height of block bones. Text/circle ignore it.',
      table: { category: 'Appearance', defaultValue: { summary: '100%' } },
    },
    label: {
      control: 'text',
      description: 'Single screen-reader announcement on the wrapper.',
      table: { category: 'Accessibility', defaultValue: { summary: 'Cargando' } },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    shape: 'text',
    size: 'md',
    lines: 1,
    width: 200,
    label: 'Cargando',
  },
  render: (args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    const props =
      args.shape === 'block'
        ? { ...args, width: args.width ?? BLOCK_WIDTH, height: args.height ?? BLOCK_HEIGHT }
        : args;
    return (
      <div style={{ padding: 24 }}>
        <PlatformSkeleton {...props} platform={platform} />
      </div>
    );
  },
} satisfies Meta<IPlatformSkeletonProps>;

export default meta;

type TStory = StoryObj<IPlatformSkeletonProps>;

export const Playground: TStory = {};

/** All nine Figma variants: shape × size. */
export const Matrix: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    const stack: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 32, padding: 24 };

    return (
      <div style={stack}>
        {SHAPES.map((shape) => (
          <Group key={shape} title={shape}>
            <Row>
              {SIZES.map((size) => (
                <Group key={`${shape}-${size}`} title={size}>
                  <PlatformSkeleton
                    height={shape === 'block' ? BLOCK_HEIGHT : undefined}
                    platform={platform}
                    shape={shape}
                    size={size}
                    width={shape === 'circle' ? undefined : BLOCK_WIDTH}
                  />
                </Group>
              ))}
            </Row>
          </Group>
        ))}
      </div>
    );
  },
};

export const TextLines: TStory = {
  args: { shape: 'text', size: 'md', lines: 3, width: 240 },
};

export const ListRow: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div
        style={{
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: 280,
        }}
      >
        <PlatformSkeleton platform={platform} shape="circle" size="md" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PlatformSkeleton platform={platform} shape="text" size="md" width="100%" />
          <PlatformSkeleton platform={platform} shape="text" size="sm" width="66%" />
        </div>
      </div>
    );
  },
};

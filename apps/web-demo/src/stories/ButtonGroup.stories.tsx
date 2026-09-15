import type { TButtonGroupDistribution, TButtonGroupOrientation } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

import { PlatformButton } from './PlatformButton';
import { PlatformButtonGroup } from './PlatformButtonGroup';
import type { IPlatformButtonGroupProps, TPlatform } from './PlatformButtonGroup';

const ORIENTATIONS: TButtonGroupOrientation[] = ['horizontal', 'vertical'];
const DISTRIBUTIONS: TButtonGroupDistribution[] = ['hug', 'fill'];

const Panel = ({
  title,
  width,
  children,
}: {
  title: string;
  width?: number | string;
  children: ReactNode;
}): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  padding: 24,
  maxWidth: 480,
};

const meta = {
  title: 'Molecules/ButtonGroup',
  component: PlatformButtonGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Layout-only container for 2–3 related Buttons. Owns orientation, distribution and gap; ' +
          'hierarchy stays on each Button. Figma slot `actions` → `children`. Not a selection control.',
      },
    },
  },
  argTypes: {
    children: { table: { disable: true } },
    orientation: {
      control: 'inline-radio',
      options: ORIENTATIONS,
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },
    distribution: {
      control: 'inline-radio',
      options: DISTRIBUTIONS,
      table: { category: 'Layout', defaultValue: { summary: 'hug' } },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
    distribution: 'hug',
  },
  render: (args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24 }}>
        <PlatformButtonGroup {...args} platform={platform}>
          <PlatformButton appearance="outline" label="Cancelar" platform={platform} />
          <PlatformButton label="Continuar" platform={platform} />
        </PlatformButtonGroup>
      </div>
    );
  },
} satisfies Meta<IPlatformButtonGroupProps>;

export default meta;

type TStory = StoryObj<IPlatformButtonGroupProps>;

export const Playground: TStory = {};

/** All four Figma variants: orientation × distribution. */
export const Variants: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={stackStyle}>
        {ORIENTATIONS.map((orientation) =>
          DISTRIBUTIONS.map((distribution) => (
            <Panel
              key={`${orientation}-${distribution}`}
              title={`${orientation} · ${distribution}`}
              width={distribution === 'fill' || orientation === 'vertical' ? '100%' : undefined}
            >
              <PlatformButtonGroup
                distribution={distribution}
                orientation={orientation}
                platform={platform}
              >
                <PlatformButton appearance="outline" label="Cancelar" platform={platform} />
                <PlatformButton label="Continuar" platform={platform} />
              </PlatformButtonGroup>
            </Panel>
          )),
        )}
      </div>
    );
  },
};

/** Horizontal primary on the right — reading order matches visual order. */
export const HorizontalPrimaryEnd: TStory = {
  name: 'Horizontal · primary end',
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24 }}>
        <PlatformButtonGroup platform={platform}>
          <PlatformButton appearance="outline" label="Cancelar" platform={platform} />
          <PlatformButton label="Continuar" platform={platform} />
        </PlatformButtonGroup>
      </div>
    );
  },
};

/** Vertical primary on top — Figma docs convention. */
export const VerticalPrimaryStart: TStory = {
  name: 'Vertical · primary start',
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24, maxWidth: 280 }}>
        <PlatformButtonGroup orientation="vertical" platform={platform}>
          <PlatformButton label="Continuar" platform={platform} />
          <PlatformButton appearance="outline" label="Cancelar" platform={platform} />
        </PlatformButtonGroup>
      </div>
    );
  },
};

/**
 * Equal widths — mobile footer case (Figma fill @ 375).
 *
 * Labels must fit one line at half-width: Button is nowrap / `numberOfLines={1}`.
 * Dev's "Sí" vs "Prefiero…" is about equal *tracks*, not multi-line labels.
 */
export const FillEqual: TStory = {
  name: 'Fill · equal widths',
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24, maxWidth: 375 }}>
        <PlatformButtonGroup distribution="fill" platform={platform}>
          <PlatformButton appearance="outline" label="Cancelar" platform={platform} />
          <PlatformButton label="Continuar" platform={platform} />
        </PlatformButtonGroup>
      </div>
    );
  },
};

/** Ghost stays tertiary; still laid out by the group. */
export const WithGhost: TStory = {
  name: 'Three actions · ghost',
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24 }}>
        <PlatformButtonGroup platform={platform}>
          <PlatformButton appearance="ghost" label="Omitir" platform={platform} />
          <PlatformButton appearance="outline" label="Guardar borrador" platform={platform} />
          <PlatformButton label="Publicar" platform={platform} />
        </PlatformButtonGroup>
      </div>
    );
  },
};

/** Destructive primary — danger fill replaces primary fill. */
export const Danger: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ padding: 24 }}>
        <PlatformButtonGroup platform={platform}>
          <PlatformButton appearance="outline" label="Conservar" platform={platform} />
          <PlatformButton label="Eliminar" platform={platform} variant="danger" />
        </PlatformButtonGroup>
      </div>
    );
  },
};

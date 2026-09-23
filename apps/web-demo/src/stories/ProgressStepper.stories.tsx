import type {
  IProgressStepDef,
  TProgressStepperOrientation,
  TProgressStepperPurpose,
  TStepStatus,
} from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

import { PlatformProgressStepper } from './PlatformProgressStepper';
import type { IPlatformProgressStepperProps, TPlatform } from './PlatformProgressStepper';

const PURPOSES: TProgressStepperPurpose[] = ['status', 'wizard'];
const ORIENTATIONS: TProgressStepperOrientation[] = ['horizontal', 'vertical'];
const STATUSES: TStepStatus[] = ['pending', 'active', 'done', 'warning', 'error'];

const stamp = '12 ago, 10:45';

const STATUS_FLOW: IProgressStepDef[] = [
  { label: 'Paso 1', secondaryLabel: stamp, status: 'done' },
  { label: 'Paso 2', secondaryLabel: stamp, status: 'active' },
  { label: 'Paso 3', secondaryLabel: stamp, status: 'pending' },
];

const WIZARD_FLOW: IProgressStepDef[] = [
  { label: 'Datos', status: 'done' },
  { label: 'Confirmación', status: 'active' },
  { label: 'Listo', status: 'pending' },
];

/** done → error → pending — connector before error stays inactive (left-step rule). */
const ERROR_RAIL: IProgressStepDef[] = [
  { label: 'Enviado', secondaryLabel: stamp, status: 'done' },
  { label: 'Falló', secondaryLabel: stamp, status: 'error' },
  { label: 'Reintento', secondaryLabel: stamp, status: 'pending' },
];

const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640, width: '100%' }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

const stack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  padding: 24,
  width: '100%',
  boxSizing: 'border-box',
};

const meta = {
  title: 'Molecules/ProgressStepper',
  component: PlatformProgressStepper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Timeline / wizard rail. Dev firma is **data-driven** (`steps[]`) — Figma\'s ' +
          '`steps` VARIANT 3–7 is guidance, not a hard clamp. Connectors derive from the ' +
          '**left** step (`done`/`warning` → done rail; else inactive). Vertical never draws ' +
          'a leading line. Non-interactive; `role="list"` + `aria-current="step"` on active.\n\n' +
          '`purpose`: `status` (empty/dot/glyphs + optional secondary) · `wizard` (numbered ' +
          'pending/active). `warning` vs `error` is visual only (amber triangle vs red X).',
      },
    },
  },
  argTypes: {
    purpose: {
      control: 'inline-radio',
      options: PURPOSES,
      table: { category: 'Appearance', defaultValue: { summary: 'status' } },
    },
    orientation: {
      control: 'inline-radio',
      options: ORIENTATIONS,
      table: { category: 'Appearance', defaultValue: { summary: 'horizontal' } },
    },
    steps: { table: { category: 'Content' } },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    purpose: 'status',
    orientation: 'horizontal',
    steps: STATUS_FLOW,
  },
  render: (args, { globals }) => (
    <div style={{ padding: 24, maxWidth: 640, width: '100%', boxSizing: 'border-box' }}>
      <PlatformProgressStepper {...args} platform={globals['platform'] as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformProgressStepperProps>;

export default meta;

type TStory = StoryObj<IPlatformProgressStepperProps>;

export const Playground: TStory = {};

/** purpose × orientation matrix. */
export const PurposeOrientation: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={stack}>
        {PURPOSES.map((purpose) =>
          ORIENTATIONS.map((orientation) => (
            <Group key={`${purpose}-${orientation}`} title={`${purpose} · ${orientation}`}>
              <PlatformProgressStepper
                orientation={orientation}
                platform={platform}
                purpose={purpose}
                steps={purpose === 'wizard' ? WIZARD_FLOW : STATUS_FLOW}
              />
            </Group>
          )),
        )}
      </div>
    );
  },
};

/** One step per status — gallery of indicator + label roles (H + V). */
export const StatusGallery: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={stack}>
        {STATUSES.map((status) => {
          const steps: IProgressStepDef[] = [
            { label: 'Anterior', secondaryLabel: stamp, status: 'done' },
            { label: status, secondaryLabel: stamp, status },
            { label: 'Siguiente', secondaryLabel: stamp, status: 'pending' },
          ];
          return (
            <Group key={status} title={status}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 48,
                  alignItems: 'flex-start',
                  width: '100%',
                }}
              >
                <div style={{ flex: '1 1 280px', minWidth: 0, maxWidth: 480 }}>
                  <span style={{ fontSize: 11, opacity: 0.55, display: 'block', marginBottom: 8 }}>
                    horizontal
                  </span>
                  <PlatformProgressStepper
                    orientation="horizontal"
                    platform={platform}
                    purpose="status"
                    steps={steps}
                  />
                </div>
                <div style={{ flex: '0 0 220px' }}>
                  <span style={{ fontSize: 11, opacity: 0.55, display: 'block', marginBottom: 8 }}>
                    vertical
                  </span>
                  <PlatformProgressStepper
                    orientation="vertical"
                    platform={platform}
                    purpose="status"
                    steps={steps}
                  />
                </div>
              </div>
            </Group>
          );
        })}
      </div>
    );
  },
};

/**
 * done → error → pending. The segment between done and error stays **inactive**
 * because derivation reads only the left step (done → done rail stops after
 * that hit; error does not paint the previous segment).
 */
export const ErrorRail: TStory = {
  args: {
    purpose: 'status',
    orientation: 'horizontal',
    steps: ERROR_RAIL,
  },
  render: (args, { globals }) => (
    <div style={stack}>
      <Group title="horizontal">
        <PlatformProgressStepper
          {...args}
          orientation="horizontal"
          platform={globals['platform'] as TPlatform}
        />
      </Group>
      <Group title="vertical">
        <PlatformProgressStepper
          {...args}
          orientation="vertical"
          platform={globals['platform'] as TPlatform}
        />
      </Group>
    </div>
  ),
};

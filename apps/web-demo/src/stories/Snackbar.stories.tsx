import type { ISnackbarStackItem, TSnackbarStatus } from '@dsm/shared';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { PlatformSnackbar } from './PlatformSnackbar';
import { PlatformSnackbarStack } from './PlatformSnackbarStack';
import type { IPlatformSnackbarProps, TPlatform } from './PlatformSnackbar';

const STATUSES: TSnackbarStatus[] = ['info', 'success', 'warning', 'danger'];

/**
 * Story-only controls. The component contract is presence-based (`action`,
 * `onDismiss`); these booleans just build that object for the controls panel.
 */
interface ISnackbarStoryArgs extends IPlatformSnackbarProps {
  actionLabel: string;
  withAction: boolean;
  withDismiss: boolean;
}

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 448, padding: 24 }}>
    {children}
  </div>
);

const triggerStyle = { alignSelf: 'flex-start' as const, cursor: 'pointer' };

/**
 * The bar is not on screen until the button mounts it. A new click remounts
 * so the dwell timer starts again. `onDismiss` (when the × is on) unmounts.
 * Without it the bar hides itself when the dwell elapses.
 */
const Triggered = ({
  platform,
  label = 'Mostrar snackbar',
  actionLabel,
  withAction,
  withDismiss,
  ...props
}: ISnackbarStoryArgs & { label?: string }): ReactElement => {
  const [session, setSession] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 448, padding: 24 }}>
      <button onClick={() => setSession((id) => id + 1)} style={triggerStyle} type="button">
        {label}
      </button>
      {session > 0 ? (
        <PlatformSnackbar
          {...props}
          action={withAction && !withDismiss ? { label: actionLabel, onPress: fn() } : undefined}
          key={session}
          onDismiss={withDismiss ? () => setSession(0) : undefined}
          platform={platform}
        />
      ) : null}
    </div>
  );
};

const meta = {
  title: 'Atoms/Snackbar',
  component: PlatformSnackbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Ephemeral overlay toast — the host mounts it when something just happened. ' +
          'Stories start hidden: press the button. One axis: `status` (info default). ' +
          'Inverse bar; glyph + `on-inverse.{status}` colour. Action is a LinkButton ' +
          '`on-inverse` `sm` and renders only when `action` is set. The × renders only ' +
          'when `onDismiss` is set. Autoclose: `motion/dwell/default` (6s) without action, ' +
          '`motion/dwell/long` (10s) with one; `duration` overrides. Timer starts on mount.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: STATUSES,
      description: 'Semantic status. Glyph + on-inverse colour carry meaning together. Bar fill never changes.',
      table: { category: 'Appearance', defaultValue: { summary: 'info' } },
    },
    message: {
      control: 'text',
      description: 'Past tense, no trailing period, max two lines.',
      table: { category: 'Content' },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether the status glyph renders. Off does not drop `status`.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    withAction: {
      control: 'boolean',
      description: 'Story control. On builds `action` (presence draws the LinkButton).',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    actionLabel: {
      control: 'text',
      description: 'Label passed inside `action`. Max two words, infinitive.',
      table: { category: 'Content', defaultValue: { summary: 'Deshacer' } },
    },
    withDismiss: {
      control: 'boolean',
      description: 'Story control. On passes `onDismiss` and drops `action` — the trailing slot is one or the other.',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    duration: {
      control: 'number',
      description: 'Autoclose dwell in ms. Overrides motion/dwell/{default|long}.',
      table: { category: 'Behavior' },
    },
    action: { table: { disable: true } },
    testID: { table: { disable: true } },
    onDismiss: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    status: 'info',
    message: 'Se guardó el cambio en tu tarjeta',
    showIcon: true,
    withAction: true,
    actionLabel: 'Deshacer',
    withDismiss: false,
    action: undefined,
    onDismiss: fn(),
  },
  render: (args, { globals }) => (
    <Triggered {...args} platform={globals['platform'] as TPlatform} />
  ),
} satisfies Meta<ISnackbarStoryArgs>;

export default meta;

type TStory = StoryObj<ISnackbarStoryArgs>;

export const Playground: TStory = {};

export const Statuses: TStory = {
  render: (args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {STATUSES.map((status) => (
          <Triggered
            {...args}
            key={status}
            label={`Mostrar ${status}`}
            platform={platform}
            status={status}
          />
        ))}
      </Column>
    );
  },
};

export const WithDismiss: TStory = {
  args: { withAction: false, withDismiss: true },
};

export const WithoutAction: TStory = {
  args: { withAction: false },
};

export const WithoutIcon: TStory = {
  args: { showIcon: false },
};

export const TwoLines: TStory = {
  args: {
    message: 'Programamos el pago de tu tarjeta Diners para el 28 de agosto',
  },
};

export const Duration: TStory = {
  args: {
    duration: 2000,
    message: 'Se cierra solo en 2 s',
    withAction: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Autoclose con `duration` override (2 s). Sin `onDismiss` la barra se oculta sola; ' +
          'el botón la vuelve a montar.',
      },
    },
  },
  render: (args, { globals }) => (
    <Triggered {...args} label="Mostrar otra vez (2000 ms)" platform={globals['platform'] as TPlatform} />
  ),
};

const pileOf = (count: 2 | 3): ISnackbarStackItem[] => {
  const bars: ISnackbarStackItem[] = [
    { id: 'paid', status: 'success', message: 'Se pagó tu tarjeta' },
    { id: 'sent', status: 'success', message: 'Se envió tu transferencia' },
    {
      id: 'saved',
      status: 'info',
      message: 'Se guardó el cambio en tu tarjeta',
      action: { label: 'Deshacer', onPress: fn() },
    },
  ];
  return bars.slice(bars.length - count);
};

const PileFrame = ({
  title,
  platform,
  count,
  expanded,
}: {
  title: string;
  platform: TPlatform;
  count: 2 | 3;
  expanded: boolean;
}): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 448 }}>
    <p style={{ margin: 0, fontSize: 12, textAlign: 'right' }}>{title}</p>
    <PlatformSnackbarStack expanded={expanded} items={pileOf(count)} platform={platform} />
  </div>
);

const STATUSES_CYCLE: TSnackbarStatus[] = ['info', 'success', 'warning', 'danger'];

const SpamPile = ({ platform }: { platform: TPlatform }): ReactElement => {
  const [items, setItems] = useState<ISnackbarStackItem[]>([]);
  const nextRef = useRef(1);

  const spam = (): void => {
    const n = nextRef.current;
    nextRef.current += 1;
    const withAction = n % 3 === 0;
    setItems((current) => [
      ...current,
      {
        id: `spam-${n}`,
        status: STATUSES_CYCLE[n % STATUSES_CYCLE.length] ?? 'info',
        message: `Aviso ${n}`,
        ...(withAction ? { action: { label: 'Deshacer', onPress: fn() } } : {}),
      },
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 448, padding: 32 }}>
      <button onClick={spam} type="button">
        Spamear
      </button>
      <PlatformSnackbarStack
        items={items}
        onDismiss={(id) => setItems((current) => current.filter((bar) => bar.id !== id))}
        platform={platform}
      />
    </div>
  );
};

export const Pila: TStory = {
  parameters: {
    docs: {
      description: {
        story:
          'SnackbarStack (`1706:3753`). Colapsada: la más nueva al frente, las de atrás asoman 8px. ' +
          'Expandida: lista, la más nueva abajo, timers en pausa. Sin `duration`: 6 s sin acción, 10 s con acción. ' +
          'En web se abre con hover o foco; en native, con un toque. Máximo 3.',
      },
    },
  },
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 448px)', gap: 48, alignItems: 'start' }}>
          <PileFrame count={3} expanded={false} platform={platform} title="3 · colapsada" />
          <PileFrame count={3} expanded platform={platform} title="3 · expandida" />
          <PileFrame count={2} expanded={false} platform={platform} title="2 · colapsada" />
          <PileFrame count={2} expanded platform={platform} title="2 · expandida" />
        </div>
      </div>
    );
  },
};

export const PilaExample: TStory = {
  name: 'Pila example',
  parameters: {
    docs: {
      description: {
        story:
          'Cada click mete un aviso nuevo. Sin `duration`: `motion/dwell/default` (6 s) y, cada tercer aviso, ' +
          '`motion/dwell/long` (10 s) porque trae Deshacer. El contador arranca al entrar y no se reinicia. ' +
          'Al cuarto, sale el más viejo. Hover o toque pausa los que quedan.',
      },
    },
  },
  render: (_args, { globals }) => <SpamPile platform={globals['platform'] as TPlatform} />,
};

import type { TPasswordFieldSize, TPasswordStrength } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { PlatformPasswordField } from './PlatformPasswordField';
import type { IPlatformPasswordFieldProps, TPlatform } from './PlatformPasswordField';

const SIZES: TPasswordFieldSize[] = ['sm', 'md', 'lg'];

/**
 * `PlatformPasswordField` is controlled, so the story holds its own state to
 * make typing possible in the canvas. Fixed to a readable width.
 */
const Controlled = (props: IPlatformPasswordFieldProps): ReactElement => {
  const [value, setValue] = useState(props.value);
  return (
    <div style={{ width: 320 }}>
      <PlatformPasswordField {...props} onChangeText={setValue} value={value} />
    </div>
  );
};

/**
 * Renders both visibility modes against a single parent-held value, so the
 * difference is visible in one screen. Declared as a component rather than
 * inlined in `render` because it needs its own state.
 */
const ControlledComparison = ({
  args,
  platform,
}: {
  args: IPlatformPasswordFieldProps;
  platform: TPlatform;
}): ReactElement => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Group title={`parent state: visible = ${visible}`}>
        <button
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          Toggle from the parent
        </button>
      </Group>
      <Group title="with onVisibilityChange — the parent owns it">
        <PlatformPasswordField
          {...args}
          label="Controlada"
          onChangeText={setValue}
          onToggleVisible={() => setVisible((v) => !v)}
          platform={platform}
          value={value}
          visible={visible}
        />
      </Group>
      <Group title="without it — the field owns it, and drifts from the label above">
        <PlatformPasswordField
          {...args}
          label="No controlada"
          onChangeText={setValue}
          platform={platform}
          value={value}
          visible={visible}
        />
      </Group>
    </div>
  );
};

/** A labelled field, stacked under its caption. */
const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

/**
 * The props table describes the shared contract from `@dsm/shared`, which both
 * implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package.
 */
const meta = {
  title: 'Atoms/PasswordField',
  component: PlatformPasswordField,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A password input revealed by a **text action**, not an eye icon. The action is a real ' +
          '`LinkButton` — the same component, composed inside the field, which is how Figma builds ' +
          'it too. Its label flips between "Mostrar" and "Ocultar" and doubles as its accessible ' +
          'name, so the toggle announces itself; it is **not** configurable, because an inverted ' +
          'label would lie about what pressing it does. The action only appears once there is a ' +
          'value — nothing to reveal on an empty field. Masking is the platform’s own (`type=' +
          '"password"` on web, `secureTextEntry` on mobile): the `value` prop is always the real ' +
          'one, never asterisks. Visibility works either way: leave `onVisibilityChange` off and ' +
          'the field manages itself, or pass it and the parent owns the state — see **Controlled Visibility**.',
      },
    },
  },
  argTypes: {
    // --- Content ------------------------------------------------------------
    label: {
      control: 'text',
      description:
        'Acts as the placeholder while empty; floats above the value once there is one — except at ' +
        '`size="sm"`, where it never floats.',
      table: { category: 'Content' },
    },
    value: { table: { disable: true } },
    // --- Appearance ---------------------------------------------------------
    size: {
      control: 'inline-radio',
      options: SIZES,
      description:
        'Heights 32 / 44 / 56. Figma’s own default is `sm`; this defaults to `md` to line up ' +
        'with the TextField a form usually puts next to it.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    visible: {
      control: 'boolean',
      description:
        'Whether the value is revealed. Drives the input’s `type` and the action’s label. The ' +
        'component owns the state — the action toggles it — but passing a new value here overrides ' +
        'it, so the control below works.',
      table: { category: 'Appearance', defaultValue: { summary: 'hidden' } },
    },
    onToggleVisible: {
      description:
        'Called with the next visibility when the reveal action is pressed. **Providing it makes ' +
        'the field controlled**: the action stops updating the component’s own state, so nothing ' +
        'changes until `visibility` comes back with the new value. Omit it and the field manages ' +
        'itself. See the **Controlled Visibility** story.',
      table: { category: 'Appearance' },
    },
    // --- Feedback -----------------------------------------------------------
    helperText: {
      control: 'text',
      description: 'Rendered below the field. Its presence is the switch; `error` replaces it.',
      table: { category: 'Feedback' },
    },
    strength: {
      control: 'inline-radio',
      options: [undefined, 'weak', 'acceptable', 'good', 'strong'],
      description:
        'How strong the password is. **Its presence draws the meter.** The component does not ' +
        'judge — bDS has no written rule for what counts as weak or strong, and says so: ' +
        '*"sin esto los cuatro niveles son decorativos"*.',
      table: { category: 'Content' },
    },
    requirements: {
      control: 'object',
      description:
        'What the password has to satisfy. **Its presence draws the list.** Figma has three ' +
        'states per row — `pending · met · failed` — and the signature has a boolean, so a rule ' +
        'that was tried and broken reads the same as one not yet attempted.',
      table: { category: 'Content' },
    },
    capsLock: {
      control: 'boolean',
      description:
        '**Web only**: *"en móvil no existe Bloq Mayús"*. Detecting it is the caller’s job — ' +
        '`event.getModifierState(\'CapsLock\')` — because the field does not listen to keys it ' +
        'does not own.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'text',
      description: 'Replaces `helperText` and puts the field in its error state.',
      table: { category: 'Feedback' },
    },
    // --- State --------------------------------------------------------------
    disabled: {
      control: 'boolean',
      description: 'Blocks interaction and applies the disabled styling.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Shows the value but prevents editing.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    // --- Other --------------------------------------------------------------
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
      table: { category: 'Other' },
    },
    onChangeText: {
      description: 'Mapped to `onChange` on web and to `onChangeText` on mobile.',
      table: { category: 'Other' },
    },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Contraseña',
    value: 'MiClave2026',
    // Required by the contract, so it has to be here: without it `StoryObj`
    // treats every story as missing an argument and rejects even `{}`.
    onChangeText: fn(),
  },
  render: (args, { globals }) => (
    <Controlled {...args} platform={globals.platform as TPlatform} />
  ),
} satisfies Meta<IPlatformPasswordFieldProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** The three heights. Note the value stays 16px at every size — only the box shrinks. */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SIZES.map((size) => (
        <Group key={size} title={size}>
          <Controlled {...args} platform={globals.platform as TPlatform} size={size} />
        </Group>
      ))}
    </div>
  ),
};

/**
 * Masked versus revealed. The action's label is the toggle's accessible name,
 * which is why it is not configurable.
 */
export const Reveal: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Group title='visible={false} (the default) — the action reads "Mostrar"'>
          <Controlled {...args} platform={platform} testID="pf-hidden" visible={false} />
        </Group>
        <Group title='visible={true} — the action reads "Ocultar"'>
          <Controlled {...args} platform={platform} testID="pf-visible" visible={true} />
        </Group>
        <Group title="empty — no action at all, there is nothing to reveal">
          <Controlled {...args} platform={platform} value="" />
        </Group>
      </div>
    );
  },
};

/** The states that are props. `hover`, `focus` and `pressed` come from interaction. */
export const States: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Group title="default (empty)">
          <Controlled {...args} platform={platform} value="" />
        </Group>
        <Group title="filled">
          <Controlled {...args} platform={platform} />
        </Group>
        <Group title="error">
          <Controlled {...args} error="Mínimo 8 caracteres" platform={platform} />
        </Group>
        <Group title="readonly">
          <Controlled {...args} readOnly platform={platform} />
        </Group>
        <Group title="disabled">
          <Controlled {...args} disabled platform={platform} />
        </Group>
      </div>
    );
  },
};

/**
 * The two visibility modes side by side.
 *
 * The first field gets `onVisibilityChange`, so the parent owns the state: its
 * own action and the button below stay in step. The second gets none, so it
 * manages itself — pressing its action moves it alone, and the label above
 * stops matching it.
 */
export const ControlledVisibility: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return <ControlledComparison args={args} platform={platform} />;
  },
};

/**
 * What the Figma frame actually shows, and what this component was missing
 * until now: **the meter and the requirements list**.
 *
 * Type in the field and watch both react. The rule bDS gives for the list is
 * about timing rather than looks — *"mostrá qué se pide mientras escribe, no
 * después de fallar"* — which is why they are visible from the first keystroke
 * and not after a failed submit.
 *
 * **The level is the caller's call.** bDS has no written criterion for weak,
 * acceptable, good or strong, and registers that gap itself: without it *"los
 * cuatro niveles son decorativos"*. The rule below belongs to this story, not
 * to the system.
 */
export const StrengthAndRequirements: TStory = {
  args: {
    strength: "good"
  },

  render: function Render(args, { globals }) {
    const platform = globals.platform as TPlatform;
    const [value, setValue] = useState('Contra');
    const strength: TPasswordStrength =
      value.length >= 12 && /[A-Z]/.test(value) && /[0-9]/.test(value)
        ? 'strong'
        : value.length >= 10
          ? 'good'
          : value.length >= 8
            ? 'acceptable'
            : 'weak';
    return (
      <div style={{ width: 380 }}>
        <PlatformPasswordField
          {...args}
          label="Contraseña"
          onChangeText={setValue}
          platform={platform}
          requirements={[
            { label: '12 caracteres de largo', met: value.length >= 12 },
            { label: 'Al menos una mayúscula', met: /[A-Z]/.test(value) },
            { label: 'Al menos un número', met: /[0-9]/.test(value) },
          ]}
          strength={strength}
          testID="pf-full"
          value={value}
        />
      </div>
    );
  }
};

/**
 * The four levels side by side.
 *
 * The bar is a real `ProgressBar` with its header off — which is what Figma
 * instances too, measured: `bar` is a header plus a track, and the fill is 25,
 * 50, 75 or 100 per cent. The word above it is the field's own, because it
 * carries a colour the bar's header could not give it.
 */
export const StrengthLevels: TStory = {
  render: function Render(args, { globals }) {
    const platform = globals.platform as TPlatform;
    const niveles: TPasswordStrength[] = ['weak', 'acceptable', 'good', 'strong'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 380 }}>
        {niveles.map((nivel) => (
          <Group key={nivel} title={nivel}>
            <PlatformPasswordField
              {...args}
              label="Contraseña"
              onChangeText={() => {}}
              platform={platform}
              strength={nivel}
              testID={`pf-strength-${nivel}`}
              value="Secreta123"
            />
          </Group>
        ))}
      </div>
    );
  },
};

/**
 * The Caps Lock warning, **web only** — on `native` nothing renders, which is
 * the point: *"en móvil no existe Bloq Mayús: la prop no aplica y el aviso no
 * se monta"*.
 *
 * It is a live region, because it appears while someone is typing and nothing
 * else would announce it.
 */
export const CapsLock: TStory = {
  args: { capsLock: true, value: 'Secreta123' },
};

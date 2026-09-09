import type { TPasswordFieldSize, TPasswordFieldVisibility } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { PlatformPasswordField } from './PlatformPasswordField';
import type { IPlatformPasswordFieldProps, TPlatform } from './PlatformPasswordField';

const SIZES: TPasswordFieldSize[] = ['sm', 'md', 'lg'];
const VISIBILITIES: TPasswordFieldVisibility[] = ['visible', 'hidden'];

/**
 * `PlatformPasswordField` is controlled, so the story holds its own state to
 * make typing possible in the canvas. Fixed to a readable width.
 */
const Controlled = (props: IPlatformPasswordFieldProps): ReactElement => {
  const [value, setValue] = useState(props.value);
  return (
    <div style={{ width: 320 }}>
      <PlatformPasswordField {...props} onValueChange={setValue} value={value} />
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
  const [visibility, setVisibility] = useState<TPasswordFieldVisibility>('hidden');
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Group title={`parent state: visibility = "${visibility}"`}>
        <button
          onClick={() =>
            setVisibility((current) => (current === 'visible' ? 'hidden' : 'visible'))
          }
          type="button"
        >
          Toggle from the parent
        </button>
      </Group>
      <Group title="with onVisibilityChange — the parent owns it">
        <PlatformPasswordField
          {...args}
          label="Controlada"
          onValueChange={setValue}
          onVisibilityChange={setVisibility}
          platform={platform}
          value={value}
          visibility={visibility}
        />
      </Group>
      <Group title="without it — the field owns it, and drifts from the label above">
        <PlatformPasswordField
          {...args}
          label="No controlada"
          onValueChange={setValue}
          platform={platform}
          value={value}
          visibility={visibility}
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
    visibility: {
      control: 'inline-radio',
      options: VISIBILITIES,
      description:
        'Whether the value is revealed. Drives the input’s `type` and the action’s label. The ' +
        'component owns the state — the action toggles it — but passing a new value here overrides ' +
        'it, so the control below works.',
      table: { category: 'Appearance', defaultValue: { summary: 'hidden' } },
    },
    onVisibilityChange: {
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
      description: 'Rendered below the field when `showHelper` is `true`. Ignored while `errorMessage` is set.',
      table: { category: 'Feedback' },
    },
    showHelper: {
      control: 'boolean',
      description: 'Whether the helper slot renders at all — independent of either text being set.',
      table: { category: 'Feedback', defaultValue: { summary: 'true' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Replaces `helperText` and puts the field in its error state.',
      table: { category: 'Feedback' },
    },
    isInvalid: {
      control: 'boolean',
      description: 'Error state without a message.',
      table: { category: 'Feedback', defaultValue: { summary: 'false' } },
    },
    // --- State --------------------------------------------------------------
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and applies the disabled styling.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    isReadOnly: {
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
    onValueChange: {
      description: 'Mapped to `onChange` on web and to `onChangeText` on mobile.',
      table: { category: 'Other' },
    },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Contraseña',
    value: 'MiClave2026',
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
        <Group title='visibility="hidden" (the default) — the action reads "Mostrar"'>
          <Controlled {...args} platform={platform} testID="pf-hidden" visibility="hidden" />
        </Group>
        <Group title='visibility="visible" — the action reads "Ocultar"'>
          <Controlled {...args} platform={platform} testID="pf-visible" visibility="visible" />
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
          <Controlled {...args} errorMessage="Mínimo 8 caracteres" platform={platform} showHelper />
        </Group>
        <Group title="readonly">
          <Controlled {...args} isReadOnly platform={platform} />
        </Group>
        <Group title="disabled">
          <Controlled {...args} isDisabled platform={platform} />
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

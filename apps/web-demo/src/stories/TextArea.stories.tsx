import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { PlatformTextArea } from './PlatformTextArea';
import type { IPlatformTextAreaProps, TPlatform } from './PlatformTextArea';

/**
 * `PlatformTextArea` is controlled, so the story needs to hold its own state
 * to make typing possible in the canvas. `value` is intentionally left out of
 * the controls panel (see `argTypes` below) — it is owned by this wrapper,
 * not by Storybook's args. Fixed to a readable width, since a growing
 * textarea with no width constraint looks odd in the canvas.
 */
const ControlledPlatformTextArea = (props: IPlatformTextAreaProps): ReactElement => {
  const [value, setValue] = useState(props.value);
  return (
    <div style={{ width: 320 }}>
      <PlatformTextArea {...props} value={value} onValueChange={setValue} />
    </div>
  );
};

/**
 * The props table below describes the shared contract from `@dsm/shared`,
 * which both implementations honour. `argTypes` are declared explicitly
 * rather than inferred, because react-docgen cannot resolve props inherited
 * from another package.
 *
 * Unlike `TextField`, there is no `size` control and no `placeholder` control
 * — Figma's `TextArea` component set has a single `state` variant axis, and
 * `label` doubles as the placeholder (see `ITextAreaBaseProps` in `@dsm/shared`).
 */
const meta = {
  title: 'Atoms/TextArea',
  component: PlatformTextArea,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Use the **Platform** dropdown to switch between the React implementation ' +
          '(`@dsm/web`) and the React Native one (`@dsm/mobile`), and the **Theme** ' +
          'dropdown to preview light and dark. `label` acts as the placeholder while ' +
          'the field is empty and floats above it as soon as there is a value — there ' +
          'is no separate `placeholder` prop. The field has no fixed height: it grows ' +
          'with content, never shrinking below its token floor.',
      },
    },
  },
  argTypes: {
    // --- Content: what the field is showing --------------------------------
    label: {
      control: 'text',
      description: 'Shown inside the field while empty (acting as a placeholder); floats above once there is a value.',
      table: { category: 'Content' },
    },
    // --- Feedback: helper text, error state and the character counter ------
    helperText: {
      control: 'text',
      description:
        'Rendered in the footer\u2019s left slot when `showHelper` is `true`. Ignored while `errorMessage` is set.',
      table: { category: 'Feedback' },
    },
    showHelper: {
      control: 'boolean',
      description: 'Whether `helperText` / `errorMessage` renders at all — independent of either being set.',
      table: { category: 'Feedback', defaultValue: { summary: 'false' } },
    },
    errorMessage: {
      control: 'text',
      description:
        'Rendered in the footer\u2019s left slot instead of `helperText` (when `showHelper` is `true`), styled as an error.',
      table: { category: 'Feedback' },
    },
    isInvalid: {
      control: 'boolean',
      description: 'Applies the invalid styling. Pair with `errorMessage` — a border alone fails WCAG 1.4.1.',
      table: { category: 'Feedback', defaultValue: { summary: 'false' } },
    },
    maxLength: {
      control: 'number',
      description: 'Used to compute the `"n/max"` counter text — see `showCounter` for whether it renders.',
      table: { category: 'Feedback' },
    },
    showCounter: {
      control: 'boolean',
      description: 'Whether the `"n/max"` counter renders at all — independent of `maxLength` being set.',
      table: { category: 'Feedback', defaultValue: { summary: 'false' } },
    },
    // --- State: interaction-blocking flags ----------------------------------
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and applies the disabled styling.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Shows the value but blocks editing.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    // --- Testing & events ----------------------------------------------------
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
      table: { category: 'Testing & events' },
    },
    onValueChange: {
      description: 'Mapped to `onChange` on web and to `onChangeText` on mobile.',
      table: { category: 'Testing & events' },
    },
    // Owned by ControlledPlatformTextArea, not by the controls panel — see above.
    value: { table: { disable: true } },
    // Driven by the toolbar, not by the controls panel.
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Comentario',
    value: '',
    // Not `showCounter`/`showHelper` themselves (those default to Figma's own
    // `false`) — just enough content ready so flipping either on in the
    // Playground immediately shows something, instead of an empty footer.
    maxLength: 200,
    helperText: 'Cuéntanos qué salió mal.',
  },
  render: (args, { globals }) => (
    <ControlledPlatformTextArea {...args} platform={globals['platform'] as TPlatform} />
  ),
} satisfies Meta<IPlatformTextAreaProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/**
 * Empty field: the label acts as the placeholder and does not float — Figma's
 * `default` state. Focusing an empty field (`focus` in Figma) looks the same
 * on this axis: it does not float either, only when a value is set.
 */
export const Empty: TStory = {
  args: { value: '' },
};

/** With a value: the label has floated above the field — Figma's `filled` state. */
export const Filled: TStory = {
  args: {
    value:
      'Texto largo que ocupa varias lineas para mostrar como crece el campo hacia abajo sin recortar nada.',
  },
};

/** With helper text guiding the user before any validation has run. */
export const WithHelperText: TStory = {
  args: { value: 'Notas del pedido', helperText: 'Máximo 200 caracteres.', showHelper: true },
};

/**
 * Invalid state with a message — the border alone would fail WCAG 1.4.1.
 * `showHelper: true` is required here: it isn't switched on automatically
 * by `errorMessage` or `isInvalid`, on either component.
 */
export const ErrorState: TStory = {
  args: { value: '', errorMessage: 'Este campo es obligatorio.', showHelper: true },
};

/** Blocks interaction entirely — the handler must not fire in this state. */
export const Disabled: TStory = {
  args: { value: 'Texto bloqueado', isDisabled: true },
};

/** Shows a value the user cannot edit through this control — a different look from disabled. */
export const ReadOnly: TStory = {
  args: { value: 'Este contenido no se puede editar.', isReadOnly: true },
};

/**
 * With `maxLength` and `showCounter: true`, rendering the `"n/max"` counter
 * in the footer's right slot — no spaces, unlike `TextField`'s `"n / max"`.
 * The counter shares the helper's color, so it turns red together with the
 * border in `ErrorState`.
 */
export const WithCounter: TStory = {
  args: { value: 'Cuéntanos qué salió mal.', maxLength: 200, showCounter: true },
};

/** Both footer slots at once — `showHelper` and `showCounter` toggle independently, so either can be off without leaving a gap. */
export const WithHelperAndCounter: TStory = {
  args: {
    value: 'Describe el problema.',
    helperText: 'Sé lo más específico posible.',
    maxLength: 500,
    showHelper: true,
    showCounter: true,
  },
};

/** Grows past its three-row starting height as the content wraps onto more lines. */
export const GrowsWithContent: TStory = {
  args: {
    value:
      'Este campo empieza con tres líneas visibles, pero no tiene un alto fijo: ' +
      'a medida que el contenido crece hacia abajo, el campo crece con él, ' +
      'línea por línea, sin recortar ni mostrar una barra de scroll interna.',
  },
};

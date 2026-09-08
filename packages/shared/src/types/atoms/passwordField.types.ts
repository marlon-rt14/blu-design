/**
 * Physical size of the PasswordField.
 *
 * Heights are 32 / 44 / 56 — the same ramp as the TextField. Note the names
 * follow Figma (`sm | md | lg`), unlike `TTextFieldSize`, which spells them out.
 *
 * `sm` is the odd one: the label never floats there (see
 * {@link IPasswordFieldBaseProps.label}), and its height comes from
 * `size/control/height/sm` because `size/field/height` only starts at `md`.
 */
export type TPasswordFieldSize = 'sm' | 'md' | 'lg';

/**
 * Visual state the PasswordField resolves its colours for.
 *
 * Mirrors the `state` axis of the bDS Figma component. It is **internal**: the
 * component derives it from the props and from real interaction.
 *
 * Note the component's written description lists a `pressed` state that the
 * property does not have, and omits `readonly`, which it does. The property
 * wins — this union matches the seven options Figma actually ships.
 */
export type TPasswordFieldState =
  | 'default'
  | 'hover'
  | 'filled'
  | 'focus'
  | 'error'
  | 'disabled'
  | 'readonly';

/**
 * Whether the value is shown in clear or masked. Mirrors Figma's `visibility`
 * axis, and keys {@link PASSWORD_FIELD_ACTION_LABEL}.
 */
export type TPasswordFieldVisibility = 'visible' | 'hidden';

/**
 * Label of the reveal action, by visibility.
 *
 * **Not configurable, by design.** bDS is explicit that the action's text is
 * determined by the state and never by the caller: an inverted label
 * ("Mostrar" while the value is already visible) breaks the button's accessible
 * name. Exported so both platforms render the same string.
 */
export const PASSWORD_FIELD_ACTION_LABEL: Record<TPasswordFieldVisibility, string> = {
  /** Shown while the value is masked — pressing it reveals. */
  hidden: 'Mostrar',
  /** Shown while the value is in clear — pressing it masks. */
  visible: 'Ocultar',
};

/**
 * Platform-agnostic contract for the PasswordField.
 *
 * A password input whose value is revealed by a **text action**, not an eye
 * icon. The action is a LinkButton, and it only renders once there is something
 * to reveal.
 *
 * It deliberately leaves out event handlers: each platform adds its own when
 * extending this interface (`onChange` on web, `onChangeText` on mobile).
 */
export interface IPasswordFieldBaseProps {
  /**
   * The password. Always the real value — the masking is visual only, done by
   * the platform's own secure input, never by substituting characters here.
   */
  value: string;
  /**
   * Text that labels the field.
   *
   * Acts as the placeholder while there is no value, and floats above the value
   * once there is one — except at `size='sm'`, where it never floats and a
   * filled field shows the value alone.
   */
  label?: string;
  /** Guidance below the field. Rendered only when `showHelper` is `true`. */
  helperText?: string;
  /** Replaces `helperText` and puts the field in its error state. */
  errorMessage?: string;
  /**
   * Whether the helper slot renders at all — independent of `helperText` or
   * `errorMessage` being set.
   *
   * @defaultValue `true`
   *
   * Every `show*` prop in the system defaults to `true`: in Figma these are
   * boolean properties whose slots are drawn, and hiding one is the deliberate
   * choice. Set it to `false` to reclaim the vertical space when the field
   * carries no helper and no error.
   */
  showHelper?: boolean;
  /**
   * Puts the field in its error state without an accompanying message.
   *
   * @defaultValue `false`
   */
  isInvalid?: boolean;
  /**
   * Physical size of the field.
   *
   * Figma's own default is `sm`; this defaults to `md` instead, to line up with
   * the TextField a form will usually put next to it.
   *
   * @defaultValue `'md'`
   */
  size?: TPasswordFieldSize;
  /**
   * Blocks interaction and applies the disabled styling.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Shows the value but prevents editing.
   *
   * @defaultValue `false`
   */
  isReadOnly?: boolean;
  /**
   * Whether the value is revealed. Named after Figma's own `visibility` axis.
   *
   * Drives the input's type — `text` when `'visible'`, `password` when
   * `'hidden'` — and the reveal action's label.
   *
   * **How it behaves depends on {@link onVisibilityChange}:**
   *
   * - *With* the handler, this prop is the single source of truth. The reveal
   *   action calls the handler and changes nothing by itself, so the caller must
   *   feed the new value back — the same contract as a controlled `<input>`.
   * - *Without* it, the component owns the state and the action toggles it
   *   directly. This prop still seeds it, and a **new** value overrides whatever
   *   the action last set; passing the same value twice does nothing.
   *
   * Either way the action's label follows what is on screen, never this prop
   * alone, so it can never say "Mostrar" over a password that is already
   * visible.
   *
   * @defaultValue `'hidden'`
   */
  visibility?: TPasswordFieldVisibility;
  /**
   * Called with the next visibility when the reveal action is pressed.
   *
   * **Providing it makes the field controlled**: the action stops updating the
   * component's own state, so nothing changes on screen until
   * {@link visibility} comes back with the new value. Omit it and the field
   * manages itself.
   *
   * This lives in the shared contract rather than in each platform's props —
   * unlike the value handlers — because its signature is identical on both:
   * there is no DOM event involved, just the next state.
   */
  onVisibilityChange?: (visibility: TPasswordFieldVisibility) => void;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile.
   */
  testID?: string;
}

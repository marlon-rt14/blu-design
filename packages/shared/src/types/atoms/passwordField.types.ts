import type { TProgressStatus } from './progressBar.types';

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
 * How strong the password is, as bDS draws it: four levels and no number.
 *
 * **The component does not judge; it draws what it is told.** And that is more
 * than a design decision — bDS registers it as open: *"no hay regla escrita de
 * qué cuenta como weak, acceptable, good o strong. El componente dibuja cuatro
 * niveles y quien implemente va a inventar el criterio. Sin esto los cuatro
 * niveles son decorativos."* Owning the criterion is the caller's job, and
 * whoever writes it should write it down.
 */
export type TPasswordStrength = 'weak' | 'acceptable' | 'good' | 'strong';

/** One line of the requirements list. */
export interface IPasswordRequirement {
  /** What is being asked — *"12 caracteres de largo"*. */
  label: string;
  /**
   * Whether it is satisfied.
   *
   * **Figma has three states and this has two.** `RequirementItem` ships
   * `pending · met · failed`, and the signature collapses them to a boolean, so
   * a rule that was *tried and broken* reads the same as one not yet attempted.
   * The tokens for the third exist —`requirement/icon-failed`,
   * `requirement/text-failed`— and nothing here can reach them.
   */
  met: boolean;
}

/**
 * The four strength words.
 *
 * **System strings, not props**, which bDS states outright: *"son cadenas del
 * sistema y su lugar es el catálogo de traducción"*. In Figma they are four
 * TEXT properties of the nested `PasswordStrength`, and the contract's first
 * divergence is precisely that they should not travel as props of the field.
 * Until this repo has an i18n catalogue they live here, next to
 * {@link PASSWORD_FIELD_ACTION_LABEL}.
 *
 * Written with their accents, unlike the Figma file, which drops them
 * throughout.
 */
export const PASSWORD_STRENGTH_LABEL: Record<TPasswordStrength, string> = {
  weak: 'Débil',
  acceptable: 'Media',
  good: 'Fuerte',
  strong: 'Muy fuerte',
};

/**
 * How full the meter is at each level — **25 · 50 · 75 · 100**.
 *
 * Measured on `PasswordStrength`'s four variants rather than assumed: the fill
 * is 85, 170, 255 and 340 wide in a 340 track. The bar itself is a ProgressBar
 * instance in Figma, and it is one here too.
 */
export const PASSWORD_STRENGTH_VALUE: Record<TPasswordStrength, number> = {
  weak: 25,
  acceptable: 50,
  good: 75,
  strong: 100,
};

/**
 * Which `ProgressBar` status draws each level.
 *
 * Not a palette choice: the fills measured on `PasswordStrength` **are** the
 * ProgressBar's own co-tokens — `#b22c42` is `fill/danger`, `#8c5a00` is
 * `fill/warning`, `#364481` is `fill/brand` and `#008557` is `fill/success`.
 */
export const PASSWORD_STRENGTH_STATUS = {
  weak: 'danger',
  acceptable: 'warning',
  good: 'brand',
  strong: 'success',
} as const satisfies Record<TPasswordStrength, TProgressStatus>;

/**
 * The requirements list's heading.
 *
 * A system string for the same reason the strength words are, and **not
 * optional**: in Figma `showLabel` is frozen to `true` because *"una lista de
 * requisitos sin encabezado no se entiende"*.
 */
export const PASSWORD_REQUIREMENTS_TITLE = 'Su contraseña debe tener al menos:';

/**
 * Platform-agnostic contract for the PasswordField.
 *
 * A password input whose value is revealed by a **text action**, not an eye
 * icon — and revealing is *"una función de accesibilidad, no un descuido"*:
 * with a screen reader it is the only way to check what was typed.
 *
 * It is the largest component in the file, 288 variants, and the one with the
 * most nested pieces: a LinkButton, an Icon and three of its own —
 * `PasswordStrength`, `PasswordRequirements` and `RequirementItem`. **Of all
 * that, three data points reach code**: the strength level, the list of
 * requirements and whether each one is met.
 *
 * ### Three rules that are not about drawing
 *
 * - **Never block paste.** *"Obliga a contraseñas memorizables, que son peores:
 *   la seguridad no mejora, empeora."*
 * - **Never break the password manager.** Both platforms ask for autofill, and
 *   turning it off means people type by hand.
 * - **The requirements list announces what is met**, it does not just paint it
 *   green: *"el color no informa solo"*.
 *
 * @example
 * ```tsx
 * <PasswordField
 *   label="Contraseña"
 *   onChangeText={setPassword}
 *   requirements={[
 *     { label: '12 caracteres de largo', met: password.length >= 12 },
 *     { label: 'Al menos una mayúscula', met: /[A-Z]/.test(password) },
 *   ]}
 *   strength={score}
 *   value={password}
 * />
 * ```
 */
export interface IPasswordFieldBaseProps {
  /**
   * Text that labels the field. **Required**, unlike before: it is the field's
   * accessible name.
   *
   * Acts as the placeholder while there is no value, and floats above the value
   * once there is one — except at `size='sm'`, where it never floats and a
   * filled field shows the value alone.
   */
  label: string;
  /**
   * The password. Always the real value — the masking is visual only, done by
   * the platform's own secure input, never by substituting characters here.
   */
  value: string;
  /** Called with the new value on every keystroke. */
  onChangeText: (value: string) => void;
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
   * Whether the value is revealed.
   *
   * Drives the input's type and the action's label. **How it behaves depends on
   * {@link IPasswordFieldBaseProps.onToggleVisible}:**
   *
   * - *With* the handler, this prop is the single source of truth. The action
   *   calls the handler and changes nothing by itself, so the caller must feed
   *   the new value back — the same contract as a controlled `<input>`.
   * - *Without* it, the component owns the state and the action toggles it
   *   directly. This prop still seeds it, and a **new** value overrides
   *   whatever the action last set.
   *
   * bDS leaves this undecided — *"falta decidir si el componente lo maneja solo
   * o si lo recibe de afuera"* — and answering "both" costs nothing and closes
   * it for the caller.
   *
   * Either way the action's label follows what is on screen, never this prop
   * alone, so it can never say "Mostrar" over a password already in clear.
   *
   * @defaultValue `false`
   */
  visible?: boolean;
  /**
   * Called when the reveal action is pressed. **Providing it makes the field
   * controlled** — see {@link IPasswordFieldBaseProps.visible}.
   *
   * It takes no argument, matching the signature bDS wrote: the caller flips
   * its own flag.
   */
  onToggleVisible?: () => void;
  /** Guidance below the field. Its presence renders the helper line. */
  helperText?: string;
  /**
   * The error message. **Its presence puts the field in the error state** —
   * there is no separate `isInvalid`, because *"el error lo comunica el
   * mensaje, no el color"* and a red field with nothing to read is exactly what
   * that forbids.
   */
  error?: string;
  /**
   * How strong the password is. **Its presence draws the meter**; leave it out
   * and there is none.
   *
   * The word is the information and the bar is decoration: the four labels come
   * from {@link PASSWORD_STRENGTH_LABEL} and are not props.
   */
  strength?: TPasswordStrength;
  /**
   * What the password has to satisfy. **Its presence draws the list**, under
   * the heading in {@link PASSWORD_REQUIREMENTS_TITLE}.
   *
   * bDS's rule for it is about timing rather than looks: *"mostrá qué se pide
   * mientras escribe, no después de fallar"*.
   */
  requirements?: readonly IPasswordRequirement[];
  /**
   * Shows the value but prevents editing.
   *
   * @defaultValue `false`
   */
  readOnly?: boolean;
  /**
   * Blocks interaction and applies the disabled styling.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile.
   */
  testID?: string;
}

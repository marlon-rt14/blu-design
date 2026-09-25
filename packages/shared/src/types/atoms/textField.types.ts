import type { ReactNode } from 'react';

/**
 * Physical size of a TextField.
 *
 * Not three scales of the same anatomy — `sm` (32px) is a single-line field
 * where `label` only ever acts as a placeholder; `md` (44px) and `lg` (56px)
 * additionally float `label` above the value once there is one. Border radius
 * and horizontal padding are the same at every size (see `textFieldTokens` in
 * `@dsm/shared`) — only height, vertical padding and the floating-label
 * behaviour change.
 *
 * The names are the contract's, and they are the ones every other field in the
 * file uses. In Figma the axis reads largest to smallest; the code order here
 * is the one the contract fixes.
 */
export type TTextFieldSize = 'sm' | 'md' | 'lg';

/** The `"n / max"` counter below the field. Its presence renders the counter. */
export interface ITextFieldCounter {
  /** Characters typed so far. */
  current: number;
  /** The ceiling the counter reads against. */
  max: number;
}

/**
 * Platform-agnostic contract for the TextField — **the pattern every field in
 * the file follows**, which is why this one is worth reading before the others.
 *
 * ### Nothing here is a visibility boolean
 *
 * Figma has six of them (`showLeadingIcon`, `showLeadingText`,
 * `showTrailingIcon`, `showTrailingText`, `showHelper`, `showCounter`) and none
 * survive: *"la presencia del nombre sustituye al booleano"*. They exist in the
 * design file because a master has to be able to draw the slot empty; in code
 * a slot with nothing in it is simply not rendered.
 *
 * The same logic retires two more axes. `isFilled` is **not** a prop — it is
 * derived from `value` having content, and *"prender isFilled en Figma con el
 * campo vacío describe algo que en código es imposible"*. And `validation`
 * becomes {@link ITextFieldBaseProps.error}: if there is a message, the field
 * is in error. There is no `isInvalid`, because *"el error lo comunica el
 * mensaje, no el color"* — a red field with nothing to read is exactly what
 * that forbids.
 *
 * ### What the platforms add
 *
 * Only what the platform actually owns: the keyboard (`type`/`inputMode` on
 * web, `keyboardType` on mobile) and autofill. Neither is a design decision —
 * *"un campo de monto con teclado alfabético es un error de implementación, no
 * de diseño"* — so neither is in this contract. Focus and hover are tracked
 * internally by each implementation, never passed in.
 *
 * @example
 * ```tsx
 * <TextField
 *   label="Correo"
 *   leadingIcon={<IconSearchMd size="sm" />}
 *   onChangeText={setEmail}
 *   value={email}
 * />
 * ```
 */
export interface ITextFieldBaseProps {
  /**
   * Text that labels the field. **Required**: it is the field's accessible
   * name.
   *
   * Acts as the placeholder while there is no value and floats to the edge of
   * the field once there is one — except at `size='sm'`, where it never
   * floats. *"No es un placeholder que desaparece: un placeholder que
   * desaparece deja al campo sin nombre."*
   */
  label: string;
  /** Current value. Controlled — the component never manages its own state. */
  value: string;
  /** Called with the new value on every keystroke. */
  onChangeText: (value: string) => void;
  /**
   * Physical size of the field.
   *
   * @defaultValue `'md'`
   */
  size?: TTextFieldSize;
  /**
   * Hint shown in the value's place while the field is empty **and** the label
   * has floated — so only where a label can float, never at `size='sm'`.
   *
   * **Does not exist in Figma**, and the contract says so outright: there the
   * placeholder and the value are the same text node, which is also why the
   * file cannot draw an empty field in error or disabled. It is one of the two
   * divergences every field in the file shares, the other being
   * {@link ITextFieldBaseProps.onChangeText}.
   */
  placeholder?: string;
  /**
   * Glyph before the value. Its presence turns the slot on.
   *
   * **A node, not a name**, and with no default: Figma's InstanceSwap
   * defaulted to `icon/search` and that went with the names. Size it to the
   * field — `sm` and `md` bind `size/icon/sm` (16), `lg` binds `size/icon/md`
   * (24).
   *
   * **Does not coexist with {@link ITextFieldBaseProps.leadingText}.** The
   * contract leaves open that this ought to be a union rather than two
   * optionals, assigned to the Tech Lead — *"se resuelve con el tipo, no con
   * una regla escrita"*. Until it is, passing both is a caller error the
   * compiler will not catch.
   */
  leadingIcon?: ReactNode;
  /**
   * Text before the value — a symbol or a prefix: `$`, `+593`. Its presence
   * turns the slot on, and it does not coexist with
   * {@link ITextFieldBaseProps.leadingIcon}.
   */
  leadingText?: string;
  /** Glyph after the value. Same contract as {@link ITextFieldBaseProps.leadingIcon}. */
  trailingIcon?: ReactNode;
  /** Text after the value — a unit: `USD`, `kg`. Its presence turns the slot on. */
  trailingText?: string;
  /** Guidance below the field. Its presence renders the helper line. */
  helperText?: string;
  /**
   * The error message. **Its presence puts the field in the error state**, and
   * the message is not optional: it is what communicates the error, since the
   * colour cannot do it alone. Replaces `helperText` while set.
   */
  error?: string;
  /**
   * The character count below the field. **Its presence renders the counter**,
   * and the component formats it — `"12 / 50"`.
   *
   * Two numbers rather than Figma's free text, which is a divergence the
   * contract asks to be signed rather than mapped: *"el counter en Figma es un
   * texto libre… o el exporter va a intentar mapear una cadena"*.
   */
  counter?: ITextFieldCounter;
  /**
   * Shows the value but blocks editing. Unlike
   * {@link ITextFieldBaseProps.disabled} the value stays fully legible — for
   * data the user may see but not change through this control.
   *
   * @defaultValue `false`
   */
  readOnly?: boolean;
  /**
   * Blocks interaction and applies the disabled styling.
   * {@link ITextFieldBaseProps.onChangeText} is not called while this is set.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the
   * native `testID` on mobile, so the same selector works in both suites.
   */
  testID?: string;
}

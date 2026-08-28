import type { ITextAreaBaseProps } from '@dsm/shared';
import type { ChangeEventHandler, FocusEventHandler } from 'react';

/**
 * Props of the web TextArea.
 *
 * Extends the shared {@link ITextAreaBaseProps} contract with the
 * web-specific bits: DOM event handlers, the native `name` attribute, and
 * `rows` — the field's starting height before it grows with content (Figma:
 * "minHeight = size/field/height/md (44) es el piso, no la altura; en
 * código la altura inicial la fija rows").
 */
export interface ITextAreaProps extends ITextAreaBaseProps {
  /** Called on every keystroke, like any controlled `<textarea>`. */
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  /**
   * Visible row count before the field grows with content. Maps to the
   * native `rows` attribute. Defaults to one — Figma's own empty/`focus`
   * frame is exactly one line tall, matching `minHeight`; raise it for a
   * field that should start pre-expanded (e.g. a long-form comment box).
   *
   * @defaultValue `1`
   */
  rows?: number;
  /** Maps to the native `name` attribute, for uncontrolled form submission. */
  name?: string;
}

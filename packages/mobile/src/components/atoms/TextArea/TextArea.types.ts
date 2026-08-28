import type { ITextAreaBaseProps } from '@dsm/shared';

/**
 * Props of the React Native TextArea.
 *
 * Extends the shared {@link ITextAreaBaseProps} contract with the
 * mobile-specific bits: `TextInput` handlers and `numberOfLines`, used to
 * compute the field's starting height — `TextInput` has no attribute
 * equivalent to web's `rows`, so `useTextArea` derives it from the typography
 * token's line height instead.
 */
export interface ITextAreaProps extends ITextAreaBaseProps {
  /** Called on every keystroke, with the new text — `TextInput`'s convention. */
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /**
   * Visible line count before the field grows with content. Defaults to
   * one — Figma's own empty/`focus` frame is exactly one line tall,
   * matching `minHeight`; raise it for a field that should start
   * pre-expanded (e.g. a long-form comment box).
   *
   * @defaultValue `1`
   */
  numberOfLines?: number;
}

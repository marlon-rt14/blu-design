/**
 * Color primitives.
 *
 * These carry no semantics on their own — they are raw values named after the
 * hue and its lightness step. Meaning is assigned by the component tokens (see
 * `button.tokens.ts`), so a component never references a primitive directly.
 */
export const colors = {
  white: '#ffffff',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate700: '#334155',
  slate900: '#0f172a',
} as const;

/** Every valid key of {@link colors}. */
export type TColorName = keyof typeof colors;

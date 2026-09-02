import type { TIconName } from './icon.types';

/**
 * ChoiceBox layout. `row` (default) puts media + text + control in a line;
 * `tile` stacks them for a grid item (media/control header, then text); the
 * text-only `compact` layout drops both media and control regardless of
 * `showMedia` / `showControl`.
 */
export type TChoiceBoxVariant = 'row' | 'tile' | 'compact';

/**
 * Shared ChoiceBox contract.
 *
 * A ChoiceBox is a selectable surface tile with a title and optional description.
 * It behaves like a checkable option or choice row: selected and unselected are
 * both valid states, but it is not a standalone form field with its own input
 * label. The platform implementations add their native event handlers.
 */
export interface IChoiceBoxBaseProps {
  /** Layout variant. */
  variant?: TChoiceBoxVariant;
  /** Glyph rendered in the media slot. Hidden unless `showMedia` is true. */
  icon?: TIconName;
  /** Title displayed inside the choice box. */
  title: string;
  /** Optional supporting description below the title. */
  description?: string;
  /** Whether the choice is currently selected. */
  isSelected?: boolean;
  /** Disables interaction and applies disabled colors. */
  isDisabled?: boolean;
  /**
   * Whether the description is rendered.
   *
   * @defaultValue `true`
   */
  showDescription?: boolean;
  /**
   * Whether the media slot (`icon`) renders. Forced off when `variant='compact'`.
   *
   * @defaultValue `true`
   */
  showMedia?: boolean;
  /**
   * Whether the mirrored Checkbox control renders. Forced off when
   * `variant='compact'`. The whole surface is always the real control —
   * this only toggles the visual indicator.
   *
   * @defaultValue `true`
   */
  showControl?: boolean;
  /** Stable identifier for tests. */
  testID?: string;
}

/**
 * Visual weight of a Button.
 *
 * - `primary`: the main action of a screen or section. Use at most one per view.
 * - `secondary`: supporting actions that sit next to a primary one.
 */
export type TButtonVariant = 'primary' | 'secondary';

/**
 * Physical size of a Button. Drives padding, font size and corner radius —
 * see `buttonSizeTokens` in the tokens module.
 *
 * - `small`: dense surfaces such as toolbars or table rows.
 * - `medium`: the default, suitable for most forms and cards.
 * - `large`: prominent calls to action.
 */
export type TButtonSize = 'small' | 'medium' | 'large';

/**
 * Platform-agnostic contract for the Button.
 *
 * It deliberately leaves out event handlers: each platform adds its own when
 * extending this interface (`onClick` on web, `onPress` on mobile). Everything
 * described here behaves identically on both platforms, which is what makes it
 * safe to share stories and documentation between them.
 */
export interface IButtonBaseProps {
  /** Text rendered inside the button. Required — the Button has no icon-only mode. */
  label: string;
  /**
   * Visual weight of the button.
   *
   * @defaultValue `'primary'`
   */
  variant?: TButtonVariant;
  /**
   * Physical size of the button.
   *
   * @defaultValue `'medium'`
   */
  size?: TButtonSize;
  /**
   * Blocks interaction and applies the disabled styling. The platform handler
   * (`onClick` / `onPress`) is not called while this is `true`.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the
   * native `testID` on mobile, so the same selector works in both suites.
   */
  testID?: string;
}

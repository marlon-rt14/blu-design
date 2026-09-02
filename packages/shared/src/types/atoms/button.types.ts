/**
 * What the action *means* — one of the two independent axes of a bDS Button.
 *
 * This axis is about intent, not weight. Hierarchy is lowered with
 * {@link TButtonAppearance}, never by switching variant: a "save draft" sitting
 * next to a "publish" is `primary` + `outline` or `primary` + `soft`.
 *
 * - `primary`: the ordinary action.
 * - `danger`: destructive or irreversible.
 *
 * There is no `secondary`. bDS removed it on 2025-08-20 for being an appearance
 * disguised as a variant — `primary` + `soft` does what `secondary` + `fill`
 * used to, and `primary` + `outline` what `secondary` + `outline` did. The
 * `action/secondary` colour tokens still exist in Foundations but the Button no
 * longer consumes them.
 */
export type TButtonVariant = 'primary' | 'danger';

/**
 * How much visual weight the Button carries, heaviest to lightest.
 *
 * - `fill`: solid brand fill. The main action of a screen.
 * - `soft`: tonal fill — the brand colour at its lightest step, strong label,
 *   no border. The step between `fill` and `outline`.
 * - `outline`: border only, no fill. The border is deliberately lighter than the
 *   label so the button does not read as heavy as a fill.
 * - `ghost`: no fill and no border at rest, only a translucent wash on hover
 *   and press.
 * - `on-inverse`: not a weight but a *surface* — for a Button sitting on
 *   `color/bg/inverse`, such as inside a Snackbar. **Only valid with
 *   `variant: 'primary'`**: bDS ships no tokens for `danger` + `on-inverse`,
 *   because a destructive action does not belong on a six-second toast.
 */
export type TButtonAppearance = 'fill' | 'soft' | 'outline' | 'ghost' | 'on-inverse';

/**
 * Physical size of the Button.
 *
 * The height ramp is shared with the form fields (24 / 32 / 44 / 56), so an `lg`
 * Button and an `lg` field line up in the same row.
 *
 * - `xs` (24): dense actions inside a row or a table. **Never the main action.**
 *   At 24 it is less than half of `size/target/min` (48), so on touch it needs
 *   `hitSlop` — which `@dsm/mobile` applies for you.
 * - `sm` (32), `md` (44): the everyday sizes.
 * - `lg` (56): prominent calls to action.
 */
export type TButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Interaction state the Button resolves its colours for.
 *
 * Mirrors the `state` axis of the bDS Figma component one-to-one, which is why
 * `disabled` lives here rather than being modelled separately. It is
 * **internal**: each platform's `useButton` derives it from real interaction and
 * from {@link IButtonBaseProps.isDisabled}, because you do not *tell* a button
 * it is hovered. Precedence, highest first: `disabled`, `pressed`, `hover`,
 * `focus`.
 *
 * There is no `loading` state — it appears only in Supernova's stale written
 * documentation, not in the current Figma component set.
 */
export type TButtonState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

/**
 * Platform-agnostic contract for the Button.
 *
 * It deliberately leaves out event handlers: each platform adds its own when
 * extending this interface (`onClick` on web, `onPress` on mobile).
 *
 * The icon slots are declared per platform rather than here, for the same
 * reason the handlers are: a web icon is a component returning DOM and a native
 * one returns react-native-svg elements. See each package's `IButtonProps`.
 *
 * **`showLeadingIcon` and `showTrailingIcon` do not survive into code.** Figma
 * needs a boolean because a variant cannot express "absent"; in React,
 * `leadingIcon={IconPlus}` already says both *whether* and *which*. Keeping the
 * boolean would invent a state the design has no token for — flag on, no icon.
 * Same reasoning that keeps `state` internal and exposes only `isDisabled`.
 */
export interface IButtonBaseProps {
  /** Text rendered inside the button. Required — the Button has no icon-only mode. */
  label: string;
  /**
   * What the action means.
   *
   * @defaultValue `'primary'`
   */
  variant?: TButtonVariant;
  /**
   * How much visual weight the button carries.
   *
   * `'on-inverse'` is only valid with `variant: 'primary'`; any other pairing
   * throws, because bDS defines no tokens for it.
   *
   * @defaultValue `'fill'`
   */
  appearance?: TButtonAppearance;
  /**
   * Physical size of the button.
   *
   * @defaultValue `'md'`
   */
  size?: TButtonSize;
  /**
   * Blocks interaction and applies the disabled styling. Resolves to
   * `TButtonState`'s `disabled`, and the platform handler (`onClick` /
   * `onPress`) is not called while this is `true`.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile, so the same selector works in both suites.
   */
  testID?: string;
}

/**
 * Which surface the LinkButton sits on. Each appearance consumes its own family
 * of colour tokens.
 *
 * - `default`: on the page, or inside a card.
 * - `on-inverse`: on `color/bg/inverse` — the Snackbar bar.
 * - `on-muted`: on the tenuous fill of an Alert.
 * - `on-scene`: on a scene the design system does not control — a photo, or a
 *   saturated brand background.
 *
 * Unlike the Button's `appearance`, this axis is *only* about surface: a
 * LinkButton has no weight ladder, because it has no surface of its own to
 * lighten.
 */
export type TLinkButtonAppearance = 'default' | 'on-inverse' | 'on-muted' | 'on-scene';

/**
 * Physical size of the LinkButton.
 *
 * Both sizes take their body from the link type scale, which measures the same
 * as `body`, so a link inside a paragraph does not change the line.
 *
 * - `md` (16px, 24 tall): the default.
 * - `sm` (14px, 21 tall): dense contexts.
 *
 * Note the heights are *derived* from the type, not set: the component hugs its
 * text. Both are far below `size/target/min` (48), which is why every standalone
 * LinkButton needs `hitSlop` — `@dsm/mobile` applies it for you.
 */
export type TLinkButtonSize = 'md' | 'sm';

/**
 * Interaction state the LinkButton resolves its colour for.
 *
 * Mirrors the `state` axis of the bDS Figma component one-to-one. It is
 * **internal**: each platform derives it from real interaction and from the
 * props, because you do not *tell* a link it is hovered.
 *
 * Two states are platform-specific:
 * - `hover` does not exist on a touch screen.
 * - `visited` **only exists on web**, and even there it cannot come from the
 *   browser: a LinkButton is an action, not a navigation, so it renders a
 *   `<button>` and CSS `:visited` never applies. The app has to say so.
 *
 * Unlike the rest of Core, `hover` and `pressed` are not drawn with an overlay
 * layer but by changing the text colour — a link has no surface to tint.
 */
export type TLinkButtonState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled' | 'visited';

/**
 * Platform-agnostic contract for the LinkButton.
 *
 * **A LinkButton is an action wearing a link's face.** It does not change the
 * URL: it acts on the page it is on — opens, expands, undoes. If the destination
 * is another page or an external site, this is not the component to use.
 *
 * It deliberately leaves out event handlers: each platform adds its own when
 * extending this interface (`onClick` on web, `onPress` on mobile). `underline`
 * is also left to the platforms, because its correct default differs — see
 * each package's `ILinkButtonProps`.
 *
 * Mirrors the nine design properties of the bDS Figma component minus the icon
 * slots (`showLeadingIcon`, `leadingIcon`, `showTrailingIcon`, `trailingIcon`),
 * which need the Icon component first.
 */
export interface ILinkButtonBaseProps {
  /** Text rendered inside the link. Required — there is no icon-only mode. */
  label: string;
  /**
   * Which surface the link sits on.
   *
   * @defaultValue `'default'`
   */
  appearance?: TLinkButtonAppearance;
  /**
   * Physical size of the link.
   *
   * @defaultValue `'md'`
   */
  size?: TLinkButtonSize;
  /**
   * Blocks interaction and applies the disabled styling. The platform handler
   * (`onClick` / `onPress`) is not called while this is `true`.
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

import { linkButtonTokens } from '@dsm/shared';
import type { TLinkButtonState } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ILinkButtonProps } from './LinkButton.types';

/** Params of {@link useLinkButton}: the props plus the live interaction state. */
interface IUseLinkButtonParams extends ILinkButtonProps {
  isHovered: boolean;
  isPressed: boolean;
  /**
   * Whether the link has *keyboard* focus. Clicking focuses it too, so the
   * component gates this on `:focus-visible` — a focus ring on click is noise.
   */
  isFocusVisible: boolean;
}

/** Styles and derived values the LinkButton needs to render. */
interface IUseLinkButtonResult {
  /**
   * Everything the `<button>` needs. A LinkButton is a single element, so unlike
   * `TextArea` there is no second style object — the type properties cascade to
   * the text.
   */
  linkStyle: CSSProperties;
  /** Normalized disabled flag, safe to hand straight to the DOM element. */
  isDisabled: boolean;
  /** Resolved interaction state, exposed so stories and tests can assert on it. */
  state: TLinkButtonState;
}

/**
 * Resolves every style the LinkButton needs, from the active theme
 * (`useThemeMode()`), its props and its current interaction state.
 *
 * Same shape as `@dsm/web`'s `useTextArea`: the component owns the interaction
 * state and passes it in, so this stays a pure function of theme + props +
 * state.
 *
 * Unlike every other Core component, `hover` and `pressed` here change the
 * **text colour** rather than laying an overlay over a surface — a link has no
 * surface to tint.
 *
 * @param params - The LinkButton props plus the current hover/press/focus state.
 * @returns The inline style, the normalized disabled flag and the resolved state.
 */
export const useLinkButton = ({
  appearance = 'default',
  size = 'md',
  isDisabled = false,
  isVisited = false,
  underline = true,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseLinkButtonParams): IUseLinkButtonResult => {
  const mode = useThemeMode();
  const tokens = linkButtonTokens[mode];
  const colors = tokens.colors[appearance];
  const fontFamily = useFontFamily(tokens.typography.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();

  // A visited link that is hovered shows hover, so `visited` sits below the
  // interaction states and above `default`.
  const state: TLinkButtonState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isHovered
        ? 'hover'
        : isFocusVisible
          ? 'focus'
          : isVisited
            ? 'visited'
            : 'default';

  // `focus` falls through to the default colour: the affordance is the ring.
  const color =
    state === 'disabled'
      ? colors.textDisabled
      : state === 'pressed'
        ? colors.textPressed
        : state === 'hover'
          ? colors.textHover
          : state === 'visited'
            ? colors.textVisited
            : colors.text;

  const linkStyle: CSSProperties = {
    // Strip the button chrome: this is a link's face on an action's element.
    appearance: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,

    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.dimension.gap,

    color,
    fontFamily,
    fontWeight: tokens.typography.fontWeight,
    fontSize: tokens.typography.fontSize[size],
    // A ratio, not pixels — and the reason no explicit height is set: the link
    // hugs its text, so the line box *is* the height (16 × 1.5 = 24, 14 × 1.5 = 21).
    lineHeight: tokens.typography.lineHeightRatio,
    textAlign: 'left',
    textDecoration: underline ? 'underline' : 'none',

    // The ring is drawn outside the text box with its own radius; the link
    // itself has no corners. `outline: none` stops the native ring doubling up.
    outline: 'none',
    borderRadius: tokens.dimension.focusRingRadius,
    boxShadow: isFocusVisible
      ? `0 0 0 ${tokens.dimension.focusRingSpread}px ${colors.borderFocus}`
      : undefined,
    transition: prefersReducedMotion ? 'none' : 'color 120ms ease, box-shadow 120ms ease',

    cursor: isDisabled ? 'not-allowed' : 'pointer',
  };

  return { linkStyle, isDisabled, state };
};

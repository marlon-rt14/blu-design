import { buttonTokens } from '@dsm/shared';
import type { IButtonSurfaceColorTokens, TButtonState, TIconSize, TTokensOf } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IButtonProps } from './Button.types';

/** Params of {@link useButton}: the Button props plus the live interaction state. */
interface IUseButtonParams extends IButtonProps {
  /** Whether the pointer currently sits over the button. */
  isHovered: boolean;
  /** Whether the button is currently held down. */
  isPressed: boolean;
  /**
   * Whether the button has *keyboard* focus. Clicking a button focuses it too,
   * so the component gates this on `:focus-visible` — a focus ring on click is
   * noise, unlike on a text field where focus is always deliberate.
   */
  isFocusVisible: boolean;
}

/** Styles and derived values the Button needs to render. */
interface IUseButtonResult {
  /**
   * Everything the `<button>` needs: layout, surface, label typography and the
   * focus ring. A Button is a single element, so unlike `TextArea` there is no
   * second style object for the label — the type properties cascade to the text.
   */
  buttonStyle: CSSProperties;
  /**
   * Which Icon size step to give the slots. Not the control's own size: `xs` and
   * `sm` both take 16, `md` and `lg` both take 24.
   */
  iconSize: TIconSize;
  /** Normalized disabled flag, safe to hand straight to the DOM element. */
  isDisabled: boolean;
  /** Resolved interaction state, exposed so stories and tests can assert on it. */
  state: TButtonState;
}

/**
 * Resolves the surface tokens for a `variant` + `appearance` pairing.
 *
 * Throws on `danger` + `on-inverse` rather than falling back: bDS ships no
 * tokens for that pair, so there is genuinely nothing to render, and a silent
 * fallback would be a wrong render that looks deliberate. Same philosophy as
 * `readThemeToken` in `@dsm/shared`.
 */
const readSurface = (
  colors: TTokensOf<typeof buttonTokens>['colors'],
  variant: NonNullable<IButtonProps['variant']>,
  appearance: NonNullable<IButtonProps['appearance']>,
): IButtonSurfaceColorTokens => {
  if (variant === 'primary') {
    return colors.primary[appearance];
  }
  if (appearance === 'on-inverse') {
    throw new Error(
      "Button: appearance 'on-inverse' is only defined for variant 'primary'. " +
        'bDS ships no tokens for danger on an inverted surface — a destructive action does not belong on a six-second toast.',
    );
  }
  return colors.danger[appearance];
};

/**
 * Resolves every style the Button needs, from the active theme
 * (`useThemeMode()`), its props and its current interaction state.
 *
 * Same shape as `@dsm/web`'s `useTextArea`: the component owns the interaction
 * state and passes it in, so this stays a pure function of theme + props +
 * state.
 *
 * @param params - The Button props plus the current hover/press/focus state.
 * @returns The inline style, the normalized disabled flag and the resolved state.
 */
export const useButton = ({
  variant = 'primary',
  appearance = 'fill',
  size = 'md',
  isDisabled = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseButtonParams): IUseButtonResult => {
  const mode = useThemeMode();
  const tokens = buttonTokens[mode];
  const fontFamily = useFontFamily(tokens.typography.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
  const surface = readSurface(tokens.colors, variant, appearance);

  // Precedence follows the bDS state axis: a disabled button never shows hover,
  // and a press wins over the hover it necessarily happens inside.
  const state: TButtonState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isHovered
        ? 'hover'
        : isFocusVisible
          ? 'focus'
          : 'default';

  // `focus` deliberately falls through to `background`: no `bg-focus` token
  // exists anywhere in the export, because the affordance is the ring.
  const backgroundColor =
    state === 'disabled'
      ? surface.backgroundDisabled
      : state === 'pressed'
        ? surface.backgroundPressed
        : state === 'hover'
          ? surface.backgroundHover
          : surface.background;

  // `hover` and `focus` reuse `border`: there is no `border-hover` token either.
  const borderColor =
    state === 'disabled'
      ? surface.borderDisabled
      : state === 'pressed'
        ? surface.borderPressed ?? surface.border
        : surface.border;

  const transition = prefersReducedMotion
    ? 'none'
    : 'background-color 120ms ease, border-color 120ms ease, outline-color 120ms ease';

  // `outline`, not `box-shadow`. Both draw outside the box without affecting
  // layout, but only `outline-offset` leaves the gap *transparent*: a box-shadow
  // gap has to be painted, and painting it means guessing the surface behind —
  // which shows as a halo the moment the button sits on a card, on bg/inverse or
  // on a photo. React Native supports the same four properties, so this is the
  // rare case of one mechanism covering both platforms.
  //
  // On an inverted surface the blue does not read, hence the second colour.
  const outline = isFocusVisible
    ? `${tokens.focus.spread}px solid ${appearance === 'on-inverse' ? tokens.focus.colorOnInverse : tokens.focus.color}`
    : 'none';

  const buttonStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.dimension.gap,
    height: tokens.dimension.height[size],
    minWidth: tokens.dimension.minWidth,
    paddingBlock: 0,
    paddingInline: tokens.dimension.paddingHorizontal[size],

    // `transparent` rather than omitting the properties, so switching appearance
    // never leaves a stale value from a previous render.
    backgroundColor: backgroundColor ?? 'transparent',
    borderStyle: 'solid',
    borderWidth: borderColor === undefined ? 0 : tokens.dimension.borderWidth,
    borderColor: borderColor ?? 'transparent',
    borderRadius: tokens.dimension.borderRadius,

    // The label is the button's own text node, so its colour is set here rather
    // than in a second style object. `disabled` is the only state with its own
    // label colour — every other one reuses `label`.
    color: state === 'disabled' ? surface.labelDisabled : surface.label,
    fontFamily,
    fontWeight: tokens.typography.fontWeight,
    fontSize: tokens.typography.fontSize[size],
    whiteSpace: 'nowrap',

    outline,
    outlineOffset: tokens.focus.offset,
    transition,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
  };

  return { buttonStyle, iconSize: tokens.dimension.iconSize[size], isDisabled, state };
};

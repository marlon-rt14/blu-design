import { iconButtonTokens } from '@dsm/shared';
import type { TIconButtonAppearance, TIconSize } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IIconButtonProps } from './IconButton.types';

/** Params of {@link useIconButton}: the props plus the live interaction state. */
interface IUseIconButtonParams extends IIconButtonProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

/** Styles and derived values the IconButton needs to render. */
interface IUseIconButtonResult {
  buttonStyle: CSSProperties;
  /** Step of the glyph, which follows its own ramp — see the shared tokens. */
  iconSize: TIconSize;
  isDisabled: boolean;
}

/**
 * The one appearance whose focus ring is drawn **inside** the control.
 *
 * Measured at 4x on both variants: `brand` at `state=focus` renders 54x54 for a
 * 44x44 node — 3px of ring plus a 2px gap on every side — while `on-media`
 * renders exactly 44x44, with 3px of white flush against the edge and no bleed
 * at all.
 *
 * The reason is contrast, not geometry. Outside, the ring lands on the photo
 * rather than on the veil, and it measured 1.37 against light media. Painted
 * over the veil it reaches 3.69. This is the exception to the general rule that
 * the ring goes outside and nothing may clip it.
 */
const INSET_FOCUS_RING: TIconButtonAppearance = 'on-media';

/**
 * Resolves every style the IconButton needs, from the active theme, its props
 * and its current interaction state.
 *
 * Same shape as `useButton`: the component owns the interaction state and
 * passes it in.
 *
 * @param params - The IconButton props plus the current hover/press/focus state.
 * @returns The resolved button style, the glyph size, and the normalized flag.
 */
export const useIconButton = ({
  appearance = 'brand',
  size = 'md',
  disabled = false,
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseIconButtonParams): IUseIconButtonResult => {
  const mode = useThemeMode();
  const { colors, dimension } = iconButtonTokens[mode];
  const palette = colors[appearance];
  const prefersReducedMotion = usePrefersReducedMotion();

  // Precedence: disabled wins, then pressed, then hover. Focus is not in this
  // ladder — it composes, because a button can be focused and hovered at once.
  //
  // `background` and `backgroundDisabled` are optional on purpose: `ghost` and
  // `on-inverse` have neither, and `undefined` here means transparent rather
  // than a missing token. On `veil`, `on-media` and `on-scene` the disabled
  // fill equals the resting one — the veil is the silhouette, so it survives.
  // `?? 'transparent'` is load-bearing, not defensive. `ghost` and `on-inverse`
  // have no resting fill, and leaving `backgroundColor` undefined lets the user
  // agent's own `<button>` background win — Chrome paints `buttonface`, which
  // measured `#efefef` over both a white row and a navy one.
  const backgroundColor =
    (disabled
      ? palette.backgroundDisabled
      : isPressed
        ? palette.backgroundPressed
        : isHovered
          ? palette.backgroundHover
          : palette.background) ?? 'transparent';

  const transition = prefersReducedMotion
    ? 'none'
    : 'background-color 120ms ease, outline-color 120ms ease';

  const isInsetRing = appearance === INSET_FOCUS_RING;

  return {
    buttonStyle: {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: dimension.size[size],
      height: dimension.size[size],
      padding: 0,
      borderRadius: dimension.borderRadius,
      // Only `brand` and `neutral` carry a disabled border. It gives back the
      // silhouette their flat disabled fill takes away; the veil-based
      // appearances opt out because their veil already is one.
      border:
        disabled && palette.borderDisabled
          ? `${dimension.borderWidth}px solid ${palette.borderDisabled}`
          : 'none',
      backgroundColor,
      // The glyph inherits this through `currentColor`, the same way the
      // Button's icons do. Nothing is passed down to the Icon.
      color: disabled ? palette.iconDisabled : palette.icon,
      // `outline`, not `box-shadow`: only `outline-offset` leaves the gap
      // transparent, and this button often sits on a photo or a brand surface
      // where a painted gap would be the wrong colour.
      outline: isFocusVisible
        ? `${dimension.focusRingSpread}px solid ${palette.focusRing}`
        : 'none',
      // A negative offset is what pulls the ring inside for `on-media`; see
      // INSET_FOCUS_RING. Everywhere else it sits outside, at the token's
      // distance.
      outlineOffset: isInsetRing ? -dimension.focusRingSpread : dimension.focusRingOffset,
      transition,
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
    iconSize: dimension.iconSize[size],
    isDisabled: disabled,
  };
};

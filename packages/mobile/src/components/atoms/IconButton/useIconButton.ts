import { iconButtonTokens } from '@dsm/shared';
import type { TIconButtonAppearance, TIconSize } from '@dsm/shared';
import type { Insets, StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IIconButtonProps } from './IconButton.types';

/** Params of {@link useIconButton}: the props plus the live interaction state. */
interface IUseIconButtonParams extends IIconButtonProps {
  isPressed: boolean;
  isFocused: boolean;
}

/** Styles and derived values the IconButton needs to render. */
interface IUseIconButtonResult {
  buttonStyle: StyleProp<ViewStyle>;
  /** Step of the glyph, which follows its own ramp — see the shared tokens. */
  iconSize: TIconSize;
  /**
   * Colour for the glyph, handed over explicitly.
   *
   * React Native has no cascade, so unlike web there is no `currentColor` to
   * inherit: the button resolves the colour and passes it as `tintColor`.
   */
  iconColor: string;
  /**
   * Extra touch area, or `undefined` once the control is already big enough.
   *
   * This is how the component honours `size/target/min` without moving the
   * layout — `hitSlop` grows what responds to a finger and leaves the drawing
   * where it is.
   */
  hitSlop: Insets | undefined;
  isDisabled: boolean;
}

/**
 * The one appearance whose focus ring is drawn **inside** the control.
 *
 * Measured at 4x on both Figma variants: `brand` at `state=focus` renders 54x54
 * for a 44x44 node — 3px of ring plus a 2px gap on every side — while
 * `on-media` renders exactly 44x44, with 3px of white flush against the edge
 * and no bleed at all.
 *
 * The reason is contrast. Outside, the ring lands on the photo instead of the
 * veil and measured 1.37 against light media; painted over the veil it reaches
 * 3.69. This is the exception to the rule that the ring goes outside.
 */
const INSET_FOCUS_RING: TIconButtonAppearance = 'on-media';

/**
 * Resolves every colour and metric the native IconButton needs, from the active
 * theme, its props and its current interaction state.
 *
 * Same shape as the web hook, one rung shorter: there is no hover on a touch
 * screen, and the design has no such state for native either.
 *
 * @param params - The IconButton props plus the current press/focus state.
 * @returns The resolved style, the glyph's step and colour, and the touch area.
 */
export const useIconButton = ({
  appearance = 'brand',
  size = 'md',
  disabled = false,
  isPressed,
  isFocused,
}: IUseIconButtonParams): IUseIconButtonResult => {
  const mode = useThemeMode();
  const { colors, dimension } = iconButtonTokens[mode];
  const palette = colors[appearance];
  const edge = dimension.size[size];

  // Precedence: disabled wins, then pressed. Focus is not in this ladder — it
  // composes, drawing its ring over whatever fill is underneath.
  //
  // `background` and `backgroundDisabled` are optional on purpose: `ghost` and
  // `on-inverse` have neither. On `veil`, `on-media` and `on-scene` the
  // disabled fill equals the resting one — the veil is the silhouette, so it
  // survives.
  //
  // The `?? 'transparent'` is only strictly needed on web, where leaving the
  // property out lets the user agent paint its own `<button>` background. Said
  // explicitly here too, so both platforms read the same.
  const backgroundColor =
    (disabled
      ? palette.backgroundDisabled
      : isPressed
        ? palette.backgroundPressed
        : palette.background) ?? 'transparent';

  const isInsetRing = appearance === INSET_FOCUS_RING;
  // Only the two smallest are called out by bDS, but `md` is 44 against a
  // minimum of 48, so it gets its four pixels too. `lg` needs none.
  const slop = Math.max(0, (dimension.targetMin - edge) / 2);

  return {
    buttonStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: edge,
      height: edge,
      borderRadius: dimension.borderRadius,
      backgroundColor,
      // Only `brand` and `neutral` carry a disabled border, to give back the
      // silhouette their flat disabled fill takes away. React Native draws
      // borders inside the box, so this does not resize the control.
      ...(disabled && palette.borderDisabled
        ? { borderWidth: dimension.borderWidth, borderColor: palette.borderDisabled }
        : null),
      // An `outline` rather than a wrapper View: focusing never resizes the
      // control, and the offset leaves the gap transparent instead of painting
      // a colour over a photo or a brand surface.
      ...(isFocused
        ? {
            outlineWidth: dimension.focusRingSpread,
            // Negative pulls the ring inside for `on-media`; see INSET_FOCUS_RING.
            outlineOffset: isInsetRing ? -dimension.focusRingSpread : dimension.focusRingOffset,
            outlineColor: palette.focusRing,
            outlineStyle: 'solid' as const,
          }
        : null),
    },
    iconSize: dimension.iconSize[size],
    iconColor: disabled ? palette.iconDisabled : palette.icon,
    hitSlop: slop > 0 ? { top: slop, bottom: slop, left: slop, right: slop } : undefined,
    isDisabled: disabled,
  };
};

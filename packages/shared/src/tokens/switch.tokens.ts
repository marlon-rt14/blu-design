import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import type { TSwitchSize } from '../types/atoms/switch.types';

/** Track colors, keyed by the state that drives them. */
export interface ISwitchTrackColorTokens {
  backgroundOff: string;
  backgroundOn: string;
  backgroundOnPressed: string;
  backgroundDisabled: string;
  overlayHover: string;
  overlayHoverOn: string;
  overlayPressed: string;
  borderFocus: string;
  borderDisabled: string;
}

/** Thumb fill + the disabled border (there is no `thumb.bg-disabled` co-token). */
export interface ISwitchThumbColorTokens {
  background: string;
  borderDisabled: string;
}

/** Optional ON/OFF word inside the track. Off/on are distinct — on sits on the brand fill. */
export interface ISwitchLabelColorTokens {
  off: string;
  on: string;
  disabled: string;
}

/** Every color a Switch needs, resolved for a single theme. */
export interface ISwitchColorTokens {
  track: ISwitchTrackColorTokens;
  thumb: ISwitchThumbColorTokens;
  label: ISwitchLabelColorTokens;
}

/**
 * Metrics that vary by `TSwitchSize`. Track width is composed:
 * `2 × thumbSize + 2 × inset` — do not hardcode 40 / 56.
 */
export interface ISwitchSizeTokens {
  /** Thumb diameter = `dimension.size.icon.{sm|md}`. */
  thumbSize: number;
  /**
   * Standalone row floor. Live Figma, not the 48pt HIG copy: sm is
   * `control.height.sm` (32); md is `target.min` (48). Width is the track.
   */
  minHeight: number;
}

/** Metrics shared by every size. */
export interface ISwitchDimensionTokens {
  /** Track padding around the thumb — `space.inset.xs`. */
  inset: number;
  borderRadius: number;
  borderWidth: number;
  focusRingOffset: number;
  focusRingSpread: number;
}

/** Every token a Switch needs, resolved for a single theme. */
export interface ISwitchTokens {
  colors: ISwitchColorTokens;
  sizes: Record<TSwitchSize, ISwitchSizeTokens>;
  dimension: ISwitchDimensionTokens;
  /** Overline 11 / ExtraBold used by `showStateLabel`. */
  typography: IThemeTypographyValue;
  /**
   * Overline tracking, composed from `font.letter-spacing.wider` (8% of
   * the font size — the primitive is a percentage mis-typed as px).
   */
  letterSpacing: number;
}

const readSwitchTokens = (key: TThemeSourceKey): ISwitchTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.switch.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const fontSize = dimensionAt('font.size.overline');

  return {
    colors: {
      track: {
        backgroundOff: colorAt('track.bg-off'),
        backgroundOn: colorAt('track.bg-on'),
        backgroundOnPressed: colorAt('track.bg-on-pressed'),
        backgroundDisabled: colorAt('track.bg-disabled'),
        overlayHover: colorAt('track.overlay-hover'),
        overlayHoverOn: colorAt('track.overlay-hover-on'),
        // No `track.overlay-pressed` co-token. Figma's pressed-off wash is
        // `color/overlay/state/pressed` — same primitive switchitem aliases.
        overlayPressed: readThemeToken(color, 'color.color.overlay.state.pressed'),
        borderFocus: colorAt('track.border-focus'),
        borderDisabled: colorAt('track.border-disabled'),
      },
      thumb: {
        background: colorAt('thumb.bg-default'),
        borderDisabled: colorAt('thumb.border-disabled'),
      },
      label: {
        off: colorAt('label.text-off'),
        on: colorAt('label.text-on'),
        disabled: colorAt('label.text-disabled'),
      },
    },
    sizes: {
      sm: {
        thumbSize: dimensionAt('size.icon.sm'),
        minHeight: dimensionAt('size.control.height.sm'),
      },
      md: {
        thumbSize: dimensionAt('size.icon.md'),
        minHeight: dimensionAt('size.target.min'),
      },
    },
    dimension: {
      inset: dimensionAt('space.inset.xs'),
      borderRadius: dimensionAt('radius.pill'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
    },
    typography: {
      fontWeight: String(dimensionAt('font.weight.extrabold')),
      fontSize,
      lineHeight: fontSize * (dimensionAt('font.line-height.snug') / 100),
      fontFamily: baseFontFamily,
    },
    // `font.letter-spacing.wider` is `"8px"` meaning 8% of the body, same
    // class of primitive as `font.line-height.*`. 11 × 0.08 = 0.88, which
    // is Figma's overline tracking.
    letterSpacing: fontSize * (dimensionAt('font.letter-spacing.wider') / 100),
  };
};

/**
 * Switch tokens, keyed by theme mode.
 *
 * Source: `color.component.switch.*` and `dimension.*` in `theme/base`
 * (light) and `theme/dark`. Typography is composed from `dimension.font.*`
 * primitives. Both platforms pick the right entry at render time via
 * `useThemeMode()`.
 */
export const switchTokens = fromThemeSources(readSwitchTokens);

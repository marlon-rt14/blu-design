import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TAvatarSize, TAvatarTone } from '../types/atoms/avatar.types';
import type { TAvatarStatus } from '../types/atoms/avatarIndicator.types';
import { baseFontFamily } from './theme.tokens';

export interface IAvatarToneColorTokens {
  background: string;
  text: string;
  icon: string;
}

export interface IAvatarColorTokens {
  tones: Record<TAvatarTone, IAvatarToneColorTokens>;
  ring: string;
  indicatorDot: Record<TAvatarStatus, string>;
  /** Fill of the AvatarGroup's "+N" tile — neutral, not tied to any tone. */
  overflowBackground: string;
  /** Ring stroke of the "+N" tile — same surface color as `ring`. */
  overflowBorder: string;
  overflowText: string;
}

export interface IAvatarSizeDimensionTokens {
  diameter: number;
  glyphSize: number;
  indicatorSize: number;
  logoSize: number;
  /** Negative — the amount an AvatarGroup shifts each avatar over the previous one. */
  overlap: number;
}

export interface IAvatarDimensionTokens {
  sizes: Record<TAvatarSize, IAvatarSizeDimensionTokens>;
  /** Inset stroke width for `showRing` and for the ring around the status dot. */
  ringWidth: number;
  initialsFontWeight: string;
  initialsFontFamily: string;
  /** Initials font size per Avatar size — no dedicated token exists, picked from the generic type scale. */
  initialsFontSize: Record<TAvatarSize, number>;
}

export interface IAvatarTokens {
  colors: IAvatarColorTokens;
  dimension: IAvatarDimensionTokens;
}

const TONES: readonly TAvatarTone[] = [
  'brand',
  'sky',
  'teal',
  'green',
  'lime',
  'amber',
  'orange',
  'pink',
  'violet',
];

const SIZES: readonly TAvatarSize[] = ['xs', 'sm', 'md', 'lg'];

const readAvatarTokens = (key: TThemeSourceKey): IAvatarTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.avatar.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const tones = Object.fromEntries(
    TONES.map((tone) => [
      tone,
      {
        background: colorAt(`bg-${tone}`),
        text: colorAt(`text-${tone}`),
        icon: colorAt(`icon-${tone}`),
      },
    ]),
  ) as Record<TAvatarTone, IAvatarToneColorTokens>;

  const sizes = Object.fromEntries(
    SIZES.map((size) => [
      size,
      {
        diameter: dimensionAt(`component.avatar.size.${size}`),
        glyphSize: dimensionAt(`component.avatar.size.glyph.${size}`),
        indicatorSize: dimensionAt(`component.avatar.size.indicator.${size}`),
        logoSize: dimensionAt(`component.avatar.size.logo.${size}`),
        overlap: dimensionAt(`component.avatar.size.overlap.${size}`),
      },
    ]),
  ) as Record<TAvatarSize, IAvatarSizeDimensionTokens>;

  return {
    colors: {
      tones,
      ring: colorAt('ring'),
      indicatorDot: {
        online: colorAt('indicator-dot-success'),
        away: colorAt('indicator-dot-warning'),
        busy: colorAt('indicator-dot-danger'),
        // No dedicated "offline" dot token in the export — this is the only
        // other neutral color in the avatar group, reused for that status.
        offline: colorAt('bg-offline'),
      },
      overflowBackground: colorAt('bg-neutral'),
      overflowBorder: colorAt('overflow-border'),
      overflowText: colorAt('overflow-text'),
    },
    dimension: {
      sizes,
      ringWidth: dimensionAt('border.width.indicator'),
      initialsFontWeight: String(dimensionAt('font.weight.semibold')),
      initialsFontFamily: baseFontFamily,
      initialsFontSize: {
        xs: dimensionAt('font.size.caption.md'),
        sm: dimensionAt('font.size.label.md'),
        md: dimensionAt('font.size.title.md'),
        lg: dimensionAt('font.size.heading.md'),
      },
    },
  };
};

export const avatarTokens = fromThemeSources(readAvatarTokens);

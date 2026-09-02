import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import type { TAlertPlacement, TAlertTone } from '../types/atoms/alert.types';

/** Surface + chip fills for one tone. */
export interface IAlertToneColorTokens {
  surface: string;
  chip: string;
}

/** IconButton `veil` colours used by the local dismiss control. */
export interface IAlertDismissColorTokens {
  background: string;
  backgroundHover: string;
  backgroundPressed: string;
}

export interface IAlertColorTokens {
  tones: Record<TAlertTone, IAlertToneColorTokens>;
  /** Title and body share `color/text/primary` — the chip carries the tone. */
  text: string;
  dismiss: IAlertDismissColorTokens;
  borderFocus: string;
}

/**
 * Metrics that vary by `TAlertPlacement`. Type is `text/body/{md,sm}`
 * composed from primitives — do **not** read `typography.component.alert`
 * (`700 14px/17px`); live Figma is ExtraBold/Regular at 150% leading.
 */
export interface IAlertPlacementTokens {
  padding: number;
  gap: number;
  borderRadius: number;
  title: IThemeTypographyValue;
  body: IThemeTypographyValue;
}

export interface IAlertDimensionTokens {
  chipSize: number;
  iconSize: number;
  actionPaddingTop: number;
  dismissSize: number;
  targetMin: number;
  pillRadius: number;
  focusRingOffset: number;
  focusRingSpread: number;
}

export interface IAlertTokens {
  colors: IAlertColorTokens;
  placements: Record<TAlertPlacement, IAlertPlacementTokens>;
  dimension: IAlertDimensionTokens;
}

const readAlertTokens = (mode: TThemeMode): IAlertTokens => {
  const { color, dimension } = themeSources[mode];
  const fillAt = (path: string): string => readThemeToken(color, `color.color.fill.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const composedTypographyAt = (sizePath: string, weightPath: string): IThemeTypographyValue => {
    const fontSize = dimensionAt(sizePath);
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt('font.line-height.normal') / 100),
      fontFamily: baseFontFamily,
    };
  };

  const bodyMd = composedTypographyAt('font.size.body.md', 'font.weight.regular');
  const titleMd = composedTypographyAt('font.size.body.md', 'font.weight.extrabold');
  const bodySm = composedTypographyAt('font.size.body.sm', 'font.weight.regular');
  const titleSm = composedTypographyAt('font.size.body.sm', 'font.weight.extrabold');

  // `color.component.alert.*` is not in the theme export. Figma aliases
  // `color/bg/{tone}/muted` (JSON: `fill.{tone}.muted`) and
  // `color/bg/{tone}/default` (`fill.{tone}.default`). Neutral chip is
  // `canvas/surface/inverse`, not a fill.default — that co-token does not exist.
  return {
    colors: {
      tones: {
        danger: { surface: fillAt('danger.muted'), chip: fillAt('danger.default') },
        warning: { surface: fillAt('warning.muted'), chip: fillAt('warning.default') },
        success: { surface: fillAt('success.muted'), chip: fillAt('success.default') },
        info: { surface: fillAt('info.muted'), chip: fillAt('info.default') },
        neutral: {
          surface: fillAt('neutral.muted'),
          chip: readThemeToken(color, 'color.color.canvas.surface.inverse'),
        },
      },
      text: readThemeToken(color, 'color.color.text.primary'),
      dismiss: {
        background: fillAt('action.veil.default'),
        backgroundHover: fillAt('action.veil.hover'),
        backgroundPressed: fillAt('action.veil.pressed'),
      },
      borderFocus: readThemeToken(color, 'color.color.border.focus'),
    },
    placements: {
      page: {
        padding: dimensionAt('space.inset.lg'),
        gap: dimensionAt('space.inline.md'),
        borderRadius: dimensionAt('radius.surface.md'),
        title: titleMd,
        body: bodyMd,
      },
      section: {
        padding: dimensionAt('space.inset.lg'),
        gap: dimensionAt('space.inline.md'),
        borderRadius: dimensionAt('radius.surface.md'),
        title: titleSm,
        body: bodySm,
      },
      inline: {
        padding: dimensionAt('space.inset.md'),
        gap: dimensionAt('space.inline.sm'),
        borderRadius: dimensionAt('radius.surface.sm'),
        title: titleSm,
        body: bodySm,
      },
    },
    dimension: {
      chipSize: dimensionAt('size.icon.md'),
      iconSize: dimensionAt('size.icon.sm'),
      actionPaddingTop: dimensionAt('space.inset.sm'),
      dismissSize: dimensionAt('size.icon.md'),
      targetMin: dimensionAt('size.target.min'),
      pillRadius: dimensionAt('radius.pill'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
    },
  };
};

export const alertTokens: Record<TThemeMode, IAlertTokens> = {
  light: readAlertTokens('light'),
  dark: readAlertTokens('dark'),
};

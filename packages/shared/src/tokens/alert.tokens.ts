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
  backgroundDefault: string;
  backgroundHover: string;
  backgroundPressed: string;
  icon: string;
  borderFocus: string;
}

export interface IAlertColorTokens {
  tones: Record<TAlertTone, IAlertToneColorTokens>;
  /** `component/alert/content/title` — aliases `color/text/primary`. */
  title: string;
  /** `component/alert/content/body` — aliases `color/text/primary`. */
  body: string;
  dismiss: IAlertDismissColorTokens;
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
  pillRadius: number;
  actionPaddingTop: number;
  actionGap: number;
  dismissSize: number;
  targetMin: number;
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
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
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

  return {
    colors: {
      tones: {
        danger: {
          surface: colorAt('component.alert.surface.bg-danger'),
          chip: colorAt('component.alert.chip.bg-danger'),
        },
        warning: {
          surface: colorAt('component.alert.surface.bg-warning'),
          chip: colorAt('component.alert.chip.bg-warning'),
        },
        success: {
          surface: colorAt('component.alert.surface.bg-success'),
          chip: colorAt('component.alert.chip.bg-success'),
        },
        info: {
          surface: colorAt('component.alert.surface.bg-info'),
          chip: colorAt('component.alert.chip.bg-info'),
        },
        neutral: {
          surface: colorAt('component.alert.surface.bg-neutral'),
          chip: colorAt('component.alert.chip.bg-neutral'),
        },
      },
      title: colorAt('component.alert.content.title'),
      body: colorAt('component.alert.content.body'),
      dismiss: {
        backgroundDefault: colorAt('component.iconbutton.veil.bg-default'),
        backgroundHover: colorAt('component.iconbutton.veil.bg-hover'),
        backgroundPressed: colorAt('component.iconbutton.veil.bg-pressed'),
        icon: colorAt('component.iconbutton.veil.icon-default'),
        borderFocus: colorAt('component.iconbutton.focus.border'),
      },
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
      pillRadius: dimensionAt('radius.pill'),
      actionPaddingTop: dimensionAt('space.inset.sm'),
      actionGap: dimensionAt('space.inline.sm'),
      dismissSize: dimensionAt('size.control.height.xs'),
      targetMin: dimensionAt('size.target.min'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
    },
  };
};

export const alertTokens: Record<TThemeMode, IAlertTokens> = {
  light: readAlertTokens('light'),
  dark: readAlertTokens('dark'),
};

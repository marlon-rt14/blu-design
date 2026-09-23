import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TStepConnectorStatus } from '../types/atoms/stepConnector.types';
import type { TStepStatus } from '../types/atoms/step.types';
import { baseFontFamily } from './theme.tokens';

/** Colour roles ProgressStepper / Step / StepConnector need for one theme. */
export interface IProgressStepperColorTokens {
  labelUpcoming: string;
  labelCurrent: string;
  labelComplete: string;
  labelError: string;
  labelWarning: string;
  secondaryUpcoming: string;
  secondaryDefault: string;
  secondaryError: string;
  secondaryWarning: string;
  railLineDefault: string;
  railLineComplete: string;
  indicatorCurrent: string;
  indicatorComplete: string;
  indicatorError: string;
  indicatorWarning: string;
  indicatorBorderUpcoming: string;
  indicatorDot: string;
  numberUpcoming: string;
  numberCurrent: string;
  iconOnFill: string;
  iconPlain: string;
}

/** Geometry shared by the three pieces. */
export interface IProgressStepperDimensionTokens {
  /** Circle edge — `size/control/height/xs` (24). */
  indicatorSize: number;
  /** Glyph edge — `size/icon/sm` (16). */
  iconSize: number;
  /** Active-status center dot diameter (Figma ~8; half of icon step). */
  dotSize: number;
  /** Rail thickness — `border/width/divider`. */
  railThickness: number;
  /** Gap between connector and indicator — `space/inline/xs`. */
  railGap: number;
  /**
   * Min painted length of a vertical trailing segment — `space/stack/2xl`.
   * Keeps hits spaced like Figma when labels are short.
   */
  railSegmentMinLength: number;
  /** Gap between rail row and labels — `space/inline/sm`. */
  railToLabelGap: number;
  /** Gap between primary and secondary label — `space/stack/xs`. */
  labelGap: number;
  borderRadius: number;
}

export interface IProgressStepperTokens {
  colors: IProgressStepperColorTokens;
  dimension: IProgressStepperDimensionTokens;
  label: IThemeTypographyValue;
  labelStrong: IThemeTypographyValue;
  secondary: IThemeTypographyValue;
  number: IThemeTypographyValue;
}

/**
 * Trailing connector after step `i` is `done` when that step is complete
 * (`done` / `warning`); otherwise `inactive`. Does **not** look at the next
 * step — deriving from the next painted the segment before an error badly
 * (Dev §07).
 */
export const deriveStepConnectorStatus = (leftStatus: TStepStatus): TStepConnectorStatus => {
  switch (leftStatus) {
    case 'done':
    case 'warning':
      return 'done';
    case 'pending':
    case 'active':
    case 'error':
      return 'inactive';
    default: {
      const _exhaustive: never = leftStatus;
      return _exhaustive;
    }
  }
};

/** Label colour role for a step status. */
export const progressStepperLabelColor = (
  colors: IProgressStepperColorTokens,
  status: TStepStatus,
): string => {
  switch (status) {
    case 'pending':
      return colors.labelUpcoming;
    case 'active':
      return colors.labelCurrent;
    case 'done':
      return colors.labelComplete;
    case 'error':
      return colors.labelError;
    case 'warning':
      return colors.labelWarning;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
};

/** Secondary caption colour for a step status. */
export const progressStepperSecondaryColor = (
  colors: IProgressStepperColorTokens,
  status: TStepStatus,
): string => {
  switch (status) {
    case 'pending':
      return colors.secondaryUpcoming;
    case 'active':
    case 'done':
      return colors.secondaryDefault;
    case 'error':
      return colors.secondaryError;
    case 'warning':
      return colors.secondaryWarning;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
};

const readProgressStepperTokens = (key: TThemeSourceKey): IProgressStepperTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const labelSize = dimensionAt('font.size.label.md');
  const captionSize = dimensionAt('font.size.caption.md');
  const lineHeightRatio = dimensionAt('font.line-height.normal') / 100;
  const labelLineHeightRatio = dimensionAt('font.line-height.tight') / 100;

  const labelBase = {
    fontSize: labelSize,
    lineHeight: labelSize * labelLineHeightRatio,
    fontFamily: baseFontFamily,
  };

  return {
    colors: {
      labelUpcoming: colorAt('component.progressstepper.label.text-upcoming'),
      labelCurrent: colorAt('component.progressstepper.label.text-current'),
      labelComplete: colorAt('component.progressstepper.label.text-complete'),
      labelError: colorAt('component.progressstepper.label.text-error'),
      labelWarning: colorAt('component.progressstepper.label.text-warning'),
      secondaryUpcoming: colorAt('component.progressstepper.secondary.text-upcoming'),
      secondaryDefault: colorAt('component.progressstepper.secondary.text-default'),
      secondaryError: colorAt('component.progressstepper.secondary.text-error'),
      secondaryWarning: colorAt('component.progressstepper.secondary.text-warning'),
      railLineDefault: colorAt('component.progressstepper.rail.line-default'),
      railLineComplete: colorAt('component.progressstepper.rail.line-complete'),
      indicatorCurrent: colorAt('component.progressstepper.rail.indicator-current'),
      indicatorComplete: colorAt('component.progressstepper.rail.indicator-complete'),
      indicatorError: colorAt('component.progressstepper.rail.indicator-error'),
      indicatorWarning: colorAt('component.progressstepper.rail.indicator-warning'),
      indicatorBorderUpcoming: colorAt('component.progressstepper.rail.indicator-border-upcoming'),
      indicatorDot: colorAt('component.progressstepper.indicator.dot'),
      numberUpcoming: colorAt('component.progressstepper.indicator.number-upcoming'),
      numberCurrent: colorAt('component.progressstepper.indicator.number-current'),
      iconOnFill: colorAt('component.progressstepper.indicator.icon-on-fill'),
      iconPlain: colorAt('component.progressstepper.indicator.icon-plain'),
    },
    dimension: {
      indicatorSize: dimensionAt('size.control.height.xs'),
      iconSize: dimensionAt('size.icon.sm'),
      // Figma active status paints an 8px center dot inside the 24 circle.
      // No dedicated leaf — half of size/icon/sm.
      dotSize: dimensionAt('size.icon.sm') / 2,
      railThickness: dimensionAt('border.width.divider'),
      railGap: dimensionAt('space.inline.xs'),
      railSegmentMinLength: dimensionAt('space.stack.2xl'),
      railToLabelGap: dimensionAt('space.inline.sm'),
      labelGap: dimensionAt('space.stack.xs'),
      borderRadius: dimensionAt('radius.pill'),
    },
    label: {
      ...labelBase,
      fontWeight: String(dimensionAt('font.weight.regular')),
    },
    labelStrong: {
      ...labelBase,
      fontWeight: String(dimensionAt('font.weight.extrabold')),
    },
    secondary: {
      fontWeight: String(dimensionAt('font.weight.regular')),
      fontSize: captionSize,
      lineHeight: captionSize * lineHeightRatio,
      fontFamily: baseFontFamily,
    },
    number: {
      fontWeight: String(dimensionAt('font.weight.extrabold')),
      fontSize: captionSize,
      lineHeight: captionSize * lineHeightRatio,
      fontFamily: baseFontFamily,
    },
  };
};

/**
 * ProgressStepper tokens per theme.
 *
 * Source: `color.component.progressstepper.*` plus control/icon/divider
 * dimension leaves.
 */
export const progressStepperTokens = fromThemeSources(readProgressStepperTokens);

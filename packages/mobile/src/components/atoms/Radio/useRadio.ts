import { radioTokens } from '@dsm/shared';
import type { TRadioState } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { IRadioProps } from './Radio.types';

/** Params of {@link useRadio}: the props plus the live interaction state. */
interface IUseRadioParams extends IRadioProps {
  isPressed: boolean;
  /** Only reachable through react-native-web; `onFocus` is a no-op on iOS and Android. */
  isFocused: boolean;
}

/** Styles and derived values the Radio needs to render. */
interface IUseRadioResult {
  /** The row: the whole touch target, per bDS. */
  rowStyle: StyleProp<ViewStyle>;
  /** The circle, including its inside border and the focus outline. */
  boxStyle: StyleProp<ViewStyle>;
  /** The inner mark. `undefined` when there is nothing to draw. */
  dotStyle: StyleProp<ViewStyle> | undefined;
  labelStyle: StyleProp<TextStyle>;
  isDisabled: boolean;
  state: TRadioState;
}

/**
 * Resolves every colour and metric the native Radio needs.
 *
 * There is no `hover` here — a touch screen has none — so the ladder is one rung
 * shorter than web's. The composited hover colours still exist in the tokens and
 * simply go unused on this platform, which is cheaper than branching the token
 * table by platform.
 *
 * @param params - The Radio props plus the current press/focus state.
 */
export const useRadio = ({
  size = 'sm',
  isChecked = false,
  isDisabled = false,
  isPressed,
  isFocused,
}: IUseRadioParams): IUseRadioResult => {
  const mode = useThemeMode();
  const tokens = radioTokens[mode];
  const { dimension, typography } = tokens;

  const state: TRadioState = isDisabled
    ? 'disabled'
    : isPressed
      ? 'pressed'
      : isFocused
        ? 'focus'
        : 'default';

  // The token groups keep Figma's axis name (`selected`), the prop takes the
  // platform's (`isChecked`). See `IRadioBaseProps.isChecked`.
  const colors = tokens.colors[isChecked ? 'selected' : 'unselected'][state];
  const boxSize = dimension.box[size];

  return {
    rowStyle: {
      columnGap: dimension.gap,
      minHeight: dimension.rowMinHeight[size],
    },
    boxStyle: {
      width: boxSize,
      height: boxSize,
      flexShrink: 0,
      // Half the box keeps it a circle at both sizes without a sentinel value.
      borderRadius: boxSize / 2,
      // Inside the edge, as Figma draws it: the 2px eats into the circle.
      borderWidth: dimension.borderWidth,
      borderColor: colors.border,
      backgroundColor: colors.background,
      ...(isFocused
        ? {
            outlineWidth: dimension.focusRingSpread,
            outlineOffset: dimension.focusRingOffset,
            outlineColor: tokens.colors.borderFocus,
            outlineStyle: 'solid' as const,
          }
        : {}),
    },
    dotStyle:
      colors.dot === undefined
        ? undefined
        : {
            width: dimension.dot[size],
            height: dimension.dot[size],
            borderRadius: dimension.dot[size] / 2,
            backgroundColor: colors.dot,
          },
    // See @dsm/mobile's TextField useTextField for why fontWeight never
    // accompanies fontFamily here — same Android font-resolver constraint.
    labelStyle: {
      fontFamily: resolveMulishFontFamily(typography.fontWeight),
      fontSize: typography.fontSize[size],
      lineHeight: typography.fontSize[size] * typography.lineHeightRatio,
      color: colors.label,
    },
    isDisabled,
    state,
  };
};

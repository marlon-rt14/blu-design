import {
  TIP_POINTER_FILL_PATH,
  TIP_POINTER_STROKE_PATH,
  TIP_POINTER_VIEW_DEPTH,
  TIP_POINTER_VIEW_LENGTH,
  TOOLTIP_POINTER_DEPTH,
  TOOLTIP_POINTER_INSET,
  TOOLTIP_POINTER_LENGTH,
} from '@dsm/shared';
import type { TTipPointerDirection } from '@dsm/shared';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export interface ITipPointerProps {
  /** Toward the anchor — `top` placement → `down`. */
  direction: TTipPointerDirection;
  fill: string;
  /** Omit for `tone=inverse`. Coachmark always passes floating stroke. */
  stroke?: string;
  strokeWidth?: number;
}

const sizeFor = (
  direction: TTipPointerDirection,
): { width: number; height: number; layoutWidth: number; layoutHeight: number } => {
  if (direction === 'up' || direction === 'down') {
    return {
      width: TIP_POINTER_VIEW_LENGTH,
      height: TIP_POINTER_VIEW_DEPTH,
      layoutWidth: TOOLTIP_POINTER_LENGTH,
      layoutHeight: TOOLTIP_POINTER_DEPTH,
    };
  }
  return {
    width: TIP_POINTER_VIEW_DEPTH,
    height: TIP_POINTER_VIEW_LENGTH,
    layoutWidth: TOOLTIP_POINTER_DEPTH,
    layoutHeight: TOOLTIP_POINTER_LENGTH,
  };
};

const groupTransform = (direction: TTipPointerDirection): string | undefined => {
  switch (direction) {
    case 'down':
      return undefined;
    case 'up':
      return `translate(0 ${TIP_POINTER_VIEW_DEPTH}) scale(1 -1)`;
    case 'right':
      return `translate(0 ${TIP_POINTER_VIEW_LENGTH}) rotate(-90)`;
    case 'left':
      return `translate(${TIP_POINTER_VIEW_DEPTH} 0) rotate(90)`;
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
};

/**
 * `.TipPointer` for React Native — same Figma vector as web (rounded tip +
 * open floating stroke). Layout box is 16×10; SVG overflows 2 px for mitres.
 */
export const TipPointer = ({
  direction,
  fill,
  stroke,
  strokeWidth = 1,
}: ITipPointerProps): ReactElement => {
  const { width, height, layoutWidth, layoutHeight } = sizeFor(direction);
  const transform = groupTransform(direction);
  const vertical = direction === 'up' || direction === 'down';

  return (
    <View style={{ width: layoutWidth, height: layoutHeight, overflow: 'visible' }}>
      <View
        style={
          vertical
            ? { position: 'absolute', left: -TOOLTIP_POINTER_INSET, top: 0 }
            : { position: 'absolute', left: 0, top: -TOOLTIP_POINTER_INSET }
        }
      >
        <Svg fill="none" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
          <G transform={transform}>
            <Path d={TIP_POINTER_FILL_PATH} fill={fill} />
            {stroke ? (
              <Path
                d={TIP_POINTER_STROKE_PATH}
                fill="none"
                stroke={stroke}
                strokeMiterlimit={8}
                strokeWidth={strokeWidth}
              />
            ) : null}
          </G>
        </Svg>
      </View>
    </View>
  );
};

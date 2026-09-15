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
import type { CSSProperties, ReactElement } from 'react';

export interface ITipPointerProps {
  /** Toward the anchor — `top` placement → `down`. */
  direction: TTipPointerDirection;
  fill: string;
  /** Omit for `tone=inverse` (Tooltip). Coachmark always passes floating stroke. */
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

/**
 * Group transform that keeps the faldón on the card side of the viewBox for
 * each direction. Source paths are Figma's `direction=down` export.
 */
const groupTransform = (direction: TTipPointerDirection): string | undefined => {
  switch (direction) {
    case 'down':
      return undefined;
    case 'up':
      return `translate(0 ${TIP_POINTER_VIEW_DEPTH}) scale(1 -1)`;
    case 'right':
      // Tip to the right of a 10×20 box; faldón on the left (card side).
      return `translate(0 ${TIP_POINTER_VIEW_LENGTH}) rotate(-90)`;
    case 'left':
      // Tip to the left; faldón on the right.
      return `translate(${TIP_POINTER_VIEW_DEPTH} 0) rotate(90)`;
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
};

/**
 * `.TipPointer` — rounded tip + open floating stroke. Not a CSS border triangle:
 * the live set uses a vector with cornerRadius 2 and an open path so the mouth
 * stays seamless with the card border.
 *
 * Layout box is 16×10 (Floating UI / edge inset). The SVG is 20×10 and hangs
 * `TOOLTIP_POINTER_INSET` past each shoulder for the mitre stubs.
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
  const wrapStyle: CSSProperties = {
    position: 'relative',
    width: layoutWidth,
    height: layoutHeight,
    overflow: 'visible',
    lineHeight: 0,
  };
  const svgStyle: CSSProperties = vertical
    ? {
        position: 'absolute',
        left: -TOOLTIP_POINTER_INSET,
        top: 0,
        display: 'block',
      }
    : {
        position: 'absolute',
        left: 0,
        top: -TOOLTIP_POINTER_INSET,
        display: 'block',
      };

  return (
    <div style={wrapStyle}>
      <svg
        aria-hidden
        fill="none"
        height={height}
        overflow="visible"
        style={svgStyle}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={transform}>
          <path d={TIP_POINTER_FILL_PATH} fill={fill} />
          {stroke ? (
            <path
              d={TIP_POINTER_STROKE_PATH}
              stroke={stroke}
              strokeMiterlimit={8}
              strokeWidth={strokeWidth}
            />
          ) : null}
        </g>
      </svg>
    </div>
  );
};

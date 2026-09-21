import {
  SKELETON_DEFAULT_LABEL,
  skeletonTokens,
} from '@dsm/shared';
import type { ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { ISkeletonProps } from './Skeleton.types';

export interface ISkeletonBoneStyle {
  root: ViewStyle;
}

interface IUseSkeletonResult {
  bones: ISkeletonBoneStyle[];
  stackStyle: ViewStyle;
  label: string;
  sheenWidthRatio: number;
  sheenDurationMs: number;
  highlight: string;
}

const resolveLength = (
  value: number | string | undefined,
  fallback: number | `${number}%`,
): number | `${number}%` => {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (value.endsWith('%')) {
    return value as `${number}%`;
  }
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : fallback;
};

export const useSkeleton = ({
  shape = 'text',
  size = 'md',
  lines = 1,
  width,
  height,
  label = SKELETON_DEFAULT_LABEL,
}: ISkeletonProps): IUseSkeletonResult => {
  const mode = useThemeMode();
  const tokens = skeletonTokens[mode];
  const { colors, dimension } = tokens;

  const buildBone = (
    boneWidth: number | `${number}%`,
    boneHeight: number | `${number}%`,
    radius: number,
  ): ISkeletonBoneStyle => ({
    root: {
      position: 'relative',
      overflow: 'hidden',
      width: boneWidth,
      height: boneHeight,
      borderRadius: radius,
      backgroundColor: colors.background,
    },
  });

  let bones: ISkeletonBoneStyle[];
  let stackStyle: ViewStyle;

  switch (shape) {
    case 'circle': {
      const edge = dimension.circleSize[size];
      bones = [buildBone(edge, edge, dimension.pillRadius)];
      stackStyle = {
        width: edge,
        height: edge,
        flexShrink: 0,
      };
      break;
    }
    case 'block': {
      const blockWidth = resolveLength(width, '100%');
      const blockHeight = resolveLength(height, '100%');
      bones = [buildBone('100%', '100%', dimension.blockRadius[size])];
      stackStyle = {
        width: blockWidth,
        height: blockHeight,
        flexShrink: 0,
      };
      break;
    }
    case 'text': {
      const count = Math.max(1, Math.floor(lines));
      const barHeight = dimension.textHeight[size];
      const barWidth = resolveLength(width, '100%');
      bones = Array.from({ length: count }, () =>
        buildBone(barWidth, barHeight, dimension.pillRadius),
      );
      stackStyle = {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: dimension.lineGap,
        width: barWidth,
      };
      break;
    }
    default: {
      const _exhaustive: never = shape;
      throw new Error(`Unhandled Skeleton shape: ${String(_exhaustive)}`);
    }
  }

  return {
    bones,
    stackStyle,
    label,
    sheenWidthRatio: dimension.sheenWidthRatio,
    sheenDurationMs: dimension.sheenDurationMs,
    highlight: colors.highlight,
  };
};

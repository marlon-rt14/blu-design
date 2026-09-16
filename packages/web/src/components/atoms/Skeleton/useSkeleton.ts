import {
  SKELETON_DEFAULT_LABEL,
  skeletonTokens,
} from '@dsm/shared';
import type { CSSProperties } from 'react';

import { usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ISkeletonProps } from './Skeleton.types';

export interface ISkeletonBoneStyle {
  root: CSSProperties;
  sheen: CSSProperties;
}

interface IUseSkeletonResult {
  bones: ISkeletonBoneStyle[];
  stackStyle: CSSProperties;
  label: string;
  prefersReducedMotion: boolean;
  sheenDurationMs: number;
}

const resolveCssLength = (value: number | string | undefined, fallback: string): string | number => {
  if (value === undefined) {
    return fallback;
  }
  return value;
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const { colors, dimension } = tokens;

  const sheenMotion: CSSProperties = prefersReducedMotion
    ? {}
    : {
        animation: `dsm-skeleton-sheen ${dimension.sheenDurationMs}ms ease-in-out infinite`,
      };

  const sheenBase: CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: `${dimension.sheenWidthRatio * 100}%`,
    backgroundColor: colors.highlight,
    ...sheenMotion,
  };

  const buildBone = (boneWidth: number | string, boneHeight: number | string, radius: number): ISkeletonBoneStyle => ({
    root: {
      // Bones are <span>s — must be blockified or width/height are ignored (inline).
      display: 'block',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
      width: boneWidth,
      height: boneHeight,
      borderRadius: radius,
      backgroundColor: colors.background,
    },
    sheen: sheenBase,
  });

  let bones: ISkeletonBoneStyle[];
  let stackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: shape === 'circle' ? 'max-content' : resolveCssLength(width, '100%'),
  };

  switch (shape) {
    case 'circle': {
      const edge = dimension.circleSize[size];
      bones = [buildBone(edge, edge, dimension.pillRadius)];
      stackStyle = {
        display: 'inline-flex',
        width: edge,
        height: edge,
        flexShrink: 0,
      };
      break;
    }
    case 'block': {
      const blockWidth = resolveCssLength(width, '100%');
      const blockHeight = resolveCssLength(height, '100%');
      bones = [buildBone('100%', '100%', dimension.blockRadius[size])];
      stackStyle = {
        display: 'block',
        width: blockWidth,
        height: blockHeight,
        flexShrink: 0,
      };
      break;
    }
    case 'text': {
      const count = Math.max(1, Math.floor(lines));
      const barHeight = dimension.textHeight[size];
      const barWidth = resolveCssLength(width, '100%');
      bones = Array.from({ length: count }, () =>
        buildBone(barWidth, barHeight, dimension.pillRadius),
      );
      stackStyle = {
        display: 'flex',
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
    prefersReducedMotion,
    sheenDurationMs: dimension.sheenDurationMs,
  };
};

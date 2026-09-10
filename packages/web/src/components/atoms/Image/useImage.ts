import { imageTokens, IMAGE_RATIO_CSS } from '@dsm/shared';
import type { TImageFit, TImageRadius, TImageRatio, TImageStatus } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IImageProps } from './Image.types';

interface IUseImageParams extends IImageProps {
  resolvedStatus: TImageStatus;
}

interface IUseImageResult {
  rootStyle: CSSProperties;
  mediaStyle: CSSProperties;
  skeletonStyle: CSSProperties;
  sheenStyle: CSSProperties;
  showMedia: boolean;
  showSkeleton: boolean;
  showEmptyIcon: boolean;
  showErrorIcon: boolean;
}

const radiusValue = (radius: TImageRadius, tokens: (typeof imageTokens)['light']): number => {
  switch (radius) {
    case 'none':
      return tokens.dimension.radii.none;
    case 'sm':
      return tokens.dimension.radii.sm;
    case 'md':
      return tokens.dimension.radii.md;
    default: {
      const _exhaustive: never = radius;
      return _exhaustive;
    }
  }
};

const fitValue = (fit: TImageFit): NonNullable<CSSProperties['objectFit']> => {
  switch (fit) {
    case 'cover':
      return 'cover';
    case 'contain':
      return 'contain';
    case 'fill':
      return 'fill';
    default: {
      const _exhaustive: never = fit;
      return _exhaustive;
    }
  }
};

export const useImage = ({
  ratio = '1:1',
  radius = 'md',
  fit = 'cover',
  resolvedStatus,
}: IUseImageParams): IUseImageResult => {
  const mode = useThemeMode();
  const tokens = imageTokens[mode];
  const prefersReducedMotion = usePrefersReducedMotion();
  const borderRadius = radiusValue(radius, tokens);
  const { borderWidth, sheenWidthRatio } = tokens.dimension;

  const showBorder = resolvedStatus !== 'default';
  const borderStyle: 'solid' | 'dashed' | 'none' =
    resolvedStatus === 'empty' ? 'dashed' : resolvedStatus === 'default' ? 'none' : 'solid';

  const showMedia = resolvedStatus === 'default';
  const showSkeleton = resolvedStatus === 'loading';
  const showEmptyIcon = resolvedStatus === 'empty';
  const showErrorIcon = resolvedStatus === 'error';

  const rootStyle: CSSProperties = {
    boxSizing: 'border-box',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: IMAGE_RATIO_CSS[ratio as TImageRatio],
    overflow: 'hidden',
    borderRadius,
    backgroundColor: tokens.colors.surface.background,
    borderWidth: showBorder ? borderWidth : 0,
    borderStyle: showBorder ? borderStyle : 'none',
    borderColor: tokens.colors.surface.border,
  };

  const mediaStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: fitValue(fit),
    display: 'block',
  };

  const skeletonStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    backgroundColor: tokens.colors.skeleton.background,
  };

  const sheenStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: `${sheenWidthRatio * 100}%`,
    backgroundColor: tokens.colors.skeleton.highlight,
    ...(prefersReducedMotion
      ? {}
      : {
          animation: 'dsm-image-sheen 1.6s ease-in-out infinite',
        }),
  };

  return {
    rootStyle,
    mediaStyle,
    skeletonStyle,
    sheenStyle,
    showMedia,
    showSkeleton,
    showEmptyIcon,
    showErrorIcon,
  };
};

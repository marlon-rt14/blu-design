import { imageTokens, IMAGE_RATIO_NUMBER } from '@dsm/shared';
import type { TImageFit, TImageRadius, TImageRatio, TImageStatus, TTokensOf } from '@dsm/shared';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IImageProps } from './Image.types';

interface IUseImageParams extends IImageProps {
  resolvedStatus: TImageStatus;
}

interface IUseImageResult {
  rootStyle: StyleProp<ViewStyle>;
  mediaStyle: StyleProp<ImageStyle>;
  skeletonStyle: StyleProp<ViewStyle>;
  sheenStyle: StyleProp<ViewStyle>;
  showMedia: boolean;
  showSkeleton: boolean;
  showEmptyIcon: boolean;
  showErrorIcon: boolean;
}

const radiusValue = (radius: TImageRadius, tokens: TTokensOf<typeof imageTokens>): number => {
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

const fitValue = (fit: TImageFit): NonNullable<ImageStyle['resizeMode']> => {
  switch (fit) {
    case 'cover':
      return 'cover';
    case 'contain':
      return 'contain';
    case 'fill':
      return 'stretch';
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
  const borderRadius = radiusValue(radius, tokens);
  const { borderWidth, sheenWidthRatio } = tokens.dimension;

  const showBorder = resolvedStatus !== 'default';
  const borderStyle: 'solid' | 'dashed' =
    resolvedStatus === 'empty' ? 'dashed' : 'solid';

  const showMedia = resolvedStatus === 'default';
  const showSkeleton = resolvedStatus === 'loading';
  const showEmptyIcon = resolvedStatus === 'empty';
  const showErrorIcon = resolvedStatus === 'error';

  const rootStyle: StyleProp<ViewStyle> = {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: IMAGE_RATIO_NUMBER[ratio as TImageRatio],
    overflow: 'hidden',
    borderRadius,
    backgroundColor: tokens.colors.surface.background,
    borderWidth: showBorder ? borderWidth : 0,
    borderStyle: showBorder ? borderStyle : undefined,
    borderColor: tokens.colors.surface.border,
  };

  const mediaStyle: StyleProp<ImageStyle> = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: fitValue(fit),
  };

  const skeletonStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    backgroundColor: tokens.colors.skeleton.background,
  };

  const sheenStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '37%',
    width: `${sheenWidthRatio * 100}%`,
    backgroundColor: tokens.colors.skeleton.highlight,
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

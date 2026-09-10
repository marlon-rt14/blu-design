import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { Image as RNImage, View } from 'react-native';

import { resolveImageStatus } from '@dsm/shared';
import type { TImageLoadPhase } from '@dsm/shared';

import { IconAlertTriangle, IconImage } from '../../../icons';
import type { IImageProps } from './Image.types';
import { useImage } from './useImage';

/**
 * Mobile Image — fixed-ratio content frame. Status derives from the load
 * (Dev); pass `status` only to force a variant in stories/tests. Error is
 * icon-only (Figma); `alt` stays on the accessible name.
 */
export const Image = (props: IImageProps): ReactElement => {
  const { src, alt, status: statusOverride, testID } = props;
  const [loadPhase, setLoadPhase] = useState<TImageLoadPhase>(() =>
    src ? 'loading' : 'idle',
  );

  useEffect(() => {
    setLoadPhase(src ? 'loading' : 'idle');
  }, [src]);

  const resolvedStatus = resolveImageStatus({ src, loadPhase, statusOverride });
  const {
    rootStyle,
    mediaStyle,
    skeletonStyle,
    sheenStyle,
    showMedia,
    showSkeleton,
    showEmptyIcon,
    showErrorIcon,
  } = useImage({ ...props, resolvedStatus });

  const isDecorative = alt === '';

  return (
    <View
      accessibilityLabel={!isDecorative && !showMedia ? alt : undefined}
      accessibilityRole={!isDecorative && !showMedia ? 'image' : undefined}
      accessible={!isDecorative && !showMedia}
      importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'yes'}
      style={rootStyle}
      testID={testID}
    >
      {src ? (
        <RNImage
          accessibilityIgnoresInvertColors
          accessible={false}
          onError={() => setLoadPhase('error')}
          onLoad={() => setLoadPhase('loaded')}
          source={{ uri: src }}
          style={[mediaStyle, { opacity: showMedia ? 1 : 0 }]}
        />
      ) : null}
      {showSkeleton ? (
        <View importantForAccessibility="no-hide-descendants" style={skeletonStyle}>
          <View style={sheenStyle} />
        </View>
      ) : null}
      {showEmptyIcon ? <IconImage color="tertiary" size="lg" /> : null}
      {showErrorIcon ? <IconAlertTriangle color="secondary" size="lg" /> : null}
    </View>
  );
};

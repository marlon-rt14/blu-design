import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { resolveImageStatus } from '@dsm/shared';
import type { TImageLoadPhase } from '@dsm/shared';

import { IconAlertTriangle, IconImage } from '../../../icons';
import type { IImageProps } from './Image.types';
import { useImage } from './useImage';

const SHEEN_STYLE_ID = 'dsm-image-sheen-keyframes';

const ensureSheenKeyframes = (): void => {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.getElementById(SHEEN_STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = SHEEN_STYLE_ID;
  style.textContent =
    '@keyframes dsm-image-sheen{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}';
  document.head.appendChild(style);
};

/**
 * Web Image — fixed-ratio content frame. Reserves space before the bitmap
 * arrives so layout does not jump. Status derives from the load (Dev); pass
 * `status` only to force a variant in stories/tests. Error is icon-only
 * (Figma); `alt` stays on the accessible name.
 */
export const Image = (props: IImageProps): ReactElement => {
  const { src, alt, status: statusOverride, testID } = props;
  const [loadPhase, setLoadPhase] = useState<TImageLoadPhase>(() =>
    src ? 'loading' : 'idle',
  );

  useEffect(() => {
    ensureSheenKeyframes();
  }, []);

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
    <div
      aria-busy={resolvedStatus === 'loading' || undefined}
      aria-hidden={isDecorative && !showMedia ? true : undefined}
      aria-label={!isDecorative && !showMedia ? alt : undefined}
      data-testid={testID}
      role={!isDecorative && !showMedia ? 'img' : undefined}
      style={rootStyle}
    >
      {src ? (
        <img
          alt={alt}
          aria-hidden={!showMedia}
          loading="lazy"
          onError={() => setLoadPhase('error')}
          onLoad={() => setLoadPhase('loaded')}
          src={src}
          style={{
            ...mediaStyle,
            opacity: showMedia ? 1 : 0,
            pointerEvents: showMedia ? 'auto' : 'none',
          }}
        />
      ) : null}
      {showSkeleton ? (
        <span aria-hidden style={skeletonStyle}>
          <span style={sheenStyle} />
        </span>
      ) : null}
      {showEmptyIcon ? <IconImage color="tertiary" size="lg" /> : null}
      {showErrorIcon ? <IconAlertTriangle color="secondary" size="lg" /> : null}
    </div>
  );
};

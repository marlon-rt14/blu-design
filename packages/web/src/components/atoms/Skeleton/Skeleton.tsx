import { useEffect } from 'react';
import type { ReactElement } from 'react';

import type { ISkeletonProps } from './Skeleton.types';
import { useSkeleton } from './useSkeleton';

const SHEEN_STYLE_ID = 'dsm-skeleton-sheen-keyframes';

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
    '@keyframes dsm-skeleton-sheen{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}';
  document.head.appendChild(style);
};

/**
 * Web Skeleton — loading placeholder that reserves content footprint.
 *
 * Sheen matches Image loading (`component/skeleton/*`, 26% band). Reduced
 * motion freezes the band (Dev / WCAG 2.3.3). Shapes are `aria-hidden`; the
 * wrapper announces once via `role="status"`.
 *
 * @example
 * ```tsx
 * <Skeleton />
 * <Skeleton shape="circle" size="lg" />
 * <div style={{ height: 96 }}><Skeleton shape="block" height="100%" /></div>
 * <Skeleton shape="block" width={200} height={96} />
 * ```
 */
export const Skeleton = (props: ISkeletonProps): ReactElement => {
  const { testID } = props;
  const { bones, stackStyle, label } = useSkeleton(props);

  useEffect(() => {
    ensureSheenKeyframes();
  }, []);

  return (
    <span
      aria-busy="true"
      aria-label={label}
      aria-live="polite"
      data-testid={testID}
      role="status"
      style={stackStyle}
    >
      {bones.map((bone, index) => (
        <span aria-hidden="true" key={index} style={bone.root}>
          <span style={bone.sheen} />
        </span>
      ))}
    </span>
  );
};

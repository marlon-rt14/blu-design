import { useEffect } from 'react';
import type { ReactElement } from 'react';

import {
  SPINNER_INDICATOR_PATH,
  SPINNER_TRACK_PATH,
  SPINNER_VIEWBOX,
} from '@dsm/shared';

import type { ISpinnerProps } from './Spinner.types';
import { useSpinner } from './useSpinner';

const ROTATE_STYLE_ID = 'dsm-spinner-rotate-keyframes';

const ensureRotateKeyframes = (): void => {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.getElementById(ROTATE_STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = ROTATE_STYLE_ID;
  style.textContent =
    '@keyframes dsm-spinner-rotate{to{transform:rotate(360deg)}}';
  document.head.appendChild(style);
};

/**
 * Web Spinner — indeterminate loading arc.
 *
 * SVG geometry matches live Figma (`3:242`). CSS keyframes rotate the whole
 * mark. Reduced motion: arc stays still (Dev), no opacity pulse.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner appearance="on-brand" size="lg" label="Enviando" />
 * ```
 */
export const Spinner = (props: ISpinnerProps): ReactElement => {
  const { testID } = props;
  const { rootStyle, svgStyle, trackFill, indicatorFill, edge, label } = useSpinner(props);

  useEffect(() => {
    ensureRotateKeyframes();
  }, []);

  return (
    <span
      aria-label={label}
      aria-live="polite"
      data-testid={testID}
      role="status"
      style={rootStyle}
    >
      <svg
        aria-hidden="true"
        fill="none"
        height={edge}
        style={svgStyle}
        viewBox={SPINNER_VIEWBOX}
        width={edge}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={SPINNER_TRACK_PATH} fill={trackFill} />
        <path d={SPINNER_INDICATOR_PATH} fill={indicatorFill} />
      </svg>
    </span>
  );
};

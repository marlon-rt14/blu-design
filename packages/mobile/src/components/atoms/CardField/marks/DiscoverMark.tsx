import { useId } from 'react';
import type { ReactElement } from 'react';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { MARK_VIEW_BOX } from './mark.types';
import type { IMarkProps } from './mark.types';

/**
 * Discover — **a navy plate with the gradient ball**.
 *
 * **The first asset in the system that a flat `fill` cannot draw.** The ball
 * runs from `#EC500E` at 38 % to `#F9A121`, so it needs a gradient definition,
 * and a definition needs an id that is unique per instance — two Discover marks
 * on one screen pointing at the same id is the classic way this breaks. Hence
 * `useId` rather than a module-level constant.
 *
 * **What is deliberately missing**: Figma also puts an inner shadow on the ball
 * (`feOffset` + `feGaussianBlur` + `feColorMatrix`). It is left out. On a plate
 * that is 16 to 32 pixels tall the shadow is invisible, and SVG filters are
 * recent and uneven in `react-native-svg` — spending that risk on something
 * nobody can see is a bad trade. Written down here so it is a decision and not
 * an oversight.
 *
 * **The colours are written in, not read from tokens, and that is declared
 * rather than debt**: *"las marcas de tarjeta llevan su color de marca, sin
 * token, a propósito. Son logos de terceros: su color no es del sistema y no
 * cambia con el tema ni con el modo de contraste. Una auditoría que cuente
 * rellenos crudos va a encontrarlos acá; no son deuda y no se corrigen."*
 *
 * **It paints its own background**, like every mark in `.Brand rect` except
 * Diners, whose plate happens to be white. The whole 48x32 is the brand's.
 */
export const DiscoverMark = ({ width, height }: IMarkProps): ReactElement => {
  // `useId` gives `:r3:`, and a colon inside `url(#…)` is asking for trouble in
  // one tool or another; stripped rather than trusted.
  const gradientId = `discover-ball-${useId().replaceAll(':', '')}`;
  return (
  <Svg height={height} viewBox={MARK_VIEW_BOX} width={width}>
        <Rect fill="#232B3D" height={32} width={48} />
    <Defs>
        <LinearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1="19.7604"
          x2="28.1895"
          y1="6.9404"
          y2="25.0821"
        >
          <Stop offset="0.38" stopColor="#EC500E" />
          <Stop offset="1" stopColor="#F9A121" />
        </LinearGradient>
      </Defs>
      <Path
        d="M24 26C29.5229 26 34 21.5228 34 16C34 10.4772 29.5229 6 24 6C18.4772 6 14 10.4772 14 16C14 21.5228 18.4772 26 24 26Z"
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
};

import { Accordion as NativeAccordion } from '@dsm/mobile';
import type { IAccordionBaseProps } from '@dsm/shared';
import { Accordion as WebAccordion } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformAccordion}: the shared contract plus the switch. */
export interface IPlatformAccordionProps extends IAccordionBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Accordion from the same
 * props. Nothing to map — the contract is identical on both platforms.
 *
 * `Accordion` clones its children to inject `isExpanded`/`onToggle`/etc., so
 * `children` has to be `PlatformAccordionItem` elements (not plain
 * `AccordionItem`/`NativeAccordionItem`) with their own `platform` prop set
 * to the same value passed here — `PlatformAccordionItem` forwards the
 * injected props straight through to whichever real implementation it
 * renders.
 */
export const PlatformAccordion = ({
  platform = 'web',
  ...props
}: IPlatformAccordionProps): ReactElement =>
  platform === 'native' ? <NativeAccordion {...props} /> : <WebAccordion {...props} />;

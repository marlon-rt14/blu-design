import { AccordionItem as NativeAccordionItem } from '@dsm/mobile';
import type { IAccordionItemBaseProps, TAccordionAppearance, TAccordionSize } from '@dsm/shared';
import { AccordionItem as WebAccordionItem } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformAccordionItem}: the shared contract plus the fields `Accordion` injects. */
export interface IPlatformAccordionItemProps extends IAccordionItemBaseProps {
  isExpanded?: boolean;
  onToggle?: () => void;
  appearance?: TAccordionAppearance;
  size?: TAccordionSize;
  showDivider?: boolean;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native AccordionItem from the same
 * props. Nothing to map — `isExpanded`/`onToggle` are named the same on
 * both platforms.
 */
export const PlatformAccordionItem = ({
  platform = 'web',
  ...props
}: IPlatformAccordionItemProps): ReactElement =>
  platform === 'native' ? <NativeAccordionItem {...props} /> : <WebAccordionItem {...props} />;

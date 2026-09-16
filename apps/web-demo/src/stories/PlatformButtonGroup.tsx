import type { IButtonGroupBaseProps } from '@dsm/shared';
import { ButtonGroup as NativeButtonGroup } from '@dsm/mobile';
import { ButtonGroup as WebButtonGroup } from '@dsm/web';
import type { ReactElement, ReactNode } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformButtonGroup}: the shared contract plus the switch. */
export interface IPlatformButtonGroupProps extends IButtonGroupBaseProps {
  children: ReactNode;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native ButtonGroup from the same props.
 */
export const PlatformButtonGroup = ({
  platform = 'web',
  ...props
}: IPlatformButtonGroupProps): ReactElement =>
  platform === 'native' ? <NativeButtonGroup {...props} /> : <WebButtonGroup {...props} />;

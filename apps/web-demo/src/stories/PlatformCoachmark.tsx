import type { ICoachmarkBaseProps } from '@dsm/shared';
import { Coachmark as NativeCoachmark } from '@dsm/mobile';
import { Coachmark as WebCoachmark } from '@dsm/web';
import type { ReactElement, ReactNode } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformCoachmark}: the shared contract plus handlers and the switch. */
export interface IPlatformCoachmarkProps extends ICoachmarkBaseProps {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onAction?: () => void;
  onBack?: () => void;
  onDismiss?: () => void;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Coachmark from the same props.
 */
export const PlatformCoachmark = ({
  platform = 'web',
  ...props
}: IPlatformCoachmarkProps): ReactElement =>
  platform === 'native' ? <NativeCoachmark {...props} /> : <WebCoachmark {...props} />;

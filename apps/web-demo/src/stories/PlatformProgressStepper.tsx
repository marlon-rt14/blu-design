import type { IProgressStepperBaseProps } from '@dsm/shared';
import { ProgressStepper as NativeProgressStepper } from '@dsm/mobile';
import { ProgressStepper as WebProgressStepper } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformProgressStepper}: the shared contract plus the switch. */
export interface IPlatformProgressStepperProps extends IProgressStepperBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native ProgressStepper from the same props.
 */
export const PlatformProgressStepper = ({
  platform = 'web',
  ...props
}: IPlatformProgressStepperProps): ReactElement =>
  platform === 'native' ? (
    <NativeProgressStepper {...props} />
  ) : (
    <WebProgressStepper {...props} />
  );

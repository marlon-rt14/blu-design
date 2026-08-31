import { Switch as NativeSwitch } from '@dsm/mobile';
import type { ISwitchBaseProps } from '@dsm/shared';
import { Switch as WebSwitch } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformSwitch}: the shared Switch contract plus a single
 * platform-neutral change handler.
 */
export interface IPlatformSwitchProps extends ISwitchBaseProps {
  /** Fired with the new checked value, on either platform. */
  onValueChange?: (isChecked: boolean) => void;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Switch from the same set of
 * shared props, mapping `onValueChange` to `onChange` (web) or
 * `onValueChange` (mobile).
 */
export const PlatformSwitch = ({
  onValueChange,
  platform = 'web',
  ...props
}: IPlatformSwitchProps): ReactElement =>
  platform === 'native' ? (
    <NativeSwitch {...props} onValueChange={onValueChange} />
  ) : (
    <WebSwitch {...props} onChange={onValueChange} />
  );

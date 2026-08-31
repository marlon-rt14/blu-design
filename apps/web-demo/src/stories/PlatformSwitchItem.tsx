import { SwitchItem as NativeSwitchItem } from '@dsm/mobile';
import type { ISwitchItemBaseProps } from '@dsm/shared';
import { SwitchItem as WebSwitchItem } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformSwitchItem}: the shared SwitchItem contract plus a
 * single platform-neutral change handler.
 */
export interface IPlatformSwitchItemProps extends ISwitchItemBaseProps {
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
 * Renders either the web or the React Native SwitchItem from the same set
 * of shared props, mapping `onValueChange` to `onChange` (web) or
 * `onValueChange` (mobile).
 */
export const PlatformSwitchItem = ({
  onValueChange,
  platform = 'web',
  ...props
}: IPlatformSwitchItemProps): ReactElement =>
  platform === 'native' ? (
    <NativeSwitchItem {...props} onValueChange={onValueChange} />
  ) : (
    <WebSwitchItem {...props} onChange={onValueChange} />
  );

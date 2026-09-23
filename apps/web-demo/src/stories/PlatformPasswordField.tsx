import { PasswordField as NativePasswordField } from '@dsm/mobile';
import type { IPasswordFieldBaseProps } from '@dsm/shared';
import { PasswordField as WebPasswordField } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformPasswordField}: the shared contract plus the platform switch. */
export interface IPlatformPasswordFieldProps extends IPasswordFieldBaseProps {
  /**
   * Whether Caps Lock is on. **Web only** — *"en móvil no existe Bloq Mayús"* —
   * so the native branch drops it rather than pretending.
   */
  capsLock?: boolean;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native PasswordField from the same props.
 *
 * `onChangeText` is now in the shared contract, so there is nothing to map —
 * the one asymmetry left is `capsLock`, which only web has.
 *
 * `autoComplete` is left at each platform's default rather than exposed here:
 * it is not part of the shared contract, and the story has no form to autofill.
 */
export const PlatformPasswordField = ({
  capsLock = false,
  platform = 'web',
  ...props
}: IPlatformPasswordFieldProps): ReactElement =>
  platform === 'native' ? (
    <NativePasswordField {...props} />
  ) : (
    <WebPasswordField {...props} capsLock={capsLock} />
  );

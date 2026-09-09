import { OTPField as NativeOTPField } from '@dsm/mobile';
import type { IOTPFieldBaseProps } from '@dsm/shared';
import { OTPField as WebOTPField } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformOTPField}: the shared contract plus the platform switch. */
export interface IPlatformOTPFieldProps extends IOTPFieldBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native OTPField from the same props.
 *
 * Thinner than the other bridges in this folder, and for a reason: the OTPField
 * reports changes through `onValueChange`, which is part of the **shared**
 * contract rather than a per-platform handler. There is nothing to map — no
 * `onChange` to unwrap on web, no `onChangeText` to rename on mobile — because
 * the component sanitizes the input itself and hands back the code either way.
 *
 * `autoFocus` is left off both sides on purpose: a story that grabs focus on
 * mount fights the Storybook canvas.
 */
export const PlatformOTPField = ({
  platform = 'web',
  ...props
}: IPlatformOTPFieldProps): ReactElement =>
  platform === 'native' ? <NativeOTPField {...props} /> : <WebOTPField {...props} />;

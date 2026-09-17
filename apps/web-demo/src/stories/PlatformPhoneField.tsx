import { PhoneField as NativePhoneField } from '@dsm/mobile';
import type { IPhoneFieldBaseProps } from '@dsm/shared';
import { PhoneField as WebPhoneField } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformPhoneField}: the shared contract plus the platform
 * switch.
 *
 * No flattening here, unlike CardField's bridge — this contract is a plain
 * interface, so the controls panel can express all of it.
 */
export interface IPlatformPhoneFieldProps extends IPhoneFieldBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native PhoneField from the same props.
 *
 * Nothing to map: both take the shared contract unchanged, and `onChangeText`
 * and `onCountryChange` are the names on both sides. What differs is only how
 * each one puts the country list on screen — an anchored panel with the Menu on
 * web, a bottom sheet on native — and that is inside the components.
 */
export const PlatformPhoneField = ({
  platform = 'web',
  ...fieldProps
}: IPlatformPhoneFieldProps): ReactElement =>
  platform === 'native' ? (
    <NativePhoneField {...fieldProps} />
  ) : (
    <WebPhoneField {...fieldProps} />
  );

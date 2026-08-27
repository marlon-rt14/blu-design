import { PasswordField as NativePasswordField } from '@dsm/mobile';
import type { IPasswordFieldBaseProps } from '@dsm/shared';
import { PasswordField as WebPasswordField } from '@dsm/web';
import type { ChangeEvent, ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformPasswordField}: the shared contract plus a single
 * platform-neutral change handler.
 */
export interface IPlatformPasswordFieldProps extends IPasswordFieldBaseProps {
  /** Fired with the new value on every keystroke, on either platform. */
  onValueChange?: (value: string) => void;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native PasswordField from the same shared
 * props, mapping `onValueChange` to whichever handler the platform expects
 * (`onChange` on web, `onChangeText` on mobile).
 *
 * `autoComplete` is left at each platform's default rather than exposed here:
 * it is not part of the shared contract, and the story has no form to autofill.
 */
export const PlatformPasswordField = ({
  onValueChange,
  platform = 'web',
  ...props
}: IPlatformPasswordFieldProps): ReactElement =>
  platform === 'native' ? (
    <NativePasswordField {...props} onChangeText={onValueChange} />
  ) : (
    <WebPasswordField
      {...props}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onValueChange?.(event.target.value)}
    />
  );

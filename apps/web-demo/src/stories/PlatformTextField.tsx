import { TextField as NativeTextField } from '@dsm/mobile';
import type { ITextFieldBaseProps } from '@dsm/shared';
import { TextField as WebTextField } from '@dsm/web';
import type { ChangeEvent, ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformTextField}: the shared TextField contract plus a
 * single platform-neutral change handler.
 */
export interface IPlatformTextFieldProps extends ITextFieldBaseProps {
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
 * Renders either the web or the React Native TextField from the same set of
 * shared props, mapping `onValueChange` to whichever handler the platform
 * expects (`onChange` on web, `onChangeText` on mobile).
 *
 * This is what lets a single story document both implementations — see
 * `PlatformButton` for the same idea applied to Button.
 */
export const PlatformTextField = ({
  onValueChange,
  platform = 'web',
  ...props
}: IPlatformTextFieldProps): ReactElement =>
  platform === 'native' ? (
    <NativeTextField {...props} onChangeText={onValueChange} />
  ) : (
    <WebTextField
      {...props}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onValueChange?.(event.target.value)}
    />
  );

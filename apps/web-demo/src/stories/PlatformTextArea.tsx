import { TextArea as NativeTextArea } from '@dsm/mobile';
import type { ITextAreaBaseProps } from '@dsm/shared';
import { TextArea as WebTextArea } from '@dsm/web';
import type { ChangeEvent, ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformTextArea}: the shared TextArea contract plus a
 * single platform-neutral change handler.
 */
export interface IPlatformTextAreaProps extends ITextAreaBaseProps {
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
 * Renders either the web or the React Native TextArea from the same set of
 * shared props, mapping `onValueChange` to whichever handler the platform
 * expects (`onChange` on web, `onChangeText` on mobile).
 *
 * Same idea as `PlatformTextField` — see that one for the pattern applied to
 * a component that also has a `size` axis, which TextArea does not.
 */
export const PlatformTextArea = ({
  onValueChange,
  platform = 'web',
  ...props
}: IPlatformTextAreaProps): ReactElement =>
  platform === 'native' ? (
    <NativeTextArea {...props} onChangeText={onValueChange} />
  ) : (
    <WebTextArea
      {...props}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onValueChange?.(event.target.value)}
    />
  );

import { Radio as NativeRadio } from '@dsm/mobile';
import type { IRadioBaseProps } from '@dsm/shared';
import { Radio as WebRadio } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformRadio}: the shared contract plus a neutral handler. */
export interface IPlatformRadioProps extends IRadioBaseProps {
  /** Fired when the option is picked, on either platform. */
  onAction?: () => void;
  /**
   * Groups radios so the browser handles the arrow keys. **Web only** — React
   * Native has no native radio to inherit grouping from, so it is dropped for
   * that implementation rather than silently doing nothing.
   */
  name?: string;
  /**
   * Implementation to render.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Radio from the same props.
 *
 * The divergence worth watching here is `name`: web renders a real
 * `<input type="radio">` and gets grouping, arrow keys and a roving tab order
 * from the browser; mobile has to be driven entirely from `isChecked`.
 */
export const PlatformRadio = ({
  onAction,
  platform = 'web',
  name,
  ...props
}: IPlatformRadioProps): ReactElement =>
  platform === 'native' ? (
    <NativeRadio {...props} onPress={onAction} />
  ) : (
    <WebRadio {...props} name={name} onChange={onAction} />
  );

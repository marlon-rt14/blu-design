import { ChoiceItem as NativeChoiceItem } from '@dsm/mobile';
import type { IChoiceItemBaseProps } from '@dsm/shared';
import { ChoiceItem as WebChoiceItem } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformChoiceItem}: the shared contract plus a neutral handler. */
export interface IPlatformChoiceItemProps extends IChoiceItemBaseProps {
  /** Fired when the row is picked, on either platform. */
  onAction?: () => void;
  /**
   * Groups radio rows. **Web only** — React Native has no native radio to
   * inherit grouping from, so it is dropped there rather than silently doing
   * nothing.
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
 * Renders either the web or the React Native ChoiceItem from the same props.
 *
 * The divergence worth watching is `name`: on web the row is a real `<label>`
 * around a native input, so rows sharing a `name` get the arrow keys and a
 * single tab stop from the browser. On mobile the selection has to be held
 * above the rows.
 */
export const PlatformChoiceItem = ({
  onAction,
  platform = 'web',
  name,
  ...props
}: IPlatformChoiceItemProps): ReactElement =>
  platform === 'native' ? (
    <NativeChoiceItem {...props} onPress={onAction} />
  ) : (
    <WebChoiceItem {...props} name={name} onChange={onAction} />
  );

import { LinkButton as NativeLinkButton } from '@dsm/mobile';
import type { ILinkButtonBaseProps } from '@dsm/shared';
import { LinkButton as WebLinkButton } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformLinkButton}: the shared LinkButton contract plus a
 * single platform-neutral handler.
 */
export interface IPlatformLinkButtonProps extends ILinkButtonBaseProps {
  /** Fired when the link is activated, on either platform. */
  onAction?: () => void;
  /**
   * Whether the label is underlined. Left `undefined` on purpose in most
   * stories: each platform then applies its own default — `true` on web, `false`
   * on mobile — which is the behaviour worth showing.
   */
  underline?: boolean;
  /**
   * Renders the visited colour. **Web only** — bDS does not implement `visited`
   * in apps, so this is dropped for the native implementation rather than
   * silently doing nothing.
   */
  isVisited?: boolean;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native LinkButton from the same set of
 * shared props, mapping `onAction` to whichever handler the platform expects
 * (`onClick` on web, `onPress` on mobile).
 *
 * Unlike `PlatformButton`, this wrapper cannot pass every prop to both: the two
 * implementations genuinely differ. `isVisited` only exists on web, and
 * `underline` has a different default on each — see `ILinkButtonProps` in either
 * package.
 */
export const PlatformLinkButton = ({
  onAction,
  platform = 'web',
  isVisited,
  ...props
}: IPlatformLinkButtonProps): ReactElement =>
  platform === 'native' ? (
    <NativeLinkButton {...props} onPress={onAction} />
  ) : (
    <WebLinkButton {...props} isVisited={isVisited} onClick={onAction} />
  );

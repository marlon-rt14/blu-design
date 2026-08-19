import { Button as NativeButton } from '@dsm/mobile';
import type { IButtonBaseProps } from '@dsm/shared';
import { Button as WebButton } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformButton}: the shared Button contract plus a single
 * platform-neutral handler.
 */
export interface IPlatformButtonProps extends IButtonBaseProps {
  /** Fired when the button is activated, on either platform. */
  onAction?: () => void;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Button from the same set of shared
 * props, mapping `onAction` to whichever handler the platform expects
 * (`onClick` on web, `onPress` on mobile).
 *
 * This is what lets a single story document both implementations: the story
 * speaks the `@dsm/shared` contract instead of one platform's API, so any
 * divergence between the two shows up immediately when flipping the toolbar.
 *
 * The React Native Button reaches the browser through react-native-web, aliased
 * in `.storybook/main.ts`.
 */
export const PlatformButton = ({
  onAction,
  platform = 'web',
  ...props
}: IPlatformButtonProps): ReactElement =>
  platform === 'native' ? (
    <NativeButton {...props} onPress={onAction} />
  ) : (
    <WebButton {...props} onClick={onAction} />
  );

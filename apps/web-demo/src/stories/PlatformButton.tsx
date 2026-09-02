import { Button as NativeButton } from '@dsm/mobile';
import * as MobileIcons from '@dsm/mobile/icons';
import type { IButtonBaseProps } from '@dsm/shared';
import { Button as WebButton } from '@dsm/web';
import * as WebIcons from '@dsm/web/icons';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';

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
   * Icon before the label, **by export name** rather than by component.
   *
   * The real prop takes the component itself — `leadingIcon={IconPlus}` — but a
   * Storybook control can only hand over a string, so the story picks the
   * platform's version here. There is no `showLeadingIcon`: passing an icon is
   * what shows it.
   */
  leadingIcon?: TIconExportName;
  /** Icon after the label, by export name. See {@link leadingIcon}. */
  trailingIcon?: TIconExportName;
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
  leadingIcon,
  trailingIcon,
  ...props
}: IPlatformButtonProps): ReactElement => {
  if (platform === 'native') {
    return (
      <NativeButton
        {...props}
        leadingIcon={leadingIcon ? MobileIcons[leadingIcon] : undefined}
        onPress={onAction}
        trailingIcon={trailingIcon ? MobileIcons[trailingIcon] : undefined}
      />
    );
  }

  return (
    <WebButton
      {...props}
      leadingIcon={leadingIcon ? WebIcons[leadingIcon] : undefined}
      onClick={onAction}
      trailingIcon={trailingIcon ? WebIcons[trailingIcon] : undefined}
    />
  );
};

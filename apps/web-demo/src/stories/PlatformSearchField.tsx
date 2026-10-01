import { SearchField as NativeSearchField } from '@dsm/mobile';
import type { ISearchFieldBaseProps } from '@dsm/shared';
import { SearchField as WebSearchField } from '@dsm/web';
import type { ReactElement, ReactNode } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformSearchField}: the shared contract plus handlers
 * that both platforms understand under one name.
 */
export interface IPlatformSearchFieldProps extends ISearchFieldBaseProps {
  /** Fired with the next value on every keystroke, on either platform. */
  onValueChange?: (value: string) => void;
  /** Fired when the clear control is pressed. Omit to empty `value`. */
  onClear?: () => void;
  /** Fired with the current value on Enter / the keyboard search key. */
  onSubmit?: (value: string) => void;
  /**
   * Trailing slot. Shown only while `value` is empty. Pass a node from the
   * same platform the story is rendering.
   */
  trailingAccessory?: ReactNode;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native SearchField from the same shared
 * props. `onValueChange` maps to `onChange` on web and `onChangeText` on mobile.
 */
export const PlatformSearchField = ({
  onValueChange,
  onClear,
  onSubmit,
  trailingAccessory,
  platform = 'web',
  ...props
}: IPlatformSearchFieldProps): ReactElement =>
  platform === 'native' ? (
    <NativeSearchField
      {...props}
      onChangeText={onValueChange}
      onClear={onClear}
      onSubmit={onSubmit}
      trailingAccessory={trailingAccessory}
    />
  ) : (
    <WebSearchField
      {...props}
      onChange={onValueChange}
      onClear={onClear}
      onSubmit={onSubmit}
      trailingAccessory={trailingAccessory}
    />
  );

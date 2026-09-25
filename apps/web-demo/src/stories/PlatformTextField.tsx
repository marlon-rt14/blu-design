import { TextField as NativeTextField } from '@dsm/mobile';
import type { ITextFieldBaseProps } from '@dsm/shared';
import { TextField as WebTextField } from '@dsm/web';
import type { ChangeEvent, ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformTextField}: the shared TextField contract plus a
 * single platform-neutral change handler.
 */
export interface IPlatformTextFieldProps
  extends Omit<ITextFieldBaseProps, 'prefixIcon' | 'suffixIcon'> {
  /** Fired with the new value on every keystroke, on either platform. */
  onValueChange?: (value: string) => void;
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop is a `ReactNode` the caller imports from its section; a
   * control can only pass a string, so the bridge builds it — see `iconNode`.
   */
  prefixIcon?: TIconExportName;
  /** The suffix glyph by export name. See {@link prefixIcon}. */
  suffixIcon?: TIconExportName;
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
  prefixIcon,
  suffixIcon,
  platform = 'web',
  ...props
}: IPlatformTextFieldProps): ReactElement => {
  // Live Figma: small and medium fields bind `size/icon/sm` (16), large binds
  // `size/icon/md` (24). The component used to apply this itself.
  const size = props.size === 'large' ? 'md' : 'sm';
  const prefix = iconNode(prefixIcon, platform, size);
  const suffix = iconNode(suffixIcon, platform, size);
  return platform === 'native' ? (
    <NativeTextField {...props} onChangeText={onValueChange} prefixIcon={prefix} suffixIcon={suffix} />
  ) : (
    <WebTextField
      {...props}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onValueChange?.(event.target.value)}
      prefixIcon={prefix}
      suffixIcon={suffix}
    />
  );
};

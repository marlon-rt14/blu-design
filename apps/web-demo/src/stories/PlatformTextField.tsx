import { TextField as NativeTextField } from '@dsm/mobile';
import type { ITextFieldBaseProps } from '@dsm/shared';
import { TextField as WebTextField } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformTextField}: the shared TextField contract plus a
 * single platform-neutral change handler.
 */
export interface IPlatformTextFieldProps
  extends Omit<ITextFieldBaseProps, 'leadingIcon' | 'trailingIcon' | 'onChangeText'> {
  /** Fired with the new value on every keystroke, on either platform. */
  onChangeText?: (value: string) => void;
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop is a `ReactNode` the caller imports from its section; a
   * control can only pass a string, so the bridge builds it — see `iconNode`.
   */
  leadingIcon?: TIconExportName;
  /** The trailing glyph by export name. See {@link leadingIcon}. */
  trailingIcon?: TIconExportName;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native TextField from the same set of
 * shared props. Since the contract moved `onChangeText` into the shared base
 * there is almost nothing left to map — only the glyphs, which have to come
 * from the matching package.
 *
 * This is what lets a single story document both implementations — see
 * `PlatformButton` for the same idea applied to Button.
 */
export const PlatformTextField = ({
  onChangeText,
  leadingIcon,
  trailingIcon,
  platform = 'web',
  ...props
}: IPlatformTextFieldProps): ReactElement => {
  // Live Figma: `sm` and `md` fields bind `size/icon/sm` (16), `lg` binds
  // `size/icon/md` (24). The component used to apply this itself.
  const size = props.size === 'lg' ? 'md' : 'sm';
  const leading = iconNode(leadingIcon, platform, size);
  const trailing = iconNode(trailingIcon, platform, size);
  const handleChange = (value: string): void => onChangeText?.(value);
  return platform === 'native' ? (
    <NativeTextField
      {...props}
      leadingIcon={leading}
      onChangeText={handleChange}
      trailingIcon={trailing}
    />
  ) : (
    <WebTextField
      {...props}
      leadingIcon={leading}
      onChangeText={handleChange}
      trailingIcon={trailing}
    />
  );
};

import { CardField as NativeCardField } from '@dsm/mobile';
import type { ICardFieldBaseProps, ICardFieldCommonProps, TCardBrand, TCardFieldPart } from '@dsm/shared';
import { CardField as WebCardField } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformCardField}: the shared contract **flattened**, plus
 * the platform switch.
 *
 * The library's contract is a discriminated union — `brand` exists only when
 * `part` is `'number'`. This type is not, deliberately: **a controls panel
 * cannot express a discriminated union.** `part` and `brand` are two
 * independent dropdowns, and nothing stops a reader from picking `cvv` and then
 * a brand. So the bridge takes the loose shape and narrows on the way in,
 * below — which is also what drops `brand` when the part cannot carry one.
 *
 * The guarantee stays where it matters: `@dsm/web` and `@dsm/mobile` still
 * refuse `part="cvv" brand="visa"` at compile time. What is relaxed here is demo
 * scaffolding, not the component's API.
 */
export type IPlatformCardFieldProps = ICardFieldCommonProps & {
  part: TCardFieldPart;
  /** Ignored unless `part` is `'number'` — see the note above. */
  brand?: TCardBrand;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
};

/**
 * Renders either the web or the React Native CardField from the same props.
 *
 * Nothing to map between platforms: both take the shared contract unchanged and
 * `onChangeText` is already the name on both sides. The only work here is
 * rebuilding the discriminated union the panel flattened, which is also what
 * drops `brand` when the part cannot carry one.
 */
export const PlatformCardField = ({
  platform = 'web',
  part,
  brand,
  ...common
}: IPlatformCardFieldProps): ReactElement => {
  const fieldProps: ICardFieldBaseProps =
    part === 'number' ? { ...common, part, brand } : { ...common, part };

  return platform === 'native' ? (
    <NativeCardField {...fieldProps} />
  ) : (
    <WebCardField {...fieldProps} />
  );
};

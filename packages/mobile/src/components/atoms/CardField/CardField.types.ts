import type { ICardFieldBaseProps } from '@dsm/shared';

/**
 * Props of the React Native CardField: the shared contract, unchanged.
 *
 * Still a discriminated union — `brand` exists only when `part` is `'number'`.
 * No `style`, matching every other component here: the field fills the width it
 * is given.
 */
export type ICardFieldProps = ICardFieldBaseProps;

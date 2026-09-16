import type { ICardFieldBaseProps } from '@dsm/shared';

/**
 * Props of the web CardField: the shared contract, unchanged.
 *
 * Still a discriminated union — `brand` exists only when `part` is `'number'`.
 * No `style` or `className`, matching every other component here: the field
 * fills the width it is given.
 */
export type ICardFieldProps = ICardFieldBaseProps;

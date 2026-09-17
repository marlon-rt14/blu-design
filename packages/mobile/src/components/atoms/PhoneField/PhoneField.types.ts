import type { IPhoneFieldBaseProps } from '@dsm/shared';

/**
 * Props of the native PhoneField.
 *
 * Identical to the shared contract: the country selector's sheet is opened by
 * the component itself, so nothing platform-specific has to be passed in.
 * `onChangeText` and `onCountryChange` already live in the contract, unlike
 * Select's `onChange`, because a field's text handler is the field.
 */
export type IPhoneFieldProps = IPhoneFieldBaseProps;

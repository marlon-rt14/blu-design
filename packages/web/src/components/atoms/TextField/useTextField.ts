import type { ITextFieldProps } from './TextField.types';

/** Values the TextField needs to render, derived from its props. */
interface IUseTextFieldResult {
  /** Composed class list for the container, e.g. `'dsm-textfield dsm-textfield--large dsm-textfield--invalid'`. */
  containerClassName: string;
  /** Normalized disabled flag, safe to hand straight to the `<input>`. */
  isDisabled: boolean;
  /** Normalized read-only flag, safe to hand straight to the `<input>`. */
  isReadOnly: boolean;
  /** Whether the field is in its invalid state — `isInvalid` or a set `errorMessage`. */
  isInvalid: boolean;
  /** `errorMessage` when set, otherwise `helperText`. `undefined` when neither is set. */
  displayedHelperText: string | undefined;
  /** `"n / max"` when `maxLength` is set, otherwise `undefined`. */
  counterText: string | undefined;
}

/**
 * Resolves the TextField class names and derived text from its props.
 *
 * Interaction states (hover, focus) are left to CSS pseudo-classes in
 * `TextField.css` — the same approach the web Button uses. Only states that
 * change the CONTAINER's look and cannot be expressed as a pseudo-class
 * (disabled, read-only, invalid) become explicit modifier classes here.
 *
 * @param props - The TextField props. `value` is read only to compute the counter.
 * @returns The class list, normalized flags, and the text to render below the field.
 */
export const useTextField = ({
  size = 'medium',
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  errorMessage,
  helperText,
  value,
  maxLength,
}: ITextFieldProps): IUseTextFieldResult => {
  const hasError = isInvalid || Boolean(errorMessage);

  const containerClassName = [
    'dsm-textfield',
    `dsm-textfield--${size}`,
    hasError && 'dsm-textfield--invalid',
    isDisabled && 'dsm-textfield--disabled',
    isReadOnly && 'dsm-textfield--readonly',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    containerClassName,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    displayedHelperText: errorMessage ?? helperText,
    counterText: maxLength !== undefined ? `${value.length} / ${maxLength}` : undefined,
  };
};

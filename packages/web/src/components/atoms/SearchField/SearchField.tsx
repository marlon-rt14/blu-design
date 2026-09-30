import { useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';

import { IconSearchSm, IconX } from '../../../icons/general';
import { IconButton } from '../IconButton';
import type { ISearchFieldProps } from './SearchField.types';
import { useSearchField } from './useSearchField';

/** Accessible name of the clear control. Dev platform section, web. */
const CLEAR_LABEL = 'Borrar búsqueda';

/**
 * Web SearchField — a bordered search bar.
 *
 * `type="search"` so Enter submits. The native WebKit clear glyph is hidden
 * in `pseudo.css`; this component draws `IconButton` appearance `veil` instead,
 * and only while there is text. `trailingAccessory` occupies that slot while
 * the field is empty.
 *
 * The search glyph is decorative. `placeholder` is the accessible name.
 */
export const SearchField = ({
  value,
  placeholder,
  onChange,
  onClear,
  onSubmit,
  trailingAccessory,
  autoFocus = false,
  testID,
  ...rest
}: ISearchFieldProps): ReactElement => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { fieldStyle, iconStyle, inputStyle, clearButtonSize, isDisabled } = useSearchField({
    ...rest,
    value,
    placeholder,
    autoFocus,
    isHovered,
    isFocused,
  });

  const hasValue = value.length > 0;

  const handleClear = (): void => {
    if (onClear) {
      onClear();
      return;
    }
    onChange?.('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <div
      style={fieldStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={iconStyle} aria-hidden>
        <IconSearchSm size="sm" />
      </span>
      <input
        className="dsm-input"
        type="search"
        enterKeyHint="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={isDisabled}
        autoFocus={autoFocus}
        data-testid={testID}
        style={inputStyle}
        onChange={(event) => onChange?.(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {hasValue ? (
        <IconButton
          appearance="veil"
          icon={IconX}
          label={CLEAR_LABEL}
          size={clearButtonSize}
          disabled={isDisabled}
          onPress={handleClear}
        />
      ) : (
        trailingAccessory
      )}
    </div>
  );
};

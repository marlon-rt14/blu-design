import type { TIconSize, TSelectSize } from '@dsm/shared';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';

import { FieldIcon } from '../../atoms/TextField/FieldIcon';
import { IconCheck, IconChevronDown, IconSearch } from '../../../icons';
import { ListItem } from '../ListItem';
import type { ISelectProps } from './Select.types';
import { useSelect } from './useSelect';

/** Select's field steps map onto Icon's the same way TextField's do: sm/md share `sm`, lg steps to `md`. */
const iconSizeForField = (size: TSelectSize): TIconSize => (size === 'lg' ? 'md' : 'sm');

/**
 * Web Select — a field whose value comes from a fixed catalog through a
 * menu, not from typing. If real text filtering of the *value* is needed,
 * this is not the right component — that is Combobox.
 *
 * The field and the menu are one control for a screen reader: it is a real
 * `aria-haspopup="listbox"` button with the options as `role="option"` rows,
 * so opening it announces how many there are and which is chosen. `isOpen`
 * is never a prop — see `ISelectBaseProps`'s docs for why.
 *
 * `isSearchable` adds a search box inside the open menu that narrows which
 * rows show — the field itself stays a non-editable button either way.
 *
 * @example
 * ```tsx
 * <Select
 *   label="País"
 *   options={[{ value: 'ec', label: 'Ecuador' }, { value: 'pe', label: 'Perú' }]}
 *   value={country}
 *   onChange={setCountry}
 * />
 * ```
 */
export const Select = (props: ISelectProps): ReactElement => {
  const {
    label,
    options,
    value,
    size = 'md',
    placeholder,
    leadingIcon,
    helperText,
    error,
    readOnly = false,
    disabled = false,
    isSearchable = false,
    onChange,
    testID,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [highlightedValue, setHighlightedValue] = useState<string | undefined>(value);
  const [searchQuery, setSearchQuery] = useState('');

  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const typeaheadRef = useRef('');
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fieldId = useId();
  const listboxId = `${fieldId}-listbox`;
  const footerId = `${fieldId}-footer`;
  const isInteractive = !disabled && !readOnly;
  const hasFooter = Boolean(error) || Boolean(helperText);
  const selectedOption = options.find((option) => option.value === value);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleOptions =
    isSearchable && normalizedQuery
      ? options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
      : options;

  const {
    wrapperStyle,
    fieldStyle,
    contentStyle,
    valueRowStyle,
    labelStyle,
    valueStyle,
    iconStyle,
    chevronStyle,
    footerStyle,
    helperStyle,
    menuStyle,
    menuListStyle,
    searchWrapperStyle,
    searchInputStyle,
    noOptionsStyle,
    menuOptionHighlightColor,
    showFloatingLabel,
    hasError,
  } = useSelect({ ...props, isHovered, isPressed, isFocusVisible, isOpen });

  // Closes on an outside click — the menu can always be dismissed without choosing.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  // Puts focus in the search box the moment the menu opens, so typing works immediately.
  useEffect(() => {
    if (isOpen && isSearchable) searchInputRef.current?.focus();
  }, [isOpen, isSearchable]);

  // Keeps the highlight on a row that is still visible once the search narrows the list.
  useEffect(() => {
    if (!isOpen) return;
    if (!visibleOptions.some((option) => option.value === highlightedValue)) {
      setHighlightedValue(visibleOptions[0]?.value);
    }
  }, [visibleOptions, isOpen, highlightedValue]);

  const openMenu = (): void => {
    if (!isInteractive) return;
    setSearchQuery('');
    setHighlightedValue(value ?? options[0]?.value);
    setIsOpen(true);
  };

  const closeMenu = (): void => setIsOpen(false);

  const commit = (nextValue: string): void => {
    onChange(nextValue);
    closeMenu();
  };

  const moveHighlight = (delta: 1 | -1): void => {
    if (visibleOptions.length === 0) return;
    const currentIndex = visibleOptions.findIndex((option) => option.value === highlightedValue);
    const nextIndex = (currentIndex + delta + visibleOptions.length) % visibleOptions.length;
    setHighlightedValue(visibleOptions[nextIndex]?.value);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveHighlight(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveHighlight(-1);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (highlightedValue !== undefined) commit(highlightedValue);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
    }
  };

  // Native `<select>`'s own behavior: typing jumps straight to the match,
  // whether the menu is open or not — no filtering, just a starts-with jump.
  const handleTypeahead = (character: string): void => {
    typeaheadRef.current += character.toLowerCase();
    clearTimeout(typeaheadTimeoutRef.current);
    typeaheadTimeoutRef.current = setTimeout(() => {
      typeaheadRef.current = '';
    }, 500);
    const match = options.find((option) => option.label.toLowerCase().startsWith(typeaheadRef.current));
    if (match) {
      if (isOpen) setHighlightedValue(match.value);
      else commit(match.value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!isInteractive) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) openMenu();
      else moveHighlight(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) openMenu();
      else moveHighlight(-1);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isOpen) openMenu();
      else if (highlightedValue !== undefined) commit(highlightedValue);
      return;
    }
    if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault();
        closeMenu();
      }
      return;
    }
    if (event.key.length === 1 && event.key !== ' ') {
      handleTypeahead(event.key);
    }
  };

  const handleClick = (): void => {
    if (!isInteractive) return;
    if (isOpen) closeMenu();
    else openMenu();
  };

  return (
    <div ref={rootRef} style={wrapperStyle}>
      <div
        aria-controls={isOpen ? listboxId : undefined}
        aria-disabled={disabled || undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        data-testid={testID}
        onBlur={() => setIsFocusVisible(false)}
        onClick={handleClick}
        onFocus={(event) => setIsFocusVisible(event.currentTarget.matches(':focus-visible'))}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        role="combobox"
        style={fieldStyle}
        tabIndex={disabled ? -1 : 0}
      >
        {leadingIcon ? (
          <span style={iconStyle}>
            <FieldIcon color={disabled ? 'disabled' : 'secondary'} name={leadingIcon} size={iconSizeForField(size)} />
          </span>
        ) : null}
        <span style={contentStyle}>
          {showFloatingLabel ? <span style={labelStyle}>{label}</span> : null}
          <span style={valueRowStyle}>
            <span style={valueStyle}>{selectedOption?.label ?? placeholder ?? label}</span>
          </span>
        </span>
        <span style={chevronStyle}>
          <IconChevronDown color={disabled ? 'disabled' : 'secondary'} size={iconSizeForField(size)} />
        </span>
        {isOpen ? (
          <div style={menuStyle}>
            {isSearchable ? (
              <div style={searchWrapperStyle}>
                <span style={iconStyle}>
                  <IconSearch color="secondary" size={iconSizeForField(size)} />
                </span>
                <input
                  aria-controls={listboxId}
                  aria-label={`Buscar en ${label}`}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar..."
                  ref={searchInputRef}
                  style={searchInputStyle}
                  type="text"
                  value={searchQuery}
                />
              </div>
            ) : null}
            {visibleOptions.length === 0 ? (
              <p style={noOptionsStyle}>Sin resultados</p>
            ) : (
              <ul aria-label={label} id={listboxId} role="listbox" style={menuListStyle}>
                {visibleOptions.map((option) => {
                  const isSelected = option.value === value;
                  const isHighlighted = option.value === highlightedValue;
                  return (
                    <li
                      aria-selected={isSelected}
                      key={option.value}
                      onClick={() => commit(option.value)}
                      onMouseEnter={() => setHighlightedValue(option.value)}
                      role="option"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isHighlighted ? menuOptionHighlightColor : undefined,
                      }}
                    >
                      <ListItem
                        icon={option.icon}
                        label={option.label}
                        leadingContent={option.icon ? 'icon' : 'none'}
                        showTrailing={isSelected}
                        trailing={isSelected ? <IconCheck color="brand" size="sm" /> : null}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}
      </div>
      {hasFooter ? (
        <div id={footerId} style={footerStyle}>
          <p role={hasError ? 'alert' : undefined} style={helperStyle}>
            {error ?? helperText}
          </p>
        </div>
      ) : null}
    </div>
  );
};

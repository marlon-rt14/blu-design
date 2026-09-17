import type { IMenuOption } from '@dsm/shared';
import type { CSSProperties } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';

import { FieldIcon } from '../../atoms/TextField/FieldIcon';
import { IconCheck } from '../../../icons';
import type { IMenuProps } from './Menu.types';
import { useMenu } from './useMenu';

const contentColumnStyle: CSSProperties = { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 };

/**
 * Web Menu — the floating list itself. One component for all three of
 * Figma's: a row (MenuItem), and what renders in the rows' own place when
 * `options` is empty (MenuEmpty) — never a component instanced on its own.
 *
 * Pure content: there is no `isOpen`, no anchor and no outside-click
 * handling here. Mounting it, positioning it as a popover and dismissing it
 * is the caller's job — same reasoning Select's own dropdown already
 * follows internally.
 *
 * A single-tabstop `role="listbox"` with `aria-activedescendant`, matching
 * the ARIA APG listbox pattern: focus never leaves the list itself. Focuses
 * itself on mount so keyboard use works the instant it appears.
 *
 * @example
 * ```tsx
 * <Menu
 *   header="Selecciona una opción"
 *   onSelect={setAccount}
 *   options={[{ value: 'savings', label: 'Cuenta de ahorros' }]}
 *   value={account}
 * />
 * ```
 */
export const Menu = (props: IMenuProps): ReactElement => {
  const { options, value, header, size = 'md', emptyMessage = 'Sin resultados', onSelect, testID } = props;

  const selectedValues = Array.isArray(value) ? value : value !== undefined ? [value] : [];

  const initialHighlight = (): string | undefined => {
    const selected = options.find((option) => selectedValues.includes(option.value));
    if (selected) return selected.value;
    return (options.find((option) => !option.disabled) ?? options[0])?.value;
  };

  const [highlightedValue, setHighlightedValue] = useState<string | undefined>(initialHighlight);
  const [pressedValue, setPressedValue] = useState<string | undefined>(undefined);
  const [isListFocusVisible, setIsListFocusVisible] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef('');
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const menuId = useId();
  const headerId = `${menuId}-header`;

  const { wrapperStyle, headerStyle, listStyle, emptyStyle, getItemStyle } = useMenu({ size });

  // Keyboard use works the instant the menu appears — it has no trigger of its own to hand focus over.
  useEffect(() => {
    listRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!options.some((option) => option.value === highlightedValue)) {
      setHighlightedValue(initialHighlight());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const activate = (option: IMenuOption): void => {
    if (option.disabled) return;
    onSelect(option.value);
  };

  const moveHighlight = (delta: 1 | -1): void => {
    if (options.length === 0) return;
    const currentIndex = options.findIndex((option) => option.value === highlightedValue);
    const nextIndex = (currentIndex + delta + options.length) % options.length;
    setHighlightedValue(options[nextIndex]?.value);
  };

  // Native `<select>`'s own behavior: typing jumps straight to the match, no filtering.
  const handleTypeahead = (character: string): void => {
    typeaheadRef.current += character.toLowerCase();
    clearTimeout(typeaheadTimeoutRef.current);
    typeaheadTimeoutRef.current = setTimeout(() => {
      typeaheadRef.current = '';
    }, 500);
    const match = options.find((option) => option.label.toLowerCase().startsWith(typeaheadRef.current));
    if (match) setHighlightedValue(match.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>): void => {
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
    if (event.key === 'Home') {
      event.preventDefault();
      setHighlightedValue(options[0]?.value);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      setHighlightedValue(options[options.length - 1]?.value);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = options.find((candidate) => candidate.value === highlightedValue);
      if (option) activate(option);
      return;
    }
    if (event.key.length === 1) {
      handleTypeahead(event.key);
    }
  };

  const activeId =
    highlightedValue !== undefined ? `${menuId}-item-${options.findIndex((option) => option.value === highlightedValue)}` : undefined;

  return (
    <div data-testid={testID} style={wrapperStyle}>
      {header ? (
        <div id={headerId} style={headerStyle}>
          {header}
        </div>
      ) : null}
      {options.length === 0 ? (
        <p style={emptyStyle}>{emptyMessage}</p>
      ) : (
        <ul
          aria-activedescendant={activeId}
          aria-labelledby={header ? headerId : undefined}
          onBlur={() => setIsListFocusVisible(false)}
          onFocus={(event) => setIsListFocusVisible(event.currentTarget.matches(':focus-visible'))}
          onKeyDown={handleKeyDown}
          ref={listRef}
          role="listbox"
          style={listStyle}
          tabIndex={0}
        >
          {options.map((option, index) => {
            const isSelected = selectedValues.includes(option.value);
            const isHighlighted = option.value === highlightedValue;
            const isPressed = option.value === pressedValue;
            const isDisabled = Boolean(option.disabled);
            const { rowStyle, labelStyle, descriptionStyle, trailingStyle, iconColor, checkColor } = getItemStyle({
              isSelected,
              isHighlighted,
              isPressed,
              isFocusVisible: isListFocusVisible && isHighlighted,
              isDisabled,
            });

            return (
              <li
                aria-disabled={isDisabled || undefined}
                aria-selected={isSelected}
                id={`${menuId}-item-${index}`}
                key={option.value}
                onClick={() => activate(option)}
                onMouseDown={() => setPressedValue(option.value)}
                onMouseEnter={() => setHighlightedValue(option.value)}
                onMouseLeave={() => setPressedValue((current) => (current === option.value ? undefined : current))}
                onMouseUp={() => setPressedValue(undefined)}
                role="option"
                style={rowStyle}
              >
                {option.leading ? (
                  <span style={{ display: 'inline-flex', flexShrink: 0, color: iconColor }}>
                    <FieldIcon name={option.leading} size="sm" />
                  </span>
                ) : null}
                <span style={contentColumnStyle}>
                  <span style={labelStyle}>{option.label}</span>
                  {option.description ? <span style={descriptionStyle}>{option.description}</span> : null}
                </span>
                {option.trailingText ? <span style={trailingStyle}>{option.trailingText}</span> : null}
                {isSelected ? (
                  <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0, color: checkColor }}>
                    <IconCheck size="sm" />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

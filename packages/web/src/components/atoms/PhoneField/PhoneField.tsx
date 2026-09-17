import { useEffect, useId, useRef } from 'react';
// Aliased: the DOM's own `KeyboardEvent` is what `document.addEventListener`
// hands back below, and React's synthetic one would shadow it.
import type { KeyboardEvent as IReactKeyboardEvent, ReactElement } from 'react';

import { IconChevronDown } from '../../../icons';
import { Menu } from '../../molecules/Menu';
import { CountryFlag } from './CountryFlag';
import type { IPhoneFieldProps } from './PhoneField.types';
import { usePhoneField } from './usePhoneField';

/**
 * Web PhoneField — a phone number, with or without a country selector in front
 * of it.
 *
 * What makes it a PhoneField rather than a TextField is **the data, not the
 * drawing**: a numeric keypad, a phone autofill hint and a country whose dial
 * prefix rides along. *"Si el campo no captura un telefono, es un TextField."*
 *
 * **The country is one datum.** The flag and the prefix both come out of
 * `country`; in Figma they are two loose properties that can contradict each
 * other, which is that file's largest declared divergence.
 *
 * **It does not format the number.** `value` is what the user typed, ungrouped —
 * the spacing in `99 123 4567` comes from a formatter outside the component.
 *
 * ### Two controls, not one — when there is a selector
 *
 * bDS is explicit: *"el selector de país es un control aparte del campo de
 * número: dos elementos enfocables, cada uno con su nombre"*. So the trigger is
 * a real `<button>` with its own accessible name and its own
 * `size/target/min` touch area, and the number is an `<input>` with its own
 * label. Tab moves between them.
 *
 * The dial code is not decoration either — it is part of the input's accessible
 * description, because *"el prefijo tiene que llegar al lector junto con el
 * número, o quien no ve la pantalla no sabe a qué país está marcando"*.
 *
 * With `leadingContent="none"` none of that is rendered and the value starts at
 * the edge. That is half of Figma's set, not an edge case.
 *
 * ### The list is a Menu, filtered upstream
 *
 * `Menu` is pure content — no `isOpen`, no anchor, no outside-click — so the
 * panel, the dismissal and the search box live here. Filtering before handing
 * over the options is exactly how that component is meant to be driven, and it
 * is what satisfies bDS's requirement that *"una lista de países necesita
 * búsqueda por teclado: doscientos elementos sin filtro no son navegables"*.
 * The Menu's own typeahead jumps to a match but does not filter, which is not
 * enough at 243 rows.
 *
 * @example
 * ```tsx
 * <PhoneField
 *   label="Numero de celular"
 *   value={phone}
 *   onChangeText={setPhone}
 *   country={country}
 *   onCountryChange={setCountry}
 * />
 * ```
 */
export const PhoneField = (props: IPhoneFieldProps): ReactElement => {
  const {
    label,
    value,
    onChangeText,
    onCountryChange,
    size = 'md',
    leadingContent = 'select',
    disabled = false,
    testID,
  } = props;
  // Half of Figma's 144 variants are `leadingContent=none`, where the field is
  // *"limpio, como un input de texto, y el valor arranca en el borde"*. It stays
  // a PhoneField: the keypad, the autofill hint and the validation are what make
  // it one, and none of them come from the prefix.
  const hasSelect = leadingContent === 'select';
  const {
    containerStyle,
    labelStyle,
    inputStyle,
    helperStyle,
    triggerStyle,
    dialCodeStyle,
    dividerStyle,
    chevronStyle,
    panelStyle,
    listStyle,
    searchStyle,
    flag,
    country,
    dialCode,
    countryRows,
    isOpen,
    isFloating,
    search,
    message,
    setSearch,
    open,
    close,
    handlers,
  } = usePhoneField(props);

  const inputId = useId();
  const messageId = `${inputId}-message`;
  const dialCodeId = `${inputId}-dial`;
  // The prefix is only part of the description when there is a prefix.
  const describedBy =
    [hasSelect ? dialCodeId : undefined, message === undefined ? undefined : messageId]
      .filter((id) => id !== undefined)
      .join(' ') || undefined;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // **`Menu` focuses its own list on mount** — right for a menu opened from
  // nowhere, wrong here, where the first thing to do with 243 countries is
  // type. A parent's effect runs after its children's, so this one wins, and it
  // is why the search box does not simply carry `autoFocus`.
  useEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  // Menu brings no dismissal of its own, by design. Escape and an outside
  // pointer are the two the listbox pattern expects; the panel keeps focus
  // inside itself while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close();
    };
    const onPointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen, close]);

  /**
   * Hands the list the focus it would have taken on its own, so the keyboard
   * path is: type to filter, `ArrowDown` to walk, `Enter` to pick. The walking
   * and the picking are the Menu's; only the handover is ours.
   */
  const handleSearchKeyDown = (event: IReactKeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    panelRef.current?.querySelector<HTMLElement>('[role="listbox"]')?.focus();
  };

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%' }}>
      {/* Only the pointer handlers: `onFocus`/`onBlur` go on the input alone,
          because React's focus events bubble and the trigger sits inside this
          box — wiring them here would ring the whole field when only the
          country button is focused. */}
      <div
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
        style={containerStyle}
      >
        {hasSelect ? (
          <>
            <button
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              // The action and the current value, because the flag is hidden and
              // the code alone would read as a number.
              aria-label={`País: ${countryRows.find((row) => row.code === country)?.label ?? country}`}
              disabled={disabled}
              onClick={() => (isOpen ? close() : open())}
              style={triggerStyle}
              type="button"
            >
              <CountryFlag {...flag} announce={false} country={country} />
              <span style={dialCodeStyle}>{dialCode}</span>
              <span style={chevronStyle}>
                <IconChevronDown size="sm" />
              </span>
            </button>
            <span style={dividerStyle} />
          </>
        ) : null}
        <span style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
          <input
            aria-describedby={describedBy}
            aria-invalid={message?.isError === true ? true : undefined}
            // Named here and not only by the `<label>`: that element is
            // `display: none` while the label is unfloated, and a hidden label
            // is not a reliable source for the accessible name.
            aria-label={label}
            autoComplete="tel"
            data-testid={testID}
            disabled={disabled}
            id={inputId}
            inputMode="tel"
            onBlur={handlers.onBlur}
            onChange={(event) => onChangeText(event.target.value)}
            onFocus={handlers.onFocus}
            // Floated, the label is already on screen; unfloated it *is* the
            // placeholder. One string, never two to keep in step.
            placeholder={isFloating ? undefined : label}
            style={inputStyle}
            type="tel"
            value={value}
          />
        </span>
        {/* Hidden, and referenced by the input: this is how the prefix reaches a
            screen reader together with the number. */}
        {hasSelect ? (
          <span hidden id={dialCodeId}>
            {dialCode}
          </span>
        ) : null}
      </div>
      {isOpen ? (
        <div ref={panelRef} style={panelStyle}>
          <input
            aria-label="Buscar país"
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar país o código"
            ref={searchRef}
            style={searchStyle}
            type="search"
            value={search}
          />
          {/* The scroll lives here rather than inside `Menu`, which has no max
              height of its own. */}
          <div style={listStyle}>
            <Menu
              onSelect={(selected) => {
                onCountryChange?.(selected as typeof country);
                close();
              }}
              options={countryRows.map((row) => ({
                value: row.code,
                label: row.label,
                trailingText: row.dialCode,
                // `announce` off: the row's own label already says the country,
                // and a second copy would read every country twice.
                leadingContent: <CountryFlag {...flag} announce={false} country={row.code} />,
              }))}
              // bDS's own mapping, not a guess: *"Menu size=sm para el campo sm;
              // Menu size=md para md y lg"*.
              size={size === 'sm' ? 'sm' : 'md'}
              value={country}
            />
          </div>
        </div>
      ) : null}
      {message === undefined ? null : (
        <span id={messageId} role={message.isError ? 'alert' : undefined} style={helperStyle}>
          {message.text}
        </span>
      )}
    </div>
  );
};

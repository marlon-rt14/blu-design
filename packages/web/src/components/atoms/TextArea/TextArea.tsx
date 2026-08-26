import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import type { ITextAreaProps } from './TextArea.types';
import { useTextArea } from './useTextArea';

const DEFAULT_ROWS = 3;

/**
 * Web TextArea — a multi-line text input that grows with its content, with a
 * floating label, helper/error text and an optional character counter.
 *
 * `label` lives inside the same bordered box as the value — it acts as the
 * `<textarea>`'s placeholder while `value` is empty, and floats above the
 * value as soon as there is one. There is no separate `placeholder` prop:
 * Figma's own description puts it as one node swapping which property it
 * points to ("a label cuando hace de placeholder, a value cuando muestra un
 * valor"), which this mirrors by conditionally rendering the floating
 * `<label>` instead of animating a single absolutely-positioned node.
 *
 * Height: `rows` sets the starting height; a `useLayoutEffect` measures
 * `scrollHeight` on every keystroke and grows the `<textarea>` to fit. The
 * bordered box's own `minHeight` (see `useTextArea`) is a floor on the whole
 * box, enforced by CSS regardless of how tall the `<textarea>` itself is.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * <TextArea label="Comentario" value={value} onChange={(e) => setValue(e.target.value)} />
 * <TextArea label="Comentario" value={value} onChange={onChange} maxLength={200} />
 * <TextArea label="Motivo" value={value} onChange={onChange} errorMessage="Campo requerido" />
 * ```
 */
export const TextArea = (props: ITextAreaProps): ReactElement => {
  const { value, label, onChange, onFocus, onBlur, rows = DEFAULT_ROWS, name, maxLength, testID } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    wrapperStyle,
    fieldStyle,
    labelStyle,
    textareaStyle,
    footerStyle,
    helperStyle,
    counterStyle,
    isDisabled,
    isReadOnly,
    isInvalid,
    hasValue,
    displayedHelperText,
    counterText,
  } = useTextArea({ ...props, isHovered, isFocused });
  const textareaId = useId();
  const footerId = `${textareaId}-footer`;
  const hasFooter = Boolean(displayedHelperText) || Boolean(counterText);

  // Auto-grow: collapse to the content's natural height, then read
  // `scrollHeight` — the only way to ask the browser "how tall would this be
  // with no scrollbar" for a controlled, unbounded-growth textarea. The
  // bordered box's own `minHeight` (in `fieldStyle`) is the floor, not this.
  useLayoutEffect(() => {
    const node = textareaRef.current;
    if (!node) {
      return;
    }
    node.style.height = 'auto';
    setMeasuredHeight(node.scrollHeight);
  }, [value]);

  const handleMouseEnter = (): void => setIsHovered(true);
  const handleMouseLeave = (): void => setIsHovered(false);
  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>): void => {
    setIsFocused(true);
    onFocus?.(event);
  };
  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>): void => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <div style={wrapperStyle}>
      <div style={fieldStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {hasValue && label ? (
          <label htmlFor={textareaId} style={labelStyle}>
            {label}
          </label>
        ) : null}
        <textarea
          aria-describedby={hasFooter ? footerId : undefined}
          aria-invalid={isInvalid}
          className="dsm-input"
          data-testid={testID}
          disabled={isDisabled}
          id={textareaId}
          maxLength={maxLength}
          name={name}
          onBlur={handleBlur}
          onChange={onChange}
          onFocus={handleFocus}
          placeholder={hasValue ? undefined : label}
          readOnly={isReadOnly}
          ref={textareaRef}
          rows={rows}
          style={{ ...textareaStyle, height: measuredHeight }}
          value={value}
        />
      </div>
      {hasFooter ? (
        <div id={footerId} style={footerStyle}>
          {displayedHelperText ? (
            // role="alert" only for actual errors — plain helper text is
            // announced politely instead of interrupting the screen reader.
            <span
              aria-live={isInvalid ? undefined : 'polite'}
              role={isInvalid ? 'alert' : undefined}
              style={helperStyle}
            >
              {displayedHelperText}
            </span>
          ) : null}
          {counterText ? (
            // Figma: "si hay límite de caracteres, el contador es
            // obligatorio y tiene que anunciarse al lector de pantalla, no
            // solo verse" — aria-live, not just a visual span.
            <span aria-live="polite" style={counterStyle}>
              {counterText}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

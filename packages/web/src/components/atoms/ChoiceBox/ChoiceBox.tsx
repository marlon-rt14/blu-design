import { useState } from 'react';
import type { FocusEvent, KeyboardEvent, ReactElement } from 'react';

import { Checkbox } from '../Checkbox';
import { FieldIcon } from '../TextField/FieldIcon';
import type { IChoiceBoxProps } from './ChoiceBox.types';
import { useChoiceBox } from './useChoiceBox';

/**
 * The whole surface is the real control (Figma: "la caja entera es el
 * control"). The Checkbox rendered inside it is a non-interactive mirror of
 * `isChecked` — clicks and key presses are handled on the wrapper, not on
 * the inner Checkbox, so there is exactly one toggle path.
 */
export const ChoiceBox = (props: IChoiceBoxProps): ReactElement => {
  const {
    variant = 'row',
    title,
    icon,
    description,
    showDescription = true,
    showMedia = true,
    showControl = true,
    isChecked = false,
    isDisabled = false,
    onChange,
    onFocus,
    onBlur,
    id,
    testID,
  } = props;

  const isCompact = variant === 'compact';
  const displayIcon = !isCompact && showMedia ? icon : undefined;
  const displayControl = !isCompact && showControl;

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const { rowStyle, surfaceStyle, overlayStyle, headerRowStyle, contentStyle, titleStyle, descriptionStyle } =
    useChoiceBox({ ...props, isChecked, isDisabled, isHovered, isPressed, isFocusVisible });

  const toggle = (): void => {
    if (isDisabled) return;
    onChange?.(!isChecked);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (isDisabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggle();
    }
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>): void => {
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
    setIsFocusVisible(false);
    onBlur?.(event);
  };

  const control = displayControl ? (
    <span aria-hidden="true" style={{ pointerEvents: 'none' }}>
      <Checkbox isChecked={isChecked} isDisabled={isDisabled} showLabel={false} />
    </span>
  ) : null;

  const content = (
    <span style={contentStyle}>
      <span style={titleStyle}>{title}</span>
      {showDescription && description ? <span style={descriptionStyle}>{description}</span> : null}
    </span>
  );

  return (
    <div
      aria-checked={isChecked}
      aria-disabled={isDisabled || undefined}
      data-testid={testID}
      id={id}
      onBlur={handleBlur}
      onClick={toggle}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      role="checkbox"
      style={rowStyle}
      tabIndex={isDisabled ? -1 : 0}
    >
      <span style={surfaceStyle}>
        {overlayStyle ? <span style={overlayStyle} /> : null}
        {variant === 'tile' ? (
          <>
            <span style={headerRowStyle}>
              {displayIcon ? <FieldIcon color={isDisabled ? 'disabled' : 'primary'} name={displayIcon} size="lg" /> : null}
              {control ? <span style={{ marginInlineStart: 'auto' }}>{control}</span> : null}
            </span>
            {content}
          </>
        ) : (
          <>
            {displayIcon ? <FieldIcon color={isDisabled ? 'disabled' : 'primary'} name={displayIcon} size="lg" /> : null}
            {content}
            {control}
          </>
        )}
      </span>
    </div>
  );
};


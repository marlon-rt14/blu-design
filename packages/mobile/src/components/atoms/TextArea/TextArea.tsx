import { useState } from 'react';
import type { ReactElement } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputContentSizeChangeEvent } from 'react-native';

import { textAreaStyles } from './TextArea.styles';
import type { ITextAreaProps } from './TextArea.types';
import { useTextArea } from './useTextArea';

// See the same constant in `@dsm/web`'s `TextArea` for why this is 1, not a
// typical textarea's 3: confirmed against Figma's own node heights that the
// empty/`default`/`hover`/`focus` frame is exactly one line tall.
const DEFAULT_NUMBER_OF_LINES = 1;

/**
 * React Native TextArea — a multi-line text input that grows with its
 * content, with a floating label, helper/error text and an optional
 * character counter.
 *
 * `label` lives inside the same bordered box as the value — it fills
 * `TextInput`'s `placeholder` while `value` is empty, and a separate
 * `<Text>` label is rendered above the field, inside the same box, as soon
 * as there is a value. There is no separate `placeholder` prop: mirrors
 * `@dsm/web`'s `TextArea`, and Figma's own description of one node swapping
 * which property it points to.
 *
 * Height: `numberOfLines` sets the `TextInput`'s starting height (see
 * `useTextArea`); `onContentSizeChange` then reports the real content
 * height on every keystroke, and the field grows to fit. The bordered box's
 * own `minHeight` is the floor, enforced by layout regardless of the
 * `TextInput`'s own height.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * <TextArea label="Comentario" value={value} onChangeText={setValue} />
 * <TextArea label="Comentario" value={value} onChangeText={setValue} maxLength={200} />
 * ```
 */
export const TextArea = ({
  onChangeText,
  onFocus,
  onBlur,
  numberOfLines = DEFAULT_NUMBER_OF_LINES,
  ...props
}: ITextAreaProps): ReactElement => {
  const [isFocused, setIsFocused] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number | undefined>(undefined);
  const {
    ringStyle,
    fieldStyle,
    inputStyle,
    labelStyle,
    helperStyle,
    counterStyle,
    placeholderTextColor,
    isDisabled,
    isReadOnly,
    isInvalid,
    hasValue,
    displayedHelperText,
    counterText,
    startingHeight,
  } = useTextArea({ ...props, isFocused, numberOfLines });
  const hasFooter = Boolean(displayedHelperText) || Boolean(counterText);

  const handleContentSizeChange = (event: TextInputContentSizeChangeEvent): void => {
    setMeasuredHeight(event.nativeEvent.contentSize.height);
  };

  return (
    <View style={textAreaStyles.wrapper}>
      <View style={ringStyle}>
        <View style={fieldStyle}>
          {hasValue && props.label ? <Text style={labelStyle}>{props.label}</Text> : null}
          <TextInput
            accessibilityLabel={props.label}
            accessibilityState={{ disabled: isDisabled }}
            editable={!isDisabled && !isReadOnly}
            maxLength={props.maxLength}
            multiline
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            onChangeText={onChangeText}
            onContentSizeChange={handleContentSizeChange}
            onFocus={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            placeholder={hasValue ? undefined : props.label}
            placeholderTextColor={placeholderTextColor}
            style={[inputStyle, { height: measuredHeight ?? startingHeight }]}
            testID={props.testID}
            value={props.value}
          />
        </View>
      </View>
      {hasFooter ? (
        <View style={textAreaStyles.footer}>
          {displayedHelperText ? (
            // Error text interrupts VoiceOver/TalkBack immediately; plain
            // helper text is announced only when the screen reader reaches it.
            <Text accessibilityLiveRegion={isInvalid ? 'assertive' : 'none'} style={helperStyle}>
              {displayedHelperText}
            </Text>
          ) : null}
          {counterText ? (
            // Figma: the counter must be announced, not just visible.
            <Text accessibilityLiveRegion="polite" style={counterStyle}>
              {counterText}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Checkbox } from '../Checkbox';
import { FieldIcon } from '../TextField/FieldIcon';
import type { IChoiceBoxProps } from './ChoiceBox.types';
import { useChoiceBox } from './useChoiceBox';

/**
 * The whole surface is the real control (Figma: "la caja entera es el
 * control"). The Checkbox rendered inside it is a non-interactive mirror of
 * `isSelected` (`pointerEvents="none"`) — the outer `Pressable` owns the
 * single toggle path.
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
    isSelected = false,
    isDisabled = false,
    onValueChange,
    testID,
  } = props;

  const isCompact = variant === 'compact';
  const displayIcon = !isCompact && showMedia ? icon : undefined;
  const displayControl = !isCompact && showControl;

  const [isPressed, setIsPressed] = useState(false);

  const { rowStyle, surfaceStyle, selectionRingStyle, headerRowStyle, contentStyle, titleStyle, descriptionStyle } =
    useChoiceBox({ ...props, isSelected, isDisabled, isPressed });

  const control = displayControl ? (
    <View importantForAccessibility="no-hide-descendants" pointerEvents="none">
      <Checkbox isChecked={isSelected} isDisabled={isDisabled} showLabel={false} />
    </View>
  ) : null;

  const content = (
    <View style={contentStyle}>
      <Text style={titleStyle}>{title}</Text>
      {showDescription && description ? <Text style={descriptionStyle}>{description}</Text> : null}
    </View>
  );

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => onValueChange?.(!isSelected)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={rowStyle}
      testID={testID}
    >
      <View style={surfaceStyle}>
        {selectionRingStyle ? <View style={selectionRingStyle} /> : null}
        {variant === 'tile' ? (
          <>
            <View style={headerRowStyle}>
              {displayIcon ? <FieldIcon color={isDisabled ? 'disabled' : 'primary'} name={displayIcon} size="lg" /> : null}
              {control ? <View style={{ marginLeft: 'auto' }}>{control}</View> : null}
            </View>
            {content}
          </>
        ) : (
          <>
            {displayIcon ? <FieldIcon color={isDisabled ? 'disabled' : 'primary'} name={displayIcon} size="lg" /> : null}
            {content}
            {control}
          </>
        )}
      </View>
    </Pressable>
  );
};


import { textFieldLayoutTokens } from '@dsm/shared';
import { StyleSheet } from 'react-native';

/** Static layout, independent of theme, size or state. Colors and metrics live in `useTextField`. */
export const textFieldStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: textFieldLayoutTokens.stackGap,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: textFieldLayoutTokens.inlineGap,
  },
});

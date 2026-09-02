import { StyleSheet } from 'react-native';

/** Static layout, independent of theme or state. Colours and metrics live in `useRadio`. */
export const radioStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

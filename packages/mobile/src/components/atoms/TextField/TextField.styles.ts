import { StyleSheet } from 'react-native';

/** Static layout, independent of theme, size or state. Colors and metrics live in `useTextField`. */
export const textFieldStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

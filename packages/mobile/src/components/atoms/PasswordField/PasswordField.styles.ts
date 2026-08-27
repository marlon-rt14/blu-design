import { StyleSheet } from 'react-native';

/** Static layout, independent of theme or state. Colors and metrics live in `usePasswordField`. */
export const passwordFieldStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
});

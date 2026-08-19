module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    // Workspace packages ship as TypeScript source, so Babel has to transform
    // them just like react-native.
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@dsm)/)',
  ],
};

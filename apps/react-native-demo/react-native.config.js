/**
 * Points the RN CLI's asset linker at `@dsm/mobile`'s fonts, so `npx
 * react-native-asset` copies them into this app's native projects (Android
 * assets, iOS Info.plist + Xcode project). This is a one-time step, same
 * spirit as `pod install` — re-run it whenever `@dsm/mobile`'s font set
 * changes.
 */
module.exports = {
  assets: ['../../packages/mobile/assets/fonts'],
};

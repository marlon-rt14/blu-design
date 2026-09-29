import type { TextStyle } from 'react-native';

/**
 * The weight a typography token asks for, in the shape React Native's
 * `TextStyle` wants.
 *
 * **There is no font family to resolve on mobile, on purpose.** Leaving
 * `fontFamily` unset hands the text to each platform's own system typeface,
 * which is exactly what bDS asks for: **SF Pro on iOS, Roboto on Android**.
 * They are the system fonts, so there is nothing to ship and nothing to link.
 * Only web carries a typeface of its own — Mulish — and it has its own
 * `useFontFamily` in `@dsm/web/theme/font.ts`.
 *
 * Four things follow from not bundling them, and they are the reason this is
 * the better shape rather than just the cheaper one:
 *
 * - **Nothing to license.** SF Pro's licence covers designing and developing
 *   for Apple platforms; redistributing the files inside a library is a
 *   different question, and now it never has to be asked.
 * - **Nothing to link.** No `npx react-native-asset` step for a consuming app,
 *   and no 60 MB of SF Pro riding along inside an Android APK that cannot use
 *   it — which is what happened when we did bundle them.
 * - **Always the current cut.** The system font ships with the OS and follows
 *   it; a bundled copy freezes at whatever release we happened to download.
 * - **It respects the reader.** Dynamic Type and the system's own font
 *   settings apply, which a bundled face only partly honours.
 *
 * ### Why the weight became numeric again
 *
 * While the faces were bundled, each one was its own family — `SFProText-Bold`
 * — so the weight travelled inside the family name and **no numeric
 * `fontWeight` was ever set**, on purpose: setting one made React Native look
 * for a bolder cut of an already-bold face.
 *
 * With the system font that inverts. There is one family and the weight is the
 * only thing that selects a cut, so it has to be set and it has to be the real
 * number. Every one of the 61 call sites reads it from the same place it
 * always did — `dimension.font.weight.*` — so the value is still the token's;
 * only where it lands in the style changed.
 *
 * One platform caveat, declared rather than worked around: Android renders the
 * full 100–900 range from API 28 on. Below that the system snaps to regular or
 * bold, so a 500 and a 600 look the same. Our `minSdk` is above that line;
 * if it ever drops, this is the note to come back to.
 *
 * @example
 * ```ts
 * labelStyle = {
 *   fontWeight: resolveFontWeight(tokens.typography.label.fontWeight),
 *   fontSize: tokens.typography.label.fontSize,
 * };
 * ```
 */
export const resolveFontWeight = (fontWeight: string): TextStyle['fontWeight'] =>
  fontWeight as TextStyle['fontWeight'];

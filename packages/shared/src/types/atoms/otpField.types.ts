/**
 * How many digits the code has.
 *
 * A union rather than `number` because only these two are drawn: bDS designed
 * `4` and `6` and nothing else. A `5` would render — the layout is a loop — but
 * it would be a length no designer has signed off on, so the type refuses it.
 * Widening this later is additive and breaks nobody.
 */
export type TOTPFieldLength = 4 | 6;

/**
 * Accessible name of the field, since the design has no label.
 *
 * The OTPField is the one field in the system with **no label axis at all** —
 * not a hidden one, not an optional one. It lives on a screen whose heading
 * already says what the code is for ("Ingresá el código que te enviamos"), so
 * bDS leaves the naming to that heading.
 *
 * That is fine on screen and not fine for a screen reader, which reaches the
 * input with no idea what it wants. Hence a default name here rather than an
 * unnamed input. Override it with `accessibilityLabel` when the surrounding
 * copy makes a better one.
 */
export const OTP_FIELD_ACCESSIBILITY_LABEL = 'Código de verificación';

/**
 * Platform-agnostic contract for the OTPField.
 *
 * A one-time code field: N boxes, one digit each.
 *
 * **The boxes are presentation. In code this is one input, never N.** bDS is
 * unusually direct about it — *"nunca N inputs separados; N inputs rompen el
 * pegado y el autorrelleno"*. A single input is what lets the OS drop the whole
 * code in at once (`one-time-code` on the web, `textContentType`
 * `oneTimeCode` on iOS, `sms-otp` autofill on Android) and what lets someone
 * paste six digits from their messages app. Each platform therefore renders one
 * focusable input covering the row, with the boxes painted from `value` behind
 * it.
 *
 * Two consequences of that shape, both intentional:
 * - **There is no `hover`.** With one input there is no per-digit element to
 *   hover, so the axis does not exist in Figma either.
 * - **There is no caret.** The focus ring on the active box is the caret; the
 *   real input is transparent.
 *
 * ### No single `state` prop
 *
 * Every other field in this library derives one `state` enum. This one does
 * not, and the reason is a design change rather than a preference: bDS split
 * the old monolithic `state` into independent axes precisely because *"el campo
 * puede estar en error y con foco al mismo tiempo, y hasta ahora había que
 * elegir uno"*. Collapsing them back into one enum would reintroduce the bug
 * the split was made to fix. So error and focus compose: every box takes the
 * error border **and** the active one takes the ring.
 *
 * `isDisabled` is the exception, and Figma says so outright — *"gana sobre todo
 * lo demás, es la última palabra del dibujo"*. Verified by measurement: an
 * `error` + `disabled` variant renders as plain disabled, with no trace of the
 * error border or the error helper.
 *
 * ### What is not here
 *
 * Figma's `isFilled` axis is **not a prop**. It carries no styling — measured,
 * it resolves to the same token set as `isFilled=false` — and exists only so
 * designers can preview a field with digits in it. In code "filled" is just
 * `value.length > 0`.
 *
 * @example
 * ```tsx
 * const [code, setCode] = useState('');
 * <OTPField value={code} onValueChange={setCode} />
 * <OTPField value={code} onValueChange={setCode} length={6} errorMessage="Código incorrecto" />
 * ```
 */
export interface IOTPFieldBaseProps {
  /**
   * The code so far, as a string of digits.
   *
   * Controlled, like the rest of the field family: shorter than `length` means
   * the remaining boxes are empty. Anything the component receives from the
   * platform is stripped to digits and capped at `length` before it reaches
   * `onValueChange`, but a `value` handed in from outside is rendered as given —
   * pass what you want drawn.
   */
  value: string;
  /**
   * Called with the sanitized code on every change.
   *
   * **Diverges from the family's `onChange` / `onChangeText` on purpose.** Those
   * hand over the platform event so the caller can read the raw text. Here the
   * raw text is the wrong thing to expose: the component strips non-digits and
   * caps the length, so an event-based handler would report characters that
   * never made it into the field. This reports what the field actually holds.
   */
  onValueChange?: (value: string) => void;
  /**
   * How many boxes to draw.
   *
   * @defaultValue `4`
   */
  length?: TOTPFieldLength;
  /**
   * Text under the boxes. Centred, like the boxes it sits under.
   *
   * bDS's own default is a resend timer — *"Reenviar codigo en 00:30"* — which
   * is the slot's intended use: this is where the countdown and the resend
   * action live.
   */
  helperText?: string;
  /**
   * Error text. Replaces `helperText` and turns the field's error state on by
   * itself, so `isInvalid` is not needed alongside it.
   */
  errorMessage?: string;
  /**
   * Whether the helper slot renders at all — independent of `helperText` or
   * `errorMessage` being set.
   *
   * @defaultValue `true`
   */
  showHelper?: boolean;
  /**
   * Puts the field in its error state without an accompanying message.
   *
   * Every box takes `digit/border-error`; the background does not change.
   * Composes with focus — an errored field can still be focused, and the active
   * box keeps its ring.
   *
   * @defaultValue `false`
   */
  isInvalid?: boolean;
  /**
   * Whether the field is unavailable.
   *
   * Wins over everything, including error and focus.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Accessible name of the input.
   *
   * @defaultValue {@link OTP_FIELD_ACCESSIBILITY_LABEL}
   */
  accessibilityLabel?: string;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile. Each box gets `${testID}-digit-${index}`, so a test can
   * assert on one box without reaching for the whole row.
   */
  testID?: string;
}

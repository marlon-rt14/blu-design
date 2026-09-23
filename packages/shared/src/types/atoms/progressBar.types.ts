/**
 * What the progress *means*, not what colour it is.
 *
 * **This is the trap of the component and bDS names it outright**: *"el eje
 * status no es una paleta: es lo que separa un avance de un problema. Un
 * ProgressBar en danger no es una barra roja bonita, es un progreso que va mal
 * —un límite que se agota, un plazo que se vence—. Por eso los cinco valores no
 * son intercambiables, y elegirlos por color es el error más fácil de cometer
 * con este componente."*
 *
 * - `brand` and `accent` are a task moving forward.
 * - `success`, `warning` and `danger` are for when the colour encodes the
 *   **value** — a quota running out, a password's strength — and not progress.
 *
 * `accent` has no written meaning yet, which bDS registers as an open item of
 * its own: without a rule it becomes *"otro color"*.
 */
export type TProgressStatus = 'brand' | 'accent' | 'success' | 'warning' | 'danger';

/**
 * Height of the track: `sm` 4 · `md` 8 · `lg` 12.
 *
 * The layout axis does not move these — 4/8/12 in `compact` and `expanded`
 * alike, measured.
 */
export type TProgressBarSize = 'sm' | 'md' | 'lg';

/**
 * Platform-agnostic contract for the ProgressBar.
 *
 * A linear bar that says how far along something with a beginning and an end
 * is. **It informs; it is not a control**: no disabled, no hover, no pressed,
 * no state axis at all.
 *
 * ### It is not a div with a width
 *
 * bDS repeats it in three places, so it is worth repeating here: the bar
 * carries `role="progressbar"` and its current value. A styled box that happens
 * to be 75 % wide tells a screen reader nothing.
 *
 * And **the value does not inform on its own**: *"'75 %' sin contexto no es
 * información"*. `label` says what is progressing, and it is what names the bar
 * — a bar without one has a number and no subject.
 *
 * ### There is no indeterminate bar
 *
 * Not here and not in Figma. For a wait of unknown length the answer is a
 * different component — *"barra si se puede medir, spinner si no"* — and a long
 * indeterminate bar *"se lee como algo colgado"*. The file registers the gap as
 * a new variant that has yet to be drawn.
 *
 * @example
 * ```tsx
 * <ProgressBar label="Subiendo el documento" value={upload} />
 * <ProgressBar label="Cupo usado" status="warning" value={82} />
 * ```
 */
export interface IProgressBarBaseProps {
  /**
   * How far along, from 0 to 100.
   *
   * **Continuous, unlike Figma**, where the axis has five steps — *"en Figma
   * son cinco pasos porque hay que dibujar algo"*. Values outside the range are
   * clamped, and any value above 0 draws at least a round dot, so a 1 % bar is
   * visible rather than invisible.
   */
  value: number;
  /**
   * What is progressing. Goes in the header, and **names the bar** for a screen
   * reader.
   *
   * Optional in the signature, but a bar without it announces a number with no
   * subject — *"'75 %' sin contexto no es información"*. Leave it out only when
   * something next to the bar already says what this is.
   *
   * **It keeps naming the bar when hidden.** See
   * {@link IProgressBarBaseProps.showLabel}.
   */
  label?: string;
  /**
   * Whether the header row renders at all — the label and the percentage
   * together.
   *
   * **The contract derives this instead of exposing it**: *"hay encabezado si
   * hay label o si showValue está prendido"*, and in Figma the boolean exists
   * only because *"un contenedor con todos sus hijos ocultos no se colapsa"*
   * there. It is a prop here anyway, for the same reason `showLabel` is: a bar
   * that loses its header should not have to lose its `label`, which is what
   * names it.
   *
   * It wins over the other two — with `showHeader={false}` there is no header,
   * whatever they say.
   *
   * @defaultValue `true`
   */
  showHeader?: boolean;
  /**
   * Whether the label's **text** renders.
   *
   * `false` hides the text and nothing else: the bar is still named by `label`,
   * the same arrangement `CheckboxGroup` uses for its `legend` — *"requerido
   * incluso cuando está oculto: es el nombre accesible"*. Use it when the
   * surrounding layout already says what is progressing but a screen reader
   * still needs to.
   *
   * @defaultValue `true`
   */
  showLabel?: boolean;
  /**
   * The percentage, to the right of the header.
   *
   * @defaultValue `true`
   */
  showValue?: boolean;
  /** @defaultValue `'brand'` */
  status?: TProgressStatus;
  /** @defaultValue `'md'` */
  size?: TProgressBarSize;
  testID?: string;
}

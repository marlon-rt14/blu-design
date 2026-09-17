/**
 * What every flag takes.
 *
 * In its own file rather than in `flags/index.tsx` so each flag can import it
 * without a resolution cycle back through the registry that imports *them* —
 * the same arrangement `CardField/marks/` uses.
 *
 * **`size` is the height**, and the width follows from the flag's own
 * proportions. That is bDS's own rule for the artwork: *"Size: xs 12 · sm 16 ·
 * md 24 · lg 32 · xl 40, ligado a size/icon/*. Es la ALTURA: una bandera md
 * alinea con un icono md en la misma fila. En Rectangle el ancho se deriva de la
 * altura (x1,5)."*
 */
export interface IFlagProps {
  /** Height in pixels, from `size/icon/*`. */
  size: number;
}

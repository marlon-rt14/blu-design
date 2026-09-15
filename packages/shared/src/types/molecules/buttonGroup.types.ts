import type { ReactNode } from 'react';

/**
 * Stack direction of the actions.
 *
 * @defaultValue `'horizontal'`
 */
export type TButtonGroupOrientation = 'horizontal' | 'vertical';

/**
 * How the group distributes width among its children.
 *
 * - `hug`: each Button keeps its intrinsic width (vertical still stretches
 *   children to the widest sibling — Figma vertical hug).
 * - `fill`: children share the available width in equal parts — Dev:
 *   *"flex: 1 en cada hijo"* / *"partes iguales, no proporcionales al contenido"*.
 *
 * @defaultValue `'hug'`
 */
export type TButtonGroupDistribution = 'hug' | 'fill';

/**
 * Platform-agnostic contract for the ButtonGroup.
 *
 * Layout-only container for 2–3 related Button actions. Direction,
 * gap and width share are owned here; hierarchy (`appearance`, `variant`,
 * `size`) stays on each Button the host passes.
 *
 * **Slot → children.** Figma's `actions` slot is `children` in code. The group
 * never freezes nested props and never invents default Cancelar/Continuar —
 * those are documentation examples only (ButtonGroup · Dev).
 *
 * **Not a selection control.** No `role="toolbar"` / `radiogroup`. Tab reaches
 * each Button; none stays marked. Order is the children order (open Dev
 * decision on platform primary placement).
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button appearance="outline" label="Cancelar" />
 *   <Button label="Continuar" />
 * </ButtonGroup>
 * ```
 */
export interface IButtonGroupBaseProps {
  /** The Buttons, in reading / DOM order. */
  children: ReactNode;
  /**
   * @defaultValue `'horizontal'`
   */
  orientation?: TButtonGroupOrientation;
  /**
   * @defaultValue `'hug'`
   */
  distribution?: TButtonGroupDistribution;
  testID?: string;
}

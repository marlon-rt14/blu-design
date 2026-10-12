# ProgressBar

Barra de progreso lineal.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Carga o avance de una tarea.

## Cuándo no

Pasos con etiquetas: ProgressStepper.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `value` | `number` | sí | — | 0–1 o 0–100 según API |
| `showHeader` | `boolean` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ProgressBar } from '@dsm/ui';

<ProgressBar value={0.4} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ProgressBarStandalone({ value }: { value: number }) {
  const track = '#ced4e3'; // color.component.progressbar.track.bg
  const fill = '#364481'; // color.component.progressbar.fill.brand
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={{ height: 8, background: track, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: fill }} />
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/progressBar.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

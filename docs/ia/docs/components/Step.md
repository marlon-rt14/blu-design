# Step

Nodo interno de ProgressStepper. No es API de pantalla.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Solo dentro de ProgressStepper / Storybook.

## Cuándo no

En una pantalla usa ProgressStepper con steps[].

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `status` | ``string`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
// No importes Step en una pantalla.
import { ProgressStepper } from '@dsm/ui';
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
// No hay réplica de pantalla: usa ProgressStepperStandalone en ProgressStepper.md.
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/step.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

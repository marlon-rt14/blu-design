# Skeleton

Placeholder de carga con shimmer.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Mientras llegan datos.

## Cuándo no

Error: Alert. Vacío: EmptyState.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `variant` | ``string`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Skeleton } from '@dsm/ui';

<Skeleton />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SkeletonStandalone() {
  const bg = '#e5e8f1'; // color.component.skeleton.bg
  return <div aria-hidden style={{ height: 16, borderRadius: 8, background: bg, width: '100%' }} />;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/skeleton.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

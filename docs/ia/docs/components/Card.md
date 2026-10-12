# Card

Superficie que sostiene contenido: fondo, radio, elevación.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Agrupar un bloque de contenido.

## Cuándo no

Filas dentro de tarjeta: ListGroup.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `children` | `ReactNode` | sí | — |  |
| `padding` | `'none'|'md'` | no | 'md' |  |
| `elevation` | `string` | no | — | raised, etc. |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Card } from '@dsm/ui';

<Card elevation="raised" padding="md">Contenido</Card>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CardStandalone({ children }: { children: React.ReactNode }) {
  const bg = '#ffffff'; // color.component.card.surface.bg
  const radius = 16; // radius.surface.md (aprox)
  const pad = 16; // space.inset.lg
  return <section style={{ background: bg, borderRadius: radius, padding: pad, boxShadow: '0 4px 16px #001e6014' }}>{children}</section>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/card.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

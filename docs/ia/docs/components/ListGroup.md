# ListGroup

Tarjeta que agrupa filas ListItem.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Lista de movimientos, contactos, productos.

## Cuándo no

Una sola fila suelta: ListItem. Superficie genérica: Card.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `children` | `ReactNode` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ListGroup, ListItem } from '@dsm/ui';

<ListGroup>
  <ListItem title="Luis Ramos" description="BCP ···7781" />
</ListGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ListGroupStandalone({ children }: { children: React.ReactNode }) {
  const bg = '#ffffff'; // color.component.card.surface.bg
  return <div style={{ background: bg, borderRadius: 16, overflow: 'hidden' }}>{children}</div>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/listGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

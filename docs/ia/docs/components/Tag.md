# Tag

Etiqueta no tocable.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Metadato: estado, categoría.

## Cuándo no

Filtro tocable: Chip.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | `string` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Tag } from '@dsm/ui';

<Tag label="Pendiente" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TagStandalone({ label }: { label: string }) {
  return <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 6, background: '#e5e8f1', color: '#232b3d', fontFamily: 'Mulish, sans-serif', fontSize: 12, fontWeight: 700 }}>{label}</span>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/tag.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

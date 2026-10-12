# SearchField

Campo de búsqueda.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Filtrar una lista larga.

## Cuándo no

Formulario de datos: TextField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `value` | `string` | sí | — |  |
| `onChangeText` | `(v: string) => void` | sí | — |  |
| `placeholder` | `string` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { SearchField } from '@dsm/ui';

<SearchField value={q} onChangeText={setQ} placeholder="Buscar beneficiario" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SearchFieldStandalone({ value, onChangeText, placeholder }: { value: string; onChangeText: (v: string) => void; placeholder?: string }) {
  const height = 44; // component.searchfield.height.md
  const radius = 12; // component.searchfield.radius (web)
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', minHeight: height, borderRadius: radius, border: '1px solid #6e7587', padding: '0 12px', fontFamily: 'Mulish, sans-serif' }}
    />
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/searchField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

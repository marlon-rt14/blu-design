# ChoiceItem

Opción como fila entera tocable, con descripción o monto.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Listas de elección con más que una etiqueta.

## Cuándo no

Casilla simple: Checkbox. Radio simple: Radio.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | `string` | sí | — |  |
| `description` | `string` | no | — |  |
| `selected` | `boolean` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ChoiceItem } from '@dsm/ui';

<ChoiceItem title="Visa ···9012" description="Pago del mes US$ 1,240.30" selected onSelect={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ChoiceItemStandalone({ title, description, selected, onSelect }: { title: string; description?: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} style={{ display: 'flex', width: '100%', minHeight: 56, padding: 12, border: 'none', borderBottom: '1px solid #ced4e3', background: selected ? '#eff3fd' : 'transparent', textAlign: 'left', fontFamily: 'Mulish, sans-serif' }}>
      <div>
        <div style={{ fontWeight: 700 }}>{title}</div>
        {description ? <div style={{ color: '#434959' }}>{description}</div> : null}
      </div>
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/choiceItem.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

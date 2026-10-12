# Radio

Opción exclusiva de un grupo.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Una sola elección entre pocas.

## Cuándo no

Varias: Checkbox. Fila rica: ChoiceItem.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `checked` | ``boolean`` | sí | — |  |
| `label` | ``string`` | sí | — |  |
| `value` | ``string`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Radio } from '@dsm/ui';

<Radio checked label="Ahorros" value="savings" onChange={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function RadioStandalone({ label, checked, name, value, onChange }: { label: string; checked: boolean; name: string; value: string; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', gap: 8, alignItems: 'center', minHeight: 48, fontFamily: 'Mulish, sans-serif' }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/radio.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

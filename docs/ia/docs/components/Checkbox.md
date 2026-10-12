# Checkbox

Casilla de selección múltiple.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Elegir varias cosas a la vez, o ninguna.

## Cuándo no

Una sola opción exclusiva: Radio. Fila entera: ChoiceItem.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `checked` | ``boolean`` | sí | — |  |
| `label` | ``string`` | sí | — |  |
| `disabled` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Checkbox } from '@dsm/ui';

<Checkbox checked={false} label="Acepto los términos" onChange={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CheckboxStandalone({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Mulish, sans-serif', fontSize: 16, color: '#232b3d', minHeight: 48 }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/checkbox.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

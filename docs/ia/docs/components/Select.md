# Select

Lista cerrada de una opción (trigger + menú).

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Banco, estado, plazo.

## Cuándo no

Texto libre filtrable: no hay Combobox en este monorepo aún.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | `string` | sí | — |  |
| `value` | `string` | no | — |  |
| `options` | `{value,label}[]` | sí | — |  |
| `onChange` | `fn` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Select } from '@dsm/ui';

<Select
  label="Banco"
  options={[{ value: 'bcp', label: 'BCP' }]}
  value={bank}
  onChange={setBank}
/>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SelectStandalone({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value?: string; onChange: (v: string) => void }) {
  const z = 1100; // dimension.z.dropdown
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: '1px solid #6e7587', padding: '0 12px', zIndex: z }}>
        <option value="">Elige una opción</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/select.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

# PhoneField

Campo de teléfono con selector de país.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Celular de contacto.

## Cuándo no

Texto libre: TextField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | `string` | sí | — |  |
| `value` | `string` | sí | — |  |
| `onChangeText` | `(v: string) => void` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { PhoneField } from '@dsm/ui';

<PhoneField label="Celular" value={v} onChangeText={setV} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function PhoneFieldStandalone({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <input type="tel" value={value} onChange={(e) => onChangeText(e.target.value)} placeholder="+1 000 000 0000" style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: '1px solid #6e7587', padding: '0 12px' }} />
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/phoneField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

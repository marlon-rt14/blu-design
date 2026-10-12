# TextField

Campo de texto de una línea. error="mensaje" es el estado inválido.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Nombre, monto, concepto.

## Cuándo no

Clave: PasswordField. Búsqueda: SearchField. Multilínea: TextArea.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `label` | `string` | sí | — |  |
| `value` | `string` | sí | — |  |
| `onChangeText` | `(v: string) => void` | sí | — |  |
| `error` | `string` | no | — | sin isInvalid |
| `disabled` | `boolean` | no | false |  |
| `readOnly` | `boolean` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { TextField } from '@dsm/ui';

<TextField label="Monto" value={v} onChangeText={setV} error={err} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TextFieldStandalone({ label, value, onChangeText, error }: { label: string; value: string; onChangeText: (v: string) => void; error?: string }) {
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <input value={value} onChange={(e) => onChangeText(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: `1px solid ${error ? '#b22c42' : '#6e7587'}`, padding: '0 12px' }} />
      {error ? <span role="alert" style={{ color: '#b22c42', fontSize: 12 }}>{error}</span> : null}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/textField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

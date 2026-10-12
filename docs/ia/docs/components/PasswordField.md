# PasswordField

Campo de clave con mostrar/ocultar.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Login o cambio de clave.

## Cuándo no

OTP: OTPField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | `string` | sí | — |  |
| `value` | `string` | sí | — |  |
| `onChangeText` | `(v: string) => void` | sí | — |  |
| `error` | `string` | no | — | mensaje = estado |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { PasswordField } from '@dsm/ui';

<PasswordField label="Clave" value={v} onChangeText={setV} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function PasswordFieldStandalone({ label, value, onChangeText, error }: { label: string; value: string; onChangeText: (v: string) => void; error?: string }) {
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <input type="password" value={value} onChange={(e) => onChangeText(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: `1px solid ${error ? '#b22c42' : '#6e7587'}`, padding: '0 12px' }} />
      {error ? <span style={{ color: '#b22c42', fontSize: 12 }}>{error}</span> : null}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/passwordField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

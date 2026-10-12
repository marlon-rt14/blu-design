# OTPField

Campo de código de un solo uso, celdas separadas.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Confirmar celular o correo.

## Cuándo no

Clave larga: PasswordField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `length` | ``number`` | no | 6 |  |
| `value` | ``string`` | sí | — |  |
| `onChangeText` | ``(v: string) => void`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { OTPField } from '@dsm/ui';

<OTPField value={code} onChangeText={setCode} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function OTPFieldStandalone({ value, onChangeText }: { value: string; onChangeText: (v: string) => void }) {
  return (
    <input
      inputMode="numeric"
      maxLength={6}
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      aria-label="Código"
      style={{ letterSpacing: 12, fontSize: 24, fontFamily: 'Mulish, sans-serif', minHeight: 56, textAlign: 'center', borderRadius: 12, border: '1px solid #6e7587', width: '100%' }}
    />
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/oTPField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

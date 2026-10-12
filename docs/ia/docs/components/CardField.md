# CardField

Campo de tarjeta: número, vencimiento y CVV.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Capturar datos de tarjeta de crédito.

## Cuándo no

Monto: TextField. Teléfono: PhoneField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `value` | `object` | sí | — |  |
| `onChange` | `fn` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { CardField } from '@dsm/ui';

<CardField /* ver props en el type */ />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CardFieldStandalone() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'Mulish, sans-serif' }}>
      <label style={{ fontSize: 14, color: '#434959' }}>Número de tarjeta
        <input inputMode="numeric" placeholder="•••• •••• •••• ••••" style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: '1px solid #6e7587', padding: '0 12px' }} />
      </label>
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/cardField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

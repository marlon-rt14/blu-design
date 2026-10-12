# TextArea

Texto multilínea con label flotante.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Reclamo, nota, descripción larga.

## Cuándo no

Una línea: TextField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | `string` | sí | — |  |
| `value` | `string` | sí | — |  |
| `onChangeText` | `(v: string) => void` | sí | — |  |
| `error` | `string` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { TextArea } from '@dsm/ui';

<TextArea label="Qué pasó" value={v} onChangeText={setV} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TextAreaStandalone({ label, value, onChangeText, error }: { label: string; value: string; onChangeText: (v: string) => void; error?: string }) {
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <textarea value={value} onChange={(e) => onChangeText(e.target.value)} rows={4} style={{ display: 'block', width: '100%', marginTop: 4, borderRadius: 12, border: `1px solid ${error ? '#b22c42' : '#6e7587'}`, padding: 12, fontFamily: 'inherit', resize: 'vertical' }} />
      {error ? <span style={{ color: '#b22c42', fontSize: 12 }}>{error}</span> : null}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/textArea.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

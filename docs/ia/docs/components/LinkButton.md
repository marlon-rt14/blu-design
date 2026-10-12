# LinkButton

Enlace que actúa (onPress) o navega (href).

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Deshacer, ver más, abrir detalle sin peso de Button.

## Cuándo no

Acción primaria: Button.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | `string` | sí | — |  |
| `onPress` | `() => void` | no | — |  |
| `href` | `string` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { LinkButton } from '@dsm/ui';

<LinkButton label="Deshacer" onPress={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function LinkButtonStandalone({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <button type="button" onClick={onPress} style={{ border: 'none', background: 'none', color: '#174183', fontFamily: 'Mulish, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
      {label}
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/linkButton.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

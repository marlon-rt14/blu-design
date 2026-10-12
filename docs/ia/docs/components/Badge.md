# Badge

Contador o punto de aviso.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Cuántas cosas nuevas hay, o solo que hay algo.

## Cuándo no

Estado sobre avatar: AvatarIndicator. Etiqueta no tocable: Tag.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `count` | `number` | no | — |  |
| `status` | `string` | no | 'neutral' |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Badge } from '@dsm/ui';

<Badge count={3} status="danger" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function BadgeStandalone({ count }: { count: number }) {
  const bg = '#b22c42'; // color.component.badge.surface.bg-danger
  const text = '#ffffff'; // color.component.badge.count.text-danger
  return (
    <span style={{ display: 'inline-flex', minWidth: 20, height: 20, padding: '0 6px', borderRadius: 999, background: bg, color: text, fontFamily: 'Mulish, sans-serif', fontSize: 12, fontWeight: 700, alignItems: 'center', justifyContent: 'center' }}>
      {count}
    </span>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/badge.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

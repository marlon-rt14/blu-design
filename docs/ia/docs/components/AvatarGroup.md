# AvatarGroup

Varias personas en una sola línea con overlap.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Lista corta de participantes.

## Cuándo no

Una sola persona: Avatar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | sí | — | Avatars |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Avatar, AvatarGroup } from '@dsm/ui';

<AvatarGroup>
  <Avatar name="Ana" />
  <Avatar name="Luis" />
</AvatarGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function AvatarGroupStandalone({ names }: { names: string[] }) {
  const overlap = -8; // dimension.component.avatar.size.overlap.md
  return (
    <div style={{ display: 'flex' }}>
      {names.map((n, i) => (
        <div key={n} style={{ marginLeft: i ? overlap : 0, zIndex: names.length - i }}>
          {/* reutiliza AvatarStandalone de Avatar.md */}
          <div aria-label={n} style={{ width: 40, height: 40, borderRadius: '50%', background: '#dfe7fa', border: '2px solid #fff', display: 'grid', placeItems: 'center', fontFamily: 'Mulish, sans-serif', fontWeight: 700, fontSize: 12 }}>
            {n.slice(0, 1)}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/avatarGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

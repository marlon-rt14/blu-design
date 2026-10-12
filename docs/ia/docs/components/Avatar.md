# Avatar

Identidad de una persona: foto, iniciales o icono.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Mostrar quién es alguien en una fila o cabecera.

## Cuándo no

Comercio: MerchantAvatar (no está en este monorepo). Grupo: AvatarGroup.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `size` | `'xs'|'sm'|'md'|'lg'` | no | 'md' |  |
| `name` | `string` | no | — | Iniciales |
| `src` | `string` | no | — | Foto |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Avatar } from '@dsm/ui';

<Avatar name="María Quispe" size="md" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function AvatarStandalone({ name }: { name: string }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const diameter = 40; // dimension.component.avatar.size.md
  const bg = '#dfe7fa'; // color fill soft brand-ish
  const color = '#174183';
  return (
    <div aria-label={name} style={{ width: diameter, height: diameter, borderRadius: '50%', background: bg, color, display: 'grid', placeItems: 'center', fontFamily: 'Mulish, sans-serif', fontWeight: 700, fontSize: 14 }}>
      {initials}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/avatar.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

# Image

Imagen con proporción reservada para que no salte el layout.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Foto de producto, recibo, media en EmptyState.

## Cuándo no

Avatar: Avatar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `src` | `string` | sí | — |  |
| `alt` | `string` | sí | — |  |
| `aspectRatio` | `string` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Image } from '@dsm/ui';

<Image src="/recibo.png" alt="Comprobante" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ImageStandalone({ src, alt }: { src: string; alt: string }) {
  const bg = '#e5e8f1'; // color.component.image.surface.bg
  return <img src={src} alt={alt} style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', background: bg, borderRadius: 12 }} />;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/image.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

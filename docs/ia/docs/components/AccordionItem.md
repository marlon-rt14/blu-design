# AccordionItem

Sección que se expande o colapsa. Usar siempre dentro de un Accordion con 2 o más items.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Como hijo de Accordion. El padre inyecta isExpanded, onToggle, appearance, size y showDivider.

## Cuándo no

Una sola sección en producto: Expansion. No setees isExpanded desde la app si vive dentro de Accordion.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `id` | `string` | sí | — |  |
| `title` | `string` | sí | — |  |
| `children` | `ReactNode` | sí | — | Panel |
| `icon` | `ReactNode` | no | — | Glifo leading |
| `disabled` | `boolean` | no | false |  |
| `testID` | `string` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Accordion, AccordionItem } from '@dsm/ui';

<Accordion>
  <AccordionItem id="a" title="Sección A">Contenido</AccordionItem>
  <AccordionItem id="b" title="Sección B">Contenido</AccordionItem>
</Accordion>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
// Ver Accordion.md — el item autocontenido vive junto al grupo.
// No copies AccordionItem solo: sin el padre no hay estado de abierto/cerrado.
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/accordionItem.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

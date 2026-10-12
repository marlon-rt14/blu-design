# Accordion

Grupo vertical de 2 o más AccordionItem separados por divider. Cada item se expande y colapsa de forma independiente.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Dos o más secciones hermanas con título que se despliegan cada una por su cuenta, sin salir de la pantalla. Cuando todas las secciones pueden verse una debajo de la otra.

## Cuándo no

Un solo item: usa Expansion (o un AccordionItem suelto solo en Storybook). No anidar Accordion dentro de Accordion. No esconder información que la persona necesita para decidir.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — | AccordionItem elements |
| `appearance` | ``'default' \| 'on-scene' \| 'on-inverse'`` | no | 'default' |  |
| `size` | ``'sm' \| 'lg'`` | no | 'sm' | sm=48, lg=56 |
| `allowMultiple` | ``boolean`` | no | true | false cierra las demás al abrir una |
| `expanded` | ``string[]`` | no | — | Controlado: ids abiertos |
| `defaultExpanded` | ``string[]`` | no | [] | Inicial no controlado |
| `onExpandedChange` | ``(ids: string[]) => void`` | no | — |  |
| `testID` | ``string`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Accordion, AccordionItem } from '@dsm/ui';
// Si @dsm/ui no resuelve: import { Accordion, AccordionItem } from '@dsm/web';

<Accordion defaultExpanded={['shipping']}>
  <AccordionItem id="shipping" title="Envío">
    Llega en 3 días hábiles.
  </AccordionItem>
  <AccordionItem id="returns" title="Devoluciones">
    Tienes 30 días.
  </AccordionItem>
</Accordion>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
import { useState, type CSSProperties, type ReactNode } from 'react';

type Item = { id: string; title: string; children: ReactNode };

export function AccordionStandalone({
  items,
  defaultExpanded = [],
  allowMultiple = true,
}: {
  items: Item[];
  defaultExpanded?: string[];
  allowMultiple?: boolean;
}) {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);
  const toggle = (id: string) => {
    setExpanded((prev) => {
      const open = prev.includes(id);
      if (open) return prev.filter((x) => x !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  const root: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  };

  return (
    <div style={root}>
      {items.map((item, index) => {
        const isExpanded = expanded.includes(item.id);
        const showDivider = index !== items.length - 1;
        return (
          <AccordionItemStandalone
            key={item.id}
            id={item.id}
            title={item.title}
            isExpanded={isExpanded}
            onToggle={() => toggle(item.id)}
            showDivider={showDivider}
          >
            {item.children}
          </AccordionItemStandalone>
        );
      })}
    </div>
  );
}

function AccordionItemStandalone({
  id,
  title,
  isExpanded,
  onToggle,
  showDivider,
  children,
}: {
  id: string;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  showDivider: boolean;
  children: ReactNode;
}) {
  // Valores light@compact@web — paths en comentarios
  const titleColor = '#232b3d'; // color.component.accordion.default.title
  const contentColor = '#434959'; // color.component.accordion.default.content
  const chevronColor = '#323949'; // color.component.accordion.default.chevron
  const dividerColor = '#ced4e3'; // color.component.accordion.default.divider
  const headerMinHeight = 48; // dimension.component.accordion.header.min-height.sm
  const headerPaddingX = 12; // dimension.component.accordion.header.padding-x
  const headerPaddingY = 8; // dimension.component.accordion.header.padding-y
  const headerGap = 12; // dimension.component.accordion.header.gap
  const contentPaddingTop = 4; // dimension.component.accordion.content.padding-top
  const contentPaddingBottom = 12; // dimension.component.accordion.content.padding-bottom
  const chevronSize = 24; // dimension.component.accordion.chevron.size

  const header: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    gap: headerGap,
    minHeight: headerMinHeight,
    padding: `${headerPaddingY}px ${headerPaddingX}px`,
    width: '100%',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'Mulish, sans-serif',
    fontWeight: 800, // font.weight.extrabold
    fontSize: 16, // font.size.body.md
    lineHeight: '24px',
    color: titleColor,
    textAlign: 'left',
  };

  const panel: CSSProperties = {
    overflow: 'hidden',
    height: isExpanded ? 'auto' : 0,
    borderBottom: showDivider ? `1px solid ${dividerColor}` : undefined,
  };

  const content: CSSProperties = {
    padding: `${contentPaddingTop}px ${headerPaddingX}px ${contentPaddingBottom}px`,
    fontFamily: 'Mulish, sans-serif',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '24px',
    color: contentColor,
  };

  const chevron: CSSProperties = {
    marginLeft: 'auto',
    width: chevronSize,
    height: chevronSize,
    color: chevronColor,
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 200ms',
    flexShrink: 0,
  };

  const headerId = `acc-h-${id}`;
  const panelId = `acc-p-${id}`;

  return (
    <div>
      <button
        type="button"
        id={headerId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={onToggle}
        style={header}
      >
        <span>{title}</span>
        <svg aria-hidden viewBox="0 0 24 24" style={chevron} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div id={panelId} role="region" aria-labelledby={headerId} style={panel}>
        <div style={content}>{children}</div>
      </div>
    </div>
  );
}

// Ejemplo
export function Example() {
  return (
    <AccordionStandalone
      defaultExpanded={['shipping']}
      items={[
        { id: 'shipping', title: 'Envío', children: 'Llega en 3 días hábiles.' },
        { id: 'returns', title: 'Devoluciones', children: 'Tienes 30 días.' },
      ]}
    />
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/accordion.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.

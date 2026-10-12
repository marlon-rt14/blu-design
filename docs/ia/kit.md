# kit.md — fichas del design system para adjuntar

Si tu IA no abre enlaces o falla al leer las fichas sueltas, **adjunta este archivo** junto al prompt. Con el kit no necesita abrir nada más.

Base: https://bds-nu.vercel.app/ia/

En las tablas de props, los unions usan `\|` para no romper el Markdown (GFM).

---

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



---


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
| `id` | ``string`` | sí | — |  |
| `title` | ``string`` | sí | — |  |
| `children` | ``ReactNode`` | sí | — | Panel |
| `icon` | ``ReactNode`` | no | — | Glifo leading |
| `disabled` | ``boolean`` | no | false |  |
| `testID` | ``string`` | no | — |  |

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



---


# Alert

Aviso no modal en el flujo del documento. Empuja contenido; no se va solo.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Mensajes de sistema con severidad (info, success, warning, danger, neutral) dentro de la página.

## Cuándo no

Toast que se va solo: Snackbar. Confirmación que interrumpe: Card + Alert + ButtonGroup (no hay Dialog).

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `status` | ``'info'\|'success'\|'warning'\|'danger'\|'neutral'`` | sí | — |  |
| `title` | ``string`` | no | — |  |
| `body` | ``string`` | sí | — |  |
| `placement` | ``'section'\|'page'`` | no | — |  |
| `showIcon` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Alert } from '@dsm/ui';

<Alert status="danger" title="Esta acción es permanente" body="Si eliminas tu cuenta perderás todos tus datos." showIcon />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function AlertStandalone({ title, body }: { title: string; body: string }) {
  const surface = '#ffe0df'; // color.component.alert.surface.bg-danger
  const chip = '#b22c42'; // color.component.alert.chip.bg-danger
  const titleColor = '#232b3d'; // color.component.alert.content.title
  const bodyColor = '#434959'; // color.component.alert.content.body
  return (
    <div role="alert" style={{ background: surface, borderRadius: 12, padding: 16, display: 'flex', gap: 12, fontFamily: 'Mulish, sans-serif' }}>
      <span aria-hidden style={{ width: 8, borderRadius: 4, background: chip }} />
      <div>
        <div style={{ fontWeight: 800, fontSize: 16, color: titleColor }}>{title}</div>
        <div style={{ fontWeight: 400, fontSize: 16, color: bodyColor, marginTop: 4 }}>{body}</div>
      </div>
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/alert.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


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
| --- | --- | --- | --- | --- |
| `size` | ``'xs'\|'sm'\|'md'\|'lg'`` | no | 'md' |  |
| `name` | ``string`` | no | — | Iniciales |
| `src` | ``string`` | no | — | Foto |

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



---


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
| `children` | ``ReactNode`` | sí | — | Avatars |

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



---


# AvatarIndicator

Punto de estado en la esquina del Avatar.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Estado online / away sobre un Avatar.

## Cuándo no

Solo: Badge.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `status` | ``string`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Avatar, AvatarIndicator } from '@dsm/ui';

<div style={{ position: 'relative', width: 40, height: 40 }}>
  <Avatar name="María" />
  <AvatarIndicator status="online" />
</div>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function AvatarIndicatorStandalone() {
  const size = 10; // dimension.component.avatar.size.indicator.md (aprox)
  return <span aria-label="En línea" style={{ width: size, height: size, borderRadius: '50%', background: '#008557', border: '2px solid #fff', display: 'inline-block' }} />;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/avatarIndicator.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


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
| --- | --- | --- | --- | --- |
| `count` | ``number`` | no | — |  |
| `status` | ``string`` | no | 'neutral' |  |

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



---


# Button

La acción. Confirmar, cancelar, continuar, borrar.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Todo lo que el usuario puede hacer en una pantalla.

## Cuándo no

Solo icono: IconButton. Enlace textual: LinkButton.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `variant` | ``'primary'\|'danger'`` | no | 'primary' |  |
| `appearance` | ``'fill'\|'soft'\|'outline'\|'ghost'\|'on-inverse'`` | no | 'fill' | on-inverse solo con primary |
| `size` | ``'xs'\|'sm'\|'md'\|'lg'`` | no | 'md' |  |
| `isDisabled` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Button } from '@dsm/ui';

<Button appearance="fill" label="Continuar" onClick={() => {}} />
<Button appearance="outline" label="Eliminar" variant="danger" onClick={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
import type { CSSProperties } from 'react';

export function ButtonStandalone({
  label,
  appearance = 'fill',
  variant = 'primary',
  isDisabled = false,
  onClick,
}: {
  label: string;
  appearance?: 'fill' | 'outline';
  variant?: 'primary' | 'danger';
  isDisabled?: boolean;
  onClick?: () => void;
}) {
  const isDanger = variant === 'danger';
  const fillBg = isDanger ? '#b22c42' : '#364481'; // color.component.button.{danger|primary}.bg-default
  const fillLabel = '#ffffff'; // text on fill
  const outlineBorder = isDanger ? '#d74b5c' : '#2760aa'; // *-outline.border-default
  const outlineLabel = isDanger ? '#b22c42' : '#174183'; // *-outline.text-default
  const height = 44; // dimension.size.control.height.md
  const radius = 12; // dimension.radius.action (web)
  const padX = 24; // space.inset.xl

  const style: CSSProperties = {
    boxSizing: 'border-box',
    minHeight: height,
    padding: `0 ${padX}px`,
    borderRadius: radius,
    border: appearance === 'outline' ? `1px solid ${outlineBorder}` : '1px solid transparent',
    background: appearance === 'fill' ? fillBg : 'transparent',
    color: appearance === 'fill' ? fillLabel : outlineLabel,
    fontFamily: 'Mulish, sans-serif',
    fontWeight: 500, // font.weight.medium (código actual)
    fontSize: 16,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
  };

  return (
    <button type="button" disabled={isDisabled} onClick={onClick} style={style}>
      {label}
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/button.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# ButtonGroup

Contenedor de 2 o 3 acciones: dirección, gap y reparto de ancho.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Pie de formulario o confirmación con acciones relacionadas.

## Cuándo no

Una sola acción: Button suelto.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — | Buttons |
| `distribution` | ``'hug'\|'fill'`` | no | — |  |
| `orientation` | ``'horizontal'\|'vertical'`` | no | 'horizontal' |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Button, ButtonGroup } from '@dsm/ui';

<ButtonGroup distribution="fill">
  <Button appearance="fill" label="Cancelar" onClick={() => {}} />
  <Button appearance="outline" label="Eliminar" variant="danger" onClick={() => {}} />
</ButtonGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ButtonGroupStandalone({ children }: { children: React.ReactNode }) {
  const gap = 12; // dimension.space.inline.md / space.stack.md
  return <div style={{ display: 'flex', gap, width: '100%' }}>{children}</div>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/buttonGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Callout

Mensaje proactivo opcional: tip o oportunidad, sin severidad.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Sugerir una función o dato en contexto.

## Cuándo no

Error o aviso de sistema: Alert. Toast: Snackbar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | ``string`` | no | — |  |
| `body` | ``string`` | sí | — |  |
| `tone` | ``string`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Callout } from '@dsm/ui';

<Callout body="Activa notificaciones para enterarte del pago." />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CalloutStandalone({ body }: { body: string }) {
  const padding = 16; // dimension.component.callout.padding
  const gap = 12; // dimension.component.callout.gap
  const radius = 12; // dimension.component.callout.radius
  return (
    <aside style={{ padding, gap, borderRadius: radius, background: '#eff3fd', display: 'flex', fontFamily: 'Mulish, sans-serif', fontSize: 16, color: '#232b3d' }}>
      {body}
    </aside>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/callout.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Card

Superficie que sostiene contenido: fondo, radio, elevación.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Agrupar un bloque de contenido.

## Cuándo no

Filas dentro de tarjeta: ListGroup.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — |  |
| `padding` | ``'none'\|'md'`` | no | 'md' |  |
| `elevation` | ``string`` | no | — | raised, etc. |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Card } from '@dsm/ui';

<Card elevation="raised" padding="md">Contenido</Card>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CardStandalone({ children }: { children: React.ReactNode }) {
  const bg = '#ffffff'; // color.component.card.surface.bg
  const radius = 16; // radius.surface.md (aprox)
  const pad = 16; // space.inset.lg
  return <section style={{ background: bg, borderRadius: radius, padding: pad, boxShadow: '0 4px 16px #001e6014' }}>{children}</section>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/card.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


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
| --- | --- | --- | --- | --- |
| `value` | ``object`` | sí | — |  |
| `onChange` | ``fn`` | sí | — |  |

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



---


# Checkbox

Casilla de selección múltiple.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Elegir varias cosas a la vez, o ninguna.

## Cuándo no

Una sola opción exclusiva: Radio. Fila entera: ChoiceItem.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `checked` | ``boolean`` | sí | — |  |
| `label` | ``string`` | sí | — |  |
| `disabled` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Checkbox } from '@dsm/ui';

<Checkbox checked={false} label="Acepto los términos" onChange={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CheckboxStandalone({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Mulish, sans-serif', fontSize: 16, color: '#232b3d', minHeight: 48 }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/checkbox.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# CheckboxGroup

Fieldset de checkboxes: pregunta, filas, ayuda o error.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Varias opciones no exclusivas con label de grupo.

## Cuándo no

Una casilla: Checkbox.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `children` | ``ReactNode`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Checkbox, CheckboxGroup } from '@dsm/ui';

<CheckboxGroup label="Beneficios">
  <Checkbox checked label="Seguro" onChange={() => {}} />
</CheckboxGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CheckboxGroupStandalone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <legend style={{ fontFamily: 'Mulish, sans-serif', fontWeight: 700, marginBottom: 8 }}>{label}</legend>
      {children}
    </fieldset>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/checkboxGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Chip

Filtro que se prende y se apaga.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Categoría de movimientos, rango, respuesta rápida.

## Cuándo no

Etiqueta no interactiva: Tag.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `selected` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Chip } from '@dsm/ui';

<Chip label="Octubre" selected onClick={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ChipStandalone({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <button type="button" style={{ minHeight: 32, padding: '0 12px', borderRadius: 999, border: selected ? '1px solid #2760aa' : '1px solid #ced4e3', background: selected ? '#eff3fd' : '#fff', fontFamily: 'Mulish, sans-serif', fontSize: 14, color: '#174183' }}>
      {label}
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/chip.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# ChoiceBox

Selector de caja: la opción entera es el control.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

La elección es la tarea de la pantalla; cada opción necesita descripción.

## Cuándo no

Lista densa: ChoiceItem / RadioGroup.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `selected` | ``boolean`` | sí | — |  |
| `title` | ``string`` | sí | — |  |
| `description` | ``string`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ChoiceBox } from '@dsm/ui';

<ChoiceBox selected title="Cuenta en dólares" description="···4521" onSelect={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ChoiceBoxStandalone({ title, description, selected, onSelect }: { title: string; description?: string; selected: boolean; onSelect: () => void }) {
  const border = selected ? '#2760aa' : '#6e7587'; // border-selected | border-default
  const bg = selected ? '#eff3fd' : '#ffffff';
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} style={{ textAlign: 'left', width: '100%', padding: 12, borderRadius: 12, border: `2px solid ${border}`, background: bg, fontFamily: 'Mulish, sans-serif' }}>
      <div style={{ fontWeight: 700, color: '#232b3d' }}>{title}</div>
      {description ? <div style={{ color: '#434959', marginTop: 4 }}>{description}</div> : null}
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/choiceBox.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# ChoiceItem

Opción como fila entera tocable, con descripción o monto.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Listas de elección con más que una etiqueta.

## Cuándo no

Casilla simple: Checkbox. Radio simple: Radio.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | ``string`` | sí | — |  |
| `description` | ``string`` | no | — |  |
| `selected` | ``boolean`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ChoiceItem } from '@dsm/ui';

<ChoiceItem title="Visa ···9012" description="Pago del mes US$ 1,240.30" selected onSelect={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ChoiceItemStandalone({ title, description, selected, onSelect }: { title: string; description?: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} style={{ display: 'flex', width: '100%', minHeight: 56, padding: 12, border: 'none', borderBottom: '1px solid #ced4e3', background: selected ? '#eff3fd' : 'transparent', textAlign: 'left', fontFamily: 'Mulish, sans-serif' }}>
      <div>
        <div style={{ fontWeight: 700 }}>{title}</div>
        {description ? <div style={{ color: '#434959' }}>{description}</div> : null}
      </div>
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/choiceItem.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Coachmark

Guía contextual anclada (tourtip).

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Onboarding puntual disparado por el sistema.

## Cuándo no

Ayuda al hover: Tooltip. Toast: Snackbar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | ``string`` | sí | — |  |
| `body` | ``string`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Coachmark } from '@dsm/ui';

<Coachmark title="Paga desde acá" body="El atajo queda en tu inicio." />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CoachmarkStandalone({ title, body }: { title: string; body: string }) {
  const bg = '#ffffff'; // color.component.coachmark.surface.bg
  const border = '#ced4e3'; // color.component.coachmark.surface.border
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 16, maxWidth: 280, fontFamily: 'Mulish, sans-serif', boxShadow: '0 8px 24px #001e601f' }}>
      <div style={{ fontWeight: 800, color: '#232b3d' }}>{title}</div>
      <div style={{ marginTop: 8, color: '#232b3d' }}>{body}</div>
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/coachmark.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Divider

Línea que separa dos bloques sin encerrarlos.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Agrupar sin tarjeta.

## Cuándo no

Borde de Card: no hace falta Divider.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `strength` | ``'subtle'\|'default'\|'strong'`` | no | 'default' |  |
| `orientation` | ``'horizontal'\|'vertical'`` | no | 'horizontal' |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Divider } from '@dsm/ui';

<Divider />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function DividerStandalone() {
  const color = '#ced4e3'; // color.component.divider.line.default
  return <hr style={{ border: 'none', borderTop: `1px solid ${color}`, margin: 0 }} />;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/divider.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# EmptyState

Pantalla o bloque sin contenido: por qué y el siguiente paso.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Lista vacía, búsqueda sin resultados.

## Cuándo no

Error de carga: Alert + reintento. No es un fallo de red.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | ``string`` | sí | — |  |
| `body` | ``string`` | no | — |  |
| `action` | ``ReactNode`` | no | — | Button |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Button, EmptyState } from '@dsm/ui';

<EmptyState
  title="Todavía no hay movimientos en octubre"
  body="Cuando recibas o envíes dinero, van a aparecer aquí."
  action={<Button label="Enviar dinero" onClick={() => {}} />}
/>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function EmptyStateStandalone({ title, body }: { title: string; body?: string }) {
  const padding = 24; // dimension.component.emptystate.padding
  const titleColor = '#232b3d'; // color.component.emptystate.title
  const bodyColor = '#434959'; // color.component.emptystate.body
  return (
    <div style={{ padding, textAlign: 'center', fontFamily: 'Mulish, sans-serif' }}>
      <div style={{ fontWeight: 800, fontSize: 18, color: titleColor }}>{title}</div>
      {body ? <p style={{ color: bodyColor, marginTop: 8 }}>{body}</p> : null}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/emptyState.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Icon

Contenedor de todo glifo: tamaño y color del sistema.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Todo icono pasa por Icon; nunca un svg suelto con width/height.

## Cuándo no

Acción solo icono: IconButton.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `size` | ``'2xs'\|'xs'\|'sm'\|'md'\|'lg'\|'xl'`` | sí | — | nunca number |
| `children` | ``ReactNode`` | sí | — | paths |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Icon } from '@dsm/ui';
import { IconChevronLeft } from '@dsm/web/icons/arrows';

<IconChevronLeft size="md" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function IconStandalone({ label }: { label: string }) {
  const size = 24; // size.icon.md
  return (
    <svg aria-label={label} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#323949" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/icon.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# IconButton

Acción sin etiqueta visible, solo icono. label es el nombre accesible.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Cerrar, editar, compartir cuando el significado es obvio.

## Cuándo no

Con texto: Button. appearance outline no existe.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `icon` | ``ReactNode`` | sí | — |  |
| `label` | ``string`` | sí | — | accessible name |
| `appearance` | ``'brand'\|'neutral'\|'ghost'\|'veil'\|'on-scene'\|'on-media'\|'on-inverse'`` | no | — |  |
| `onPress` | ``() => void`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { IconButton } from '@dsm/ui';
import { IconChevronLeft } from '@dsm/web/icons/arrows';

<IconButton appearance="ghost" icon={<IconChevronLeft size="md" />} label="Página anterior" onPress={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function IconButtonStandalone({ label, onPress }: { label: string; onPress: () => void }) {
  const min = 48; // size.target.min
  return (
    <button type="button" aria-label={label} onClick={onPress} style={{ width: min, height: min, border: 'none', borderRadius: 999, background: 'transparent', cursor: 'pointer' }}>
      <svg aria-hidden width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#323949" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/iconButton.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


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
| --- | --- | --- | --- | --- |
| `src` | ``string`` | sí | — |  |
| `alt` | ``string`` | sí | — |  |
| `aspectRatio` | ``string`` | no | — |  |

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



---


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
| `label` | ``string`` | sí | — |  |
| `onPress` | ``() => void`` | no | — |  |
| `href` | ``string`` | no | — |  |

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



---


# ListGroup

Tarjeta que agrupa filas ListItem.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Lista de movimientos, contactos, productos.

## Cuándo no

Una sola fila suelta: ListItem. Superficie genérica: Card.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ListGroup, ListItem } from '@dsm/ui';

<ListGroup>
  <ListItem title="Luis Ramos" description="BCP ···7781" />
</ListGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ListGroupStandalone({ children }: { children: React.ReactNode }) {
  const bg = '#ffffff'; // color.component.card.surface.bg
  return <div style={{ background: bg, borderRadius: 16, overflow: 'hidden' }}>{children}</div>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/listGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# ListItem

Fila de lista: la pieza más repetida.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Movimiento, contacto, producto.

## Cuándo no

Opción seleccionable: ChoiceItem.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | ``string`` | sí | — |  |
| `description` | ``string`` | no | — |  |
| `divider` | ``boolean`` | no | false | último de grupo |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ListItem } from '@dsm/ui';

<ListItem title="Enviaste a Luis Ramos" description="6 oct · −US$ 250.00" divider />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ListItemStandalone({ title, description, divider }: { title: string; description?: string; divider?: boolean }) {
  return (
    <div style={{ minHeight: 56, padding: '12px 16px', borderBottom: divider ? '1px solid #ced4e3' : undefined, fontFamily: 'Mulish, sans-serif' }}>
      <div style={{ fontWeight: 700, color: '#232b3d' }}>{title}</div>
      {description ? <div style={{ color: '#434959', fontSize: 14 }}>{description}</div> : null}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/listItem.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Menu

Menú flotante de acciones u opciones.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Acciones sobre un ítem sin salir de la pantalla.

## Cuándo no

Navegación de app: no. Select de formulario: Select.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Menu } from '@dsm/ui';

<Menu>{/* items */}</Menu>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function MenuStandalone({ items }: { items: string[] }) {
  const bg = '#ffffff'; // color.component.menu.surface.bg
  const border = '#ced4e3'; // color.component.menu.surface.border
  return (
    <ul role="menu" style={{ listStyle: 'none', margin: 0, padding: 8, background: bg, border: `1px solid ${border}`, borderRadius: 12, boxShadow: '0 8px 24px #001e601f', minWidth: 200 }}>
      {items.map((item) => (
        <li key={item} role="menuitem" style={{ padding: '10px 12px', fontFamily: 'Mulish, sans-serif', cursor: 'pointer' }}>{item}</li>
      ))}
    </ul>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/menu.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


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



---


# PasswordField

Campo de clave con mostrar/ocultar.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Login o cambio de clave.

## Cuándo no

OTP: OTPField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `value` | ``string`` | sí | — |  |
| `onChangeText` | ``(v: string) => void`` | sí | — |  |
| `error` | ``string`` | no | — | mensaje = estado |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { PasswordField } from '@dsm/ui';

<PasswordField label="Clave" value={v} onChangeText={setV} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function PasswordFieldStandalone({ label, value, onChangeText, error }: { label: string; value: string; onChangeText: (v: string) => void; error?: string }) {
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <input type="password" value={value} onChange={(e) => onChangeText(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: `1px solid ${error ? '#b22c42' : '#6e7587'}`, padding: '0 12px' }} />
      {error ? <span style={{ color: '#b22c42', fontSize: 12 }}>{error}</span> : null}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/passwordField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# PhoneField

Campo de teléfono con selector de país.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Celular de contacto.

## Cuándo no

Texto libre: TextField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `value` | ``string`` | sí | — |  |
| `onChangeText` | ``(v: string) => void`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { PhoneField } from '@dsm/ui';

<PhoneField label="Celular" value={v} onChangeText={setV} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function PhoneFieldStandalone({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <input type="tel" value={value} onChange={(e) => onChangeText(e.target.value)} placeholder="+1 000 000 0000" style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: '1px solid #6e7587', padding: '0 12px' }} />
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/phoneField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Popover

Superficie anclada sin punta (el Popover no tiene tip).

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Contenido corto anclado a un control.

## Cuándo no

Con tip: Tooltip / Coachmark. Menú de acciones: Menu.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Popover } from '@dsm/ui';

<Popover>{/* contenido */}</Popover>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function PopoverStandalone({ children }: { children: React.ReactNode }) {
  const bg = '#ffffff'; // color.component.menu.surface.bg
  const border = '#ced4e3';
  const z = 1200; // dimension.z.popover
  return <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 12, zIndex: z, boxShadow: '0 8px 24px #001e601f' }}>{children}</div>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/popover.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# ProgressBar

Barra de progreso lineal.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Carga o avance de una tarea.

## Cuándo no

Pasos con etiquetas: ProgressStepper.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `value` | ``number`` | sí | — | 0–1 o 0–100 según API |
| `showHeader` | ``boolean`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ProgressBar } from '@dsm/ui';

<ProgressBar value={0.4} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ProgressBarStandalone({ value }: { value: number }) {
  const track = '#ced4e3'; // color.component.progressbar.track.bg
  const fill = '#364481'; // color.component.progressbar.fill.brand
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={{ height: 8, background: track, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: fill }} />
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/progressBar.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# ProgressStepper

Riel de pasos de un wizard.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Flujo multipaso con estados pending/active/done/error/warning.

## Cuándo no

Progreso continuo: ProgressBar. No renderices Step a mano en una pantalla.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `steps` | ``IProgressStepDef[]`` | sí | — | desde @dsm/shared |
| `purpose` | ``string`` | sí | — | ej. 'wizard' |
| `orientation` | ``'horizontal'\|'vertical'`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import type { IProgressStepDef } from '@dsm/shared';
import { ProgressStepper } from '@dsm/ui';

const steps: IProgressStepDef[] = [
  { label: 'Plan', status: 'done' },
  { label: 'Calendar', status: 'active' },
  { label: 'Contacts', status: 'pending' },
];

<ProgressStepper purpose="wizard" steps={steps} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ProgressStepperStandalone({ labels }: { labels: string[] }) {
  const active = '#364481'; // rail.indicator-active
  const done = '#008557'; // rail.indicator-done
  const pending = '#6e7587'; // indicator-border-pending
  return (
    <ol style={{ display: 'flex', gap: 16, listStyle: 'none', padding: 0, fontFamily: 'Mulish, sans-serif' }}>
      {labels.map((label, i) => (
        <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: i === 0 ? done : i === 1 ? '#232b3d' : '#5f6677' }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? done : i === 1 ? active : 'transparent', border: i > 1 ? `2px solid ${pending}` : undefined }} />
          {label}
        </li>
      ))}
    </ol>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/progressStepper.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Radio

Opción exclusiva de un grupo.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Una sola elección entre pocas.

## Cuándo no

Varias: Checkbox. Fila rica: ChoiceItem.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `checked` | ``boolean`` | sí | — |  |
| `label` | ``string`` | sí | — |  |
| `value` | ``string`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Radio } from '@dsm/ui';

<Radio checked label="Ahorros" value="savings" onChange={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function RadioStandalone({ label, checked, name, value, onChange }: { label: string; checked: boolean; name: string; value: string; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', gap: 8, alignItems: 'center', minHeight: 48, fontFamily: 'Mulish, sans-serif' }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/radio.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# RadioGroup

Grupo de radios con label y error.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Una pregunta, una respuesta.

## Cuándo no

Varias respuestas: CheckboxGroup.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `children` | ``ReactNode`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Radio, RadioGroup } from '@dsm/ui';

<RadioGroup label="Tipo de cuenta">
  <Radio checked label="Ahorros" value="a" onChange={() => {}} />
  <Radio checked={false} label="Corriente" value="c" onChange={() => {}} />
</RadioGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function RadioGroupStandalone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: 'none', padding: 0 }}>
      <legend style={{ fontWeight: 700, fontFamily: 'Mulish, sans-serif', marginBottom: 8 }}>{label}</legend>
      {children}
    </fieldset>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/radioGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# SearchField

Campo de búsqueda.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Filtrar una lista larga.

## Cuándo no

Formulario de datos: TextField.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `value` | ``string`` | sí | — |  |
| `onChangeText` | ``(v: string) => void`` | sí | — |  |
| `placeholder` | ``string`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { SearchField } from '@dsm/ui';

<SearchField value={q} onChangeText={setQ} placeholder="Buscar beneficiario" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SearchFieldStandalone({ value, onChangeText, placeholder }: { value: string; onChangeText: (v: string) => void; placeholder?: string }) {
  const height = 44; // component.searchfield.height.md
  const radius = 12; // component.searchfield.radius (web)
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', minHeight: height, borderRadius: radius, border: '1px solid #6e7587', padding: '0 12px', fontFamily: 'Mulish, sans-serif' }}
    />
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/searchField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Select

Lista cerrada de una opción (trigger + menú).

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Banco, estado, plazo.

## Cuándo no

Texto libre filtrable: no hay Combobox en este monorepo aún.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `value` | ``string`` | no | — |  |
| `options` | ``{value,label}[]`` | sí | — |  |
| `onChange` | ``fn`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Select } from '@dsm/ui';

<Select
  label="Banco"
  options={[{ value: 'bcp', label: 'BCP' }]}
  value={bank}
  onChange={setBank}
/>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SelectStandalone({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value?: string; onChange: (v: string) => void }) {
  const z = 1100; // dimension.z.dropdown
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: '1px solid #6e7587', padding: '0 12px', zIndex: z }}>
        <option value="">Elige una opción</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/select.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Skeleton

Placeholder de carga con shimmer.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Mientras llegan datos.

## Cuándo no

Error: Alert. Vacío: EmptyState.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `variant` | ``string`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Skeleton } from '@dsm/ui';

<Skeleton />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SkeletonStandalone() {
  const bg = '#e5e8f1'; // color.component.skeleton.bg
  return <div aria-hidden style={{ height: 16, borderRadius: 8, background: bg, width: '100%' }} />;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/skeleton.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Snackbar

Toast efímero sobre la UI. Se va solo.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Algo acaba de pasar: guardado, enviado, error breve.

## Cuándo no

Aviso persistente: Alert. Pila: SnackbarStack.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `message` | ``string`` | sí | — |  |
| `status` | ``'info'\|'success'\|'warning'\|'danger'`` | no | 'info' |  |
| `action` | ``{label,onPress}`` | no | — | XOR con onDismiss |
| `onDismiss` | ``() => void`` | no | — |  |
| `duration` | ``number`` | no | 6000 | 10000 |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Snackbar } from '@dsm/ui';

<Snackbar
  message="Se guardó el cambio en tu tarjeta"
  status="success"
  action={{ label: 'Deshacer', onPress: () => {} }}
/>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SnackbarStandalone({ message, onAction }: { message: string; onAction?: () => void }) {
  const surface = '#232b3d'; // color.component.snackbar.surface.bg
  const text = '#fafbfe'; // color.component.snackbar.content.text
  const z = 1500; // dimension.z.toast
  return (
    <div role="status" style={{ position: 'fixed', left: 16, right: 16, bottom: 24, zIndex: z, background: surface, color: text, borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ flex: 1 }}>{message}</span>
      {onAction ? <button type="button" onClick={onAction} style={{ background: 'none', border: 'none', color: text, fontWeight: 700, cursor: 'pointer' }}>Deshacer</button> : null}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/snackbar.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# SnackbarStack

Pila de hasta 3 Snackbar: colapsada o expandida.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Varios avisos a la vez.

## Cuándo no

Uno solo: Snackbar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `items` | ``ISnackbarStackItem[]`` | sí | — |  |
| `onDismiss` | ``(id) => void`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { SnackbarStack } from '@dsm/ui';

<SnackbarStack items={items} onDismiss={remove} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SnackbarStackStandalone({ messages }: { messages: string[] }) {
  const z = 1500; // dimension.z.toast
  return (
    <div style={{ position: 'fixed', left: 16, right: 16, bottom: 24, zIndex: z, display: 'flex', flexDirection: 'column-reverse', gap: 8 }}>
      {messages.slice(-3).map((m) => (
        <div key={m} style={{ background: '#232b3d', color: '#fafbfe', borderRadius: 12, padding: 16, fontFamily: 'Mulish, sans-serif' }}>{m}</div>
      ))}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/snackbarStack.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Spinner

Indicador de carga indeterminado.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Espera corta sin porcentaje.

## Cuándo no

Progreso conocido: ProgressBar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `appearance` | ``string`` | no | — | brand |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Spinner } from '@dsm/ui';

<Spinner />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SpinnerStandalone() {
  const indicator = '#364481'; // color.component.spinner.indicator.brand
  return (
    <div role="status" aria-label="Cargando" style={{ width: 24, height: 24, borderRadius: '50%', border: `3px solid #ced4e3`, borderTopColor: indicator, animation: 'spin 0.8s linear infinite' }} />
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/spinner.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Step

Nodo interno de ProgressStepper. No es API de pantalla.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Solo dentro de ProgressStepper / Storybook.

## Cuándo no

En una pantalla usa ProgressStepper con steps[].

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `status` | ``string`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
// No importes Step en una pantalla.
import { ProgressStepper } from '@dsm/ui';
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
// No hay réplica de pantalla: usa ProgressStepperStandalone en ProgressStepper.md.
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/step.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# StepConnector

Conector interno del ProgressStepper.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Solo dentro del steppper.

## Cuándo no

No uses en pantallas.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `status` | ``string`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
// Interno — ver ProgressStepper.md
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
// Interno — ver ProgressStepper.md
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/stepConnector.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Switch

Interruptor on/off.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Preferencia binaria inmediata.

## Cuándo no

Checkbox de formulario: Checkbox.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `checked` | ``boolean`` | sí | — |  |
| `onChange` | ``(v: boolean) => void`` | sí | — |  |
| `disabled` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Switch } from '@dsm/ui';

<Switch checked={on} onChange={setOn} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SwitchStandalone({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const track = checked ? '#364481' : '#ced4e3';
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} style={{ width: 52, height: 32, borderRadius: 999, border: 'none', background: track, padding: 2, cursor: 'pointer' }}>
      <span style={{ display: 'block', width: 28, height: 28, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 150ms' }} />
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/switch.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# SwitchItem

Fila con label + Switch.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Ajuste en lista de preferencias.

## Cuándo no

Switch suelto sin texto: Switch.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | ``string`` | sí | — |  |
| `checked` | ``boolean`` | sí | — |  |
| `onChange` | ``fn`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { SwitchItem } from '@dsm/ui';

<SwitchItem title="Notificaciones" checked={on} onChange={setOn} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SwitchItemStandalone({ title, checked, onChange }: { title: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontWeight: 700 }}>{title}</span>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} style={{ width: 52, height: 32, borderRadius: 999, border: 'none', background: checked ? '#364481' : '#ced4e3' }}>
        <span style={{ display: 'block', width: 28, height: 28, margin: 2, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(20px)' : undefined }} />
      </button>
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/switchItem.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Tabs

Secciones que se ven de a una, elegidas tocando.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Cambiar de vista hermana en la misma pantalla.

## Cuándo no

Todas visibles a la vez: Accordion. Un solo panel: no uses Tabs.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `items` | ``ITabDef[]`` | sí | — |  |
| `value` | ``string`` | sí | — |  |
| `onChange` | ``fn`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Tabs } from '@dsm/ui';

<Tabs
  items={[{ id: 'a', label: 'Movimientos' }, { id: 'b', label: 'Detalles' }]}
  value={tab}
  onChange={setTab}
/>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TabsStandalone({ items, value, onChange }: { items: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) {
  const active = '#364481'; // component.tabs.indicator.bg-active
  const activeText = '#232b3d'; // label.text-active
  const inactiveText = '#5f6677'; // label.text-inactive
  return (
    <div role="tablist" style={{ display: 'flex', borderBottom: '1px solid #ced4e3', fontFamily: 'Mulish, sans-serif' }}>
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button key={item.id} type="button" role="tab" aria-selected={selected} onClick={() => onChange(item.id)} style={{ flex: 1, minHeight: 48, border: 'none', background: 'transparent', borderBottom: selected ? `2px solid ${active}` : '2px solid transparent', color: selected ? activeText : inactiveText, fontWeight: selected ? 800 : 400 }}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/tabs.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Tag

Etiqueta no tocable.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Metadato: estado, categoría.

## Cuándo no

Filtro tocable: Chip.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Tag } from '@dsm/ui';

<Tag label="Pendiente" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TagStandalone({ label }: { label: string }) {
  return <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 6, background: '#e5e8f1', color: '#232b3d', fontFamily: 'Mulish, sans-serif', fontSize: 12, fontWeight: 700 }}>{label}</span>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/tag.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# TagGroup

Grupo de Tags.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Varias etiquetas en fila.

## Cuándo no

Un Tag: Tag.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Tag, TagGroup } from '@dsm/ui';

<TagGroup>
  <Tag label="Dólares" />
  <Tag label="Activa" />
</TagGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TagGroupStandalone({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/tagGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


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
| `label` | ``string`` | sí | — |  |
| `value` | ``string`` | sí | — |  |
| `onChangeText` | ``(v: string) => void`` | sí | — |  |
| `error` | ``string`` | no | — |  |

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



---


# TextField

Campo de texto de una línea. error="mensaje" es el estado inválido.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Nombre, monto, concepto.

## Cuándo no

Clave: PasswordField. Búsqueda: SearchField. Multilínea: TextArea.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `value` | ``string`` | sí | — |  |
| `onChangeText` | ``(v: string) => void`` | sí | — |  |
| `error` | ``string`` | no | — | sin isInvalid |
| `disabled` | ``boolean`` | no | false |  |
| `readOnly` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { TextField } from '@dsm/ui';

<TextField label="Monto" value={v} onChangeText={setV} error={err} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TextFieldStandalone({ label, value, onChangeText, error }: { label: string; value: string; onChangeText: (v: string) => void; error?: string }) {
  return (
    <label style={{ display: 'block', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontSize: 14, color: '#434959' }}>{label}</span>
      <input value={value} onChange={(e) => onChangeText(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, minHeight: 44, borderRadius: 12, border: `1px solid ${error ? '#b22c42' : '#6e7587'}`, padding: '0 12px' }} />
      {error ? <span role="alert" style={{ color: '#b22c42', fontSize: 12 }}>{error}</span> : null}
    </label>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/textField.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


# Tooltip

Ayuda breve al hover/foco, con tip.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Explicar un control sin ocupar espacio permanente.

## Cuándo no

Tour: Coachmark. Toast: Snackbar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `body` | ``string`` | sí | — |  |
| `title` | ``string`` | no | — |  |
| `placement` | ``string`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Tooltip } from '@dsm/ui';

<Tooltip body="Comisión US$ 1.50 a otros bancos" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TooltipStandalone({ body }: { body: string }) {
  const bg = '#232b3d'; // color.component.tooltip.surface.bg
  const text = '#fafbfe'; // content
  return (
    <div role="tooltip" style={{ background: bg, color: text, borderRadius: 8, padding: '8px 12px', fontFamily: 'Mulish, sans-serif', fontSize: 14, maxWidth: 240 }}>
      {body}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/tooltip.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.



---


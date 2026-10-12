# Prompt — armar una pantalla con el design system

Copia todo lo que sigue, cambia lo que está entre `[corchetes]` y pégalo en el chat. No mandes solo el enlace: muchas IA no lo abren.

---

Arma con el design system blu (Diners Club) una pantalla de la app, en **React + JSX**.

## PEDIDO

[Describe la pantalla como la diría un usuario. Ej.: «Quiero enviar dinero: cuenta de origen, beneficiario, banco, monto en dólares y Continuar.»]

## DATOS Y REGLAS

[Datos y reglas reales. Si no hay: «Inventa datos verosímiles en dólares y dime cuáles inventaste».]

## LEE PRIMERO (no supongas)

El design system es interno. Ábrelo en estos enlaces (texto plano):

- `…/ia/index.html` — esta página y el prompt para copiar.
- `…/ia/llms.txt` — lista de componentes y para qué sirve cada uno.
- La ficha de cada componente que vayas a usar: `…/ia/docs/components/<Nombre>.md` (cuándo usarlo, cuándo no, props, JSX de uso y JSX sin librería).
- Si te adjunté `kit.md`, úsalo en lugar de los enlaces: trae las fichas juntas. Con el kit no necesitas abrir nada.

Si no puedes abrir los enlaces y no hay kit adjunto, dímelo en una línea y para: no armes la pantalla de memoria.

## CÓMO TRABAJAR

1. Antes del código, dame una tabla: parte de la pantalla → componente → por qué ese y no su alternativa (según la ficha).
2. Usa solo componentes que están en `llms.txt`, respetando su ficha («Cuándo no» incluido). Si algo no se puede armar con ellos, no lo inventes: dime qué falta.
3. **Import de la librería.** Prueba primero:

   ```tsx
   import { Accordion, Button, BluProvider } from '@dsm/ui';
   ```

   Si `@dsm/ui` no resuelve (no está instalado o no existe en ese proyecto), usa el paquete del monorepo:

   ```tsx
   import { Accordion, Button, BluProvider } from '@dsm/web';
   ```

   Tipos de contrato: `@dsm/shared`. Íconos en el monorepo: un import por sección, sin barrel — `import { IconChevronLeft } from '@dsm/web/icons/arrows'`. Envuelve la pantalla en `BluProvider`.
4. **Si ninguno de los paquetes se puede instalar**, no reescribas el componente y no lo bajes a HTML. Abre la ficha del componente y copia el bloque **Sin librería** (el function component en JSX). Pégalo en tu proyecto tal cual. Los valores del tema por defecto (`light` / `compact` / `web`) ya van en el objeto `style`, con el path del token en comentario. No busques `variables.css`.
5. No completes ese JSX con un color, padding, font-size o medida que la ficha no traiga. Si falta un token, dilo.
6. Textos en español con tuteo. Montos en dólares: `US$ 1,250.56`. Egresos con `−` (U+2212) además del color cuando la ficha lo use.
7. Accesibilidad: HTML semántico (`button`, `h1`…), nombre accesible en controles, foco visible, áreas de toque de al menos 44.

## AL FINAL DAME

- El JSX completo de la pantalla (un solo bloque, o los archivos que uses).
- La tabla de componentes.
- Lo que inventaste (datos, reglas o tokens que no encontraste).
- Una autocalificación de 1 a 5 en: componentes reales, tokens, plataforma, accesibilidad, contenido y fidelidad al pedido.

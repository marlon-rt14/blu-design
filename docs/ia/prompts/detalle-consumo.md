# Prompt — Detalle de un consumo

Copia todo lo que sigue y pégalo en el chat.

**Si tu agente suele fallar al abrir URLs (DeepSeek, Gemini, a veces ChatGPT): adjunta primero** [kit.md](https://bds-nu.vercel.app/ia/kit.md) **y después pega el prompt.**

---

Arma con el design system blu (Diners Club) una pantalla de la app, en **React + JSX**.

## PEDIDO

Quiero ver el detalle de un consumo con tarjeta: comercio, monto, fecha y hora, estado, tarjeta con la que pagué, número de referencia y un botón para compartir el comprobante.

## DATOS Y REGLAS

Inventa datos verosímiles de Ecuador y dime cuáles inventaste.

- Montos en dólares: `US$ 1,250.56` (sé consistente)
- Textos en español con tuteo
- Una sola pantalla, sin wizard
- El botón de compartir es la acción principal; no inventes anular ni disputar si no están en el pedido

## LEE PRIMERO (orden obligatorio)

1. **Preferido:** https://bds-nu.vercel.app/ia/kit.md (o el kit adjunto). Si lo tienes, ignora el resto.
2. Si no hay kit:
   - https://bds-nu.vercel.app/ia/llms.txt
   - https://bds-nu.vercel.app/ia/docs/components/Card.md
   - https://bds-nu.vercel.app/ia/docs/components/ListGroup.md
   - https://bds-nu.vercel.app/ia/docs/components/ListItem.md
   - https://bds-nu.vercel.app/ia/docs/components/Tag.md
   - https://bds-nu.vercel.app/ia/docs/components/Badge.md
   - https://bds-nu.vercel.app/ia/docs/components/Button.md
   - https://bds-nu.vercel.app/ia/docs/components/ButtonGroup.md
   - https://bds-nu.vercel.app/ia/docs/components/IconButton.md
   - https://bds-nu.vercel.app/ia/docs/components/Divider.md
   - https://bds-nu.vercel.app/ia/docs/components/Avatar.md
   - https://bds-nu.vercel.app/ia/docs/components/Alert.md
3. Si las fichas sueltas fallan (error de Markdown, etc.): abre kit.md y continúa.
4. Solo si no hay kit ni pudiste abrir `kit.md` ni `llms.txt`: pide el kit en una línea y espera. No inventes el design system.

## CÓMO TRABAJAR

1. Antes del código: tabla parte → componente → por qué ese y no su alternativa.
2. Solo componentes del kit / `llms.txt`, respetando «Cuándo no». Si falta un patrón y no está en el catálogo, dilo: no lo inventes.
3. Import: `@dsm/ui`; si no resuelve, `@dsm/web`. Tipos `@dsm/shared`. Íconos `@dsm/web/icons/<sección>`. `BluProvider`.
4. Sin librería: copia el JSX **Sin librería** de cada ficha. No HTML.
5. `Button`: `onClick`, `label`, `isDisabled`. Acción principal `appearance="fill"`. `IconButton`: `onPress` + `label` accesible.
6. Accesibilidad: `button`/`h1`, nombres accesibles, foco visible, toque ≥ 44.

## AL FINAL DAME

- JSX completo de la pantalla
- Tabla de componentes
- Lo que inventaste (comercio, montos, fechas, tarjeta, referencia, estado)
- Autocalificación 1–5: componentes, tokens, plataforma, a11y, contenido, fidelidad

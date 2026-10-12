# Prompt — armar una pantalla con el design system

Copia todo lo que sigue, cambia lo que está entre `[corchetes]` y pégalo en el chat.

**Si tu agente suele fallar al abrir URLs (DeepSeek, Gemini, a veces ChatGPT): adjunta primero** [`kit.md`](https://bds-nu.vercel.app/ia/kit.md) **y después pega el prompt.** Con el kit no necesita abrir nada más.

---

Arma con el design system blu (Diners Club) una pantalla de la app, en **React + JSX**.

## PEDIDO

[Describe la pantalla como la diría un usuario.]

## DATOS Y REGLAS

[Datos y reglas reales. Si no hay: «Inventa datos verosímiles y dime cuáles inventaste».]

## LEE PRIMERO (orden obligatorio)

El design system es interno. Sigue este orden; **no pares en el primer fallo**:

1. **Preferido — un solo archivo:** abre o usa el adjunto  
   https://bds-nu.vercel.app/ia/kit.md  
   Ahí están todas las fichas (cuándo usarlo, cuándo no, props, JSX de uso y JSX sin librería). Si tienes el kit, **ignora el resto de enlaces**.
2. Si no hay kit:  
   - https://bds-nu.vercel.app/ia/llms.txt  
   - Ficha de cada componente: https://bds-nu.vercel.app/ia/docs/components/<Nombre>.md  
   - Índice: https://bds-nu.vercel.app/ia/index.html
3. Si las fichas sueltas fallan (error de Markdown, 404, etc.) pero `llms.txt` o el índice sí abren: **abre kit.md** (paso 1) y continúa.
4. Solo si no tienes kit adjunto **y** no pudiste abrir ni `kit.md` ni `llms.txt`: responde en una línea pidiendo que te adjunten `kit.md` y espera. No inventes el design system de memoria.

## CÓMO TRABAJAR

1. Antes del código, tabla: parte de la pantalla → componente → por qué ese y no su alternativa (según la ficha o el kit).
2. Usa solo componentes listados en `llms.txt` / kit, respetando «Cuándo no». Si algo no se puede armar, dilo: no lo inventes.
3. **Import.** Prueba `@dsm/ui`. Si no resuelve: `@dsm/web`. Tipos: `@dsm/shared`. Íconos: `@dsm/web/icons/<sección>`. Envuelve en `BluProvider`.
4. **Sin librería:** copia el bloque **Sin librería** de la ficha (JSX). No HTML. No inventes colores fuera de los comentados.
5. Textos en español con tuteo. Montos en dólares: `US$ 1,250.56` salvo que el pedido diga otra cosa.
6. Accesibilidad: HTML semántico, nombre accesible, foco visible, toque ≥ 44.

## AL FINAL DAME

- El JSX completo de la pantalla.
- La tabla de componentes.
- Lo que inventaste.
- Autocalificación 1–5: componentes, tokens, plataforma, a11y, contenido, fidelidad.

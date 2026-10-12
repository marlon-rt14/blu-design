# Prompt — Login

Copia todo lo que sigue y pégalo en el chat.

**Si tu agente suele fallar al abrir URLs (DeepSeek, Gemini, a veces ChatGPT): adjunta primero** [kit.md](https://bds-nu.vercel.app/ia/kit.md) **y después pega el prompt.**

---

Arma con el design system blu (Diners Club) una pantalla de la app, en **React + JSX**.

## PEDIDO

Quiero un login: correo, clave (con mostrar/ocultar), checkbox “Recordarme”, enlace “Olvidé mi clave”, botón principal “Entrar”, y debajo un LinkButton “Crear cuenta”. Si el correo o la clave están mal al enviar, muestra error en los campos. Mientras valida, el botón Entrar queda deshabilitado (no hay loading en Button).

## DATOS Y REGLAS

- Correo de ejemplo: `maria.quispe@correo.com`
- Clave: no la inventes en claro; placeholder “Tu clave”
- Error de correo vacío: “Escribe tu correo”
- Error de formato: “Revisa el formato del correo”
- Error de clave vacía: “Escribe tu clave”
- Error de servidor (ambos campos): “Correo o clave incorrectos” en el campo de clave
- Textos en español con tuteo
- Una sola pantalla, sin wizard

## LEE PRIMERO (orden obligatorio)

1. **Preferido:** https://bds-nu.vercel.app/ia/kit.md (o el kit adjunto). Si lo tienes, ignora el resto.
2. Si no hay kit:
   - https://bds-nu.vercel.app/ia/llms.txt
   - https://bds-nu.vercel.app/ia/docs/components/TextField.md
   - https://bds-nu.vercel.app/ia/docs/components/PasswordField.md
   - https://bds-nu.vercel.app/ia/docs/components/Checkbox.md
   - https://bds-nu.vercel.app/ia/docs/components/Button.md
   - https://bds-nu.vercel.app/ia/docs/components/LinkButton.md
   - https://bds-nu.vercel.app/ia/docs/components/ButtonGroup.md
   - https://bds-nu.vercel.app/ia/docs/components/Alert.md (solo si hace falta; preferí `error` en el campo)
3. Si las fichas sueltas fallan: abre kit.md y continúa.
4. Solo si no hay kit ni pudiste abrir `kit.md` ni `llms.txt`: pide el kit en una línea y espera. No inventes el design system.

## CÓMO TRABAJAR

1. Antes del código: tabla parte → componente → por qué ese y no su alternativa.
2. Solo componentes del kit / `llms.txt`, respetando «Cuándo no».
3. Import: `@dsm/ui`; si no resuelve, `@dsm/web`. Tipos `@dsm/shared`. Íconos `@dsm/web/icons/<sección>`. `BluProvider`.
4. Sin librería: copia el JSX **Sin librería** de cada ficha. No HTML.
5. `TextField` / `PasswordField`: `error="mensaje"`, `onChangeText`. `Button`: `onClick`, `label`, `isDisabled`. Acción segura `appearance="fill"` primero.
6. Accesibilidad: `button`/`h1`, nombres accesibles, foco visible, toque ≥ 44.

## AL FINAL DAME

- JSX completo del login
- Tabla de componentes
- Lo que inventaste
- Autocalificación 1–5: componentes, tokens, plataforma, a11y, contenido, fidelidad

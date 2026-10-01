# Props enlazadas a tokens, componente por componente

Qué propiedad de cada nodo de Figma está enlazada a una variable, **qué eje la hace
cambiar**, y si nuestro código ya la resuelve bien. Una fila por enlace real — no por
token que creamos que debería existir.

Tres columnas cargan todo el peso:

- **Eje** — qué hace que esa propiedad cambie de valor. Es lo que decide si un
  componente necesita divergir por plataforma o solo por tema.
- **Comentario** — qué está pasando con esa prop, en una frase y sin tecnicismos.
- **Estado** — qué tan lejos está esa fila de estar resuelta. **No es una medición fila
  por fila: lo decide el eje**, y una fila solo pasa a ✅ cuando alguien la cruza a mano
  contra Figma.

## Las 16 reglas

Lo que sigue en el documento las desarrolla. Esta lista es el índice.

**Qué es un componente de plataforma**

1. Hay **nativos e híbridos**. Los nativos cambian de anatomía según el SO; los híbridos
   tienen una sola forma y siguen la plataforma solo por tokens. Los dos llevan **además**
   los temas de marca y semantic.
2. **La lista de nativos es de diseño, no se elige a dedo** — 15 a 2026-10-01. Y un
   nativo tiene por fuerza props de eje `PLATAFORMA`, pero tenerlas no lo vuelve nativo.
3. **Primero se marca, después se arregla.** Nada de código antes de tener la fila medida.

**Cómo se anota una fila**

4. **Todo va en la tabla del componente.** Sin subsecciones nuevas.
5. **Leer la variable completa** y anotar en `Aliasea a` el destino que nombre su
   `description`; si no nombra ninguno, el nombre del objeto — y si el destino es
   `platform/*`, el eje es `PLATAFORMA` aunque la colección diga otra cosa.
6. **La colección de Figma no es el eje.** Una dice dónde lo guarda diseño; la otra, qué
   lo cambia.
7. **El eje se mide**, comparando el token entre los cuatro grupos de carpetas. No se lee
   del panel.
8. **Sin columnas de valores medidos.** La tabla dice qué eje y qué estado, no qué número
   salió.

**Los estados**

9. **El Estado lo decide el eje**, no una medición fila por fila: `TEMA` y `PLATAFORMA`
   nacen en ❌, `LAYOUT` y `FIJO` en ⚠️.
10. **Solo las ⚠️ llevan comentario**, en lenguaje llano. Las ❌ van con `—`.
11. **Una celda puede llevar varios ítems**, y cada ítem resuelto se marca con ✓.
12. **⚠️ → ✅ cuando todos los ítems están en ✓.** **❌ → ✅ directo al implementarse.**
13. **Confirmar o corregir un ítem actualiza este archivo en el mismo momento**, sin que
    nadie lo pida. La medición y la fila se mueven juntas o la tabla miente.

**Al verificar**

14. **Cuando la descripción y el valor se contradicen, manda el valor.** `radius/action`
    decía "píldora" valiendo 12; `font/size/body/md` dice "16px" valiendo 17.
15. **Si no sabes dónde vive un token, pregunta hasta que te den la ruta.** No se
    resuelve adivinando ni dejando la fila a medias: se insiste al dev por la ruta o la
    dirección exacta del token, y con eso se implementa.
16. **Compilar no es ejecutar.** `typecheck` y `build-storybook` pueden estar verdes con
    el paquete muerto — la prueba es **evaluar** `@dsm/shared`, que resuelve todas las
    rutas de token al importarse.

## Nativos e híbridos

Desde el **30-sep-2026** el export trae `5. Platform`: carpetas `web`, `ios` y `android`.
Diseño ya partió el catálogo, y **la lista es suya, no nuestra** — está en el frame
`Nativos e híbridos` (`1694:37`, página `Components` `1692:240824`):

[figma.com/design/DOUsaQf0fK7hybeS0n74gb/bDS---Core-components?node-id=1694-37](https://www.figma.com/design/DOUsaQf0fK7hybeS0n74gb/bDS---Core-components?node-id=1692-240824&p=f&m=dev)

- **Nativos — 15.** *Cambian de anatomía.* Se redibujan con los controles que el usuario
  ya conoce de su teléfono. Llevan el eje `platform` atado a `platform/variant`.
  - **ACTIONS**: Button — *"cápsula en iOS, botón común de M3"*
  - **FORMS**: TextField · TextArea · PasswordField · CardField · OTPField · PhoneField ·
    Select · Combobox · SearchField · NumericStepper
  - **SELECTION**: SegmentedControl · Slider · Switch · Calendar
- **Híbridos — 40.** *Una sola forma.* Misma anatomía en las tres plataformas; siguen la
  plataforma **solo a través de los tokens**: tipografía, alturas mínimas de toque, color
  y radios. Son marca y contenido, no controles del sistema.

Los dos grupos llevan **además** los temas de marca y semantic, como todo el catálogo.

El criterio de diseño para decidirlo, textual: va nativo si *"es un control del sistema:
escribir, elegir, activar, deslizar, cargar"*, si *"teclado, foco, selector o gestos se
comportan distinto en cada sistema operativo"*, o si *"se ve ajeno a la plataforma, se
siente roto o poco confiable"*. Va híbrido si *"es marca o contenido"* y *"basta con que
la tipografía, el tamaño de toque y el color sigan el modo"*.

**Un nativo tiene por fuerza props de eje `PLATAFORMA`. Pero tenerlas no lo vuelve
nativo**: medido, 23 de los 42 componentes que tenemos divergen por plataforma, y solo
15 son nativos. Alert, Tooltip, Snackbar o ListItem leen `font/size/body/*`, que se mueve
con el SO, y siguen siendo híbridos. Lo que separa a las dos familias es si cambia **la
anatomía**, y eso lo dice la lista de Figma, no una medición nuestra.

## La trampa: la colección de Figma no es el eje

`radius/action` vive en la colección `4. Layout`, y no se mueve con layout en
absoluto: se mueve con **plataforma**, porque aliasea `platform/radius/action`. Por eso
hay dos columnas y no una. La colección dice dónde guarda diseño la variable; el eje
dice qué la cambia, y es lo único que importa para el código.

La columna **Aliasea a** es la que lo hace visible: cuando dice `platform/*`, el eje va
a ser `PLATAFORMA` aunque la colección diga otra cosa.

## Leyenda

**Eje** — medido comparando el valor del token entre las 18 carpetas del export:

| | significado |
|---|---|
| `TEMA (marca+semantic)` | cambia con `2. Brand` **y** con `3. Semantic` |
| `TEMA (semantic)` | cambia solo con `3. Semantic` — la marca no lo toca |
| `PLATAFORMA` | cambia con `5. Platform` — web / ios / android |
| `LAYOUT` | cambia con `4. Layout` — compact / regular / expanded |
| `FIJO` | un solo valor en las 18 carpetas |

**Estado** — no se decide fila por fila, lo decide el eje:

| | significado | a qué ejes les toca |
|---|---|---|
| ❌ | **incompleto.** El eje no está cableado, así que no hay forma de producir el valor correcto desde código | todas las de `TEMA` y `PLATAFORMA` |
| ⚠️ | **implementado, sin revisar.** Se lee un token y sale un valor, pero **nadie lo ha cruzado a mano con el de Figma**: puede funcionar o no | todas las de `LAYOUT` y `FIJO` |
| ✅ | revisado a mano contra Figma y coincide | **5 de 12** |
| 🔍 | el eje no está identificado todavía | — |

Por eso `TEMA` y `PLATAFORMA` van en ❌ de entrada: los cruces marca × tema no se
exportan y el eje plataforma no está cableado. Y `LAYOUT` y `FIJO` no van en ✅ solo
porque estén implementadas — **una fila pasa a ✅ cuando alguien la mide**, no cuando
compila. Ya nos pasó: `size/icon/sm` estaba implementada y daba 24 donde Figma pone 16.

**Cómo se mueve una fila de estado:**

- **Solo las filas en ⚠️ llevan comentario.** Las de ❌ van con `—`: están pendientes y
  no hay nada que matizar — su detalle está en «Los cinco frentes abiertos».
- Una celda de comentario **puede llevar varios ítems**, uno por cosa que falta.
- **Cada ítem resuelto se marca con ✓.**
- **⚠️ → ✅ cuando todos los ítems de la celda están en ✓.** Si queda uno suelto, sigue
  en ⚠️.
- **❌ → ✅ directo, al implementarse.** No pasa por ⚠️: lo que le falta a una ❌ es
  cablear el eje, y eso o está o no está — no hay nada que revisar a mano después.

## Cómo se llena esto

Nada se lee a ojo del panel de Figma. Son cuatro pasos:

```bash
# 1. el nodo, con sus boundVariables y su explicitVariableModes
curl -s -H "X-Figma-Token: $FIGMA_API_KEY" \
  "https://api.figma.com/v1/files/DOUsaQf0fK7hybeS0n74gb/nodes?ids=<NODE_ID>"

# 2. el diccionario de variables, para pasar de VariableID a nombre
curl -s -H "X-Figma-Token: $FIGMA_API_KEY" \
  "https://api.figma.com/v1/files/DOUsaQf0fK7hybeS0n74gb/variables/local"

# 3. el eje: buscar la ruta del token en packages/shared/src/theme/<carpeta>/ y
#    comparar su valor entre los grupos de carpetas
#      MARCA       blu · titanium · discover · clubmiles · grandtable
#      SEMANTIC    light · dark · mclight · mcdark · hclight · hcdark
#      LAYOUT      compact · regular · expanded
#      PLATAFORMA  web · ios · android

# 4. nuestro valor, EVALUANDO el paquete (no compilándolo)
node_modules/.bin/esbuild ./entry.ts --bundle --platform=node --format=cjs \
  --loader:.json=json --outfile=/tmp/out.cjs && node /tmp/out.cjs
```

`fileKey` = `DOUsaQf0fK7hybeS0n74gb` (`BDS3 - Core components`).

**Dudas de diseño o de Figma: se le preguntan a Jetto.** No se resuelven inventando una
fila ni citando una descripción que no se encuentra — eso ya nos costó el mapeo del
icono del Button.

Al leer el nodo, dos campos valen oro:

- **`boundVariables`** — el enlace propiedad → variable. Es el dato duro; el nombre de
  la capa no lo es.
- **`explicitVariableModes`** — qué modo de qué colección está fijado, y **en qué nodo**.
  En la matriz del Button está repartido: marca y semantic en el botón, plataforma en
  el frame `docs/set` que lo contiene.

**Regla:** leer la variable completa y anotar en `Aliasea a` el destino que nombre su
`description`; si no nombra ninguno, el nombre del objeto — y si el destino es
`platform/*`, el eje es `PLATAFORMA` aunque la colección diga otra cosa.

---

## Button — **nativo**

Entró en la lista de Figma el **2026-10-01**, en `ACTIONS`, con la nota *"cápsula en iOS,
botón común de M3"*. Hasta ese día estaba entre los híbridos y este documento lo
describía así.

Lo que ya tenemos cubierto es el **eje de tokens**: dos filas siguen la plataforma,
`rectangleCornerRadii` y `fontFamily`, y la primera está cerrada y medida. Lo que un
nativo hace **además** es cambiar de anatomía, y eso no son valores distintos sino otro
árbol de JSX por plataforma. Eso está sin empezar, y no es lo que miden estas tablas.

Medido sobre dos nodos hermanos de la sección `06 · Marca × tema × plataforma`
(frame `Button · Plataformas`, `1507:65184`):

- `1507:65201` — `Button · grandtable · light`, bloque **web**. El único con los dos
  iconos visibles, así que es el que sirve para medir el icono.
- `1507:65490` — `Button · discover · mc-light`, bloque **ios**.

Ambos son `variant=primary · appearance=fill · size=lg · state=default`.

### Capa raíz

| Propiedad (Figma) | Variable | Aliasea a | Colección | **Eje** | Estado | Comentario |
|---|---|---|---|---|---|---|
| `fills` | `component/button/primary/bg-default` | `color/fill/action/primary/default` | 3. Semantic | **TEMA (marca+semantic)** | ❌ | — |
| `rectangleCornerRadii` (4 esquinas) | `radius/action` | **`platform/radius/action`** | 4. Layout | **PLATAFORMA** | ✅ | • Eje plataforma cableado; medido en el navegador: web 12 · iOS pastilla · Android 12 **✓** |
| `paddingLeft` · `paddingRight` | `space/inset/{sm,md,lg,xl}` | primitivo (sin nombrar) | 4. Layout | LAYOUT | ⚠️ | • Los cuatro tamaños cuadran con Figma en `compact`: 8 · 12 · 16 · 24 **✓**<br>• En `regular` y `expanded` crece hasta 32 y 40, y eso no se ha visto |
| `size.y` | `size/control/height/{xs,sm,md,lg}` | primitivo (sin nombrar) | 4. Layout | LAYOUT | ⚠️ | • Los cuatro tamaños cuadran con Figma: 24 · 32 · 44 · 56 **✓**<br>• Las 18 variantes del set dan lo mismo **✓**<br>• `sm` y `md` crecen en `expanded` (36 y 48) y eso no se ha visto |
| `itemSpacing` | `space/inline/sm` | primitivo (sin nombrar) | 4. Layout | FIJO | ✅ | • Da 8 en los cuatro tamaños y en las 18 variantes, igual que Figma **✓**<br>• El token es el mismo en las 18 carpetas **✓** |
| `minWidth` | `size/control/minWidth` | primitivo (sin nombrar) | 4. Layout | FIJO | ✅ | • Da 64 en los cuatro tamaños y en las 18 variantes, igual que Figma **✓**<br>• El token es el mismo en las 18 carpetas **✓** |

### Capa `label`

| Propiedad (Figma) | Variable | Aliasea a | Colección | **Eje** | Estado | Comentario |
|---|---|---|---|---|---|---|
| `fills` | `component/button/primary/text-default` | `color/text/action/primary/default` | 3. Semantic | **TEMA (semantic)** | ❌ | — |
| `fontFamily` | `font/family/text` | **`platform/font/family`** | 4. Layout | **PLATAFORMA** | ⚠️ | • Eje plataforma cableado **✓**<br>• Seguimos leyendo `font/family/mulish` a mano en vez de este token; retirar el rodeo |
| `fontStyle` | *(variable no local)* | — | — | 🔍 | ❌ | — |
| `fontSize` | `font/size/label/{sm,md,lg}` | primitivo (sin nombrar) | 4. Layout | FIJO | ✅ | • Los cuatro tamaños cuadran con Figma: 12 · 12 · 14 · 16 **✓**<br>• Las 18 variantes del set usan los mismos valores **✓** |

### Capas `leadingIcon` / `trailingIcon`

| Propiedad (Figma) | Variable | Aliasea a | Colección | **Eje** | Estado | Comentario |
|---|---|---|---|---|---|---|
| `fills` (del vector) | `component/button/primary/icon-default` | `color/icon/action/primary/default` | 3. Semantic | **TEMA (semantic)** | ❌ | — |
| `size.x` · `size.y` | `size/icon/sm` | primitivo (sin nombrar) | 4. Layout | FIJO | ✅ | • El Button pedía 24 en `md` y `lg` donde Figma pone 16 **✓**<br>• Las 18 variantes del set usan el mismo tamaño, `size/icon/sm` **✓** |

### Lo que mueve la plataforma, con valores

```
                              web        ios      android     light (la que leemos hoy)
radius/action                12px     9999px         12px     9999px
font/family/text           Mulish     SF Pro       Roboto     SF Pro
platform/type/label/weight  500px      600px        500px      600px
```

**El eje está cableado desde el 30-sep-2026.** `TThemeSourceKey` pasó a
`` `${marca-o-modo}@${layout}@${plataforma}` `` — 90 entradas — y los dos `BluProvider`
aceptan `platform`, que en móvil sale de `Platform.OS` y en web es siempre `web`. Antes
de eso `light` era la única fuente y las 15 carpetas viejas están **congeladas en modo
ios**, que es por lo que la web rendía el Button en pastilla.

Los cuatro ejes componen sin arbitrar nada, medido: las **seis intersecciones dos a dos
están vacías**, y `layout` y `platform` no mueven un solo token de color.

Cablearlo no arregló solo el Button. De las 140 claves que mueve la plataforma, 5 llegan
a un componente y tocan 19: los siete campos pasan a `radius/field` = **4 en Android**, y
la web recupera sus tamaños de texto (14/16) en lugar de los 15/17 de iOS.

### Los tres frentes abiertos

Esto no es "las que fallan": son las que ya sabemos **qué** tienen y **quién** lo cierra.
El resto está en ⚠️ por no haberse revisado, que es otra cosa. Cuando un frente se
cierra **se borra de aquí** — su historia vive en el commit y en el JSDoc.

1. **`font/family/text`. `PLATAFORMA`.** El eje ya está cableado, así que este token
   ahora resolvería solo: `Mulish` en web, `SF Pro` en iOS, `Roboto` en Android. Pero
   seguimos leyendo `font/family/mulish` **a mano**, que fue el rodeo para no pedirle
   SF Pro al navegador cuando el export estaba congelado en iOS. Retirar el rodeo es lo
   que queda.
   **Ojo:** esto no cambia la regla de móvil. `@dsm/mobile` no escribe `fontFamily`
   nunca; que `android` traiga `Roboto` no es una invitación a consumirlo — dejarlo sin
   poner es lo que selecciona la fuente del sistema, que en un OEM puede no ser Roboto.

2. **`fontStyle` → 600 vs 500.** Figma rinde la etiqueta en SemiBold; leemos
   `font/weight/medium` = 500, que es `FIJO`. La variable que enlaza Figma es **no
   local**, así que no puedo nombrarla desde aquí.
   **`platform/type/label/weight` queda descartado, medido**: da `web=500`, y el bloque
   que rinde 600 es el de **web**, con `5. Platform = web` fijado de verdad en
   `docs/set · platform=web` (`1507:65195`). O sea que el 600 sale de otra variable, de
   una librería remota. **Hay que preguntarle a diseño cuál es antes de tocar nada.**

3. **`component/button/primary/icon-default`. `TEMA (semantic)`.** No lo leemos:
   `IButtonSurfaceColorTokens` no tiene campo de color de icono, así que el glifo hereda
   el de la etiqueta. **Y por ahora da igual, medido**: los 14 tokens `icon-*` del Button
   son idénticos a su gemelo `text-*` en las 18 carpetas. Así que no es un bug, es una
   divergencia de contrato — el día que diseño los separe, nos enteramos rompiéndonos.
   Cerrarlo es añadir el campo y leerlo; volver a medir los 14 antes.

### Modos fijados, y en qué nodo

```
1507:65490  Button · discover · mc-light     3. Semantic = mc-light · 2. Brand = discover
1507:65195  docs/set · platform=web          5. Platform = web
1507:65402  docs/set · platform=ios          5. Platform = ios
1507:65609  docs/set · platform=android      5. Platform = android
```

El cruce marca × tema está declarado en el propio botón — justo el que el export no
emite como carpeta. La plataforma se fija un nivel arriba, en el `docs/set`.

---

## Pendientes de medir

Ninguno tiene filas todavía, así que **ninguno está clasificado como de plataforma o
no**. Eso se decide al medirlo, no antes:

🔍 Alert · Avatar · Badge · Callout · Card · CardField · Checkbox · CheckboxGroup ·
Chip · ChoiceBox · ChoiceItem · Coachmark · Divider · Icon · IconButton · Image ·
LinkButton · ListGroup · ListItem · Menu · OtpField · PasswordField · PhoneField ·
Popover · ProgressBar · ProgressStepper · Radio · RadioGroup · Select · Skeleton ·
Snackbar · Spinner · Switch · SwitchItem · Tabs · Tag · TextArea · TextField · Tooltip

Pista de por dónde empezar: en el export hay tokens `platform/*` para **Switch**
(`track-width`, `track-height`, `thumb-*`, `padding-*`, `border-width-*`) y **Checkbox**
(`box-size`, `mark-size`), con descripciones que nombran los tres valores. Esos dos son
candidatos firmes a componente de plataforma.

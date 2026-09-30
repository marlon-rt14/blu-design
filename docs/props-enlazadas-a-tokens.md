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

## Las 14 reglas

Lo que sigue en el documento las desarrolla. Esta lista es el índice.

**Qué es un componente de plataforma**

1. Hay **componentes de plataforma y componentes que no**. Los de plataforma llevan
   plataforma **y además** los temas; los que no, solo los temas.
2. **No se declara a dedo: lo es si alguna de sus filas dice `PLATAFORMA`.**
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

**Al verificar**

13. **Cuando la descripción y el valor se contradicen, manda el valor.** `radius/action`
    decía "píldora" valiendo 12; `font/size/body/md` dice "16px" valiendo 17.
14. **Compilar no es ejecutar.** `typecheck` y `build-storybook` pueden estar verdes con
    el paquete muerto — la prueba es **evaluar** `@dsm/shared`, que resuelve todas las
    rutas de token al importarse.

## Por qué el eje importa ahora

Desde el **30-sep-2026** el export trae `5. Platform`: carpetas `web`, `ios` y
`android`. Eso parte el catálogo en dos clases de componente:

- **Componentes de plataforma** — tienen al menos una prop de eje `PLATAFORMA`. Se ven
  distinto en iOS, Android y web. **Y además** llevan los temas de marca y semantic,
  como todos.
- **Componentes de un solo aspecto** — ninguna prop de eje `PLATAFORMA`. Solo temas.

Un componente no se declara de plataforma a dedo: **lo es si alguna de sus filas dice
`PLATAFORMA`**. Esta tabla es lo que lo determina.

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
| ✅ | revisado a mano contra Figma y coincide | hoy **ninguna** |
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

## Button — **componente de plataforma**

Lo es por una sola fila: `rectangleCornerRadii`. Todo lo demás es tema, layout o fijo.

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
| `rectangleCornerRadii` (4 esquinas) | `radius/action` | **`platform/radius/action`** | 4. Layout | **PLATAFORMA** | ❌ | — |
| `paddingLeft` · `paddingRight` | `space/inset/xl` | primitivo (sin nombrar) | 4. Layout | LAYOUT | ⚠️ | Cambia con la densidad y solo hemos mirado `compact`. `regular` y `expanded` nunca se probaron. |
| `size.y` | `size/control/height/lg` | primitivo (sin nombrar) | 4. Layout | FIJO | ⚠️ | Lee el token y da 56, igual que Figma. Solo falta confirmarlo en los otros tamaños. |
| `itemSpacing` | `space/inline/sm` | primitivo (sin nombrar) | 4. Layout | FIJO | ⚠️ | Lee el token y da 8, igual que Figma. Solo falta confirmarlo. |
| `minWidth` | `size/control/minWidth` | primitivo (sin nombrar) | 4. Layout | FIJO | ⚠️ | Lee el token y da 64, igual que Figma. Solo falta confirmarlo. |

### Capa `label`

| Propiedad (Figma) | Variable | Aliasea a | Colección | **Eje** | Estado | Comentario |
|---|---|---|---|---|---|---|
| `fills` | `component/button/primary/text-default` | `color/text/action/primary/default` | 3. Semantic | **TEMA (semantic)** | ❌ | — |
| `fontFamily` | `font/family/text` | **`platform/font/family`** | 4. Layout | **PLATAFORMA** | ❌ | — |
| `fontStyle` | *(variable no local)* | — | — | 🔍 | ❌ | — |
| `fontSize` | *(variable no local)* | — | — | 🔍 | ⚠️ | Da 16, igual que Figma. Pero no sabemos qué variable usa Figma, así que no cuenta como confirmado. |

### Capas `leadingIcon` / `trailingIcon`

| Propiedad (Figma) | Variable | Aliasea a | Colección | **Eje** | Estado | Comentario |
|---|---|---|---|---|---|---|
| `fills` (del vector) | `component/button/primary/icon-default` | `color/icon/action/primary/default` | 3. Semantic | **TEMA (semantic)** | ❌ | — |
| `size.x` · `size.y` | `size/icon/sm` | primitivo (sin nombrar) | 4. Layout | FIJO | ⚠️ | El Icon funciona bien: le pides un tamaño y te lo da. El Button le pide el que no es — en `md` y `lg` pide 24 donde Figma pone 16. |

### Lo que mueve la plataforma, con valores

```
                              web        ios      android     light (la que leemos hoy)
radius/action                12px     9999px         12px     9999px
font/family/text           Mulish     SF Pro       Roboto     SF Pro
platform/type/label/weight  500px      600px        500px      600px
```

`light` es la fuente por defecto de `themeSources`, y **las 15 carpetas viejas siguen
congeladas en modo ios**. Por eso hoy la web rinde el Button en pastilla y pediría
SF Pro si no lo estuviéramos esquivando a mano.

### Los cinco frentes abiertos

Con la leyenda de arriba **ninguna de las 12 filas está en ✅**, así que esto no es "las
que fallan": son las cinco donde ya sabemos **qué** está mal y **quién** lo cierra. El
resto está en ⚠️ por no haberse revisado, que es otra cosa.

1. **`radius/action` → 12 vs 9999. `PLATAFORMA`.** Ya **no** está bloqueado por diseño:
   la carpeta `web` trae `12px`. Lo que falta es nuestro — cablear el eje plataforma en
   `themeSource/themes.ts`. Hoy `TThemeSourceKey` es
   `` `${marca-o-modo}@${layout}` `` y no tiene ranura para plataforma.

2. **`font/family/text`. `PLATAFORMA`.** Mismo caso: la carpeta `web` trae `Mulish`.
   Hoy divergimos **a propósito**, leyendo `font/family/mulish` (la familia nombrada,
   que es `FIJO`) para no pedirle SF Pro al navegador. Cuando el eje esté cableado esta
   divergencia se puede retirar y volver al token que enlaza Figma.
   **Ojo:** esto no cambia la regla de móvil. `@dsm/mobile` no escribe `fontFamily`
   nunca; que `android` traiga `Roboto` no es una invitación a consumirlo — dejarlo sin
   poner es lo que selecciona la fuente del sistema, que en un OEM puede no ser Roboto.

3. **`fontStyle` → 600 vs 500.** Figma rinde la etiqueta en SemiBold; leemos
   `font/weight/medium` = 500, que es `FIJO`. La variable que enlaza Figma es **no
   local**, así que no puedo nombrarla desde aquí.
   **`platform/type/label/weight` queda descartado, medido**: da `web=500`, y el bloque
   que rinde 600 es el de **web**, con `5. Platform = web` fijado de verdad en
   `docs/set · platform=web` (`1507:65195`). O sea que el 600 sale de otra variable, de
   una librería remota. **Hay que preguntarle a diseño cuál es antes de tocar nada.**

4. **`size/icon/sm` → 16 vs 24. `FIJO`.** Esta **sí es nuestra, y es la más fácil.**
   `button.tokens.ts` mapea `iconSize: { xs: 'sm', sm: 'sm', md: 'md', lg: 'md' }`, y su
   JSDoc lo justifica con *"porque la escala no tiene un paso de 20"*. Pero el nodo `lg`
   con el icono **visible** mide 16×16 y enlaza `size/icon/sm`. Es un valor escrito a
   mano, no un token leído — por eso ningún typecheck lo iba a cazar. Falta medir `md`,
   `sm` y `xs` antes de rehacer la tabla completa.

5. **`component/button/primary/icon-default`. `TEMA (semantic)`.** No lo leemos:
   `IButtonSurfaceColorTokens` no tiene campo de color de icono, así que el glifo hereda
   el de la etiqueta. Coinciden en `fill`, pero son tokens distintos y nadie garantiza
   que coincidan en `outline`, `ghost` o `on-inverse`. **Lo cerramos nosotros.**

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

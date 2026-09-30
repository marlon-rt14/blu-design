# Pendientes de diseño y producto

Registro de **lo que el código no puede cerrar solo**. Cada entrada dice quién
lo cierra, según lo que declara la propia documentación de desarrollo de Figma
en su sección `07 · Divergencias y decisiones abiertas`, más lo que
encontramos nosotros y no está declarado.

La regla que usa el archivo de diseño, y que este documento sigue: *"una
divergencia documentada no es deuda; una no documentada sí"*. Lo que está acá
no frena el trabajo — se implementa con la decisión declarada y se corrige
cuando la cierren.

**Esto no es una bitácora.** Lo que ya está implementado y cerrado sale del
archivo: vive en el commit que lo hizo y en el JSDoc del componente. Cuando una
entrada se cierra, se borra.

Última actualización: 2026-09-28.

---

## CardField

Fuente: `CardField · Dev`, nodo `1018:94761`.

| # | Qué | Quién lo cierra |
|---|---|---|
| 1 | En Figma hay **tres pares** de `label`/`value`, uno por parte, y solo uno aplica por variante. En código es un par y `part` decide cuál. *"Es la divergencia más grande del componente y hay que firmarla, o el exporter va a emitir seis props."* | Design Lead + Tech Lead |
| 2 | 432 variantes — el segundo set más grande del archivo. Sacando `isFilled` del eje bajaría a la mitad; partiendo `part` en tres sets, a un tercio. | Jetto |
| 3 | **El catálogo de marcas de tarjeta no está declarado en ningún lado.** Qué marcas se reconocen y qué pasa con una desconocida es regla de producto — no del campo, que solo dice qué tarjeta describen los dígitos. | Jetto + producto |
| 4 | **Cuál de los dos dibujos de Amex.** `.Brand rect` trae `Amex` —un `AMEX` grande cuyas letras se salen de la placa y quedan cortadas— y `Amex alternative`, el lockup `AMERICAN EXPRESS` completo. Usamos el segundo, que es el que entra entero. **Los nombres parecen invertidos** y el recorte parece defecto, no tratamiento. Cambiar de uno al otro es un archivo. | Jetto |
| 5 | **Legibilidad del lockup de Amex en `sm`.** En la placa de 24×16 el lockup de dos líneas queda diminuto. Si hace falta algo legible a ese tamaño, es justamente para lo que serviría un `AMEX` compacto, bien recortado. | Jetto |
| 6 | **En dark, el muestrario invierte Mastercard y Discover** (`#232B3D` → `#E6E8EC`). Dejamos la placa fija en su color de marca. Si bDS quiere que se invierta, hace falta un segundo valor por marca y es CHG. | Jetto |
| 7 | **Las instancias del CardField no usan todas el mismo set de marcas.** En capturas del componente real, Visa y Mastercard salen de `.Brand rect` (placa de color) mientras Discover y Amex aparecen con placa blanca y el logo suelto, que es el otro set. El código sigue el arte canónico de la página `Card network`; la diferencia es del lado del diseño. | Jetto |

**Hallazgo nuestro, no declarado.** La lista de tokens de la sección `06` dice
28 y **omite ~14 que el contrato sí necesita**: `container/border-error`,
`border-focus`, `border-hover`, `overlay-hover`, `bg-readonly`,
`border-readonly`, `value/text-filled`, `value/text-readonly`,
`helper/text-error` y los dos del `brandicon`. Todos existen en el export y se
leen, porque el contrato tiene `error`, `readOnly` y `brand`, y el foco es un
estado.

---

## TextField

Fuente: `TextField · Dev`, nodo `1018:90662`. Es el patrón que siguen los nueve
campos del archivo, así que sus divergencias se repiten en casi todos.

| # | Qué | Quién lo cierra |
|---|---|---|
| 1 | `isFilled` es un eje de variante y en código no existe: se deriva de `value`. Ya se decidió el 20-ago no sacarlo para no romper instancias, pero **el eje sigue multiplicando la matriz** y sigue apareciendo en el panel como si fuera configurable. | Jetto (decidido y declarado; se revisa antes de publicar) |
| 2 | **El placeholder y el valor son el mismo nodo de texto.** Por eso el archivo no puede documentar un campo en error o deshabilitado estando vacío. | Jetto (pendiente desde el 20-ago) |
| 3 | **`leadingIcon` y `leadingText` son dos props independientes y nada impide pasar las dos.** El contrato dice que en código debería ser una unión, y nos lo asigna: *"se resuelve con el tipo, no con una regla escrita"*. Hoy son dos opcionales y el compilador no lo caza. | **nosotros** |
| 4 | El `counter` en Figma es un texto libre (`"0/50"`); en código son dos números y el formato lo pone el componente. La divergencia hay que firmarla *"o el exporter va a intentar mapear una cadena"*. | Design Lead + Tech Lead |
| 5 | `placeholder` y `onChangeText` **no existen en Figma**, y son las divergencias que comparten los nueve campos. Conviene una regla general en `DESIGN.md` en vez de repetirlas nueve veces. | Design Lead + Tech Lead |

---

## ListItem

Fuente: `ListItem · Dev`, nodo `1018:111237`.

| # | Qué | Quién lo cierra |
|---|---|---|
| 1 | **El hueco de `trailing` acepta cualquier componente.** Una fila con un Switch o un Checkbox adentro se ve bien y rompe la accesibilidad: la fila entera ya es un control. Para eso están SwitchItem y ChoiceItem. Acotarlo a Icon y Badge, o escribirlo como regla dura. | Jetto |
| 2 | **No hay forma de declarar una fila NO interactiva.** El eje `state` trae hover, pressed y focus siempre, así que una fila de solo lectura se documenta igual que una tocable. Es un eje `isInteractive`, o una regla escrita. | Jetto |
| 3 | **El indicador y el anillo del Avatar están apagados en la fila.** Una lista de contactos con estado en línea es un caso real y hoy no se puede armar. | Jetto |

---

## PhoneField

Fuente: `PhoneField · Dev`, nodo `1018:96583`.

| # | Qué | Quién lo cierra |
|---|---|---|
| 1 | La bandera y el prefijo son dos props sueltas en Figma y se pueden contradecir. En código son un solo dato, `country`. *"Hay que firmarlo o el exporter va a emitir dos props independientes."* | Design Lead + Tech Lead |
| 2 | **El catálogo de países no existe**: en Figma son cuatro instancias dibujadas a mano. | Jetto + producto |
| 3 | El menú abierto se documenta con `showMenu`, que es property y no estado. | Tech Lead (declarada) |

**Hallazgos nuestros, no declarados:**

1. **La firma de la doc se queda corta contra el component set.** La firma
   (`1018:96962`) tiene 10 props y no menciona `leadingContent`, pero el eje es
   real y es la mitad del set: 72 de 144 variantes son `none`. Conviene
   agregarlo. De paso, **la descripción usa el nombre viejo del eje** — dice
   `prefix=none` / `prefix=select` en todo el primer bloque.
2. **La firma del Menu dice `IconName`** para su slot leading. Conviene
   corregirla: el slot de Figma ya aceptaba Flag/Avatar/MerchantAvatar, y desde
   el 24-sep en código **todos** los slots de icono son `ReactNode`.
3. **El Menu no tiene alto máximo ni scroll interno.** Con 243 países el panel
   mide 10.718 px, medidos. Hoy lo acota quien lo llama; sería útil que lo
   resolviera el Menu, como ya hace el Select.
4. **No existe token de alto máximo de menú.** La única clave que menciona un
   dropdown es `z/dropdown` (1100), así que el Select y el PhoneField comparten
   un literal de **280 px** escrito a mano en los dos. Con un token
   —`size/menu/max-height`— dejaría de ser un número inventado dos veces.
5. **El patrón completo del buscador sería `combobox`** con
   `aria-activedescendant`, y eso necesita que el Menu acepte teclas desde
   afuera. Hoy el foco se entrega desde el PhoneField y `ArrowDown` pasa a la
   lista. Anotado, no hecho.

---

## ListGroup

Fuente: `ListGroup · Dev`, nodo `1020:112256`.

| # | Qué | Quién lo cierra |
|---|---|---|
| 1 | **El grupo no tiene encabezado en el archivo.** Una lista de secciones —"Hoy", "Ayer", "Esta semana"— es el caso más común de una app bancaria. Está en la firma, así que lo implementamos leyendo la capa semántica y ubicado arriba de la tarjeta: **las dos cosas son decisiones nuestras, no mediciones.** | Jetto |
| 2 | **No hay estado vacío.** Una lista sin elementos es un caso real y no está dibujado. | Jetto |
| 3 | Los divisores se apagan fila por fila en Figma y ya se perdieron una vez, en el pase de renombres del 20-ago. En código lo resuelve el grupo. | Tech Lead (declarada) |

**Hallazgos nuestros, no declarados:**

1. **El token de superficie que el contrato nombra no existe.** La sección `06`
   lista `component/listgroup/surface/bg` y en el export **no hay grupo
   `listgroup`** — sí están `checkboxgroup`, `radiogroup` y `switchgroup`. Lo
   que el componente bindea en Figma es `component/card/surface/bg`. Leemos ese.
2. **Son cuatro tokens, no seis.** Los otros cuatro que el contrato lista
   (`size/control/height/lg`, `space/inline/sm`, `space/inset/md`,
   `space/inset/xs`) son de las filas, no del grupo.
3. **Las dos fuentes no coinciden en qué filas acepta.** El contrato dice
   *"ListItem, y solo ListItem"*; la descripción del componente dice *"pueden
   ser ListItem, ChoiceItem o las dos mezcladas"*. El tipo permite la versión
   amplia.
4. **`children` y virtualización son incompatibles.** El contrato pide
   virtualizar las listas largas —*"trescientas filas montadas de una vez es el
   problema de rendimiento más común de una app bancaria"*— y la firma recibe
   `children`. Una lista larga **no es este componente**: pide un `FlatList` a
   nivel de pantalla, y ahí la regla del divisor vuelve a quien llama.

---

## PasswordField

Fuente: `PasswordField · Dev`, nodo `1018:93666`.

| # | Qué | Quién lo cierra |
|---|---|---|
| 1 | **No hay regla escrita de qué cuenta como `weak`, `acceptable`, `good` o `strong`.** El componente dibuja cuatro niveles y quien implemente va a inventar el criterio. *"Sin esto los cuatro niveles son decorativos."* | Jetto + producto |
| 2 | **`RequirementItem` tiene tres estados y la firma tiene dos.** El componente de Figma trae `pending · met · failed`, y la firma lo colapsa a un booleano, así que una regla *intentada y rota* se lee igual que una no intentada. Los tokens del tercero existen —`requirement/icon-failed`, `requirement/text-failed`— y nada en código puede alcanzarlos. | Design Lead + Tech Lead |

---

## Chip

Fuente: `Chip · Dev`, nodo `1018:110276`.

| # | Qué | Quién lo cierra |
|---|---|---|
| 1 | **La × no tiene parada de foco ni área de toque propia.** Es un icono dentro del chip, no un IconButton anidado, y así está dibujado. Es una carencia real del componente vivo, no algo para inventarle un arreglo acá. | Jetto |

---

## Divider

Fuente: `Divider · Dev`, nodo `1017:79919`.

| # | Qué | Quién lo cierra |
|---|---|---|
| 1 | El eje `appearance` tiene tres valores y **no hay escrito cuándo usar cada uno**. *"Sin esa regla los tres se eligen a ojo, y el resultado es que la misma pantalla mezcla dos."* | Jetto |
| 2 | No hay eje de grosor ni de estilo de línea. Si aparece la necesidad de una punteada o de una más gruesa, es CHG. | nadie por ahora (declarada) |

**Typo a corregir en la doc.** La sección `05` dice que el grosor sale de
`border/width/default` y la `06` dice `border/width/divider`. Valen lo mismo (1
en light y dark, 2 en los dos alto contraste), pero `divider` es el que el
componente bindea de verdad —verificado en las 6 variantes— y el que se
describe como *"grosor de divisor decorativo"*.

---

## Iconos

La tabla de cambios de la colección nueva se aplicó el 28-sep. Lo que queda
abierto son **5 filas cuyo componente no existe todavía**: cuando se
construyan, estos son los glifos que pide la tabla.

| Componente | Espacio | Glifo |
|---|---|---|
| SearchField | `searchIcon` | `search-md` |
| SearchField | `trailingIcon` | `image-01` · `microphone-01` · `camera-01` |
| AccordionItem | `leadingIcon` / `chevron` | `image-01` · `chevron-down` · `chevron-up` |
| MerchantAvatar | `icon` | `store` |
| EmptyState | `graphic` | `image-01` |

Y cuatro glifos que la tabla **no cubre** y hoy solo usan demos y stories, sin
contrato que los fije: `trash-01`, `flag-01`, `lock-01`, `credit-card-01`.

---

## Sistema de temas

No sale de una doc de componente; es nuestro.

| Qué | Quién lo cierra |
|---|---|
| **El export no trae combinaciones marca × modo.** Las dos colecciones son dueñas de `color.json`, así que `discover` en `hc-light` no existe en ninguna carpeta. Hoy el modo gana, la marca cae a `blu` y el canvas del Storybook lo avisa. Las otras dos parejas de ejes **sí** se componen en código. | diseñador (export de Supernova) |
| **Los 12 temas van eager y el bundle pasó de 2,6 a 8,5 MB.** Se usan 276 rutas de token de las 2.427 que trae cada tema. La salida no es carga perezosa: es **precalcular los tokens resueltos** con un Proxy sobre `readThemeToken`/`readThemeDimension` y emitir solo lo que se lee. Marlon aprobó dejarlo para después. | **nosotros** |

---

## Activos disponibles que ningún componente usa

De `BDS3 - Assets` (`EjuudbnL2TbkjnSCwBNztw`), por si aparece el componente que
los pida:

| Página | Set | Node | Qué |
|---|---|---|---|
| Cards - Pending | `Tarjetas_cards_consolidado` | `2060:448` | el arte de **16 tarjetas físicas** (Titanium, Débito Blue, Freedom, Kids, Supermaxi…) |
| Badges | `Wallets`, `App Stores`, `Pay` | `2008:249` | Apple/Google Pay y los badges de las tiendas |

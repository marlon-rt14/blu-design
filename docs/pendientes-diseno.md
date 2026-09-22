# Pendientes de diseño y producto

Registro de lo que el código no puede cerrar solo. Cada entrada dice **quién lo
cierra**, según lo que declara la propia documentación de desarrollo de Figma en
su sección `07 · Divergencias y decisiones abiertas`.

La regla que usa el archivo de diseño, y que este documento sigue: *"una
divergencia documentada no es deuda; una no documentada sí"*. Lo que está acá no
frena el trabajo — se implementa con la decisión declarada y se corrige cuando
la cierren.

Última actualización: 2026-09-16.

---

## El archivo `BDS3 - Assets` — **acceso concedido el 22-sep**

Jetto dio acceso a `marlon.ruiz@centrohub.co`. Era la vía preferida justamente
por esto: el arte se exporta sin coordinar con nadie, y cuando diseño corrija
una bandera se vuelve a exportar solo.

```
BDS3 - Assets    Figma EjuudbnL2TbkjnSCwBNztw
                 propietario Jetto Gonzalez
```

### Lo que había adentro

| Página | Set | Node | Qué |
|---|---|---|---|
| Flags | `.Flag` | `2053:2053` | **265 países**, eje `Country` con formato `"EC - Ecuador"` |
| Flags | `Flag icon` | `2055:2028` | `Shape` (Rectangle/Square/Circle) × `Size` (xs…xl) sobre `.Flag` |
| Card network | `.Brand rect` | `2094:149` | **6 marcas**: Diners Club, Discover, Visa, Mastercard, Amex, "Amex alternative" |
| Card network | `Card network icon` | `2008:690` | `Shape` × `Size` sobre `.Brand` |
| Cards - Pending | `Tarjetas_cards_consolidado` | `2060:448` | el arte de **16 tarjetas físicas** (Titanium, Débito Blue, Freedom, Kids, Supermaxi…) |
| Badges | `Wallets`, `App Stores`, `Pay` | `2008:249` | Apple/Google Pay y los badges de las tiendas |

Las dos últimas páginas no estaban en el radar y no las usa ningún componente
todavía. Quedan anotadas por si aparece una `Card` de producto o un botón de
wallet.

### Banderas: hechas

Las 243 del catálogo, cerradas el 22-sep. **Cero faltantes**: los 265 del set
cubren nuestros 243 y sobran 22 que son territorios sin prefijo telefónico
(`EU`, `GB-ENG`, `ES-CT`, `XK`, `AQ`…), así que no entran.

Medido antes de elegir el enfoque: las 265 son `<path>` y nada más, todas con
`viewBox="0 0 240 160"`, sin un solo raster ni `base64`. Los 530 `clipPath` que
traen son rects del frame completo —recortes de Figma, no de diseño— así que se
descartan, y con ellos el problema de ids duplicados al inlinear 243 SVG en un
documento.

Son **datos, no componentes**: un módulo generado
(`packages/shared/src/data/flags.generated.ts`, 1.159 paths) y un renderer por
plataforma. 243 componentes serían 486 archivos con el mismo `<svg>` alrededor
de distinta geometría.

**Costo medido en el bundle: +241,2 kB (+74,8 kB gzip)**, comparando el build
con el módulo vaciado contra el módulo entero. Es el 2,8 % del bundle; los temas
siguen siendo el grueso. Se suma al pendiente de carga perezosa, no lo crea.

Se regenera con dos scripts, que necesitan `FIGMA_API_KEY` en el entorno:

```
node scripts/fetch-figma-flags.mjs     # 2 requests REST + 265 descargas
node --experimental-strip-types scripts/generate-flags.mjs
```

El MCP de Figma no servía para esto: baja **un nodo por llamada**, o sea 265
llamadas. La API REST acepta todos los ids juntos.

### Logos de tarjeta: medidos, y nuestro CardField está mal

Los 6 SVG están bajados y el muestrario `__test-borde` (`2094:1078`, columna
LIGHT) da las seis marcas renderizadas a 48×32. Medido de ahí:

| Marca | Placa | Logo |
|---|---|---|
| Diners Club | **blanca** | `#046AA9` |
| Discover | `#232B3D` | **degradado lineal** |
| Visa | `#1434CB` | blanco |
| Mastercard | `#232B3D` | `#FF5F00` · `#EB001B` · `#F79E1B` |
| Amex | `#006FCF` | blanco + `#016FD0` |
| Amex alternative | `#006FCF` | `#006FCF` + blanco |

Todas 48×32 con `rx=2`, más un `rect` de 47×31 inset 0,5 que es el filete.

**El color de la placa es de la marca, no del token.** Nuestro `CardBrandLogo`
pinta la placa con un token neutro para las cuatro y encima un glifo de color.
Con Diners coincide de casualidad —su placa *es* blanca— y eso fue lo que nos
hizo generalizar mal: medimos el único caso donde la regla equivocada da el
resultado correcto.

Dos cosas más que caen con esto:

- **"El logo es la mitad del ancho de la placa" es un hecho de Diners**, no una
  regla. El de Diners ocupa 24 de 48; el wordmark de Visa ocupa mucho más.
- **Discover trae un degradado**, que es el primer asset del sistema que no se
  resuelve con `fill` plano. `react-native-svg` lo soporta con `Defs` +
  `LinearGradient`, pero obliga a ids únicos por instancia — justo el problema
  que en las banderas pudimos esquivar.

Lo correcto es que **la marca sea el arte completo de 3:2, fondo incluido**, y
que el `CardBrandLogo` ponga solo el filete y el recorte. La placa con token
queda únicamente para el caso sin marca detectada. Es cambio de CardField, no de
banderas, así que va en su propio commit.

### Y la discrepancia de Amex, ahora con arte

**El set tiene seis marcas y la descripción del CardField declara cuatro.**
American Express está en `BDS3 - Assets` —y "Amex alternative" también— y no en
la lista del componente. Hoy `TCardBrand` tiene las cuatro declaradas, así que
un número de Amex no muestra logo. Ya no se puede argumentar que el arte no
existe: es decisión de producto si Amex entra. Parte de la divergencia 4 del
CardField.

---

## CardField

Fuente: `CardField · Dev`, nodo `1018:94761`.

| # | Qué | Quién lo cierra | Estado |
|---|---|---|---|
| 1 | En Figma hay **tres pares** de `label`/`value`, uno por parte, y solo uno aplica por variante. En código es un par y `part` decide cuál. *"Es la divergencia más grande del componente y hay que firmarla, o el exporter va a emitir seis props."* | Design Lead + Tech Lead | **abierta** |
| 2 | ¿Un componente o tres? `part` cambia teclado, máscara, validación, autocompletado y ancho. | Jetto + Tech Lead | **decidida de nuestro lado** ↓ |
| 3 | 432 variantes — el segundo set más grande del archivo. Sacando `isFilled` del eje bajaría a la mitad; partiendo `part` en tres sets, a un tercio. | Jetto | **abierta** |
| 4 | **El catálogo de marcas de tarjeta no está declarado en ningún lado.** Qué marcas se reconocen y qué pasa con una desconocida es regla de producto. | Jetto + producto | **abierta** |

### Sobre la 2, lo que decidimos

Se implementa **un componente con `part` requerida**, tipada como **unión
discriminada** para que `brand` solo exista cuando `part='number'`:

```ts
type ICardFieldProps =
  | ({ part: 'number'; brand?: TCardBrand } & ICardFieldCommon)
  | ({ part: 'expiry' | 'cvv' }            & ICardFieldCommon);
```

Razones, en orden:

1. Es la firma de la sección `01`, que el propio frame define como *"lo que
   desarrollo copia"*. La divergencia 2 dice *"puede que"* sean tres: es una
   duda abierta, no una decisión contra la firma.
2. **Lo que cambia por parte es una tabla, no lógica** — teclado,
   autocompletado, `maxLength`, agrupación. El caparazón visual (los tokens, la
   etiqueta flotante, los tres tamaños, los estados) es común, y es la mayor
   parte del componente.
3. **Compound components con Context se descartó**: se gana el lugar cuando las
   partes coordinan en runtime, y acá la descripción dice lo contrario — *"en
   código son tres campos distintos… aquí viven juntos solo para que compartan
   estilo"*. No hay un `CardFieldGroup` en el diseño. Además no hay un solo
   `createContext` en la capa de componentes del repo, y el `RadioGroup`, que sí
   es un grupo, tampoco usa uno: las filas llegan como `children`.
4. Si Jetto decide partirlo, es mecánico: `part` siendo requerida vuelve la
   separación en tres envoltorios finos sobre el mismo hook, los mismos tokens y
   los mismos tipos.

### El arte de las marcas

Ubicado en `BDS3 - Assets`, **con acceso desde el 22-sep** y los 6 SVG ya
bajados — pero sin aplicar todavía, porque falta medir si la placa la dibuja el
componente o la trae el asset (ver la sección de arriba). Hoy sigue siendo que
solo **Diners** tiene su marca real (exportada de las variantes del propio
CardField en Core, donde el diseñador la dibujó inline) y las otras tres caen al
`icon/credit-card` genérico. Las cuatro se detectan y se anuncian igual, así que
no hay nada mal en silencio.

El arte vive aislado en `packages/{web,mobile}/src/components/atoms/CardField/marks/`
— un archivo por marca más el registro. Reemplazar un logo **toca esa carpeta y
nada más**; el `CardBrandLogo` no menciona ninguna marca. El `marks/index.tsx`
lleva la checklist de qué hace falta para agregar una.

**Un defecto que se va solo cuando llegue el arte**: el glifo genérico ignora el
ancho que le pasa la placa y se dibuja de 16×16 en los tres tamaños, porque
`Icon` dimensiona desde `size/icon/*` como cuadrado y 18 no está en esa rampa. En
`sm` (placa 24×16) ocupa el alto completo; en `lg` (48×32) queda chico para su
placa. No se arregla a mano: desaparece cuando cada marca traiga su propio SVG.

### Hallazgo nuestro, no declarado en la doc

La lista de la sección `06` dice **28 tokens** y **omite ~14 que el contrato sí
necesita**: `container/border-error`, `border-focus`, `border-hover`,
`overlay-hover`, `bg-readonly`, `border-readonly`, `value/text-filled`,
`value/text-readonly`, `helper/text-error`, y los dos del `brandicon`
(`bg-default`, `border-default`). Todos existen en el export. Se leen, porque el
contrato tiene `error`, `readOnly` y `brand`, y el foco es un estado.

Los pares `border-warning` / `border-success` / `helper/text-warning` /
`helper/text-success` **no** se leen: el eje `validation` de Figma los tiene, pero
el contrato de código solo tiene `error`. Leerlos inventaría un estado que la
firma no ofrece.

---

## PhoneField

Fuente: `PhoneField · Dev`, nodo `1018:96583`. **Implementado** en las dos
plataformas; lo único en espera es el arte de las banderas.

| # | Qué | Quién lo cierra | Estado |
|---|---|---|---|
| 1 | La bandera y el prefijo son dos props sueltas en Figma y se pueden contradecir. En código son un solo dato, `country`. *"Hay que firmarlo o el exporter va a emitir dos props independientes."* | Design Lead + Tech Lead | **abierta** |
| 2 | ~~`leadingContent` es un eje de variante y en código no debería ser prop.~~ **Mal leído de nuestro lado.** El eje es real y es la mitad del set —72 de 144 variantes son `none`— así que es prop: `leadingContent?: 'none' \| 'select'`. Quien llama al campo *es* el producto. | nosotros | **cerrada** |
| 3 | **El catálogo de países no existe**: en Figma son cuatro instancias dibujadas a mano. | Jetto + producto | **abierta** |
| 4 | El menú abierto se documenta con `showMenu`, que es property y no estado. | Tech Lead | declarada |

### Lo que sigue en espera

- ~~**El set de banderas.**~~ **Hecho el 22-sep**, con el acceso a
  `BDS3 - Assets` — las 243 del catálogo, sin faltantes. Ver la sección de
  arriba. De paso, el set confirmó lo que habíamos implementado por deducción:
  el alto sale de `size/icon/*`, el ancho en Rectangle es ×1,5 (los SVG son
  240×160 exactos), el círculo usa `radius/pill`, y el filete existe *"para que
  JP, FI y CH no se pierdan sobre fondo claro"*. No hubo que rehacer nada del
  `CountryFlag`: solo cambió lo que dibuja `flags/`, que era exactamente el
  propósito de esa carpeta.
- **El Menu ya está** (de Joel) y es el que usa la versión web. Lo que faltaba
  para poder usarlo era el slot: `leading` era un `TIconName`, o sea los 31
  glifos del sistema, y una bandera no es un glifo. Se ensanchó a
  `leadingContent?: ReactNode` con permiso de Marlon. La firma de la doc de
  desarrollo del Menu dice `IconName`; conviene corregirla, porque el slot de
  Figma ya aceptaba Flag/Avatar/MerchantAvatar y era la doc la que iba más
  angosta que el diseño y que el uso.

### Hallazgos nuestros, no declarados en la doc

0. **La firma de la doc de desarrollo se queda corta contra el component set.**
   La firma (`1018:96962`) tiene 10 props y no menciona `leadingContent`, pero el
   component set tiene el eje con 72 variantes de cada valor. Las 144 salen de
   `leadingContent(2) × size(3) × state(3) × isFilled(2) × isDisabled(2) ×
   validation(2)`. Conviene agregarlo a la firma; el código ya lo implementa.
   De paso, **la descripción usa el nombre viejo del eje**: dice `prefix=none` /
   `prefix=select` en todo el primer bloque, y el eje se llama `leadingContent`.
1. **El Menu no tiene alto máximo ni scroll interno.** Es contenido puro, lo
   cual es correcto, pero significa que con 243 países el panel mide **10.718
   px** medidos. Lo acota quien lo llama: el PhoneField web lo mete en un
   contenedor con `max-block-size` y `overflow-y: auto`. Sería útil que el Menu
   lo resolviera él, como ya hace el Select, que se acota solo.
2. **No existe token de alto máximo de menú.** En `dimension.json` la única
   clave que menciona un dropdown es `z/dropdown` (1100). Así que el Select y el
   PhoneField comparten un literal de **280 px** escrito a mano en los dos. Con
   un token —`size/menu/max-height`— dejaría de ser un número inventado dos
   veces.
3. **Dos superficies no pueden anidarse.** El Menu pinta su propio fondo, borde
   y radio. Si el panel del PhoneField pintara los suyos, se vería un filete
   doble por los costados. El panel quedó **sin superficie**: solo posiciona,
   recorta y proyecta la sombra, y la tira del buscador pinta la parte de
   arriba.
4. **El foco al abrir.** El Menu se enfoca a sí mismo al montarse, que es lo
   correcto para un menú sin disparador. Acá el foco tiene que ir al buscador,
   porque con 243 filas lo primero que se hace es escribir. Se resuelve desde el
   PhoneField —el efecto del padre corre después del hijo, así que gana— y
   `ArrowDown` le entrega el foco a la lista. El patrón completo sería
   `combobox` con `aria-activedescendant`, que necesitaría que el Menu acepte
   teclas desde afuera. Queda anotado, no hecho.

---

## Divider

Fuente: `Divider · Dev`, nodo `1017:79919`. Implementado y commiteado en `53aeb34`.

| # | Qué | Quién lo cierra | Estado |
|---|---|---|---|
| 1 | El eje `appearance` tiene tres valores y **no hay escrito cuándo usar cada uno**. *"Sin esa regla los tres se eligen a ojo, y el resultado es que la misma pantalla mezcla dos."* | Jetto | **abierta** |
| 2 | No hay eje de grosor ni de estilo de línea. Si aparece la necesidad de una punteada o de una más gruesa, es CHG. | nadie por ahora | declarada |

### Typo a corregir en la doc

La sección `05` dice que el grosor sale de `border/width/default` y la sección
`06` dice `border/width/divider`. Valen lo mismo (1 en light y dark, 2 en los dos
alto contraste), así que no hay diferencia visual, pero `divider` es el que el
componente bindea de verdad —verificado en las 6 variantes— y el que se describe
como *"grosor de divisor decorativo"*; `default` es *"grosor de borde de
control"*.

---

## Sistema de temas

No sale de una doc de componente; es nuestro.

| Qué | Quién lo cierra | Estado |
|---|---|---|
| **El export no trae combinaciones marca × modo.** Las dos colecciones son dueñas de `color.json`, así que `discover` en `hc-light` no existe en ninguna carpeta. Hoy el modo gana y la marca cae a `blu`, y el canvas del Storybook lo avisa. Las otras dos parejas de ejes **sí** se componen en código. | diseñador (export de Supernova) | **abierta** |

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

## El archivo `BDS3 - Assets` — acceso

**Prioridad alta: desbloquea dos componentes.**

Hay un cuarto origen de diseño que no estaba en el radar:

```
BDS3 - Assets    Figma EjuudbnL2TbkjnSCwBNztw
                 97 componentes · propietario Jetto Gonzalez · import cada hora
```

Ahí viven los dos sets de arte que faltaban:

- **`Card network icon`** — *"conjunto de logotipos compactos de medios de pago.
  Incluye versiones de Diners Club, Discover, Visa, Mastercard y American
  Express"*. Ejes `Shape` (Rectangle/Square/Circle) × `Size` (xs 12 · sm 16 ·
  md 24 · lg 32 · xl 40, ligado a `size/icon/*`).
- **`Flag icon`** — *"las 15 variantes apuntan al mismo set base 'Flag'
  (**265 entradas**)"*. Mismos ejes.

**En los dos, la marca o el país NO es un eje de variante: es una propiedad de
una instancia anidada** (`Country`, formato `"CO - Colombia"`). Por eso buscar
"Visa" o "Ecuador" en la librería no devuelve nada, y por eso yo había concluido
—mal— que el arte no existía.

**El bloqueo es de permisos.** `list_file_components_for_code_connect`,
`search_design_system` y `get_metadata` responden los tres *"looks like you
don't have edit access to this file"* para ese fileKey, aunque el asiento en la
organización sea Dev.

### El pedido, concreto

**Archivo:** https://www.figma.com/design/EjuudbnL2TbkjnSCwBNztw/BDS3---Assets

Alcanza con **una** de las dos cosas:

1. **Acceso al archivo** para `marlon.ruiz@centrohub.co` — con eso los exporto
   yo y no hay que coordinar nada más. Es la vía preferida: cuando el diseñador
   corrija una bandera o un logo, se vuelve a exportar sin pedir nada.
2. **Los SVG sueltos**, si el acceso no se puede dar:

| Para | Qué | Componente en Assets |
|---|---|---|
| **CardField** | los **5 logos de red** — Diners Club, Discover, Visa, Mastercard, American Express | `Card network icon`, `Shape=Rectangle` |
| **PhoneField** | el set base **`Flag`, 265 entradas** | `Flag icon`, `Shape=Circle` |

De los tamaños no hace falta nada: el alto sale de `size/icon/*` y el ancho se
deriva, así que con **un** SVG por marca y por país alcanza — el escalado lo
hace el código.

Ids en Supernova, por si sirve para ubicarlos:
`Card network icon` = `7ecf5c53-90c1-455d-be7e-f40c3cb1c7c3` ·
`Flag icon` = `965f4788-43bb-40bd-b31e-a9cb485631fe`.

### Y una discrepancia que aparece de paso

**El set de arte tiene cinco marcas y la descripción del CardField declara
cuatro** — American Express está en `BDS3 - Assets` y no en la lista del
componente. Hoy `TCardBrand` tiene las cuatro declaradas, así que un número de
Amex no muestra logo. Es parte de la divergencia 4: hay que decidir si Amex
entra.

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

Ubicado en `BDS3 - Assets`, sin acceso — ver la sección de arriba. Mientras
tanto solo **Diners** tiene su marca real (exportada de las variantes del propio
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

Fuente: `PhoneField · Dev`, nodo `1018:96583`. **En espera**, ver más abajo.

| # | Qué | Quién lo cierra | Estado |
|---|---|---|---|
| 1 | La bandera y el prefijo son dos props sueltas en Figma y se pueden contradecir. En código son un solo dato, `country`. *"Hay que firmarlo o el exporter va a emitir dos props independientes."* | Design Lead + Tech Lead | **abierta** |
| 2 | `leadingContent` es un eje de variante y en código no debería ser prop: si el producto opera en un solo país, el selector no va. | Jetto + producto | **abierta** |
| 3 | **El catálogo de países no existe**: en Figma son cuatro instancias dibujadas a mano. | Jetto + producto | **abierta** |
| 4 | El menú abierto se documenta con `showMenu`, que es property y no estado. | Tech Lead | declarada |

### Lo que lo tiene en espera

- **El set de banderas: ubicado, pero sin acceso.** Está en `BDS3 - Assets` como
  `Flag icon`, con un set base de **265 entradas** — ver la sección de arriba.
  `icon/flag` en Core es solo el placeholder, y su descripción ya lo decía: la
  bandera real *"lo reemplaza"*. Falta el acceso al archivo, o los SVG.
  De paso, la descripción de `Flag icon` confirma dos cosas que habíamos
  implementado por deducción: el alto sale de `size/icon/*`, el ancho en
  Rectangle es ×1,5, el círculo usa `radius/pill`, y el filete alrededor existe
  *"para que JP, FI y CH no se pierdan sobre fondo claro"*.
- **El Menu.** La lista de países es una instancia de Menu en el diseño. No
  bloquea el código —la sección `03` cierra con *"de las siete instancias
  anidadas, a código llegan dos datos: qué país está elegido y qué países se
  ofrecen"*— pero conviene esperar el componente de Joel para no construir un
  panel que después haya que tirar.

El trabajo hecho está en un stash: catálogo de 243 países, contrato de 10 props y
47 tokens verificados.

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

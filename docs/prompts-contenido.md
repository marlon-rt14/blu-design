# 1. Enviar dinero

Pantalla para transferir dólares a una cuenta de otro banco. El usuario ya está autenticado. No es un wizard: todo cabe en una sola pantalla y al confirmar pasa a una revisión, que no es parte de este contenido.

**Encabezado**

- Título: Enviar dinero
- Bajada: Llega en minutos a cuentas del mismo banco y en un día hábil al resto.

**Origen**

- Etiqueta: Desde
- Valor fijo, no editable: Cuenta en dólares ···4521
- Línea secundaria: Disponible US$ 4,280.50
- Si el disponible es cero, la línea pasa a: Sin saldo disponible, y la acción principal queda deshabilitada.

**Destino**

- Beneficiario. Campo de texto. Placeholder: Nombre de quien recibe. Vacío al entrar. Error si se envía vacío: Escribe el nombre del beneficiario. Error si tiene menos de dos palabras: Escribe nombre y apellido.
- Banco. Lista cerrada, una opción. Placeholder: Elige un banco. Opciones: Banco de la Nación, BCP, Interbank, BBVA, Scotiabank, Banbif, Pichincha, Otro. Error si no hay selección: Elige el banco de destino.
- Tipo de cuenta. Dos opciones en línea: Ahorros (seleccionada por defecto) y Corriente.
- Número de cuenta. Numérico. Placeholder: 000-00000000-0-00. Ayuda: Sin espacios. El formato se ajusta solo. Error vacío: Escribe el número de cuenta. Error con letras o menos de 10 dígitos: Revisa el número de cuenta.

**Monto**

- Etiqueta: Monto
- Prefijo visible dentro del campo: US$
- Placeholder: 0.00
- Ayuda bajo el campo: Mínimo US$ 1.00. Máximo por envío US$ 10,000.00.
- Comisión, texto fijo bajo la ayuda: Comisión US$ 0.00 entre cuentas propias. US$ 1.50 a otros bancos.
- Errores, uno a la vez, en este orden: Ingresa un monto mayor a cero. El mínimo es US$ 1.00. El máximo por envío es US$ 10,000.00. No tienes saldo suficiente.

**Concepto**

- Opcional. Placeholder: Ej. Alquiler de octubre.
- Ayuda: Lo ve quien recibe. Máximo 40 caracteres.
- Contador visible: 0/40. Al pasar de 40 no deja escribir más. No es un error.

**Acciones**

- Principal, primero: Continuar. Deshabilitada mientras falte beneficiario, banco, cuenta o monto válido.
- Secundaria: Cancelar. Vuelve a la cuenta sin guardar nada. No pide confirmación.

**Al enviar con todo válido**

- No hay mensaje de éxito en esta pantalla. Continuar lleva a la revisión con este resumen ya armado: US$ 250.00 a Luis Ramos, BCP, ahorros ···7781, concepto Alquiler de octubre, comisión US$ 1.50, total US$ 251.50. Ese resumen es de la pantalla siguiente. Aquí no se muestra.

---

# 2. Pagar tarjeta

Pantalla para pagar la tarjeta de crédito en dólares desde una cuenta del mismo usuario.

**Encabezado**

- Título: Pagar tarjeta
- Bajada: El pago se refleja al instante en tu disponible.

**Resumen de la tarjeta, solo lectura**

- Producto: Visa Signature ···9012
- Titular: María Quispe
- Pago del mes: US$ 1,240.30
- Pago mínimo: US$ 180.00
- Deuda total: US$ 3,860.15
- Vence: 18 oct 2026
- Si hoy es posterior al vencimiento, la línea de vencimiento cambia a: Venció el 18 oct 2026, y aparece un aviso: Estás fuera de fecha. Pagar hoy evita que sigan los intereses de mora.

**Cuánto pagar**

- Tres opciones, una sola activa. Por defecto, Pago del mes.
  - Pago mínimo. US$ 180.00. Ayuda: Cubre lo exigible. El resto genera intereses.
  - Pago del mes. US$ 1,240.30. Ayuda: Pagas lo facturado y no generas intereses de compra.
  - Otro monto. Abre un campo. Prefijo US$. Placeholder: 0.00. Ayuda: Puedes pagar hasta la deuda total, US$ 3,860.15.
- Errores del monto libre: Ingresa un monto mayor a cero. El máximo es tu deuda total, US$ 3,860.15.

**Desde dónde**

- Etiqueta: Cuenta de cargo
- Una opción por defecto: Cuenta en dólares ···4521. Disponible US$ 4,280.50.
- Segunda opción, deshabilitada si no hay saldo: Cuenta de ahorro ···1108. Disponible US$ 90.00. Texto de deshabilitada: Saldo insuficiente para este pago.
- Si el monto elegido supera el disponible de la cuenta activa: No tienes saldo suficiente en esta cuenta.

**Desglose, se actualiza con la opción**

- Vas a pagar: el monto elegido
- Deuda después del pago: deuda total menos ese monto. Con pago del mes: US$ 2,619.85. Con pago mínimo: US$ 3,680.15. Con otro monto, el cálculo en vivo. Nunca negativo.

**Acciones**

- Principal: Pagar US$ 1,240.30. El monto del botón cambia con la opción. Con otro monto y el campo vacío, el botón dice Pagar y está deshabilitado.
- Secundaria: Ahora no.

**Después de pagar**

- Esta pantalla no muestra el comprobante. El contenido del cierre, por si se arma aparte: Listo, pagaste US$ 1,240.30. Visa Signature ···9012. Desde Cuenta en dólares ···4521. N.° de operación 00491840. Hoy, 12:41.

---

# 3. Agregar beneficiario

Alta de una persona o empresa a la que el usuario va a transferir más de una vez. No se envía dinero en esta pantalla.

**Encabezado**

- Título: Agregar beneficiario
- Bajada: Lo guardamos para que la próxima transferencia solo pida el monto.

**Quién recibe**

- Nombre completo. Placeholder: Como figura en el banco. Error vacío: Escribe el nombre. Error de una sola palabra: Escribe nombre y apellido.
- Tipo de documento. Opciones: DNI (por defecto), Carné de extranjería, Pasaporte, RUC. Si elige RUC, la etiqueta del nombre cambia a Razón social y el placeholder a Nombre de la empresa. El error de una sola palabra deja de aplicar.
- Número de documento. Placeholder según el tipo: 00000000 para DNI, 000000000 para carnét, el número de pasaporte libre, 00000000000 para RUC. Errores: Escribe el número de documento. DNI debe tener 8 dígitos. RUC debe tener 11 dígitos.

**Cuenta**

- Banco. Misma lista que en Enviar dinero. Placeholder: Elige un banco. Error: Elige el banco.
- Tipo de cuenta. Ahorros (por defecto) o Corriente. Si el documento es RUC, Corriente queda seleccionada y Ahorros sigue disponible.
- Moneda de la cuenta. Dólares, seleccionada y fija. Texto de ayuda: Por ahora solo guardamos cuentas en dólares.
- Número de cuenta. Mismas reglas que en Enviar dinero.

**Cómo lo vas a ver**

- Alias. Opcional. Placeholder: Ej. Alquiler, Mamá, Proveedor. Ayuda: Así aparece en tu lista. Si lo dejas vacío usamos el nombre.
- Máximo 24 caracteres. Contador 0/24.

**Aviso**

- No verificamos la cuenta con el banco en este paso. La primera transferencia confirma que los datos son correctos.

**Acciones**

- Principal: Guardar beneficiario. Deshabilitada hasta que nombre, documento, banco y cuenta sean válidos. El alias no bloquea.
- Secundaria, destructiva de descarte, no de borrado: Descartar. Si no escribió nada, sale directo. Si hay algún campo con texto, pide confirmación en la misma pantalla, no en un modal: ¿Descartar los datos que escribiste? Conservar / Sí, descartar.

**Lista resultante, no se muestra aquí, es el estado al que se llega**

- Una fila: Luis Ramos. Alias Alquiler. BCP · ahorros ···7781 · dólares.

---

# 4. Tus datos

Edición del perfil. Parte de los datos los dio el banco y no se editan. El celular y el correo exigen un código, pero el código es otra pantalla: aquí solo se deja escrito el valor nuevo.

**Encabezado**

- Título: Tus datos
- Bajada: El nombre y el documento salen de tu identificación. Para cambiarlos, escríbenos.

**Identificación, solo lectura**

- Nombre: María Quispe Rojas
- Documento: DNI 45678912
- Cliente desde: marzo 2021
- Ayuda de bloque: Estos datos no se editan desde la app.

**Contacto**

- Celular. Valor actual: +1 415 555 0148. Editable. Placeholder del reemplazo: +1 000 000 0000. Ayuda: Te enviamos un código para confirmar el número nuevo. El anterior sigue activo hasta que confirmes. Error de formato: Escribe un celular con código de país. Error si es igual al actual: Es el mismo número que ya tienes.
- Correo. Valor actual: maria.quispe@correo.com. Editable. Ayuda: También te pedimos un código. Ahí te llegan los comprobantes. Error: Revisa el formato del correo. Error si es igual al actual: Es el mismo correo que ya tienes.

**Dónde vives**

- Dirección. Valor: 1842 Market Street, Apt 4. Error vacío: Escribe la dirección.
- Ciudad. Valor: San Francisco.
- Estado. Lista. Valor: California. Opciones: los estados de Estados Unidos, California seleccionado.
- Código postal. Valor: 94102. Error: El código postal tiene 5 dígitos.
- Referencia. Opcional. Valor vacío. Placeholder: Edificio, piso, indicación para el courier. Máximo 80 caracteres.

**Acciones**

- Principal: Guardar cambios. Deshabilitada si nada cambió respecto a los valores iniciales. Al habilitarse, el botón no cambia de texto.
- Secundaria: Cancelar. Restaura los valores iniciales sin salir, si hubo edición. Si no hubo edición, sale al inicio.

**Errores de envío, reemplazan la ayuda del campo que falló**

- No pudimos enviar el código al celular. Inténtalo en unos minutos.
- Ya existe una cuenta con ese correo.

---

# 5. Cambiar clave

Cambio de la clave de acceso a la app. No es la clave de la tarjeta ni el PIN del cajero.

**Encabezado**

- Título: Cambiar clave
- Bajada: La vas a usar la próxima vez que entres. Las sesiones abiertas en otros teléfonos se cierran.

**Campos, en este orden, todos ocultos con opción de mostrar**

- Clave actual. Placeholder: La que usas hoy. Error vacío: Escribe tu clave actual. Error de servidor: La clave actual no coincide.
- Clave nueva. Placeholder: Mínimo 8 caracteres. Ayuda fija, tres líneas que se marcan conforme cumple:
  - 8 caracteres o más
  - Una mayúscula
  - Un número
  Las que faltan no son un error rojo hasta que intenta guardar. Ahí el mensaje es: La clave nueva no cumple los requisitos.
- Repetir clave nueva. Placeholder: Escríbela otra vez. Error: Las claves nuevas no coinciden. Este error aparece al salir del campo, no en cada tecla.

**Reglas que la ayuda no lista pero el error sí**

- No puede ser igual a la clave actual: Elige una clave distinta a la actual.
- No puede ser el documento ni la fecha de nacimiento: Elige una clave que no uses en otros datos tuyos.

**Aviso**

- Nunca te pedimos la clave por llamada ni por correo. Si alguien lo hace, no la des y escríbenos.

**Acciones**

- Principal: Actualizar clave. Deshabilitada hasta que los tres campos tengan texto y la nueva cumpla las tres reglas y coincida con la repetición.
- No hay acción secundaria. Para irse está el cierre de la pantalla, y si hay texto pregunta: ¿Salir sin cambiar la clave? Seguir editando / Salir.

**Cierre, pantalla siguiente**

- Título: Clave actualizada
- Cuerpo: Entra de nuevo con la clave nueva. Tus otros dispositivos van a pedir la clave.
- Acción: Entrar

---

# 6. Pedir un préstamo

Un solo paso. El usuario pide un préstamo personal en dólares. La cuota que ve es estimada. No hay documentos que adjuntar aquí.

**Encabezado**

- Título: Pedir un préstamo
- Bajada: Respuesta en minutos si tus datos están al día. El dinero entra a la cuenta que elijas.

**Cuánto y a qué plazo**

- Monto. Prefijo US$. Vacío. Placeholder: 0.00. Ayuda: Entre US$ 500.00 y US$ 20,000.00. Errores: Ingresa un monto. El mínimo es US$ 500.00. El máximo es US$ 20,000.00.
- Plazo. Una opción. Por defecto 12 meses. Opciones y cuota de ejemplo para US$ 5,000.00, que es el monto que se usa en la maqueta si el campo sigue vacío:
  - 6 meses. Cuota US$ 868.40
  - 12 meses. Cuota US$ 445.10
  - 24 meses. Cuota US$ 236.80
  - 36 meses. Cuota US$ 168.25
- La cuota mostrada se recalcula con el monto escrito. Texto de la línea: Cuota aproximada US$ 445.10 al mes.
- Tasa, texto pequeño bajo la cuota: Tasa estimada 18.50% anual. La definitiva sale en la evaluación.
- Aviso: La cuota final se confirma al evaluar tu solicitud. Esto no es una aprobación.

**Destino del dinero**

- Cuenta de desembolso. Una sola, seleccionada: Cuenta en dólares ···4521. Ayuda: Ahí abonamos si aprobamos el préstamo. No se puede elegir otra en esta pantalla.

**Motivo**

- Etiqueta: En qué lo vas a usar
- Opciones, una: Libre (por defecto), Vivienda, Estudios, Salud, Consolidar deudas, Negocio.
- No es obligatorio para habilitar el envío. Si no toca nada, viaja Libre.

**Resumen antes del botón**

- Pides: el monto, o US$ 5,000.00 si todavía no escribió
- Plazo: 12 meses
- Cuota aproximada: US$ 445.10
- Primera cuota: 8 nov 2026
- Cuenta: ···4521

**Acciones**

- Principal: Enviar solicitud. Deshabilitada solo si el monto está fuera de rango o vacío.
- Secundaria: Ahora no.

**Qué no prometer en la copy**

- No digas que está aprobado, preaprobado ni garantizado. No muestres un calendario de todas las cuotas. No pidas empleador, ingreso ni referencias: el banco ya los tiene.

---

# 7. Presentar un reclamo

El usuario describe un hecho sobre un producto. No adjunta archivos. La respuesta llega al correo del perfil.

**Encabezado**

- Título: Presentar un reclamo
- Bajada: Te respondemos en 15 días hábiles a maria.quispe@correo.com. Si ese correo no es el tuyo, cámbialo en Tus datos antes de enviar.

**Sobre qué**

- Producto. Una opción, sin default. Placeholder: Elige el producto. Opciones: Cuenta en dólares ···4521, Visa Signature ···9012, Préstamo personal ···3304. Error: Elige el producto del reclamo.
- Fecha del hecho. Vacía. Placeholder: dd/mm/aaaa. No acepta una fecha futura. Error vacío: Indica cuándo pasó. Error de fecha futura: La fecha no puede ser posterior a hoy. Error de más de 6 años atrás: Esa fecha está fuera del plazo para reclamar.
- Monto involucrado. Opcional. Prefijo US$. Placeholder: 0.00. Ayuda: Si no hubo un monto, déjalo vacío. Error si escribe cero: Déjalo vacío o escribe un monto mayor a cero. No hay máximo.

**Qué pasó**

- Etiqueta: Cuéntanos qué pasó
- Texto largo. Vacío. Placeholder: Qué esperabas y qué ocurrió. Sin saludos ni datos de tu clave.
- Ayuda: Máximo 600 caracteres. Contador 0/600.
- Error vacío: Cuéntanos qué pasó. Error bajo 20 caracteres: Danos un poco más de detalle.

**Qué esperas**

- Etiqueta: Cómo quieres que lo resolvamos
- Una opción, sin default. Opciones: Que revisen el cargo, Que devuelvan el dinero, Que corrijan un dato, Una explicación, Otra cosa. Error: Elige qué resultado esperas.
- Si elige Otra cosa, aparece un campo corto. Placeholder: Qué resultado esperas. Máximo 80 caracteres. Error vacío: Escribe el resultado que esperas.

**Aviso, debajo de los campos y antes de los botones**

- Este reclamo no frena un pago ni una cuota. Si quieres evitar un cargo futuro, hazlo desde el producto.

**Acciones**

- Principal: Enviar reclamo.
- Secundaria: Cancelar. Si hay texto, pregunta: ¿Descartar el reclamo? Seguir / Descartar.

**Acuse, reemplaza el formulario en la misma pantalla**

- Título: Recibimos tu reclamo
- Número: R-2026-10442
- Cuerpo: Te escribimos a maria.quispe@correo.com antes del 29 oct 2026. Guarda el número si nos llamas.
- Acción: Ir al inicio
- Secundaria: Presentar otro

---

# 8. Cuenta sin movimientos

Estado vacío del mes en curso. La cuenta existe y tiene saldo. No es un error de carga ni una cuenta nueva.

**Encabezado de la cuenta**

- Nombre: Cuenta en dólares
- Número: ···4521
- Saldo: US$ 4,280.50
- Disponible: US$ 4,280.50
- Mes que se está mirando: Octubre 2026. El selector de mes existe y octubre está elegido. Septiembre, si se elige, no es este estado: tiene movimientos. Este contenido es solo octubre vacío.

**Cuerpo vacío, al centro del área de lista**

- Título: Todavía no hay movimientos en octubre
- Cuerpo: Cuando recibas o envíes dinero, van a aparecer aquí. Tu saldo no cambió este mes.
- No hay ilustración con texto encima. No hay filtro, búsqueda ni lista de cero filas.

**Acciones, en este orden**

- Principal: Enviar dinero
- Secundaria: Traer dinero. Lleva a fondear la cuenta. No abre un formulario en esta pantalla.

**Lo que no debe decir**

- No digas que la cuenta está inactiva, bloqueada o vacía de saldo. El saldo está a la vista. No ofrezcas reintentar ni actualizar: no falló la carga.

**Contraste, por si el mes sí trae datos y alguien arma la otra variante**

- Tres movimientos de ejemplo, no forman parte del vacío: 2 oct, Recibiste de Nómina, +US$ 2,400.00. 6 oct, Enviaste a Luis Ramos, −US$ 250.00. 11 oct, Pago de Visa ···9012, −US$ 180.00. Saldo resultante coherente con US$ 4,280.50 solo si el saldo inicial del mes era US$ 2,310.50. No muestres esa cifra en el estado vacío.

---

# 9. Eliminar beneficiario

Confirmación antes de borrar a una persona guardada. No hay campos. No se puede deshacer.

**Contexto que ya viene elegido**

- Nombre: Luis Ramos
- Alias: Alquiler
- Banco y cuenta: BCP · ahorros ···7781 · dólares
- Última transferencia: US$ 250.00 el 6 oct 2026

**Bloque de confirmación**

- Título: Esta acción es permanente
- Cuerpo: Si eliminas a Luis Ramos vas a tener que volver a escribir sus datos para transferirle. Las transferencias que ya le hiciste siguen en tus movimientos.
- No menciones papelera, archivo ni recuperación a los 30 días. No se puede.

**Acciones**

- Segura, primero: Conservar. Cierra la confirmación y lo deja en la lista.
- Destructiva, segunda: Eliminar beneficiario. No digas solo Eliminar.

**Después de eliminar**

- Vuelve a la lista de beneficiarios.
- La fila de Luis Ramos ya no está.
- Aviso breve, arriba de la lista, se va solo: Eliminaste a Luis Ramos.
- Si era el único, la lista queda en este vacío: Título: No tienes beneficiarios. Cuerpo: Agrégalos una vez y después solo escribes el monto. Acción: Agregar beneficiario.

---

# 10. Transferencia enviada

Cierre de una transferencia que ya salió. No hay formulario. No se puede editar el monto ni el destino desde aquí.

**Encabezado**

- Título: Listo, enviaste US$ 250.00
- Bajada: Luis Ramos ya puede ver el dinero si su banco es BCP. A otros bancos llega el siguiente día hábil.

**Detalle, solo lectura, en este orden**

- Para: Luis Ramos
- Alias: Alquiler
- Banco: BCP
- Cuenta: Ahorros ···7781
- Moneda: Dólares
- Monto: US$ 250.00
- Comisión: US$ 1.50
- Total cargado: US$ 251.50
- Desde: Cuenta en dólares ···4521
- Concepto: Alquiler de octubre
- N.° de operación: 00491827
- Fecha: 8 oct 2026, 12:17

**Saldo**

- Una línea, no un campo: Tu disponible quedó en US$ 4,028.00. Sale de 4,280.50 menos 251.50.

**Aviso**

- Si no reconoces esta operación, escríbenos hoy y presenta un reclamo. El número de operación es 00491827.

**Acciones**

- Principal: Ir al inicio
- Secundaria: Enviar otro. Abre Enviar dinero vacío, no repite estos datos.
- Tercera, de texto: Compartir constancia. No es la acción principal. El texto que se comparte, tal cual: Enviaste US$ 250.00 a Luis Ramos. BCP ahorros ···7781. Operación 00491827. 8 oct 2026, 12:17.

**Lo que no debe aparecer**

- No hay botón para anular. No hay estado pendiente ni en proceso: esta pantalla es solo el caso ya enviado. No pidas calificar la app.

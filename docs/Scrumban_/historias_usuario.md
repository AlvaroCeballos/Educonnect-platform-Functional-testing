# Product Backlog: historias de usuario y trabajo asociado

> El Product Backlog es una lista ordenada y evolutiva de todo el trabajo necesario para desarrollar y mejorar un producto. Puede incluir historias de usuario, tareas técnicas, pruebas, documentación, despliegue y otros elementos necesarios para entregar valor.
>
> En este documento se presentan las historias de usuario de la plataforma **EduConnect**. Las tareas derivadas de cada historia se gestionan en el tablero Kanban, mientras que la estimación, las dependencias y los criterios de aceptación se consultan en este Product Backlog.
>
> El proyecto se organizó en dos fases:
> - **Fase 1 (Sprint 1):** Establece el núcleo operativo del sistema (registro, autenticación en dos pasos, aprobación administrativa, configuración de horarios y reservación básica anti-traslapes).
> - **Fase 2 (Sprint 2):** Amplía la solución con búsqueda avanzada, sesiones activas, atención y resúmenes de citas, historial, actualización de perfiles, gestión de bajas lógicas y reportes analíticos de demanda.

Este documento contiene las historias de usuario para el desarrollo de la plataforma EduConnect, organizadas por fases.  
Cada historia describe una funcionalidad desde la perspectiva del usuario final y está priorizada según su importancia dentro del proyecto, dicha priorización se realizó al inicio de cada fase. Las prioridades están indicadas con cuadros de colores:  

🟥 **Alta:** Funcionalidades críticas que deben implementarse primero, ya que en base a estas se desarrollarán otras más adelante.  
🟨 **Media:** Funcionalidades importantes, pero que pueden desarrollarse después de las críticas.  
🟦 **Baja:** Funcionalidades complementarias que agregan valor analítico o secundario al sistema.  

---

## Estimación del tamaño (T-Shirt Size)

> La estimación representa el tamaño relativo de una historia de usuario, no una cantidad exacta de horas. Las tallas permiten comparar la complejidad y comunicar el nivel de esfuerzo esperado.

Para estimar el tamaño de las historias de usuario, se utilizó el método T-Shirt Size.  

- Durante las sesiones de planificación, los 6 integrantes del equipo evaluaron conjuntamente cada una de las 27 historias de usuario del backlog.
- Cada miembro del equipo emitió su voto individual según su perspectiva técnica de complejidad (frontend, backend, base de datos y pruebas), y posteriormente se debatió en conjunto hasta alcanzar un **Veredicto Final** consensuado.

> **XS:** Historia de muy baja complejidad y rápida implementación (formularios básicos o ajustes directos).  
> **S:** Historia sencilla, con pocos criterios de aceptación y cambios focalizados.  
> **M:** Historia de complejidad media, que requiere lógica de negocio e integración entre frontend y backend.  
> **L:** Historia compleja, que involucra múltiples validaciones, algoritmos de verificación de traslape, persistencia crítica o seguridad.  
> **XL:** Historia muy compleja, con alta incertidumbre técnica o alcance extenso que abarca múltiples subsistemas.  

---

### Evidencias de la Matriz de Estimación Colaborativa (Consenso del Equipo)

Como evidencia del proceso de estimación grupal, se utilizó una matriz de votación en una hoja de cálculo compartida en la que participaron **Alvaro**, **Nicole**, **Yury**, **Xavi**, **Isai** y **Katheryn**, determinando de común acuerdo la talla definitiva de cada historia:

#### Paquetes A, B y C — Identidad, Tutor y Administración
![Matriz de Estimación Paquetes A, B y C](imgs_kanban/estimacion_paquetes_a_b_c.png)

#### Paquetes D, E y F — Descubrimiento, Sesiones y Notificaciones
![Matriz de Estimación Paquetes D, E y F](imgs_kanban/estimacion_paquetes_d_e_f.png)

---

# 1. Fase 1 — Núcleo Operativo (Sprint 1)

## 🟥 [HU-001] Registro de estudiante

**Responsable:** Katheryn / Wade (Paquete A)

**Como** estudiante nuevo  
**Quiero** registrarme en la plataforma EduConnect con mis datos personales y académicos  
**Para** solicitar acceso al sistema y poder programar sesiones de tutoría

### Criterios de Aceptación

- El formulario debe solicitar obligatoriamente: nombre, apellido, carnet universitario, correo electrónico institucional y contraseña.
- La fotografía de perfil debe ser un campo opcional para el estudiante.
- La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra minúscula, una letra mayúscula y un número.
- El sistema debe verificar que no exista previamente un usuario registrado con el mismo correo electrónico o carnet.
- Las contraseñas deben persistirse encriptadas de forma unidireccional utilizando un algoritmo seguro (bcrypt).
- Al completar el registro, la cuenta del estudiante debe crearse en estado pendiente (`PENDING`), impidiendo el inicio de sesión hasta que un administrador apruebe la solicitud.
- El sistema debe mostrar un mensaje claro informando que la cuenta está en espera de revisión administrativa.

### Tamaño: XS

### Dependencias

- Base de datos inicial y esquema de tablas de usuarios

---

## 🟥 [HU-002] Registro de tutor

**Responsable:** Isai (Paquete B)

**Como** docente o tutor aspirante  
**Quiero** registrarme en EduConnect proporcionando mis datos personales, credenciales y fotografía  
**Para** solicitar la habilitación de mi perfil docente y ofrecer tutorías académicas

### Criterios de Aceptación

- El formulario debe solicitar: nombre, apellido, carnet, DPI/identificación, fecha de nacimiento, género, especialidad académica, universidad de origen, modalidad/dirección, año de inicio de experiencia, correo electrónico y contraseña.
- La carga de una fotografía de perfil es de carácter obligatorio para el tutor.
- El sistema debe validar que la fotografía cargada sea en formato de imagen admitido (JPG, PNG) y almacenarse en almacenamiento estático persistente.
- La contraseña debe cumplir con las políticas de complejidad (mínimo 8 caracteres, mayúscula, minúscula y número) y almacenarse con hash seguro.
- La cuenta debe crearse en estado pendiente (`PENDING`), impidiendo el acceso a la plataforma hasta su aprobación.

### Tamaño: XS

### Dependencias

- Base de datos inicial y sistema de almacenamiento de archivos

---

## 🟥 [HU-003] Autenticación de administrador en dos pasos

**Responsable:** Katheryn / Wade (Paquete A)

**Como** administrador del sistema  
**Quiero** autenticarme mediante un mecanismo de inicio de sesión en dos factores (2FA)  
**Para** garantizar el acceso altamente seguro al panel de control y proteger la información institucional

### Criterios de Aceptación

- **Fase 1:** El administrador debe ingresar su correo electrónico y contraseña maestra en un formulario inicial.
- Si las credenciales primarias son correctas, el sistema no emite el token JWT definitivo, sino una respuesta que solicita el segundo factor de autenticación.
- **Fase 2:** El sistema debe exigir la carga física del archivo criptográfico `auth2-ayd1.txt`.
- El backend debe validar el contenido del archivo contra el hash esperado y verificar que el nombre de archivo sea exactamente `auth2-ayd1.txt`.
- Las contraseñas de ambos pasos deben validarse rigurosamente; solo tras la aprobación de ambos factores se emite el token JWT con rol `admin`.
- Si el archivo es inválido, modificado o ausente, el acceso debe denegarse con código HTTP 401.

### Tamaño: M

### Dependencias

- [HU-001] Base de autenticación JWT y configuración de variables de entorno

---

## 🟥 [HU-004] Aprobar o rechazar registro de estudiante

**Responsable:** Alvaro (Paquete C)

**Como** administrador autenticado  
**Quiero** revisar las solicitudes de ingreso de los estudiantes pendientes  
**Para** autorizar el acceso a la plataforma o rechazar solicitudes no válidas

### Criterios de Aceptación

- El panel administrativo debe mostrar un listado claro de todos los estudiantes en estado pendiente (`PENDING`), desplegando carnet, nombre completo, correo y fecha de solicitud.
- El administrador debe disponer de botones diferenciados para "Aprobar" y "Rechazar" cada solicitud.
- Al aprobar, el estado del usuario cambia a `APPROVED`, habilitando inmediatamente su capacidad de iniciar sesión.
- Al rechazar, el estado cambia a `REJECTED`, bloqueando el acceso a la plataforma.
- El sistema debe enviar automáticamente una notificación por correo electrónico al estudiante informándole la resolución de su solicitud.

### Tamaño: S

### Dependencias

- [HU-001] Registro de estudiante
- [HU-003] Autenticación de administrador en dos pasos

---

## 🟥 [HU-005] Aprobar o rechazar registro de tutor

**Responsable:** Alvaro (Paquete C)

**Como** administrador autenticado  
**Quiero** examinar el expediente completo y la fotografía de los tutores postulantes  
**Para** verificar sus credenciales académicas y decidir su aprobación o rechazo en la plataforma

### Criterios de Aceptación

- El panel administrativo debe mostrar el listado de tutores pendientes con acceso a su dossier completo: fotografía, especialidad, universidad, experiencia, DPI y datos de contacto.
- La aprobación cambia el estado del tutor a `APPROVED`, permitiéndole iniciar sesión y configurar horarios de atención.
- El rechazo cambia el estado a `REJECTED`, impidiendo el inicio de sesión.
- Debe dispararse un correo electrónico institucional automático notificando al tutor la decisión del administrador.
- Las decisiones administrativas deben reflejarse de inmediato en el sistema sin requerir recargas manuales.

### Tamaño: M

### Dependencias

- [HU-002] Registro de tutor
- [HU-003] Autenticación de administrador en dos pasos

---

## 🟥 [HU-006] Inicio de sesión de estudiante

**Responsable:** Katheryn / Wade (Paquete A)

**Como** estudiante registrado  
**Quiero** iniciar sesión con mi correo y contraseña  
**Para** ingresar al portal y acceder a la programación de mis tutorías

### Criterios de Aceptación

- El formulario debe requerir correo electrónico y contraseña.
- Si las credenciales son incorrectas, debe mostrarse el mensaje: "Credenciales inválidas".
- Si el usuario existe pero su estado es `PENDING`, el sistema debe denegar el acceso con HTTP 403 y mostrar el mensaje: "Tu cuenta está pendiente de aprobación por el administrador".
- Si la cuenta está en estado `REJECTED` o `DISABLED`, el acceso debe ser bloqueado con un mensaje explícito.
- Al ingresar exitosamente, se debe retornar un token JWT válido con rol `student` y redirigir al estudiante a su panel principal.

### Tamaño: S

### Dependencias

- [HU-001] Registro de estudiante
- [HU-004] Aprobar o rechazar registro de estudiante

---

## 🟥 [HU-007] Inicio de sesión de tutor

**Responsable:** Isai (Paquete B)

**Como** tutor aprobado  
**Quiero** autenticarme en EduConnect con mis credenciales  
**Para** acceder al panel docente y gestionar mi agenda de atención

### Criterios de Aceptación

- El sistema debe verificar correo y contraseña contra la base de datos de tutores.
- Debe comprobar estrictamente que el tutor tenga estado `APPROVED`.
- Si el tutor está en estado `PENDING`, `REJECTED` o `DISABLED`, se debe rechazar la autenticación informando el motivo del estado.
- Tras la validación exitosa, se genera una sesión autenticada con JWT conteniendo el rol `tutor` y su identificador de perfil.

### Tamaño: S

### Dependencias

- [HU-002] Registro de tutor
- [HU-005] Aprobar o rechazar registro de tutor

---

## 🟥 [HU-008] Establecer horario de atención

**Responsable:** Isai (Paquete B)

**Como** tutor autenticado  
**Quiero** definir mis días disponibles de la semana y un rango de horario diario  
**Para** habilitar espacios de tiempo en los que los estudiantes puedan reservarme citas

### Criterios de Aceptación

- El tutor debe poder seleccionar uno o varios días de la semana (Lunes a Domingo).
- Debe establecer una hora de inicio y una hora de finalización (formato HH:mm).
- El sistema debe validar que la hora de inicio sea estrictamente anterior a la hora de finalización.
- La disponibilidad debe guardarse en la tabla de horarios asociada al perfil del tutor autenticado.
- El tutor no puede definir intervalos invertidos ni vacíos.

### Tamaño: M

### Dependencias

- [HU-007] Inicio de sesión de tutor

---

## 🟥 [HU-009] Visualizar tutores disponibles

**Responsable:** Yury (Paquete D)

**Como** estudiante autenticado  
**Quiero** consultar la lista de tutores aprobados y activos en la plataforma  
**Para** conocer a los profesionales disponibles y seleccionar al más apto para mi consulta

### Criterios de Aceptación

- La interfaz debe presentar una cuadrícula o lista de tutores aprobados (`APPROVED`), mostrando nombre completo, fotografía, especialidad académica, universidad y modalidad de tutoría.
- No deben aparecer tutores en estado pendiente (`PENDING`) ni deshabilitados (`DISABLED`).
- Si el estudiante ya tiene una sesión activa programada con un tutor específico, dicho tutor debe ser excluido del catálogo de reserva activa para prevenir duplicidad.
- Cada tarjeta de tutor debe incluir un botón directo para consultar sus horarios y disponibilidad.

### Tamaño: S

### Dependencias

- [HU-005] Aprobar o rechazar registro de tutor
- [HU-006] Inicio de sesión de estudiante

---

## 🟥 [HU-011] Consultar horarios y disponibilidad del tutor

**Responsable:** Yury (Paquete D)

**Como** estudiante  
**Quiero** seleccionar un tutor y visualizar sus días y horas de atención  
**Para** elegir una fecha y hora disponible antes de solicitar la tutoría

### Criterios de Aceptación

- Al elegir un tutor, el estudiante debe visualizar los días de la semana en los que dicho tutor ofrece atención.
- El sistema debe permitir elegir una fecha específica en el calendario y validar que corresponda a un día habilitado por el tutor.
- Deben desplegarse los bloques de horarios disponibles calculados para esa fecha, distinguiendo claramente los espacios libres de los ocupados.
- Si una fecha u hora ya cuenta con una cita programada, dicho bloque debe mostrarse como no disponible.

### Tamaño: M

### Dependencias

- [HU-008] Establecer horario de atención
- [HU-009] Visualizar tutores disponibles

---

## 🟥 [HU-012] Programar sesión de tutoría

**Responsable:** Nicole (Paquete E)

**Como** estudiante autenticado  
**Quiero** reservar una cita de tutoría indicando fecha, hora, materia y motivo  
**Para** asegurar un espacio de asesoría académica personalizada con el tutor seleccionado

### Criterios de Aceptación

- El formulario debe solicitar: tutor seleccionado, fecha, hora de inicio, materia y descripción del motivo de la consulta.
- El sistema debe validar que la fecha y hora solicitadas estén dentro del rango de horario configurado por el tutor.
- **Regla anti-traslapes:** El sistema debe verificar en la base de datos que el tutor no tenga ya una sesión reservada (`PENDING` o `ATTENDED`) que se cruce en el intervalo de tiempo seleccionado.
- **Regla de unicidad de sesión:** Un estudiante no puede tener más de una sesión activa simultánea con el mismo tutor.
- Al confirmar la reserva, la sesión se registra con estado `PENDING` y duración estándar de 60 minutos.

### Tamaño: M

### Dependencias

- [HU-011] Consultar horarios y disponibilidad del tutor

---

## 🟥 [HU-016] Cancelar sesión por el estudiante

**Responsable:** Nicole (Paquete E)

**Como** estudiante  
**Quiero** cancelar una sesión de tutoría que tenga programada  
**Para** liberar el horario del tutor en caso de que no pueda asistir a la cita

### Criterios de Aceptación

- El estudiante debe visualizar sus citas programadas y contar con un botón de "Cancelar Cita".
- El sistema debe solicitar confirmación explícita antes de ejecutar la acción.
- Al confirmar, el estado de la sesión cambia inmediatamente a `CANCELLED_BY_STUDENT`.
- El horario ocupado por la sesión debe quedar automáticamente liberado en el calendario del tutor para que otros estudiantes puedan reservarlo.
- La sesión cancelada debe desaparecer de las citas activas y trasladarse al historial.

### Tamaño: S

### Dependencias

- [HU-012] Programar sesión de tutoría

---

## 🟥 [HU-017] Cancelar sesión por el tutor

**Responsable:** Xavi (Paquete F)

**Como** tutor  
**Quiero** cancelar una sesión pendiente de mi agenda  
**Para** notificar que por un imprevisto no podré impartir la asesoría académica

### Criterios de Aceptación

- El tutor debe poder ver sus citas pendientes y presionar la opción de "Cancelar Cita".
- Se debe solicitar un motivo de cancelación mediante un cuadro de texto obligatorio o modal de confirmación.
- El estado de la sesión debe actualizarse en base de datos a `CANCELLED_BY_TUTOR`.
- El espacio en la agenda del tutor se libera inmediatamente.
- La cita cancelada se conserva en la base de datos con su motivo para efectos de historial y auditoría.

### Tamaño: S

### Dependencias

- [HU-012] Programar sesión de tutoría
- [HU-014] Visualizar sesiones pendientes del tutor

---

# 2. Fase 2 — Completitud, Gestión y Reportes (Sprint 2)

## 🟨 [HU-010] Búsqueda avanzada de tutores

**Responsable:** Yury (Paquete D)

**Como** estudiante  
**Quiero** aplicar filtros avanzados en el catálogo de tutores  
**Para** encontrar tutores específicos por materia, años de experiencia, sexo, edad o universidad

### Criterios de Aceptación

- El catálogo de tutores debe incluir controles de filtrado interactivos:
  1. Filtro por materia o especialidad.
  2. Filtro por rango de años de experiencia docente.
  3. Filtro por género/sexo del tutor.
  4. Filtro por edad o rango de nacimiento.
  5. Filtro por universidad de procedencia.
- Los filtros deben ser combinables entre sí (búsqueda multicriterio).
- El sistema debe proveer un botón para limpiar filtros y restaurar el listado completo.
- Si no existen tutores que coincidan con la combinación de filtros, debe mostrarse un mensaje informativo amigable.

### Tamaño: L

### Dependencias

- [HU-009] Visualizar tutores disponibles

---

## 🟨 [HU-013] Visualizar sesiones activas del estudiante

**Responsable:** Nicole (Paquete E)

**Como** estudiante autenticado  
**Quiero** consultar una vista dedicada de mis sesiones de tutoría activas  
**Para** dar seguimiento a mis citas pendientes y conocer las fechas y tutores asignados

### Criterios de Aceptación

- Debe existir una vista accesible ("Mis Sesiones" o "Sesiones Activas") que liste únicamente las citas en estado `PENDING`.
- No deben listarse sesiones finalizadas (`ATTENDED`) ni canceladas.
- Cada tarjeta o fila debe mostrar: nombre del tutor, especialidad, fecha, hora, materia y modalidad.
- Las sesiones deben presentarse ordenadas cronológicamente de la más próxima a la más lejana.
- Si el estudiante no cuenta con citas activas, se debe mostrar un mensaje que invite a programar una tutoría.

### Tamaño: S

### Dependencias

- [HU-012] Programar sesión de tutoría

---

## 🟨 [HU-014] Visualizar sesiones pendientes del tutor

**Responsable:** Xavi (Paquete F)

**Como** tutor autenticado  
**Quiero** consultar la lista de sesiones que los estudiantes han reservado conmigo  
**Para** organizar mi tiempo de preparación y saber qué citas tengo pendientes de impartir

### Criterios de Aceptación

- La interfaz debe listar todas las sesiones del tutor en estado `PENDING`.
- Debe mostrar el nombre completo del estudiante, carnet, materia a consultar, motivo de la sesión, fecha y hora programada.
- Las sesiones deben mostrarse ordenadas cronológicamente por proximidad temporal.
- Desde esta vista el tutor debe tener accesos directos para atender la sesión o cancelarla si fuera necesario.

### Tamaño: S

### Dependencias

- [HU-007] Inicio de sesión de tutor
- [HU-012] Programar sesión de tutoría

---

## 🟨 [HU-015] Marcar sesión como atendida

**Responsable:** Xavi (Paquete F)

**Como** tutor  
**Quiero** marcar una sesión completada como "Atendida" e ingresar un resumen académico  
**Para** registrar formalmente que la asesoría fue impartida y dejar retroalimentación al estudiante

### Criterios de Aceptación

- El tutor debe disponer de la opción "Marcar como Atendida" en sus sesiones pendientes.
- Al presionar la opción, debe desplegarse un formulario que requiera obligatoriamente:
  - Resumen de los temas abordados en la tutoría.
  - Recomendaciones u observaciones para el estudiante.
- Al confirmar el guardado, el estado de la sesión cambia a `ATTENDED` y se persisten los textos en la base de datos.
- La sesión se remueve de las citas pendientes del tutor y pasa a formar parte de las estadísticas e historiales.

### Tamaño: S

### Dependencias

- [HU-014] Visualizar sesiones pendientes del tutor

---

## 🟨 [HU-020] Consultar historial de sesiones del estudiante

**Responsable:** Nicole (Paquete E)

**Como** estudiante  
**Quiero** consultar el historial completo de todas las tutorías que he solicitado  
**Para** revisar mi registro de aprendizaje, citas pasadas y las recomendaciones dejadas por los tutores

### Criterios de Aceptación

- La vista de historial debe incluir tanto sesiones finalizadas (`ATTENDED`) como canceladas (`CANCELLED_BY_STUDENT`, `CANCELLED_BY_TUTOR`).
- Debe incluir distintivos visuales de estado con colores claros (verde para atendida, rojo para cancelada).
- En las sesiones atendidas, el estudiante debe poder hacer clic para abrir y leer el resumen y recomendaciones redactadas por el tutor.
- Las sesiones deben estar ordenadas de la más reciente a la más antigua.

### Tamaño: S

### Dependencias

- [HU-015] Marcar sesión como atendida
- [HU-016] Cancelar sesión por el estudiante

---

## 🟨 [HU-021] Consultar historial de sesiones del tutor

**Responsable:** Xavi (Paquete F)

**Como** tutor  
**Quiero** acceder a mi historial histórico de sesiones atendidas y canceladas  
**Para** llevar control docente de las horas impartidas y consultar expedientes de estudiantes atendidos

### Criterios de Aceptación

- El historial del tutor debe mostrar todas las sesiones con estado `ATTENDED` y cancelaciones pasadas.
- Debe desplegar claramente el nombre del estudiante, carnet, fecha de realización, materia y el resumen registrado.
- Debe permitir distinguir si una cita cancelada fue revocada por el tutor o por el estudiante.
- El listado debe paginarse u ordenarse cronológicamente descendente.

### Tamaño: S

### Dependencias

- [HU-015] Marcar sesión como atendida
- [HU-017] Cancelar sesión por el tutor

---

## 🟨 [HU-022] Ver y actualizar perfil del estudiante

**Responsable:** Katheryn / Wade (Paquete A)

**Como** estudiante autenticado  
**Quiero** consultar y modificar los datos de mi perfil  
**Para** mantener actualizada mi información de contacto en la plataforma

### Criterios de Aceptación

- El estudiante debe visualizar sus datos actuales en un formulario de edición.
- Debe permitir actualizar nombre, apellido y contraseña (con validación de complejidad mínima).
- El correo electrónico institucional y el carnet deben permanecer bloqueados para edición por motivos de seguridad e identidad.
- El sistema debe confirmar la actualización con un mensaje de éxito reactivo.

### Tamaño: XS

### Dependencias

- [HU-006] Inicio de sesión de estudiante

---

## 🟨 [HU-023] Ver y actualizar perfil del tutor

**Responsable:** Isai (Paquete B)

**Como** tutor autenticado  
**Quiero** actualizar la información de mi perfil profesional y contraseña  
**Para** reflejar cambios en mi experiencia académica o actualizar mis credenciales de acceso

### Criterios de Aceptación

- El formulario debe presentar los datos actuales del tutor y permitir modificar especialidad, universidad, dirección/modalidad y contraseña.
- El correo electrónico institucional debe estar bloqueado para edición.
- Las actualizaciones de contraseña deben verificar la presencia de mayúsculas, minúsculas y números antes de encriptarse.
- Los cambios deben guardarse de forma inmediata en la tabla `tutor_profiles`.

### Tamaño: XS

### Dependencias

- [HU-007] Inicio de sesión de tutor

---

## 🟨 [HU-024] Administrar estudiantes aprobados

**Responsable:** Alvaro (Paquete C)

**Como** administrador autenticado  
**Quiero** consultar el directorio de estudiantes aprobados y tener la opción de darles de baja  
**Para** revocar el acceso a estudiantes inactivos o que hayan infringido las normativas de la plataforma

### Criterios de Aceptación

- El panel administrativo debe contar con una pestaña para listar todos los estudiantes con estado `APPROVED`.
- Debe incluir una barra de búsqueda reactiva por carnet, nombre completo o correo electrónico.
- Cada estudiante debe contar con un botón "Dar de baja" que requiera confirmación explícita antes de proceder.
- Al confirmar la baja, el estado del usuario cambia a `DISABLED` mediante una baja lógica (sin eliminar el registro físico en base de datos).
- El estudiante dado de baja debe ver revocado su acceso a la plataforma de inmediato, impidiéndole nuevos inicios de sesión.

### Tamaño: M

### Dependencias

- [HU-003] Autenticación de administrador en dos pasos
- [HU-004] Aprobar o rechazar registro de estudiante

---

## 🟨 [HU-025] Administrar tutores aprobados

**Responsable:** Alvaro (Paquete C)

**Como** administrador autenticado  
**Quiero** consultar los tutores aprobados y poder darles de baja lógica notificándoles por correo  
**Para** gestionar el cuerpo docente activo y desincorporar a tutores que ya no presten servicio

### Criterios de Aceptación

- El panel de administración debe mostrar la lista de tutores activos (`APPROVED`) con su fotografía, especialidad, carnet y universidad.
- Debe permitir buscar tutores en tiempo real por nombre, especialidad, correo o carnet.
- El botón "Dar de baja" debe desplegar un modal que permita ingresar un motivo de desvinculación (opcional o descriptivo).
- Al confirmar, el estado en la base de datos cambia a `DISABLED`.
- El sistema debe enviar un correo electrónico automático al tutor notificando su baja y el motivo registrado por el administrador.
- El tutor dado de baja queda inhabilitado para iniciar sesión y es excluido automáticamente de los catálogos de búsqueda de los estudiantes.

### Tamaño: M

### Dependencias

- [HU-003] Autenticación de administrador en dos pasos
- [HU-005] Aprobar o rechazar registro de tutor

---

## 🟦 [HU-018] Notificar por correo la cancelación del tutor

**Responsable:** Xavi (Paquete F)

**Como** estudiante  
**Quiero** recibir una notificación por correo electrónico cuando mi tutor cancele una sesión  
**Para** enterarme a tiempo de la cancelación, conocer el motivo y reprogramar mi consulta

### Criterios de Aceptación

- El sistema debe integrarse al servicio de correo SMTP (Nodemailer / Mailtrap).
- Al momento en que el tutor ejecute la cancelación de la cita ([HU-017]), se debe disparar automáticamente un correo al estudiante titular de la sesión.
- El cuerpo del correo debe incluir: nombre del estudiante, nombre del tutor, materia, fecha y hora original de la cita, y el motivo detallado de la cancelación.
- Si el servicio de correo presenta fallas de red, la transacción de cancelación de la base de datos debe conservarse y registrar el error en bitácora.

### Tamaño: M

### Dependencias

- [HU-017] Cancelar sesión por el tutor

---

## 🟦 [HU-019] Actualizar horario de atención

**Responsable:** Isai (Paquete B)

**Como** tutor  
**Quiero** modificar los días y horas de mi horario de atención regular  
**Para** ajustar mi disponibilidad docente a nuevos compromisos académicos

### Criterios de Aceptación

- El tutor debe poder cargar sus rangos de horario actuales y definir nuevos días o intervalos horarios.
- **Regla de integridad:** El sistema debe comprobar que el nuevo horario no deje citas previamente programadas en estado pendiente (`PENDING`) fuera del nuevo rango de atención.
- Si existen sesiones pendientes que entrarían en conflicto con el nuevo horario, la actualización debe ser rechazada informando al tutor de las citas existentes.
- Si no hay conflictos, los nuevos rangos deben actualizarse en la tabla de horarios del tutor.

### Tamaño: M

### Dependencias

- [HU-008] Establecer horario de atención
- [HU-012] Programar sesión de tutoría

---

## 🟦 [HU-026] Reporte de tutores con más estudiantes atendidos

**Responsable:** Alvaro (Paquete C)

**Como** administrador autenticado  
**Quiero** consultar un reporte analítico con el ranking de tutores según la cantidad de estudiantes y citas atendidas  
**Para** identificar a los tutores con mayor impacto y demanda en la plataforma EduConnect

### Criterios de Aceptación

- El reporte debe contabilizar exclusivamente las sesiones de tutoría con estado `ATTENDED` (atendidas exitosamente), excluyendo citas pendientes (`PENDING`) y canceladas.
- Los tutores deben ordenarse en un ranking descendente según la cantidad de sesiones atendidas.
- En caso de empate en sesiones atendidas, el criterio de desempate debe ser la cantidad de estudiantes únicos distintos atendidos (`COUNT(DISTINCT student_id)`).
- La interfaz administrativa debe mostrar:
  - Tarjetas de resumen KPI (Total de sesiones atendidas, Estudiantes beneficiados, Tutor líder #1).
  - Tabla detallada con distintivos de podio (#1, #2, #3), especialidad, carnet, universidad, barras de porcentaje de demanda y estado.
  - Filtro reactivo para buscar por nombre/especialidad y alternar entre todos los tutores o solo aquellos con atenciones.
- El sistema debe incluir la opción de **Exportar Reportes**, descargando simultáneamente:
  1. Planilla en formato CSV con codificación UTF-8 con BOM.
  2. Documento ejecutivo oficial en formato PDF con membrete y estructura formal.
- La interfaz del reporte y sus exportaciones deben presentarse sin caracteres emojis informales.

### Tamaño: S

### Dependencias

- [HU-003] Autenticación de administrador en dos pasos
- [HU-015] Marcar sesión como atendida

---

## 🟦 [HU-027] Reporte de materia con mayor demanda

**Responsable:** Yury (Paquete D)

**Como** administrador autenticado  
**Quiero** visualizar un reporte que totalice las sesiones reservadas agrupadas por materia  
**Para** conocer qué asignaturas académicas presentan la mayor necesidad de apoyo estudiantil

### Criterios de Aceptación

- El endpoint debe consultar y agregar el número total de sesiones registradas agrupadas por el campo `materia`.
- El reporte debe ordenar las materias de mayor a menor número de solicitudes recibidas.
- La interfaz debe presentar una tabla ordenada con el nombre de la materia, total de citas solicitadas y porcentaje relativo sobre el total general.
- Debe calcularse en tiempo real a partir de las sesiones existentes en base de datos.

### Tamaño: S

### Dependencias

- [HU-003] Autenticación de administrador en dos pasos
- [HU-012] Programar sesión de tutoría

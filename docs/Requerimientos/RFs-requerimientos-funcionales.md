# Requerimientos Funcionales (RFs)

Matriz de requerimientos funcionales de EduConnect, derivada del Product Backlog (`docs/Scrumban/historias_usuario.md`) y verificada contra el comportamiento real implementado. Formato: `RF-<módulo>-<consecutivo>`.

Módulos: **1** Estudiante, **2** Tutor, **3** Administrador, **4** Transversal (autenticación, notificaciones, disponibilidad y sesiones que involucran a más de un rol).

## Módulo 1 — Estudiante

| ID | Descripción | Prioridad | Actores involucrados |
|---|---|---|---|
| RF-1-1 | El sistema debe permitir a un estudiante registrarse con nombre, apellido, carnet, correo y contraseña. | Alta | Estudiante |
| RF-1-2 | El sistema debe validar que la contraseña del estudiante tenga mínimo 8 caracteres, una mayúscula, una minúscula y un número. | Alta | Estudiante |
| RF-1-3 | El sistema debe rechazar el registro si el correo o el carnet ya existen. | Alta | Estudiante |
| RF-1-4 | El sistema debe registrar al estudiante en estado `PENDING` hasta que un administrador lo apruebe. | Alta | Estudiante, Administrador |
| RF-1-5 | El sistema debe permitir al estudiante iniciar sesión únicamente si su cuenta está `APPROVED`. | Alta | Estudiante |
| RF-1-6 | El sistema debe mostrar al estudiante el catálogo de tutores aprobados, excluyendo automáticamente a los tutores con los que ya tenga una sesión `PENDING`. | Alta | Estudiante |
| RF-1-7 | El sistema debe permitir al estudiante filtrar tutores por materia, experiencia, sexo, edad y universidad, de forma combinable. | Media | Estudiante |
| RF-1-8 | El sistema debe permitir al estudiante consultar los días y horarios de atención de un tutor, distinguiendo espacios ocupados de disponibles. | Alta | Estudiante |
| RF-1-9 | El sistema debe permitir al estudiante programar una sesión indicando tutor, materia, fecha, hora de inicio y motivo. | Alta | Estudiante |
| RF-1-10 | El sistema debe derivar la hora de fin de la sesión sumando 60 minutos a la hora de inicio, sin confiar en un valor enviado por el cliente. | Alta | Estudiante |
| RF-1-11 | El sistema debe rechazar una reserva fuera del horario configurado por el tutor. | Alta | Estudiante |
| RF-1-12 | El sistema debe rechazar una reserva que traslape otra sesión `PENDING` del mismo tutor. | Alta | Estudiante |
| RF-1-13 | El sistema debe rechazar una reserva si el estudiante ya tiene otra sesión `PENDING` a la misma hora, incluso con un tutor distinto. | Alta | Estudiante |
| RF-1-14 | El sistema debe rechazar una reserva si el estudiante ya tiene una sesión `PENDING` con ese mismo tutor. | Alta | Estudiante |
| RF-1-15 | El sistema debe permitir al estudiante cancelar una sesión propia mientras siga `PENDING`, previa confirmación. | Alta | Estudiante |
| RF-1-16 | El sistema debe liberar el horario del tutor inmediatamente después de que el estudiante cancele una sesión. | Alta | Estudiante |
| RF-1-17 | El sistema debe listar únicamente las sesiones `PENDING` del estudiante autenticado, ordenadas por fecha y hora más próxima. | Media | Estudiante |
| RF-1-18 | El sistema debe permitir al estudiante consultar su historial de sesiones (atendidas y canceladas), de la más reciente a la más antigua. | Media | Estudiante |
| RF-1-19 | El sistema debe mostrar el resumen y las recomendaciones del tutor únicamente en las sesiones con estado `ATTENDED`. | Media | Estudiante |
| RF-1-20 | El sistema debe notificar por correo al estudiante cuando el tutor cancele una de sus sesiones, incluyendo motivo y disculpa. | Baja | Estudiante |
| RF-1-21 | El sistema debe permitir al estudiante consultar y actualizar su perfil, manteniendo el correo electrónico bloqueado para edición. | Media | Estudiante |

## Módulo 2 — Tutor

| ID | Descripción | Prioridad | Actores involucrados |
|---|---|---|---|
| RF-2-1 | El sistema debe permitir a un tutor registrarse con datos personales, profesionales y una fotografía obligatoria. | Alta | Tutor |
| RF-2-2 | El sistema debe registrar al tutor en estado `PENDING` hasta que un administrador lo apruebe. | Alta | Tutor, Administrador |
| RF-2-3 | El sistema debe permitir al tutor iniciar sesión únicamente si su cuenta está `APPROVED`. | Alta | Tutor |
| RF-2-4 | El sistema debe permitir al tutor establecer uno o más días de atención con un rango de hora de inicio y fin común. | Alta | Tutor |
| RF-2-5 | El sistema debe validar que la hora de inicio sea menor que la hora de fin al guardar la disponibilidad del tutor. | Alta | Tutor |
| RF-2-6 | El sistema debe permitir al tutor actualizar su horario, rechazando el cambio si deja sesiones `PENDING` fuera del nuevo rango. | Baja | Tutor |
| RF-2-7 | El sistema debe permitir al tutor consultar sus sesiones `PENDING`, ordenadas cronológicamente por proximidad. | Media | Tutor |
| RF-2-8 | El sistema debe permitir al tutor marcar una sesión `PENDING` como atendida, exigiendo un resumen obligatorio y recomendaciones opcionales. | Media | Tutor |
| RF-2-9 | El sistema debe permitir al tutor cancelar una sesión `PENDING`, liberando el horario y conservando la sesión para el historial. | Alta | Tutor |
| RF-2-10 | El sistema debe permitir al tutor consultar su historial de sesiones, distinguiendo si fueron atendidas o canceladas y por quién. | Media | Tutor |
| RF-2-11 | El sistema debe permitir al tutor consultar y actualizar su perfil profesional, manteniendo el correo bloqueado para edición. | Media | Tutor |

## Módulo 3 — Administrador

| ID | Descripción | Prioridad | Actores involucrados |
|---|---|---|---|
| RF-3-1 | El sistema debe exigir al administrador un segundo factor de autenticación (archivo `auth2-ayd1.txt` con contraseña distinta a la del login inicial). | Alta | Administrador |
| RF-3-2 | El sistema debe permitir al administrador listar las solicitudes de estudiantes en estado `PENDING`. | Alta | Administrador |
| RF-3-3 | El sistema debe permitir al administrador aprobar o rechazar una solicitud de estudiante, notificando el resultado por correo. | Alta | Administrador, Estudiante |
| RF-3-4 | El sistema debe permitir al administrador listar las solicitudes de tutores en estado `PENDING`. | Alta | Administrador |
| RF-3-5 | El sistema debe permitir al administrador aprobar o rechazar una solicitud de tutor, notificando el resultado por correo. | Alta | Administrador, Tutor |
| RF-3-6 | El sistema debe permitir al administrador dar de baja lógica a un estudiante aprobado, bloqueando futuros inicios de sesión. | Media | Administrador |
| RF-3-7 | El sistema debe permitir al administrador dar de baja lógica a un tutor aprobado, bloqueando su login y ocultándolo de las búsquedas públicas. | Media | Administrador |
| RF-3-8 | El sistema debe generar un reporte de tutores ordenado por cantidad de sesiones `ATTENDED`. | Baja | Administrador |
| RF-3-9 | El sistema debe generar un reporte de materias agrupado por cantidad total de sesiones reservadas. | Baja | Administrador |

## Módulo 4 — Transversal

| ID | Descripción | Prioridad | Actores involucrados |
|---|---|---|---|
| RF-4-1 | El sistema debe almacenar todas las contraseñas cifradas con `bcrypt`, nunca en texto plano. | Alta | Estudiante, Tutor, Administrador |
| RF-4-2 | El sistema debe emitir un token JWT al iniciar sesión y exigirlo en las rutas privadas mediante encabezado `Authorization: Bearer`. | Alta | Estudiante, Tutor, Administrador |
| RF-4-3 | El sistema debe bloquear el acceso a cuentas en estado `PENDING`, `REJECTED` o `DISABLED`, indicando el motivo. | Alta | Estudiante, Tutor |
| RF-4-4 | El sistema debe validar en el backend, dentro de una transacción con bloqueo de fila, que ninguna reserva de sesión traslape otra activa. | Alta | Estudiante, Tutor |
| RF-4-5 | El sistema debe enviar correos transaccionales (aprobación, rechazo, baja, cancelación) mediante un servicio SMTP simulado (Mailtrap). | Media | Estudiante, Tutor, Administrador |
| RF-4-6 | El sistema completo (frontend, backend y base de datos) debe poder levantarse localmente con un solo comando `docker compose up`. | Alta | Equipo de desarrollo |

---

**Referencia cruzada con historias de usuario:** cada RF corresponde a uno o más criterios de aceptación de `docs/Scrumban/historias_usuario.md`. Los RF del Módulo 1 marcados Alta (RF-1-9 a RF-1-16) corresponden a `HU-012`; RF-1-15/RF-1-16 a `HU-016`; RF-1-17 a `HU-013`; RF-1-18/RF-1-19 a `HU-020`.

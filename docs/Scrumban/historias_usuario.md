# Product Backlog — Historias de Usuario

Este documento centraliza los requerimientos funcionales de EduConnect. Cada historia incluye su estimación relativa (T-Shirt Sizing) preparada para el Sprint Planning, dependencias técnicas y criterios de aceptación verificables.

## Sprint 1: Núcleo Operativo (Prioridad Alta)

**HU-001 | Registro de estudiante**
* **Responsable:** Wade (Paquete A) | **Prioridad:** 🟥 Alta | **Estimación:** M
* **Dependencias:** Ninguna.
* **Descripción:** Como estudiante, quiero registrarme en EduConnect con mis datos personales y académicos, para solicitar acceso a la plataforma y poder gestionar tutorías.
* **Criterios de Aceptación:**
  * Solicita datos requeridos; fotografía opcional.
  * Contraseña $\ge$ 8 caracteres (minúscula, mayúscula, número).
  * Valida formatos y evita correos duplicados.
  * Contraseña encriptada en base de datos.
  * La cuenta queda en estado pendiente de aprobación.

**HU-002 | Registro de tutor**
* **Responsable:** Isai (Paquete B) | **Prioridad:** 🟥 Alta | **Estimación:** M
* **Dependencias:** Ninguna.
* **Descripción:** Como tutor, quiero registrarme en EduConnect con mis datos, para solicitar acceso a la plataforma y ofrecer tutorías.
* **Criterios de Aceptación:**
  * Fotografía obligatoria y datos profesionales completos.
  * Contraseña segura encriptada; validación de duplicados.
  * Cuenta ingresa en estado pendiente.

**HU-003 | Autenticación de administrador en dos pasos**
* **Responsable:** Wade (Paquete A) | **Prioridad:** 🟥 Alta | **Estimación:** L
* **Dependencias:** Ninguna.
* **Descripción:** Como administrador, quiero autenticarme mediante dos pasos de seguridad, para acceder de forma controlada.
* **Criterios de Aceptación:**
  * Login predeterminado exitoso solicita archivo `auth2-ayd1.txt`.
  * Valida contraseña encriptada del archivo.
  * Contraseñas de ambos pasos deben ser diferentes.

**HU-004 | Aprobar o rechazar registro de estudiante**
* **Responsable:** Alvaro (Paquete C) | **Prioridad:** 🟥 Alta | **Estimación:** S
* **Dependencias:** HU-001, HU-003
* **Descripción:** Como administrador, quiero revisar solicitudes de estudiantes para controlar el acceso.
* **Criterios de Aceptación:**
  * Listar pendientes; opción de aceptar o rechazar.
  * Aprobar habilita el login; rechazar lo impide.
  * Enviar correo con el resultado de la gestión.

**HU-005 | Aprobar o rechazar registro de tutor**
* **Responsable:** Alvaro (Paquete C) | **Prioridad:** 🟥 Alta | **Estimación:** S
* **Dependencias:** HU-002, HU-003
* **Descripción:** Como administrador, quiero revisar solicitudes de tutores para controlar quién ofrece tutorías.
* **Criterios de Aceptación:**
  * Listar pendientes; aprobar habilita login, rechazar lo bloquea.
  * Enviar correo con el resultado.

**HU-006 | Inicio de sesión de estudiante**
* **Responsable:** Wade (Paquete A) | **Prioridad:** 🟥 Alta | **Estimación:** S
* **Dependencias:** HU-001, HU-004
* **Descripción:** Como estudiante, quiero iniciar sesión para acceder a la gestión de tutorías.
* **Criterios de Aceptación:**
  * Autenticar con correo/contraseña; exigir estado aprobado.
  * Bloquear accesos pendientes, rechazados o dados de baja.

**HU-007 | Inicio de sesión de tutor**
* **Responsable:** Isai (Paquete B) | **Prioridad:** 🟥 Alta | **Estimación:** S
* **Dependencias:** HU-002, HU-005
* **Descripción:** Como tutor, quiero iniciar sesión para gestionar mi disponibilidad y citas.
* **Criterios de Aceptación:**
  * Validar credenciales y exigir aprobación de cuenta.
  * Generar token de sesión seguro.

**HU-008 | Establecer horario de atención**
* **Responsable:** Isai (Paquete B) | **Prioridad:** 🟥 Alta | **Estimación:** M
* **Dependencias:** HU-007
* **Descripción:** Como tutor, quiero establecer mis días y horas de disponibilidad para recibir estudiantes.
* **Criterios de Aceptación:**
  * Seleccionar días de la semana y un rango de horas (inicio/fin).
  * Validar consistencia temporal e insertar en base de datos.

**HU-009 | Visualizar tutores disponibles**
* **Responsable:** Yury (Paquete D) | **Prioridad:** 🟥 Alta | **Estimación:** M
* **Dependencias:** HU-005, HU-006
* **Descripción:** Como estudiante, quiero visualizar tutores disponibles para conocer opciones.
* **Criterios de Aceptación:**
  * Mostrar solo tutores aprobados (nombre, especialidad, foto).
  * Excluir automáticamente tutores con los que ya se tenga una sesión activa.

**HU-011 | Consultar horarios y disponibilidad del tutor**
* **Responsable:** Yury (Paquete D) | **Prioridad:** 🟥 Alta | **Estimación:** M
* **Dependencias:** HU-008, HU-009
* **Descripción:** Como estudiante, quiero consultar días y espacios de un tutor para elegir una fecha válida.
* **Criterios de Aceptación:**
  * Mostrar días laborables y horario general.
  * Distinguir visualmente espacios ocupados vs. disponibles.

**HU-012 | Programar sesión de tutoría**
* **Responsable:** Nicole (Paquete E) | **Prioridad:** 🟥 Alta | **Estimación:** L
* **Dependencias:** HU-011
* **Descripción:** Como estudiante, quiero programar una sesión con un tutor disponible.
* **Criterios de Aceptación:**
  * Registrar fecha, hora, materia y motivo.
  * Impedir traslapes de horario exactos.
  * Máximo una sesión activa simultánea con el mismo tutor.

**HU-016 | Cancelar sesión por el estudiante**
* **Responsable:** Nicole (Paquete E) | **Prioridad:** 🟥 Alta | **Estimación:** S
* **Dependencias:** HU-013
* **Descripción:** Como estudiante, quiero cancelar una sesión activa para liberar el horario.
* **Criterios de Aceptación:**
  * Pedir confirmación; cambiar estado a cancelado.
  * Liberar inmediatamente el bloque horario en base de datos.

**HU-017 | Cancelar sesión por el tutor**
* **Responsable:** Xavi (Paquete F) | **Prioridad:** 🟥 Alta | **Estimación:** S
* **Dependencias:** HU-014
* **Descripción:** Como tutor, quiero cancelar una sesión pendiente cuando tenga un inconveniente.
* **Criterios de Aceptación:**
  * Cambiar estado a cancelado por el tutor.
  * Quitar de pendientes, liberar horario y conservar para el historial.

---

## Sprint 2: Completitud y Reportes (Prioridad Media / Baja)

**HU-010 | Búsqueda avanzada de tutores**
* **Responsable:** Yury (Paquete D) | **Prioridad:** 🟨 Media | **Estimación:** M
* **Dependencias:** HU-009
* **Descripción:** Como estudiante, quiero filtrar tutores para encontrar uno adecuado.
* **Criterios de Aceptación:**
  * Filtros por materia, experiencia, sexo, edad y universidad.
  * Filtros combinables y actualización en tiempo real.

**HU-013 | Visualizar sesiones activas del estudiante**
* **Responsable:** Nicole (Paquete E) | **Prioridad:** 🟨 Media | **Estimación:** S
* **Dependencias:** HU-012
* **Descripción:** Como estudiante, quiero consultar mis sesiones activas para dar seguimiento.
* **Criterios de Aceptación:**
  * Mostrar solo citas no atendidas ni canceladas con detalles completos.

**HU-014 | Visualizar sesiones pendientes del tutor**
* **Responsable:** Xavi (Paquete F) | **Prioridad:** 🟨 Media | **Estimación:** S
* **Dependencias:** HU-007, HU-012
* **Descripción:** Como tutor, quiero visualizar sesiones pendientes para organizar mi agenda.
* **Criterios de Aceptación:**
  * Mostrar solo pendientes del tutor autenticado.
  * Orden cronológico (próximas primero).

**HU-015 | Marcar sesión como atendida**
* **Responsable:** Xavi (Paquete F) | **Prioridad:** 🟨 Media | **Estimación:** M
* **Dependencias:** HU-014
* **Descripción:** Como tutor, quiero marcar una sesión como atendida y registrar su resumen.
* **Criterios de Aceptación:**
  * Formulario que exija un resumen y recomendaciones obligatorias.
  * Cambiar estado a atendido y remover de pendientes.

**HU-020 | Consultar historial de sesiones del estudiante**
* **Responsable:** Nicole (Paquete E) | **Prioridad:** 🟨 Media | **Estimación:** S
* **Dependencias:** HU-015, HU-016, HU-017
* **Descripción:** Como estudiante, quiero consultar mi historial para llevar control.
* **Criterios de Aceptación:**
  * Mostrar sesiones atendidas y canceladas.
  * Desplegar el resumen escrito por el tutor si fue atendida.

**HU-021 | Consultar historial de sesiones del tutor**
* **Responsable:** Xavi (Paquete F) | **Prioridad:** 🟨 Media | **Estimación:** S
* **Dependencias:** HU-015, HU-016, HU-017
* **Descripción:** Como tutor, quiero consultar el historial de mis sesiones.
* **Criterios de Aceptación:**
  * Distinguir claramente si la cita fue atendida o cancelada (y por quién).

**HU-022 | Ver y actualizar perfil del estudiante**
* **Responsable:** Wade (Paquete A) | **Prioridad:** 🟨 Media | **Estimación:** S
* **Dependencias:** HU-006
* **Descripción:** Como estudiante, quiero actualizar mi perfil para mantener vigente mi información.
* **Criterios de Aceptación:**
  * Modificar todos los datos excepto el correo electrónico.

**HU-023 | Ver y actualizar perfil del tutor**
* **Responsable:** Isai (Paquete B) | **Prioridad:** 🟨 Media | **Estimación:** S
* **Dependencias:** HU-007
* **Descripción:** Como tutor, quiero actualizar mi perfil profesional.
* **Criterios de Aceptación:**
  * Validar formatos; correo bloqueado para edición.

**HU-024 | Administrar estudiantes aprobados**
* **Responsable:** Alvaro (Paquete C) | **Prioridad:** 🟨 Media | **Estimación:** M
* **Dependencias:** HU-003, HU-004
* **Descripción:** Como administrador, quiero dar de baja a estudiantes aprobados.
* **Criterios de Aceptación:**
  * Listar aprobados; opción de baja con confirmación para bloquear futuros logins.

**HU-025 | Administrar tutores aprobados**
* **Responsable:** Alvaro (Paquete C) | **Prioridad:** 🟨 Media | **Estimación:** M
* **Dependencias:** HU-003, HU-005
* **Descripción:** Como administrador, quiero dar de baja a tutores aprobados.
* **Criterios de Aceptación:**
  * Cambiar estado a inactivo, bloquear login y notificar por correo.

**HU-018 | Notificar por correo la cancelación del tutor**
* **Responsable:** Xavi (Paquete F) | **Prioridad:** 🟦 Baja | **Estimación:** S
* **Dependencias:** HU-017
* **Descripción:** Como estudiante, quiero recibir un correo cuando el tutor cancele mi sesión.
* **Criterios de Aceptación:**
  * Envío automático vía SMTP incluyendo motivo, disculpa y detalles de la cita.

**HU-019 | Actualizar horario de atención**
* **Responsable:** Isai (Paquete B) | **Prioridad:** 🟦 Baja | **Estimación:** L
* **Dependencias:** HU-008, HU-012
* **Descripción:** Como tutor, quiero modificar mis rangos de atención.
* **Criterios de Aceptación:**
  * Validar que el nuevo horario no deje sesiones pendientes por fuera del rango.

**HU-026 | Reporte de tutores con más estudiantes atendidos**
* **Responsable:** Alvaro (Paquete C) | **Prioridad:** 🟦 Baja | **Estimación:** M
* **Dependencias:** HU-003, HU-015
* **Descripción:** Como administrador, quiero consultar un reporte de tutores más activos.
* **Criterios de Aceptación:**
  * Usar conteo de sesiones en estado "Atendido" por cada tutor.

**HU-027 | Reporte de materia con mayor demanda**
* **Responsable:** Yury (Paquete D) | **Prioridad:** 🟦 Baja | **Estimación:** M
* **Dependencias:** HU-003, HU-012
* **Descripción:** Como administrador, quiero identificar la demanda académica.
* **Criterios de Aceptación:**
  * Contabilizar cantidad total de sesiones reservadas agrupadas por materia.
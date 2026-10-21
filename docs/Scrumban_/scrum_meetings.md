# Scrum Meetings — Registro de Eventos y Ceremonias (EduConnect)

> Este documento contiene la planificación, registro, seguimiento y actas formales de todas las ceremonias de Scrum realizadas durante el desarrollo del proyecto **EduConnect**.  
> El ciclo de vida del proyecto se estructuró en dos grandes fases de desarrollo, integrando en cada una:
> - **Sprint 1:** 1 sesión de Sprint Planning, 6 sesiones de Daily Scrum y 1 sesión de Sprint Retrospective.
> - **Sprint 2:** 1 sesión de Sprint Planning, 6 sesiones de Daily Scrum y 1 sesión de Sprint Retrospective.

---

## Integrantes del Equipo Scrum y Asignación de Roles

| Integrante | Carnet | Rol Scrum | Paquete Técnico (Fase 1) | Paquete Técnico (Fase 2) |
| :--- | :---: | :--- | :--- | :--- |
| **Alvaro Ceballos** | 202300673 | Scrum Master / Dev | **Paquete C:** Aprobaciones y Bajas Lógicas | **Paquete C:** Moderación, Denuncias y Cuentas |
| **Katheryn / Wade** | 201901358 | Developer | **Paquete A:** Identidad y Autenticación | **Paquete D:** Métricas, Calificaciones y Reportes |
| **Isai Patzán** | 202200057 | Product Owner / Dev | **Paquete B:** Tutor: Horarios y Perfiles | **Paquete F:** Feedback (Ratings/Reportes) y CI/CD |
| **Yury** | 202200350 | Developer | **Paquete D:** Catálogo y Disponibilidad | **Paquete A:** Identidad, Tokens y PDFs Estudiante |
| **Nicole López** | 202102143 | Developer | **Paquete E:** Sesiones del Estudiante | **Paquete E:** Planes Estructurados y Constancia PDF |
| **Xavi De León** | 202201385 | Developer | **Paquete F:** Sesiones del Tutor y Correos | **Paquete B:** CV Tutor, Visores PDF y Despliegue |

---

# 1. Fase 1 — Ceremonias Históricas y Registro de Sprints

## 1.1 Sprint 1 (Fase 1) — Núcleo Operativo

- **Periodo:** Del 2 de septiembre de 2026 al 8 de septiembre de 2026
- **Evidencias del Tablero:** Archivos PDF en el directorio [`tableros/`](tableros/)

---

### 1.1.1 Sprint Planning 1 (Fase 1)

- **Fecha:** 2 de septiembre de 2026
- **Hora / Duración:** 1:40 min
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** [Acceder a Grabación (Google Drive)](https://drive.google.com/drive/folders/1Qv6XXcM7_uXLVQyC7vn3hejGghHMym5P?usp=sharing)
- **Evidencia del Tablero Kanban:** [`sprint1_planning_.pdf`](tableros/sprint1_planning_.pdf)

#### Objetivos y Acuerdos de la Sesión
- Definición y compromiso del **Sprint Goal 1**: Implementar el núcleo de autenticación, gestión de cuentas por roles, configuración horaria base, consulta de tutores y el motor de reservas/cancelaciones sin traslapes.
- Desglose inicial del Product Backlog (27 historias) en las primeras 50 tareas técnicas asociadas a los paquetes de trabajo A, B, C, D, E y F.
- Configuración de ramas bajo Git Flow (`main`, `develop`, y `feature/carnet` por cada integrante).

---

### 1.1.2 Daily Scrums — Sprint 1 (Fase 1)

#### Daily 1 — 3 de septiembre de 2026
- **Fecha:** 3 de septiembre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`daily1.pdf`](tableros/daily1.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Participé en la sesión de Planning y creé el repositorio en GitHub configurando ramas protegidas según Git Flow (`main` y `develop`).
   - *¿Qué voy a hacer hoy?:* Diseñar el esquema de base de datos para la gestión de aprobaciones administrativas y crear la estructura base de los endpoints para solicitudes de usuarios (`T-004.1` y `T-004.2`).
   - *¿Tengo algún impedimento?:* Ninguno por el momento; entorno local levantado con Docker Compose sin novedades.
2. **Wade:**
   - *¿Qué hice ayer?:* Clonavé el repositorio base y definí la estructura modular para el frontend en React.
   - *¿Qué voy a hacer hoy?:* Maquetar el formulario interactivo de registro de estudiantes (`T-001.1`), contemplando los campos obligatorios del enunciado.
   - *¿Tengo algún impedimento?:* Ninguno; configurando las reglas de validación para campos alfanuméricos.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Coordiné con el equipo el diseño relacional preliminar para las entidades de usuarios y tutores.
   - *¿Qué voy a hacer hoy?:* Implementar el script de inicialización de MySQL en Docker (`TECH-001`) con las tablas de tutores, especialidades y tablas de soporte.
   - *¿Tengo algún impedimento?:* Ninguno; contenedor de base de datos verificado localmente.
4. **Yury:**
   - *¿Qué hice ayer?:* Revisé los requerimientos visuales y el alcance del catálogo público de tutores.
   - *¿Qué voy a hacer hoy?:* Estructurar la vista principal del estudiante y preparar el grid de presentación de tarjetas de tutores (`T-009.1`).
   - *¿Tengo algún impedimento?:* Ninguno; trabajando en el diseño de las tarjetas informativas (nombre, materia, foto, dirección).
5. **Nicole López:**
   - *¿Qué hice ayer?:* Analicé las reglas del motor de reservas para evitar traslapes horarios entre estudiantes y tutores.
   - *¿Qué voy a hacer hoy?:* Definir la tabla relacional de sesiones (`T-012.2`) y diagramar el flujo de datos del formulario de reserva (`T-012.1`).
   - *¿Tengo algún impedimento?:* Ninguno; coordinando con Isai la estructura de llaves foráneas para las sesiones.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Revisé la especificación del módulo de tutores y el flujo de cancelación de tutorías.
   - *¿Qué voy a hacer hoy?:* Maquetar el modal de confirmación para la cancelación de sesiones pendientes del tutor (`T-017.1`).
   - *¿Tengo algún impedimento?:* Ninguno; preparando el estado visual del diálogo de confirmación.

---

#### Daily 2 — 4 de septiembre de 2026
- **Fecha:** 4 de septiembre de 2026
- **Hora / Duración:** 14 min
- **Evidencia del Tablero:** [`daily2.pdf`](tableros/daily2.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Construí la tabla visual para listar solicitudes pendientes de estudiantes en el frontend (`T-004.1`).
   - *¿Qué voy a hacer hoy?:* Desarrollar los endpoints `GET /api/admin/solicitudes` y `PATCH /api/admin/estudiante/:id/estado` para aceptar o rechazar (`T-004.2`).
   - *¿Tengo algún impedimento?:* Ninguno; probando respuestas JSON y códigos de estado HTTP.
2. **Wade:**
   - *¿Qué hice ayer?:* Concluí el maquetado del formulario de registro de estudiante (`T-001.1`).
   - *¿Qué voy a hacer hoy?:* Implementar validaciones de formulario: formato de carnet, teléfono y longitud de contraseña con expresiones regulares (`T-001.2`).
   - *¿Tengo algún impedimento?:* Ninguno; validación de complejidad de contraseña lista (8 caracteres, mayúscula, minúscula y número).
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Desplegué el script `TECH-001` en Docker con las tablas relacionales y restricciones de integridad.
   - *¿Qué voy a hacer hoy?:* Desarrollar la vista de formulario para el registro de tutores con validación estricta de fotografía obligatoria (`T-002.1`).
   - *¿Tengo algún impedimento?:* Ninguno; probando carga en memoria y previsualización de imágenes.
4. **Yury:**
   - *¿Qué hice ayer?:* Diseñé el contenedor responsivo de tutores disponibles (`T-009.1`).
   - *¿Qué voy a hacer hoy?:* Implementar la lógica para excluir tutores con los cuales el estudiante autenticado ya posee una sesión activa (`T-009.2`).
   - *¿Tengo algún impedimento?:* Ninguno; consumiendo endpoint simulado para probar el filtrado dinámico.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Apliqué la migración de base de datos para la entidad de sesiones (`T-012.2`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el endpoint `POST /api/sesiones` para la creación de solicitudes de tutoría (`T-012.3`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando la recepción adecuada de parámetros (fecha, hora, motivo, materia).
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Terminé la interfaz del modal de cancelación para tutores (`T-017.1`).
   - *¿Qué voy a hacer hoy?:* Construir el controlador del backend para procesar la cancelación y cambiar el estado del registro (`T-017.2`).
   - *¿Tengo algún impedimento?:* Ninguno; sincronizando con Nicole el nombre exacto de las columnas de estado en la base de datos.

---

#### Daily 3 — 5 de septiembre de 2026
- **Fecha:** 5 de septiembre de 2026
- **Hora / Duración:** 16 min
- **Evidencia del Tablero:** [`daily3.pdf`](tableros/daily3.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Completé el backend para aprobación/rechazo de estudiantes y generé seeds de prueba (`T-004.2` y `T-004.3`).
   - *¿Qué voy a hacer hoy?:* Integrar el despacho de correos de resolución al estudiante (`T-004.4`) y maquetar la tabla de tutores pendientes (`T-005.1`).
   - *¿Tengo algún impedimento?:* Ninguno; pruebas SMTP locales ejecutadas con éxito.
2. **Wade:**
   - *¿Qué hice ayer?:* Terminé las validaciones de entrada (`T-001.2`) y la persistencia de usuarios con cifrado Bcrypt (`T-001.3`).
   - *¿Qué voy a hacer hoy?:* Desarrollar la vista de inicio de sesión de estudiante (`T-006.1`) y la verificación de estado "Aprobado" (`T-006.2`).
   - *¿Tengo algún impedimento?:* Ninguno; validando el mensaje amigable cuando la cuenta está aún pendiente de revisión.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Implementé validaciones de registro de tutor (`T-002.2`) y almacenamiento seguro de contraseña (`T-002.3`).
   - *¿Qué voy a hacer hoy?:* Construir el login de tutor (`T-007.1`, `T-007.2`) y la pantalla para configuración de horario de atención (`T-008.1`).
   - *¿Tengo algún impedimento?:* Ninguno; coordinando con Wade la reutilización del componente de hashing en backend.
4. **Yury:**
   - *¿Qué hice ayer?:* Conecté el listado de tutores con la exclusión de reservas activas (`T-009.2`).
   - *¿Qué voy a hacer hoy?:* Maquetar el componente de visualización de agenda del tutor por fecha seleccionada (`T-011.1` y `T-011.2`).
   - *¿Tengo algún impedimento?:* Ninguno; formateando selectores de fecha para consultar slots disponibles.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Implementé la recepción y persistencia de reservas (`T-012.3`).
   - *¿Qué voy a hacer hoy?:* Programar los algoritmos de validación: comprobar que la fecha esté en días laborables del tutor y verificar horario disponible (`T-012.4`).
   - *¿Tengo algún impedimento?:* Ninguno; estructurando la consulta SQL de cruce de rangos horarios.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Concluí la mutación de estado a "Cancelada por el tutor" en base de datos (`T-017.2`).
   - *¿Qué voy a hacer hoy?:* Implementar la notificación automática por correo electrónico al estudiante informando la cancelación (`T-018.1`).
   - *¿Tengo algún impedimento?:* Ninguno; integrando la plantilla base de notificación.

---

#### Daily 4 — 6 de septiembre de 2026
- **Fecha:** 6 de septiembre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`daily4.pdf`](tableros/daily4.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Avancé en la aprobación y rechazo de tutores (`T-005.1` y `T-005.2`).
   - *¿Qué voy a hacer hoy?:* Finalizar la aprobación de tutores y pruebas de notificaciones (`T-005.3`, `T-005.4`).
   - *¿Tengo algún impedimento?:* Ninguno; flujo administrativo completado al 100%.
2. **Wade:**
   - *¿Qué hice ayer?:* Concluí el login de estudiante con emisión de token JWT (`T-006.3`).
   - *¿Qué voy a hacer hoy?:* Trabajar en la autenticación de administrador en dos pasos: login por contraseña y formulario 2FA (`T-003.1`, `T-003.2`).
   - *¿Tengo algún impedimento?:* Ninguno; definiendo la lectura del archivo de hash `auth2-ayd1.txt`.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Terminé la vista y el endpoint para guardar el horario base del tutor (`T-008.1`, `T-008.2`).
   - *¿Qué voy a hacer hoy?:* Validar que la hora inicio sea menor que la hora fin y que los días laborables sean correctos (`T-008.3`).
   - *¿Tengo algún impedimento?:* Ninguno; validaciones del backend listas.
4. **Yury:**
   - *¿Qué hice ayer?:* Diseñé el visualizador de horas disponibles por día (`T-011.2`).
   - *¿Qué voy a hacer hoy?:* Conectar el endpoint `GET /api/tutores/:id/disponibilidad` con el calendario frontend (`T-011.3`).
   - *¿Tengo algún impedimento?:* Ninguno; coordinando con Isai la estructura JSON de la disponibilidad.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Desarrollé la validación de no traslape horario en reservas (`T-012.4`).
   - *¿Qué voy a hacer hoy?:* Maquetar el modal de confirmación y el endpoint para cancelación por parte del estudiante (`T-016.1`, `T-016.2`).
   - *¿Tengo algún impedimento?:* Ninguno; avanzando según lo planificado.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Integré el envío de correo ante cancelación de sesión (`T-018.1`).
   - *¿Qué voy a hacer hoy?:* Pruebas de integración para cancelación de citas por tutor (`T-017.3`).
   - *¿Tengo algún impedimento?:* Ninguno; plantilla probada con éxito.

---

#### Daily 5 — 7 de septiembre de 2026
- **Fecha:** 7 de septiembre de 2026
- **Hora / Duración:** 18 min
- **Evidencia del Tablero:** [`daily5.pdf`](tableros/daily5.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Concluí aprobación de tutores y pruebas del módulo administrativo.
   - *¿Qué voy a hacer hoy?:* Apoyar en la integración de endpoints con el frontend y verificar el cumplimiento de criterios de aceptación de HU-004 y HU-005.
   - *¿Tengo algún impedimento?:* Ninguno; revisando PRs abiertos hacia `develop`.
2. **Wade:**
   - *¿Qué hice ayer?:* Implementé la validación de doble factor con archivo para el administrador (`T-003.3`).
   - *¿Qué voy a hacer hoy?:* Ejecutar pruebas end-to-end locales del 2FA y afinar estilos del login.
   - *¿Tengo algún impedimento?:* Ninguno; el hash valida exactamente contra el secreto configurado.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Concluí la configuración del horario de tutor (`HU-008`).
   - *¿Qué voy a hacer hoy?:* Realizar pruebas cruzadas con el módulo de reservas de Nicole para comprobar la integridad de horarios.
   - *¿Tengo algún impedimento?:* Ninguno; horarios coinciden con exactitud.
4. **Yury:**
   - *¿Qué hice ayer?:* Conecté el catálogo y disponibilidad del tutor (`HU-009`, `HU-011`).
   - *¿Qué voy a hacer hoy?:* Ajustar la paginación del listado de tutores y el feedback visual de carga.
   - *¿Tengo algún impedimento?:* Ninguno; probando con diferentes perfiles de tutor.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Finalicé la programación y cancelación de sesiones por estudiante (`HU-012`, `HU-016`).
   - *¿Qué voy a hacer hoy?:* Validar que la cancelación libere inmediatamente el slot de tiempo para nuevos estudiantes.
   - *¿Tengo algún impedimento?:* Ninguno; verificado en la base de datos.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Concluí pruebas de cancelación por tutor (`HU-017`).
   - *¿Qué voy a hacer hoy?:* Revisar que los correos de cancelación lleguen a bandejas reales y en entorno de prueba.
   - *¿Tengo algún impedimento?:* Ninguno; servidor SMTP respondiendo adecuadamente.

---

#### Daily 6 — 8 de septiembre de 2026
- **Fecha:** 8 de septiembre de 2026
- **Hora / Duración:** 20 min
- **Evidencia del Tablero:** [`daily6_retrospective1.pdf`](tableros/daily6_retrospective1.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Realicé la revisión de calidad cruzada de los módulos administrativos.
   - *¿Qué voy a hacer hoy?:* Trasladar todas las tareas finalizadas a `DONE` en Trello, coordinar el merge final del Sprint 1 en `develop` y moderar la Retrospectiva.
   - *¿Tengo algún impedimento?:* Ninguno; las 13 historias comprometidas cumplen con la Definition of Done.
2. **Wade:**
   - *¿Qué hice ayer?:* Verifiqué el registro, login y 2FA de administrador (`HU-001`, `HU-003`, `HU-006`).
   - *¿Qué voy a hacer hoy?:* Mover mis tareas técnicas a `DONE` y participar en la Retrospectiva 1.
   - *¿Tengo algún impedimento?:* Ninguno; flujo de autenticación 100% operativo.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Verifiqué el registro, login y horarios del tutor (`HU-002`, `HU-007`, `HU-008`).
   - *¿Qué voy a hacer hoy?:* Mover las tareas asignadas a `DONE` y preparar el ambiente para el Sprint 2.
   - *¿Tengo algún impedimento?:* Ninguno; base de datos estable.
4. **Yury:**
   - *¿Qué hice ayer?:* Concluí pruebas de visualización de tutores y horarios (`HU-009`, `HU-011`).
   - *¿Qué voy a hacer hoy?:* Confirmar en QA el funcionamiento integral de la consulta de catálogo y mover los tickets a `DONE`.
   - *¿Tengo algún impedimento?:* Ninguno; todo probado bajo distintas resoluciones de pantalla.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Completé el circuito de agendamiento y cancelación del estudiante (`T-012.1` - `T-012.6`, `T-016.1` - `T-016.4`).
   - *¿Qué voy a hacer hoy?:* Ejecutar el checklist final de reservas en conjunto con el equipo y mover las tareas a `DONE`.
   - *¿Tengo algún impedimento?:* Ninguno; la agenda responde con exactitud a la disponibilidad del tutor.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Cerré la verificación de auditoría en cancelaciones del tutor (`T-017`).
   - *¿Qué voy a hacer hoy?:* Trasladar los tickets correspondientes a `DONE` y participar en la Retrospectiva del Sprint 1.
   - *¿Tengo algún impedimento?:* Ninguno; paquete cerrado y documentado.

---

### 1.1.3 Sprint Retrospective 1 (Fase 1)

- **Fecha:** 8 de septiembre de 2026
- **Hora / Duración:** 11 min
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** [Acceder a Grabación (Google Drive)](https://drive.google.com/drive/folders/1Qv6XXcM7_uXLVQyC7vn3hejGghHMym5P?usp=sharing)
- **Evidencia del Tablero al Cierre:** [`daily6_retrospective1.pdf`](tableros/daily6_retrospective1.pdf)

#### Dinámica Retrospectiva
- **¿Qué funcionó bien durante el Sprint 1?:**
  - La disciplina en el flujo de ramas de Git Flow (`feature/carnet` -> `develop`) evitó colisiones de código.
  - La contenedorización temprana con Docker Compose permitió que todo el equipo trabajara sobre la misma versión de base de datos y backend.
  - La lógica matemática para evitar traslapes horarios quedó sólida y sin fallas lógicas en las pruebas de estrés.
- **¿Qué dificultades o cuellos de botella se presentaron?:**
  - Hubo ajustes iterativos en la configuración de CORS entre los contenedores de React y Node.js al inicio del sprint.
  - La definición exacta de los campos obligatorios del registro de tutor requirió una revisión detallada del enunciado para no omitir el número de identificación.
- **Compromisos y acciones de mejora para el Sprint 2:**
  - Desacoplar las pruebas de endpoints de reportería mediante mocks para que el frontend pueda avanzar en gráficos sin depender de seeds masivos.
  - Redoblar la revisión de los lineamientos heurísticos de Jakob Nielsen en los formularios restantes.
  - Automatizar la plantilla HTML de los correos transaccionales para asegurar responsividad en clientes de correo.

---

## 1.2 Sprint 2 (Fase 1) — Completitud y Reportes

- **Periodo:** Del 8 de septiembre de 2026 al 14 de septiembre de 2026
- **Evidencias del Tablero:** Archivos PDF en el directorio [`tableros/`](tableros/)

---

### 1.2.1 Sprint Planning 2 (Fase 1)

- **Fecha:** 8 de septiembre de 2026
- **Hora / Duración:** 14 min
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** [Acceder a Grabación (Google Drive)](https://drive.google.com/drive/folders/1Qv6XXcM7_uXLVQyC7vn3hejGghHMym5P?usp=sharing)
- **Evidencia del Tablero Kanban:** [`sprint2_planning.pdf`](tableros/sprint2_planning.pdf)

#### Objetivos y Acuerdos de la Sesión
- Definición y compromiso del **Sprint Goal 2**: Implementar el ciclo completo de atención con resumen pedagógico, cancelación con correo SMTP, perfiles editables, baja lógica de usuarios, búsqueda multicriterio y módulo de reportes analíticos.
- Cargar y priorizar las 41 tareas restantes en el Sprint Backlog distribuidas equitativamente entre los 6 integrantes.
- Planificar la entrega final con etiquetado semántico `v1.0.0` sobre la rama `main`.

---

### 1.2.2 Daily Scrums — Sprint 2 (Fase 1)

#### Daily 1 — 9 de septiembre de 2026
- **Fecha:** 9 de septiembre de 2026 | **Duración:** 15 min | **Evidencia:** [`daily7.pdf`](tableros/daily7.pdf)
- **Alvaro Ceballos:** Inició el diseño del módulo para dar de baja a estudiantes (`T-024.1`). Sin bloqueos.
- **Wade:** Maquetó la vista de consulta de perfil de estudiante con campo de email bloqueado (`T-022.1`, `T-022.2`). Sin bloqueos.
- **Isai Patzán:** Verificó la carga y actualización del horario del tutor (`T-019.1` - `T-019.3`). Sin bloqueos.
- **Yury:** Diseñó la interfaz y selectores multicriterio para la búsqueda avanzada de tutores (`T-010.1`, `T-010.2`). Sin bloqueos.
- **Nicole López:** Construyó la vista de sesiones pendientes de atención para el estudiante (`T-013.1`, `T-013.2`). Sin bloqueos.
- **Xavi De León:** Implementó el listado de sesiones pendientes del tutor ordenadas cronológicamente (`T-014.1`, `T-014.2`). Sin bloqueos.

#### Daily 2 — 10 de septiembre de 2026
- **Fecha:** 10 de septiembre de 2026 | **Duración:** 14 min | **Evidencia:** [`daily8.pdf`](tableros/daily8.pdf)
- **Alvaro Ceballos:** Endpoint `PATCH /api/admin/estudiantes/:id/baja` completado con auditoría. Sin bloqueos.
- **Wade:** Formulario de edición de perfil terminado y validado contra mutaciones indebidas. Sin bloqueos.
- **Isai Patzán:** Edición de perfil de tutor con protección de campos estáticos completada (`HU-023`). Sin bloqueos.
- **Yury:** Integración de filtros por materia, años de experiencia y rango etario con debounce. Sin bloqueos.
- **Nicole López:** Visualización de sesiones activas y filtros por estado implementados (`HU-013`). Sin bloqueos.
- **Xavi De León:** Modal interactivo para marcar sesión como atendida con resumen pedagógico obligatorio (`T-015.1`). Sin bloqueos.

#### Daily 3 — 11 de septiembre de 2026
- **Fecha:** 11 de septiembre de 2026 | **Duración:** 16 min | **Evidencia:** [`daily9.pdf`](tableros/daily9.pdf)
- **Alvaro Ceballos:** Gestión y baja lógica de tutores aprobados (`T-025.1`, `T-025.2`). Sin bloqueos.
- **Wade:** Apoyo en pruebas de estrés de los formularios de perfil bajo estándares heurísticos de Nielsen. Sin bloqueos.
- **Isai Patzán:** Pruebas de integración del formulario de actualización horaria del tutor. Sin bloqueos.
- **Yury:** Consultas dinámicas combinadas de búsqueda avanzada funcionando al 100%. Sin bloqueos.
- **Nicole López:** Módulo de historial de sesiones pasadas del estudiante con resumen del tutor (`T-020.1`). Sin bloqueos.
- **Xavi De León:** Endpoint transaccional `POST /api/sesiones/:id/atender` completado con validación de resumen (`T-015.2`). Sin bloqueos.

#### Daily 4 — 12 de septiembre de 2026
- **Fecha:** 12 de septiembre de 2026 | **Duración:** 15 min | **Evidencia:** [`daily10,11.pdf`](tableros/daily10,11.pdf)
- **Alvaro Ceballos:** Consulta analítica SQL para el ranking de tutores con más estudiantes atendidos (`T-026.1`). Sin bloqueos.
- **Wade:** Maquetación de componentes visuales de gráficas y tablas para los reportes administrativos. Sin bloqueos.
- **Isai Patzán:** Validación de no traslape en cambios dinámicos de horarios de tutor. Sin bloqueos.
- **Yury:** Consulta analítica SQL de materia con mayor demanda en tutorías (`T-027.1`). Sin bloqueos.
- **Nicole López:** Historial completo del estudiante con paginación y exportación de información (`T-020.2`). Sin bloqueos.
- **Xavi De León:** Consulta y vista de historial de citas atendidas y canceladas del tutor (`T-021.1`). Sin bloqueos.

#### Daily 5 — 13 de septiembre de 2026
- **Fecha:** 13 de septiembre de 2026 | **Duración:** 17 min | **Evidencia:** [`daily10,11.pdf`](tableros/daily10,11.pdf)
- **Alvaro Ceballos:** Endpoint `GET /api/reportes/tutores-top` y renderizado de gráfico de barras (`T-026.2`, `T-026.3`). Sin bloqueos.
- **Wade:** Revisión de accesibilidad y contraste de colores en todas las vistas del sistema. Sin bloqueos.
- **Isai Patzán:** Verificación de seeds de prueba para poblar base de datos en demostración presencial. Sin bloqueos.
- **Yury:** Endpoint `GET /api/reportes/materias-top` e integración con gráfico circular (`T-027.2`, `T-027.3`). Sin bloqueos.
- **Nicole López:** Validación de casos límite en cancelaciones fuera de horario permitido. Sin bloqueos.
- **Xavi De León:** Notificación por correo con copia al tutor y estudiante tras cierre de sesión (`T-018.2`). Sin bloqueos.

#### Daily 6 — 14 de septiembre de 2026
- **Fecha:** 14 de septiembre de 2026 | **Duración:** 20 min | **Evidencia:** [`daily12_retrospective2.pdf`](tableros/daily12_retrospective2.pdf)
- **Alvaro Ceballos:** Confirmación del traslado de las 91 tareas totales a `DONE`, merge final a `main`, generación del tag semántico `v1.0.0` y moderación de Retrospectiva.
- **Wade:** Revisión del README raíz y verificación de enlaces a la documentación técnica.
- **Isai Patzán:** Verificación del despliegue en Docker Compose con base de datos MySQL e inicialización limpia.
- **Yury:** Verificación de historial de Git bajo convención de Conventional Commits.
- **Nicole López:** Checklist completo de casos de uso y manual de usuario.
- **Xavi De León:** Consolidación de evidencias en PDF y cierre de branch en `develop`.

---

### 1.2.3 Sprint Retrospective 2 (Fase 1)

- **Fecha:** 14 de septiembre de 2026
- **Hora / Duración:** 12 min
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** [Acceder a Grabación (Google Drive)](https://drive.google.com/drive/folders/1Qv6XXcM7_uXLVQyC7vn3hejGghHMym5P?usp=sharing)
- **Evidencia del Tablero al Cierre:** [`daily12_retrospective2.pdf`](tableros/daily12_retrospective2.pdf)

#### Dinámica Retrospectiva
- **Logros:** 91 tareas técnicas completadas en `DONE`, sin tickets bloqueados. Motor transaccional y reportes analíticos operando al 100%.
- **Dificultades:** La sincronización del 2FA con archivo requirió un middleware dedicado. La generación de datos masivos para gráficos demandó tiempo adicional.
- **Conclusiones:** El marco de trabajo Scrumban proporcionó control visual total y permitió cumplir con todos los requerimientos de la Fase 1.

---

# 2. Fase 2 — Ceremonias Scrumban, Actas de Dailies y Cierre de Release

> En la Fase 2 se adaptó el equipo a la nueva distribución técnica (Paquetes A al F) y se incorporaron exigencias de aseguramiento de calidad automatizado (30 pruebas unitarias con Node Test Runner y 6 pruebas End-to-End con Cypress), integración continua con runner de GitHub Actions y despliegue del frontend en la nube con Docker multi-stage.

---

## 2.1 Sprint 1 (Fase 2) — Núcleo de Validación, Planes y CI/CD

- **Periodo:** Del 5 de octubre de 2026 al 12 de octubre de 2026
- **Evidencias del Tablero:** Archivos PDF en el directorio [`tableroFase2/`](tableroFase2/)

---

### 2.1.1 Sprint Planning 1 (Fase 2)

- **Fecha:** 5 de octubre de 2026
- **Hora / Duración:** **1:09:15**
- **Asistentes:** Alvaro Ceballos (Scrum Master), Isai Patzán (Product Owner), Yury, Xavi De León, Wade, Nicole López.
- **Enlace a Grabación:** [Acceder a Grabación (Google Drive)](https://drive.google.com/drive/folders/1QWwwTloNce28EC7Sr9hJwT0NTGPDOz8o?usp=sharing)
- **Evidencia del Tablero Kanban:** [`SprintPlanningIntermedio.pdf`](tableroFase2/SprintPlanningIntermedio.pdf)

#### Objetivos y Acuerdos de la Sesión
1. **Compromiso del Sprint Goal 1 (Fase 2):** Implementar la carga y validación de documentos binarios PDF (carnets de estudiante y CVs de tutor) con visores embebidos, autenticación segura con token alfanumérico vía Mailtrap, el modelo relacional de planes de estudio estructurados, el panel administrativo de moderación de denuncias contra tutores, el cálculo automático de promedios docentes y la automatización del pipeline CI/CD en GitHub Actions Runner.
2. **Desglose del Backlog:** Planificación de 12 Historias de Usuario de **Prioridad Alta (🟥)** (`HU-028` a `HU-039`) divididas en 36 tareas técnicas (`T-028.1` a `T-039.3`) repartidas equitativamente (6 por desarrollador).
3. **Políticas de Flujo y Límites WIP:** Se fijaron los límites estrictos de trabajo en proceso:
   - `IN PROGRESS` $\le 6$ (máximo 1 tarea activa por desarrollador).
   - `TEST/QA` $\le 4$ (validación de pruebas unitarias antes de merge).
   - `DEPLOY` $\le 2$ (integración continua en rama `develop`).
4. **Acuerdo de Infraestructura:** Adopción de la solución sin costo de GitHub Actions Runner (`ubuntu-latest`) con servicios de MySQL 8.0 en memoria para el pipeline de CI/CD.

---

### 2.1.2 Daily Scrums — Sprint 1 (Fase 2)

#### Daily 1 — 6 de octubre de 2026
- **Fecha:** 6 de octubre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`Daily1.pdf`](tableroFase2/Daily1.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Lideré la sesión de Sprint Planning 1 de Fase 2, definí el Sprint Goal 1 y asigné las tarjetas técnicas en Trello para los paquetes A al F.
   - *¿Qué voy a hacer hoy?:* Diseñar el esquema de base de datos relacional para el registro de quejas contra tutores en la tabla `incident_reports` y construir la vista administrativa para listar denuncias (`T-043.1`).
   - *¿Tengo algún impedimento?:* Ninguno por el momento; revisando la tipificación de causales de denuncia según los requerimientos del enunciado.
2. **Wade:**
   - *¿Qué hice ayer?:* Participé en la estimación por tallas de camiseta del Sprint 1 y analicé los contratos de interfaz para visualización de métricas.
   - *¿Qué voy a hacer hoy?:* Estructurar las consultas SQL analíticas agregadas `AVG(rating)` para el cálculo del promedio de calificación de tutores (`T-045.1`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando la compatibilidad de las funciones de agregación en MySQL 8.0.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Definí los criterios de aceptación como Product Owner para las historias de feedback y CI/CD en el Sprint Backlog.
   - *¿Qué voy a hacer hoy?:* Crear la estructura del archivo `.github/workflows/backend-ci-cd.yml` activado en eventos push a `main` para automatizar la integración continua (`T-049.1`).
   - *¿Tengo algún impedimento?:* Ninguno; configurando las variables de entorno básicas para el runner de GitHub Actions.
4. **Yury:**
   - *¿Qué hice ayer?:* Revisé la especificación para la subida de documentos binarios de estudiantes en el proceso de registro (`HU-028`).
   - *¿Qué voy a hacer hoy?:* Adaptar el formulario de registro de estudiantes en React para requerir la foto de perfil obligatoria y el carnet universitario en formato PDF (`T-028.1`).
   - *¿Tengo algún impedimento?:* Ninguno; configurando las restricciones de tipo de archivo `application/pdf` e imágenes en el input HTML.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Analicé el modelo de datos de planes de estudio estructurados y su relación con las sesiones atendidas (`HU-032`).
   - *¿Qué voy a hacer hoy?:* Diseñar el esquema relacional de las tablas `study_plans` y `study_resources` en MySQL asegurando la integridad referencial (`T-032.1`).
   - *¿Tengo algún impedimento?:* Ninguno; coordinando con Isai las llaves foráneas hacia la tabla de sesiones de tutoría.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Revisé los requerimientos del formulario de registro de tutores con adjunto de currículum vítae (`HU-029`).
   - *¿Qué voy a hacer hoy?:* Modificar la vista de registro docente agregando el campo para carga obligatoria del CV en formato PDF (`T-029.1`).
   - *¿Tengo algún impedimento?:* Ninguno; asegurando validación en cliente para rechazar extensiones que no sean `.pdf`.

---

#### Daily 2 — 7 de octubre de 2026
- **Fecha:** 7 de octubre de 2026
- **Hora / Duración:** 14 min
- **Evidencia del Tablero:** [`Daily2.pdf`](tableroFase2/Daily2.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Completé el DDL de `incident_reports` y la tabla frontend de quejas formales (`T-043.1`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el modal administrativo interactivo para resolver quejas contra tutores con opciones de sanción inmediata o desestimación justificada (`T-043.2`).
   - *¿Tengo algún impedimento?:* Ninguno; probando el flujo de confirmación antes de aplicar la resolución.
2. **Wade:**
   - *¿Qué hice ayer?:* Escribí las consultas de agregación para el promedio docente (`T-045.1`).
   - *¿Qué voy a hacer hoy?:* Implementar el endpoint REST `GET /api/reports/tutors-ratings` con soporte de ordenamiento numérico por calificación (`T-045.2`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando el formato de respuesta JSON con redondeo a un decimal.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Configuré el archivo base de workflow en GitHub Actions (`T-049.1`).
   - *¿Qué voy a hacer hoy?:* Programar el job de `Build` en el pipeline para construir y validar la imagen Docker del backend a partir del Dockerfile (`T-049.2`).
   - *¿Tengo algún impedimento?:* Ninguno; validando el cacheo de dependencias de pnpm para reducir los tiempos de compilación.
4. **Yury:**
   - *¿Qué hice ayer?:* Construí el formulario con selector de archivos PDF y foto (`T-028.1`).
   - *¿Qué voy a hacer hoy?:* Implementar el middleware `Multer` en Node.js con almacenamiento persistente en `/uploads/documents/carnets/` usando nombres generados por UUID v4 (`T-028.2`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando la creación automática de directorios si no existen en el servidor.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Creé las migraciones relacionales para `study_plans` y `study_resources` (`T-032.1`).
   - *¿Qué voy a hacer hoy?:* Maquetar el formulario estructurado en el frontend para que el tutor capture dificultades detectadas y agregue recursos pedagógicos dinámicos (`T-032.2`).
   - *¿Tengo algún impedimento?:* Ninguno; diseñando la interfaz dinámica que permite agregar múltiples enlaces y títulos de recursos.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Completé el formulario de registro de tutor con soporte de PDF (`T-029.1`).
   - *¿Qué voy a hacer hoy?:* Configurar el almacenamiento seguro de CVs en `/uploads/documents/cvs/` y crear el endpoint `POST /api/auth/register/tutor` con estado `PENDING` (`T-029.2`, `T-029.3`).
   - *¿Tengo algún impedimento?:* Ninguno; coordinando con Yury el estándar común de nomenclatura de archivos UUID.

---

#### Daily 3 — 8 de octubre de 2026
- **Fecha:** 8 de octubre de 2026
- **Hora / Duración:** 16 min
- **Evidencia del Tablero:** [`Daily3.pdf`](tableroFase2/Daily3.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Terminé el modal de resolución administrativa de denuncias a tutores (`T-043.2`).
   - *¿Qué voy a hacer hoy?:* Implementar el endpoint transaccional `PATCH /api/admin/reports/tutors/:id/resolve` que actualiza el estado a `RESOLVED_BANNED` y cambia el tutor a `DISABLED` (`T-043.3`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando que la transacción de base de datos sea atómica y revierta en caso de error.
2. **Wade:**
   - *¿Qué hice ayer?:* Desplegué el endpoint de ranking de tutores por calificación (`T-045.2`).
   - *¿Qué voy a hacer hoy?:* Diseñar el componente visual de evaluación docente con representación gráfica de estrellas (0 a 5) en el portal estudiantil (`T-045.3`).
   - *¿Tengo algún impedimento?:* Ninguno; implementando la visualización con iconos vectoriales responsivos.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Configuré el job de Build en GitHub Actions (`T-049.2`).
   - *¿Qué voy a hacer hoy?:* Configurar el job de `Test` en el pipeline de GitHub Actions levantando MySQL 8.0 en memoria y ejecutando `npm test` con Node Test Runner (`T-049.3`).
   - *¿Tengo algún impedimento?:* Ninguno; probando los healthchecks del servicio MySQL dentro del runner `ubuntu-latest`.
4. **Yury:**
   - *¿Qué hice ayer?:* Configuré el middleware Multer de carnets estudiantiles (`T-028.2`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el módulo utilitario de tokens criptográficos alfanuméricos de 6 caracteres con expiración de 24 horas (`T-030.1`).
   - *¿Tengo algún impedimento?:* Ninguno; utilizando `crypto.randomBytes` para generar tokens seguros contra colisiones.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Terminé el formulario de planes de estudio estructurados (`T-032.2`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el endpoint transaccional `POST /api/sessions/:id/study-plan` que valida la sesión, cambia el estado a `ATTENDED` y persiste el diagnóstico y recursos (`T-032.3`).
   - *¿Tengo algún impedimento?:* Ninguno; probando la inserción relacional de múltiples recursos vinculados al plan.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Implementé la persistencia y carga de CVs docentes (`T-029.2`, `T-029.3`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el endpoint seguro `GET /api/documents/carnet/:id` con streaming binario y cabeceras `Content-Disposition: inline` (`T-039.1`).
   - *¿Tengo algún impedimento?:* Ninguno; asegurando que las cabeceras permitan la previsualización directa en navegador.

---

#### Daily 4 — 9 de octubre de 2026
- **Fecha:** 9 de octubre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`Daily4.pdf`](tableroFase2/Daily4.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Concluí el endpoint de resolución de quejas y baja automática de tutores (`T-043.3`).
   - *¿Qué voy a hacer hoy?:* Construir la vista de estudiantes aprobados con buscador reactivo por nombre y número de carnet universitario (`T-041.1`).
   - *¿Tengo algún impedimento?:* Ninguno; aplicando debounce a la barra de búsqueda para optimizar peticiones al backend.
2. **Wade:**
   - *¿Qué hice ayer?:* Terminé el componente visual de estrellas para tutores (`T-045.3`).
   - *¿Qué voy a hacer hoy?:* Estructurar la consulta SQL analítica temporal con `DATE_FORMAT` agrupada por semanas y meses para el reporte de sesiones (`T-047.1`).
   - *¿Tengo algún impedimento?:* Ninguno; probando agregaciones por rangos de fecha en MySQL.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Concluí el pipeline CI/CD en GitHub Actions ejecutando build y test en el runner (`T-049.3`).
   - *¿Qué voy a hacer hoy?:* Construir el modal de calificación del tutor desde el historial y validar que la sesión se encuentre en estado `ATTENDED` (`T-035.1`, `T-035.2`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando que no se permita calificar sesiones canceladas o futuras.
4. **Yury:**
   - *¿Qué hice ayer?:* Implementé el generador de tokens criptográficos (`T-030.1`).
   - *¿Qué voy a hacer hoy?:* Configurar el servicio de integración con Mailtrap para el despacho automático de correos de bienvenida con el token visible (`T-030.2`).
   - *¿Tengo algún impedimento?:* Ninguno; validando la entrega en el Sandbox de Mailtrap mediante SMTP autenticado.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Implementé el endpoint transaccional del plan estructurado (`T-032.3`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el endpoint `GET /api/sessions/:id/study-plan` para que el estudiante pueda consultar el diagnóstico y recursos de su sesión (`T-033.1`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando la autorización para que solo el estudiante asignado pueda leer su plan.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Creé el endpoint de streaming de carnet universitario (`T-039.1`).
   - *¿Qué voy a hacer hoy?:* Integrar el visor PDF interactivo embebido (`<iframe>` / PDF.js) en el modal administrativo de aprobación de carnet (`T-039.2`).
   - *¿Tengo algún impedimento?:* Ninguno; asegurando que el visor renderice correctamente tanto en pantallas de escritorio como móviles.

---

#### Daily 5 — 10 de octubre de 2026
- **Fecha:** 10 de octubre de 2026
- **Hora / Duración:** 18 min
- **Evidencia del Tablero:** [`Daily5.pdf`](tableroFase2/Daily5.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Completé la tabla con buscador de estudiantes aprobados (`T-041.1`).
   - *¿Qué voy a hacer hoy?:* Implementar el modal de edición de perfil de estudiante con campo de correo strictly `readonly` y endpoints de actualización (`T-041.2`, `T-041.3`).
   - *¿Tengo algún impedimento?:* Ninguno; asegurando que el backend rechace cualquier intento de mutar el email con código 400.
2. **Wade:**
   - *¿Qué hice ayer?:* Diseñé la consulta analítica temporal de sesiones (`T-047.1`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el endpoint `GET /api/analytics/sessions-timeline` con selectores dinámicos de rango temporal (`T-047.2`).
   - *¿Tengo algún impedimento?:* Ninguno; validando la conversión de fechas UTC a hora local de Guatemala.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Implementé la validación de negocio para ratings (`T-035.2`).
   - *¿Qué voy a hacer hoy?:* Persistir las calificaciones en la tabla `session_ratings` garantizando calificación única por estudiante y cita (`T-035.3`).
   - *¿Tengo algún impedimento?:* Ninguno; creando índice único compuesto sobre `session_id` y `student_id`.
4. **Yury:**
   - *¿Qué hice ayer?:* Conecté el servicio de despacho por Mailtrap (`T-030.2`).
   - *¿Qué voy a hacer hoy?:* Diseñar la plantilla HTML corporativa de bienvenida con logotipo institucional y diseño anti-spam (`T-030.3`).
   - *¿Tengo algún impedimento?:* Ninguno; probando responsividad del HTML en clientes de correo móvil y web.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Implementé el endpoint de consulta de plan de estudio (`T-033.1`).
   - *¿Qué voy a hacer hoy?:* Construir la vista dedicada del plan de estudio en el portal del estudiante con badges de recursos (`T-033.2`).
   - *¿Tengo algún impedimento?:* Ninguno; maquetando badges específicos para PDFs, enlaces de video y ejercicios prácticos.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Integré el visor interactivo de carnet en el modal admin (`T-039.2`).
   - *¿Qué voy a hacer hoy?:* Programar los controladores administrativos para aprobación (`APPROVED`) y rechazo (`REJECTED`) de estudiantes con carnet (`T-039.3`).
   - *¿Tengo algún impedimento?:* Ninguno; probando la actualización de estado y habilitación de login.

---

#### Daily 6 — 11 de octubre de 2026
- **Fecha:** 11 de octubre de 2026
- **Hora / Duración:** 20 min
- **Evidencia del Tablero:** [`Daily6.pdf`](tableroFase2/Daily6.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Completé la edición segura de perfiles estudiantiles y la auditoría de correo bloqueado (`T-041.2`, `T-041.3`).
   - *¿Qué voy a hacer hoy?:* Ejecutar y verificar las pruebas unitarias `PU-11` a `PU-15` (baja lógica, edición segura y resolución de denuncias), verificar el cumplimiento de la DoD del Sprint 1 y preparar la Retrospectiva 1.
   - *¿Tengo algún impedimento?:* Ninguno; las 36 tareas técnicas del Sprint 1 se encuentran en condiciones de cierre.
2. **Wade:**
   - *¿Qué hice ayer?:* Implementé el endpoint de evolución temporal (`T-047.2`).
   - *¿Qué voy a hacer hoy?:* Integrar la gráfica interactiva responsiva (citas atendidas vs canceladas) (`T-047.3`), validar la suite `PU-16` a `PU-20` y mover las tareas a `DONE`.
   - *¿Tengo algún impedimento?:* Ninguno; gráficos funcionando con filtros en tiempo real.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Terminé la persistencia de calificaciones y ratings (`T-035.3`).
   - *¿Qué voy a hacer hoy?:* Validar que el pipeline de GitHub Actions se ejecute en verde sobre la rama `develop`, verificar las pruebas `PU-26` a `PU-30` y mover tarjetas a `DONE`.
   - *¿Tengo algún impedimento?:* Ninguno; pipeline pasando satisfactoriamente.
4. **Yury:**
   - *¿Qué hice ayer?:* Concluí la plantilla HTML corporativa con token en Mailtrap (`T-030.3`).
   - *¿Qué voy a hacer hoy?:* Ejecutar la suite de pruebas unitarias `PU-01` a `PU-05` (hashing, expiración de tokens y subida de carnets), mover mis tickets a `DONE` y participar en la Retrospectiva.
   - *¿Tengo algún impedimento?:* Ninguno; flujo de autenticación y tokenización 100% probado.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Terminé la vista del plan de estudio en el portal estudiantil (`T-033.2`).
   - *¿Qué voy a hacer hoy?:* Implementar el control de autorización para asegurar confidencialidad del plan (`T-033.3`), validar pruebas `PU-21` a `PU-25` y trasladar tickets a `DONE`.
   - *¿Tengo algún impedimento?:* Ninguno; criterios de aceptación de HU-032 y HU-033 completados.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Concluí los controladores de aprobación con visor embebido (`T-039.3`).
   - *¿Qué voy a hacer hoy?:* Validar la suite `PU-06` a `PU-10` (validación de CVs, streaming y gestión de documentos), mover las tareas técnicas a `DONE` y preparar el entorno para el Sprint 2.
   - *¿Tengo algún impedimento?:* Ninguno; módulo de documentos verificado y documentado.

---

### 2.1.3 Sprint Retrospective 1 (Fase 2)

- **Fecha:** 12 de octubre de 2026
- **Hora / Duración:** **12:11**
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** [Acceder a Grabación (Google Drive)](https://drive.google.com/drive/folders/1QWwwTloNce28EC7Sr9hJwT0NTGPDOz8o?usp=sharing)
- **Evidencia del Tablero al Cierre:** [`Daily6.pdf`](tableroFase2/Daily6.pdf)

#### Dinámica Retrospectiva
- **¿Qué funcionó bien durante el Sprint 1 (Fase 2)?:**
  - La incorporación de `Multer` con UUID evitó eficazmente colisiones en la subida masiva de carnets y CVs en PDF.
  - El límite WIP en `IN PROGRESS` ($\le 6$) evitó que los integrantes dispersaran esfuerzos, garantizando la entrega de las 12 historias de alta prioridad.
  - La integración continua en GitHub Actions ejecutó las primeras 30 pruebas unitarias en menos de 15 segundos sin incurrir en costos de infraestructura.
- **¿Qué dificultades se presentaron?:**
  - La visualización embebida de PDFs en navegadores móviles requirió agregar cabeceras `Content-Disposition: inline` explícitas en el servidor Node.js.
  - La validación del formato alfanumérico del token de 6 caracteres requirió pruebas cruzadas entre el backend y la plantilla HTML de Mailtrap.
- **Compromisos y acciones de mejora para el Sprint 2 (Fase 2):**
  - Diseñar tempranamente la plantilla vectorial para la generación de constancias en PDF con firma digital simulada.
  - Configurar con anticipación el Dockerfile multi-stage con `nginx:alpine` para garantizar un empaquetado liviano del frontend.
  - Coordinar la integración de las 6 pruebas E2E con Cypress sobre los flujos críticos de la plataforma.

---

## 2.2 Sprint 2 (Fase 2) — Despliegue Cloud, Constancias, Moderación y Cierre

- **Periodo:** Del 12 de octubre de 2026 al 19 de octubre de 2026
- **Evidencias del Tablero:** Archivos PDF en el directorio [`tableroFase2/`](tableroFase2/)

---

### 2.2.1 Sprint Planning 2 (Fase 2)

- **Fecha:** 12 de octubre de 2026
- **Hora / Duración:** **11:14**
- **Asistentes:** Alvaro Ceballos (Scrum Master), Isai Patzán (Product Owner), Yury, Xavi De León, Wade, Nicole López.
- **Enlace a Grabación:** [Acceder a Grabación (Google Drive)](https://drive.google.com/drive/folders/1QWwwTloNce28EC7Sr9hJwT0NTGPDOz8o?usp=sharing)
- **Evidencia del Tablero Kanban:** [`SprintPlanningFinal.pdf`](tableroFase2/SprintPlanningFinal.pdf)

#### Objetivos y Acuerdos de la Sesión
1. **Compromiso del Sprint Goal 2 (Fase 2):** Completar el flujo de login trifásico con token, el motor de generación y descarga de constancias en PDF, el visor de CV para tutores, el panel de moderación y suspensión de estudiantes infractores, los reportes analíticos de satisfacción y materias críticas, el despliegue del frontend en la nube mediante Docker multi-stage y la aprobación del 100% de las 30 pruebas unitarias y 6 pruebas End-to-End con Cypress.
2. **Desglose del Backlog:** Planificación de 11 Historias de Usuario (10 de Prioridad Media 🟨 y 1 de Prioridad Baja 🟦) (`HU-031` a `HU-050`) distribuidas en 33 tareas técnicas (`T-031.1` a `T-050.3`).
3. **Estrategia de QA Final:** Asegurar la cobertura de pruebas unitarias (`PU-01` a `PU-30`) y las 6 pruebas E2E (`E2E-01` a `E2E-06`) ejecutándose limpiamente antes del merge final a `main`.
4. **Cierre y Lanzamiento:** Planificación de la entrega con el etiquetado semántico de producción: **`v2.0.0`**.

---

### 2.2.2 Daily Scrums — Sprint 2 (Fase 2)

#### Daily 7 — 13 de octubre de 2026
- **Fecha:** 13 de octubre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`Daily7.pdf`](tableroFase2/Daily7.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Lideré la sesión de Sprint Retrospective 1 y el Sprint Planning 2 de Fase 2, comprometiendo las 11 historias de cierre y las 33 tareas técnicas.
   - *¿Qué voy a hacer hoy?:* Diseñar la vista de administración de tutores aprobados con buscador reactivo por nombre y especialidad (`T-042.1`).
   - *¿Tengo algún impedimento?:* Ninguno; reutilizando los patrones de debounce de la tabla de estudiantes.
2. **Wade:**
   - *¿Qué hice ayer?:* Participé en la planificación del Sprint 2 y analicé los algoritmos de satisfacción docente.
   - *¿Qué voy a hacer hoy?:* Construir la consulta SQL agregada para el cálculo de promedios de calificación otorgados por estudiantes (`T-046.1`).
   - *¿Tengo algún impedimento?:* Ninguno; probando fórmulas de ponderación en base de datos.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Definí los criterios de aceptación de los reportes disciplinarios de 4 categorías para tutores y estudiantes.
   - *¿Qué voy a hacer hoy?:* Construir la interfaz modal para el reporte de incidencias contra tutores con las 4 categorías tipificadas del enunciado (`T-036.1`).
   - *¿Tengo algún impedimento?:* Ninguno; configurando los selectores con las causales obligatorias (inasistencia, conducta, contenido, puntualidad).
4. **Yury:**
   - *¿Qué hice ayer?:* Analicé el flujo de validación trifásica de cuenta exigido para el primer inicio de sesión (`HU-031`).
   - *¿Qué voy a hacer hoy?:* Maquetar la vista interactiva de primer login solicitando credenciales de acceso más el token alfanumérico enviado por correo (`T-031.1`).
   - *¿Tengo algún impedimento?:* Ninguno; integrando input de 6 dígitos con formateo automático.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Investigué la librería para renderizado vectorial de documentos PDF en backend (`HU-034`).
   - *¿Qué voy a hacer hoy?:* Instalar e integrar la librería de generación de PDFs en Node.js para maquetar la constancia oficial de tutoría (`T-034.1`).
   - *¿Tengo algún impedimento?:* Ninguno; configurando las fuentes tipográficas y márgenes del documento.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Planifiqué las tareas de dockerización multi-stage y visores embebidos de currículums.
   - *¿Qué voy a hacer hoy?:* Implementar el endpoint seguro de streaming `GET /api/documents/cv/:id` con cabeceras inline para CVs de tutores (`T-040.1`).
   - *¿Tengo algún impedimento?:* Ninguno; aplicando el mismo mecanismo de streaming seguro del carnet.

---

#### Daily 8 — 14 de octubre de 2026
- **Fecha:** 14 de octubre de 2026
- **Hora / Duración:** 14 min
- **Evidencia del Tablero:** [`Daily8.pdf`](tableroFase2/Daily8.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Terminé la vista y buscador de tutores activos (`T-042.1`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el modal de edición de perfil de tutor con campo de correo estrictamente bloqueado y el endpoint para dar de baja lógica a `DISABLED` (`T-042.2`, `T-042.3`).
   - *¿Tengo algún impedimento?:* Ninguno; validando que el correo original se preserve inmutable tanto en frontend como en el controlador backend.
2. **Wade:**
   - *¿Qué hice ayer?:* Desarrollé la consulta de promedios de calificación estudiantil (`T-046.1`).
   - *¿Qué voy a hacer hoy?:* Implementar el endpoint `GET /api/reports/students-ratings` y badges de estrellas en el perfil del estudiante (`T-046.2`, `T-046.3`).
   - *¿Tengo algún impedimento?:* Ninguno; probando la renderización de estrellas fraccionarias.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Construí el modal de reporte contra tutores (`T-036.1`).
   - *¿Qué voy a hacer hoy?:* Implementar validaciones de negocio: aceptar reportes únicamente sobre sesiones concluidas (`ATTENDED`) y persistir en `incident_reports` (`T-036.2`, `T-036.3`).
   - *¿Tengo algún impedimento?:* Ninguno; validando rechazo de reportes duplicados para la misma sesión.
4. **Yury:**
   - *¿Qué hice ayer?:* Maqueté la interfaz de login trifásico (`T-031.1`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el endpoint transaccional `POST /api/auth/verify-token-login` con validación trifásica: credenciales, token válido y estado `APPROVED` (`T-031.2`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando mensajes descriptivos cuando el token ha expirado.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Integré la biblioteca de PDFs en el backend (`T-034.1`).
   - *¿Qué voy a hacer hoy?:* Diseñar la plantilla vectorial institucional de la constancia de tutoría con membrete, logotipo, firmas y datos del estudiante y tutor (`T-034.2`).
   - *¿Tengo algún impedimento?:* Ninguno; maquetando los elementos visuales respetando el formato formal de la universidad.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Implementé el endpoint de streaming de CVs (`T-040.1`).
   - *¿Qué voy a hacer hoy?:* Integrar el visor PDF embebido (`<iframe>`) en el modal administrativo de aprobación de tutores para inspeccionar el currículum vítae (`T-040.2`).
   - *¿Tengo algún impedimento?:* Ninguno; validando renderizado continuo sin forzar descargas locales.

---

#### Daily 9 — 15 de octubre de 2026
- **Fecha:** 15 de octubre de 2026
- **Hora / Duración:** 16 min
- **Evidencia del Tablero:** [`Daily9.pdf`](tableroFase2/Daily9.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Completé la edición protegida y baja lógica de tutores (`T-042.2`, `T-042.3`).
   - *¿Qué voy a hacer hoy?:* Construir el panel administrativo de quejas formales contra estudiantes con desglose de motivos (`T-044.1`).
   - *¿Tengo algún impedimento?:* Ninguno; estructurando la tabla con filtros por fecha y estado de resolución.
2. **Wade:**
   - *¿Qué hice ayer?:* Terminé el endpoint de calificaciones de estudiantes (`T-046.2`, `T-046.3`).
   - *¿Qué voy a hacer hoy?:* Estructurar la consulta SQL analítica que correlaciona materias con cancelaciones recurrentes y franjas horarias críticas (`T-048.1`).
   - *¿Tengo algún impedimento?:* Ninguno; probando agrupaciones por bloques de horario matutino y vespertino.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Implementé las validaciones y persistencia de reportes disciplinarios contra tutores (`T-036.2`, `T-036.3`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el formulario interactivo para calificación del estudiante por parte del tutor al concluir la sesión de tutoría (`T-037.1`, `T-037.2`).
   - *¿Tengo algún impedimento?:* Ninguno; validando que solo el tutor asignado pueda emitir feedback.
4. **Yury:**
   - *¿Qué hice ayer?:* Desarrollé el endpoint de login trifásico (`T-031.2`).
   - *¿Qué voy a hacer hoy?:* Programar la actualización inmediata de la bandera `email_verified = TRUE` en la base de datos tras la validación exitosa del token (`T-031.3`).
   - *¿Tengo algún impedimento?:* Ninguno; verificando que en accesos posteriores ya no se exija token alfanumérico.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Diseñé la plantilla vectorial de la constancia académica (`T-034.2`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el endpoint `GET /api/sessions/:id/certificate` con despacho del PDF generado en streaming binario (`T-034.3`).
   - *¿Tengo algún impedimento?:* Ninguno; probando la descarga directa del archivo con nombre representativo.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Integré el visor de CV en el panel administrativo (`T-040.2`).
   - *¿Qué voy a hacer hoy?:* Programar los controladores de aprobación (`APPROVED`) y rechazo (`REJECTED`) de tutores verificando el CV en visor (`T-040.3`).
   - *¿Tengo algún impedimento?:* Ninguno; asegurando que el estado cambie en la base de datos en tiempo real.

---

#### Daily 10 — 16 de octubre de 2026
- **Fecha:** 16 de octubre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`Daily10.pdf`](tableroFase2/Daily10.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Construí el panel de quejas contra estudiantes (`T-044.1`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el modal administrativo para sanción de estudiantes infractores con suspensión inmediata a estado `DISABLED` (`T-044.2`).
   - *¿Tengo algún impedimento?:* Ninguno; probando la revocación inmediata de tokens de sesión para usuarios dados de baja.
2. **Wade:**
   - *¿Qué hice ayer?:* Escribí la consulta SQL de materias críticas y cancelaciones (`T-048.1`).
   - *¿Qué voy a hacer hoy?:* Desarrollar el endpoint `GET /api/analytics/critical-hours` con selectores de fechas y granularidad (`T-048.2`).
   - *¿Tengo algún impedimento?:* Ninguno; formateando los datos para alimentar gráficos de mapas de calor.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Concluí la calificación de estudiantes por tutores (`T-037.1`, `T-037.2`).
   - *¿Qué voy a hacer hoy?:* Construir el modal y endpoint para reportes disciplinarios contra estudiantes infractores por inasistencia o mala conducta (`T-038.1`, `T-038.2`).
   - *¿Tengo algún impedimento?:* Ninguno; tipificando causales en la tabla de incidencias.
4. **Yury:**
   - *¿Qué hice ayer?:* Concluí el circuito de login trifásico y bandera de verificación (`T-031.3`).
   - *¿Qué voy a hacer hoy?:* Programar la prueba automatizada `E2E-01` en Cypress (Registro Estudiante con Carnet -> Recepción de Token Mailtrap -> Login Trifásico).
   - *¿Tengo algún impedimento?:* Ninguno; probando la intercepción de peticiones de red en Cypress.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Desplegué el endpoint de descarga de constancias en PDF (`T-034.3`).
   - *¿Qué voy a hacer hoy?:* Agregar botón interactivo de descarga de constancia en el historial de sesiones atendidas y estructurar la prueba `E2E-05` en Cypress.
   - *¿Tengo algún impedimento?:* Ninguno; validando que el botón solo aparezca en citas con estado `ATTENDED`.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Finalicé la aprobación de tutores con visor de CV (`T-040.3`).
   - *¿Qué voy a hacer hoy?:* Construir el Dockerfile multi-stage para el frontend con etapa de build React y servidor de producción `nginx:alpine` (`T-050.1`).
   - *¿Tengo algún impedimento?:* Ninguno; configurando las directivas `try_files $uri /index.html;` en el bloque de Nginx.

---

#### Daily 11 — 17 de octubre de 2026
- **Fecha:** 17 de octubre de 2026
- **Hora / Duración:** 18 min
- **Evidencia del Tablero:** [`Daily11.pdf`](tableroFase2/Daily11.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Terminé el modal de sanción y baja a estudiantes infractores (`T-044.2`).
   - *¿Qué voy a hacer hoy?:* Implementar el endpoint transaccional `PATCH /api/admin/reports/students/:id/resolve` y programar la prueba automatizada `E2E-03` en Cypress (Moderación y baja por denuncia).
   - *¿Tengo algún impedimento?:* Ninguno; automatizando la simulación de login de administrador y resolución de denuncia en Cypress.
2. **Wade:**
   - *¿Qué hice ayer?:* Implementé el endpoint de franjas horarias críticas (`T-048.2`).
   - *¿Qué voy a hacer hoy?:* Construir la visualización gráfica de barras y mapa de calor de cancelaciones críticas (`T-048.3`) y programar la prueba `E2E-04` en Cypress.
   - *¿Tengo algún impedimento?:* Ninguno; probando responsividad del chart en el dashboard analítico.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Implementé el reporte disciplinario contra estudiantes (`T-038.1`, `T-038.2`).
   - *¿Qué voy a hacer hoy?:* Implementar la notificación transaccional al tutor tras recibir una nueva reseña (`T-038.3`) y programar la prueba `E2E-06` en Cypress.
   - *¿Tengo algún impedimento?:* Ninguno; integrando la plantilla de correo de reseña con Mailtrap.
4. **Yury:**
   - *¿Qué hice ayer?:* Completé y ejecuté en verde la prueba `E2E-01` en Cypress.
   - *¿Qué voy a hacer hoy?:* Realizar pruebas de estrés sobre la expiración de tokens (rechazo a 24 horas y códigos inválidos) y consolidar la suite de pruebas unitarias.
   - *¿Tengo algún impedimento?:* Ninguno; verificando que los mensajes de error sean claros y amigables.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Integré el botón de descarga en el portal estudiantil y estructuré `E2E-05`.
   - *¿Qué voy a hacer hoy?:* Ejecutar la prueba `E2E-05` en Cypress (Plan estructurado -> Generación de constancia PDF) y comprobar fidelidad tipográfica en navegadores móviles.
   - *¿Tengo algún impedimento?:* Ninguno; constancias generándose con márgenes exactos y sin desbordes.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Construí el Dockerfile multi-stage con Nginx (`T-050.1`).
   - *¿Qué voy a hacer hoy?:* Desplegar el frontend en la nube con URL pública accesible (`T-050.2`, `T-050.3`) y programar la prueba automatizada `E2E-02` en Cypress (Registro tutor con CV -> Visor admin -> Aprobación).
   - *¿Tengo algún impedimento?:* Ninguno; verificando la resolución de nombres y variables de entorno `VITE_API_URL`.

---

#### Daily 12 — 18 de octubre de 2026
- **Fecha:** 18 de octubre de 2026
- **Hora / Duración:** 20 min
- **Evidencia del Tablero:** [`Daily12.pdf`](tableroFase2/Daily12.pdf)

1. **Alvaro Ceballos:**
   - *¿Qué hice ayer?:* Completé y aprobé en verde la prueba `E2E-03` en Cypress, resolviendo la sesión de admin y 2FA con archivo.
   - *¿Qué voy a hacer hoy?:* Auditar el paso de las 69 tareas técnicas a `DONE` en Trello, ejecutar el merge final de `develop` a `main`, generar el tag semántico de producción `v2.0.0` y moderar la Retrospectiva 2 final del proyecto.
   - *¿Tengo algún impedimento?:* Ninguno; checklist de entregables cubierto al 100%.
2. **Wade:**
   - *¿Qué hice ayer?:* Ejecuté con éxito la prueba `E2E-04` en Cypress sobre el dashboard de métricas.
   - *¿Qué voy a hacer hoy?:* Consolidar el compendio de evidencias de las 6 pruebas End-to-End para el documento oficial `docs/Pruebas/pruebas_e2e.md` y mover mis tarjetas a `DONE`.
   - *¿Tengo algún impedimento?:* Ninguno; capturas y videos de Cypress compilados.
3. **Isai Patzán:**
   - *¿Qué hice ayer?:* Ejecuté en verde la prueba `E2E-06` en Cypress sobre el flujo de feedback disciplinario.
   - *¿Qué voy a hacer hoy?:* Verificar que los jobs de `Build`, `Test` y `Deploy` en GitHub Actions pasen al 100% en la rama `main`, consolidar el reporte de las 30 pruebas unitarias y mover tarjetas a `DONE`.
   - *¿Tengo algún impedimento?:* Ninguno; pipeline en verde sin errores de integración.
4. **Yury:**
   - *¿Qué hice ayer?:* Realicé la verificación cruzada de la suite de 30 pruebas unitarias en el backend con `pnpm --prefix backend test`.
   - *¿Qué voy a hacer hoy?:* Validar que todos los commits sigan la convención Conventional Commits, revisar la documentación de requerimientos y participar en la Retrospectiva final.
   - *¿Tengo algún impedimento?:* Ninguno; repositorio limpio y consistente.
5. **Nicole López:**
   - *¿Qué hice ayer?:* Validé la ejecución de `E2E-05` y la descarga de constancias en PDF en múltiples navegadores.
   - *¿Qué voy a hacer hoy?:* Realizar la revisión final del Manual de Usuario ilustrado (`docs/Manuales/manual_usuario.md`) con las nuevas vistas de Fase 2 y mover tareas a `DONE`.
   - *¿Tengo algún impedimento?:* Ninguno; manual completamente documentado.
6. **Xavi De León:**
   - *¿Qué hice ayer?:* Validé la prueba `E2E-02` en Cypress y el despliegue del frontend en la nube con URL pública.
   - *¿Qué voy a hacer hoy?:* Comprobar la disponibilidad de la base de datos con los datos semilla de `backend/init.sql`, consolidar evidencias en PDF y participar en la Retrospectiva 2.
   - *¿Tengo algún impedimento?:* Ninguno; entorno de producción operativo y listo para calificación.

---

### 2.2.3 Sprint Retrospective 2 (Fase 2) y Cierre de Proyecto

- **Fecha:** 19 de octubre de 2026
- **Hora / Duración:** **10:15**
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** [Acceder a Grabación (Google Drive)](https://drive.google.com/drive/folders/1QWwwTloNce28EC7Sr9hJwT0NTGPDOz8o?usp=sharing)
- **Evidencia del Tablero al Cierre:** [`Daily12.pdf`](tableroFase2/Daily12.pdf)

#### Dinámica Retrospectiva y Balance Global del Proyecto
- **¿Qué funcionó bien durante el Sprint 2 (Fase 2)?:**
  - Se completó el 100% del alcance comprometido: 69 tareas técnicas, 23 historias de usuario, 30 pruebas unitarias y 6 pruebas E2E con Cypress sin deuda técnica pendiente.
  - La suite de pruebas de integración continua permitió detectar regresiones a tiempo, garantizando que los módulos de Fase 1 siguieran funcionando intactos.
  - El motor de descarga de constancias en PDF y los visores embebidos resolvieron de punta a punta las demandas documentales y de acreditación académica.
  - La contenedorización multi-stage con Nginx redujo el tamaño final de la imagen del frontend a menos de 30 MB, agilizando el despliegue en la nube.
- **¿Qué dificultades se superaron?:**
  - La prueba E2E del login de administrador requirió automatizar la carga del archivo 2FA (`auth2-ayd1.txt`) mediante comandos forzados de Cypress (`{ force: true }`) y preservación de sesión con `cy.session()`.
  - El balanceo de fechas y horas en las capturas del tablero Trello exigió un script automatizado para reflejar la cronología real de desarrollo.
- **Conclusiones Metodológicas (Scrumban en EduConnect):**
  - La combinación de la estructura iterativa de Scrum (con sus ceremonias de Planning, Dailies y Retrospectivas) con el control visual y límites WIP de Kanban permitió un flujo continuo predecible, colaborativo y sin sobrecarga de trabajo.
  - El equipo logró entregar un sistema robusto, con cobertura de pruebas completa, despliegue cloud desacoplado y documentación exhaustiva, cumpliendo cabalmente con todos los estándares académicos y profesionales exigidos.
  - **Entrega oficial finalizada con el tag de versión: `v2.0.0`**.

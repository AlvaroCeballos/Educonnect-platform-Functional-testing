# Scrum Meetings — Registro de Eventos y Ceremonias (EduConnect)

> Este documento contiene la planificación, registro y seguimiento de todas las ceremonias de Scrum realizadas durante el desarrollo del proyecto **EduConnect**.  
> El ciclo de vida del proyecto se organizó en **2 Sprints de desarrollo**, realizándose en cada uno:
> - **1 sesión de Sprint Planning**
> - **6 sesiones de Daily Scrum**
> - **1 sesión de Sprint Retrospective**

---

## Integrantes del Equipo Scrum
1. **Alvaro Ceballos** — Scrum Master & Desarrollador (Paquete Técnico C)
2. **Wade** — Desarrollador (Paquete Técnico A)
3. **Isai Patzán** — Desarrollador (Paquete Técnico B)
4. **Yury** — Desarrollador (Paquete Técnico D)
5. **Nicole López** — Desarrolladora (Paquete Técnico E)
6. **Xavi De León** — Desarrollador (Paquete Técnico F)

---

# 1. Sprint 1: Núcleo Operativo

- **Periodo:** Del 2 de septiembre de 2026 al 8 de septiembre de 2026
- **Evidencias del Tablero:** Archivos PDF en el directorio [`tableros_f2/`](tableros_f2/)

---

## 1.1 Sprint Planning 1

- **Fecha:** 2 de septiembre de 2026
- **Hora / Duración:** 1:40 min
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** https://drive.google.com/drive/folders/1Qv6XXcM7_uXLVQyC7vn3hejGghHMym5P?usp=sharing
- **Evidencia del Tablero Kanban previo al sprint:** [`sprint1_planning_.pdf`](tableros_f2/sprint1_planning_.pdf)

### Objetivos y Acuerdos de la Sesión
- Definición y compromiso del **Sprint Goal 1**: Implementar el núcleo de autenticación, gestión de cuentas por roles, configuración horaria base, consulta de tutores y el motor de reservas/cancelaciones sin traslapes.
- Desglose inicial del Product Backlog (27 historias) en las primeras 50 tareas técnicas asociadas a los paquetes de trabajo A, B, C, D, E y F.
- Configuración de ramas bajo Git Flow (`main`, `develop`, y `feature/carnet` por cada integrante).

---

## 1.2 Daily Scrums — Sprint 1

### Daily 1 — 3 de septiembre de 2026
- **Fecha:** 3 de septiembre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`daily1.pdf`](tableros_f2/daily1.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Participé en la sesión de Planning y creé el repositorio en GitHub configurando ramas protegidas según Git Flow (`main` y `develop`).
- **¿Qué voy a hacer hoy?:** Diseñar el esquema de base de datos para la gestión de aprobaciones administrativas y crear la estructura base de los endpoints para solicitudes de usuarios (`T-004.1` y `T-004.2`).
- **¿Tengo algún impedimento?:** Ninguno por el momento; entorno local levantado con Docker Compose sin novedades.

#### 2. Wade
- **¿Qué hice ayer?:** Clonavé el repositorio base y definí la estructura modular para el frontend en React con Tailwind CSS.
- **¿Qué voy a hacer hoy?:** Maquetar el formulario interactivo de registro de estudiantes (`T-001.1`), contemplando los campos obligatorios del enunciado.
- **¿Tengo algún impedimento?:** Ninguno; configurando las reglas de validación para campos alfanuméricos.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Coordiné con el equipo el diseño relacional preliminar para las entidades de usuarios y tutores.
- **¿Qué voy a hacer hoy?:** Implementar el script de inicialización de MySQL en Docker (`TECH-001`) con las tablas de tutores, especialidades y tablas de soporte.
- **¿Tengo algún impedimento?:** Ninguno; contenedor de base de datos verificado localmente.

#### 4. Yury
- **¿Qué hice ayer?:** Revisé los requerimientos visuales y el alcance del catálogo público de tutores.
- **¿Qué voy a hacer hoy?:** Estructurar la vista principal del estudiante y preparar el grid de presentación de tarjetas de tutores (`T-009.1`).
- **¿Tengo algún impedimento?:** Ninguno; trabajando en el diseño de las tarjetas informativas (nombre, materia, foto, dirección).

#### 5. Nicole López
- **¿Qué hice ayer?:** Analicé las reglas del motor de reservas para evitar traslapes horarios entre estudiantes y tutores.
- **¿Qué voy a hacer hoy?:** Definir la tabla relacional de sesiones (`T-012.2`) y diagramar el flujo de datos del formulario de reserva (`T-012.1`).
- **¿Tengo algún impedimento?:** Ninguno; coordinando con Isai la estructura de llaves foráneas para las sesiones.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Revisé la especificación del módulo de tutores y el flujo de cancelación de tutorías.
- **¿Qué voy a hacer hoy?:** Maquetar el modal de confirmación para la cancelación de sesiones pendientes del tutor (`T-017.1`).
- **¿Tengo algún impedimento?:** Ninguno; preparando el estado visual del diálogo de confirmación.

---

### Daily 2 — 4 de septiembre de 2026
- **Fecha:** 4 de septiembre de 2026
- **Hora / Duración:** 14 min
- **Evidencia del Tablero:** [`daily2.pdf`](tableros_f2/daily2.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Construí la tabla visual para listar solicitudes pendientes de estudiantes en el frontend (`T-004.1`).
- **¿Qué voy a hacer hoy?:** Desarrollar los endpoints `GET /api/admin/solicitudes` y `PATCH /api/admin/estudiante/:id/estado` para aceptar o rechazar (`T-004.2`).
- **¿Tengo algún impedimento?:** Ninguno; probando respuestas JSON y códigos de estado HTTP.

#### 2. Wade
- **¿Qué hice ayer?:** Concluí el maquetado del formulario de registro de estudiante (`T-001.1`).
- **¿Qué voy a hacer hoy?:** Implementar validaciones de formulario: formato de carnet, teléfono y longitud de contraseña con expresiones regulares (`T-001.2`).
- **¿Tengo algún impedimento?:** Ninguno; validación de complejidad de contraseña lista (8 caracteres, mayúscula, minúscula y número).

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Desplegué el script `TECH-001` en Docker con las tablas relacionales y restricciones de integridad.
- **¿Qué voy a hacer hoy?:** Desarrollar la vista de formulario para el registro de tutores con validación estricta de fotografía obligatoria (`T-002.1`).
- **¿Tengo algún impedimento?:** Ninguno; probando carga en memoria y previsualización de imágenes.

#### 4. Yury
- **¿Qué hice ayer?:** Diseñé el contenedor responsivo de tutores disponibles (`T-009.1`).
- **¿Qué voy a hacer hoy?:** Implementar la lógica para excluir tutores con los cuales el estudiante autenticado ya posee una sesión activa (`T-009.2`).
- **¿Tengo algún impedimento?:** Ninguno; consumiendo endpoint simulado para probar el filtrado dinámico.

#### 5. Nicole López
- **¿Qué hice ayer?:** Apliqué la migración de base de datos para la entidad de sesiones (`T-012.2`).
- **¿Qué voy a hacer hoy?:** Desarrollar el endpoint `POST /api/sesiones` para la creación de solicitudes de tutoría (`T-012.3`).
- **¿Tengo algún impedimento?:** Ninguno; verificando la recepción adecuada de parámetros (fecha, hora, motivo, materia).

#### 6. Xavi De León
- **¿Qué hice ayer?:** Terminé la interfaz del modal de cancelación para tutores (`T-017.1`).
- **¿Qué voy a hacer hoy?:** Construir el controlador del backend para procesar la cancelación y cambiar el estado del registro (`T-017.2`).
- **¿Tengo algún impedimento?:** Ninguno; sincronizando con Nicole el nombre exacto de las columnas de estado en la base de datos.

---

### Daily 3 — 5 de septiembre de 2026
- **Fecha:** 5 de septiembre de 2026
- **Hora / Duración:** 16 min
- **Evidencia del Tablero:** [`daily3.pdf`](tableros_f2/daily3.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Completé el backend para aprobación/rechazo de estudiantes y generé seeds de prueba (`T-004.2` y `T-004.3`).
- **¿Qué voy a hacer hoy?:** Integrar el despacho de correos de resolución al estudiante (`T-004.4`) y maquetar la tabla de tutores pendientes (`T-005.1`).
- **¿Tengo algún impedimento?:** Ninguno; pruebas SMTP locales ejecutadas con éxito.

#### 2. Wade
- **¿Qué hice ayer?:** Terminé las validaciones de entrada (`T-001.2`) y la persistencia de usuarios con cifrado Bcrypt (`T-001.3`).
- **¿Qué voy a hacer hoy?:** Desarrollar la vista de inicio de sesión de estudiante (`T-006.1`) y la verificación de estado "Aprobado" (`T-006.2`).
- **¿Tengo algún impedimento?:** Ninguno; validando el mensaje amigable cuando la cuenta está aún pendiente de revisión.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Implementé validaciones de registro de tutor (`T-002.2`) y almacenamiento seguro de contraseña (`T-002.3`).
- **¿Qué voy a hacer hoy?:** Construir el login de tutor (`T-007.1`, `T-007.2`) y la pantalla para configuración de horario de atención (`T-008.1`).
- **¿Tengo algún impedimento?:** Ninguno; coordinando con Wade la reutilización del componente de hashing en backend.

#### 4. Yury
- **¿Qué hice ayer?:** Conecté el listado de tutores con la exclusión de reservas activas (`T-009.2`).
- **¿Qué voy a hacer hoy?:** Maquetar el componente de visualización de agenda del tutor por fecha seleccionada (`T-011.1` y `T-011.2`).
- **¿Tengo algún impedimento?:** Ninguno; formateando selectores de fecha para consultar slots disponibles.

#### 5. Nicole López
- **¿Qué hice ayer?:** Implementé la recepción y persistencia de reservas (`T-012.3`).
- **¿Qué voy a hacer hoy?:** Programar los algoritmos de validación: comprobar que la fecha esté en días laborables del tutor y verificar horario disponible (`T-012.4`).
- **¿Tengo algún impedimento?:** Ninguno; estructurando la consulta SQL de cruce de rangos horarios.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Concluí la mutación de estado a "Cancelada por el tutor" en base de datos (`T-017.2`).
- **¿Qué voy a hacer hoy?:** Garantizar que el horario cancelado quede libre para otros estudiantes y registrar la traza en auditoría (`T-017.3`).
- **¿Tengo algún impedimento?:** Ninguno; validando la actualización de disponibilidad en tiempo real con Yury.

---

### Daily 4 — 6 de septiembre de 2026
- **Fecha:** 6 de septiembre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`daily4.pdf`](tableros_f2/daily4.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Finalicé la integración del servicio de correo para estudiantes (`T-004.4`) y la tabla de tutores pendientes (`T-005.1`).
- **¿Qué voy a hacer hoy?:** Desarrollar la lógica de resolución para tutores y despacho automático de correo (`T-005.2`, `T-005.3`, `T-005.4`).
- **¿Tengo algún impedimento?:** Ninguno; verificando el formato de correo con la rúbrica del proyecto.

#### 2. Wade
- **¿Qué hice ayer?:** Completé el flujo de autenticación de estudiantes y control de acceso por estado (`T-006.1`, `T-006.2`).
- **¿Qué voy a hacer hoy?:** Implementar la Fase 1 del login de administrador con credenciales predeterminadas (`T-003.1`).
- **¿Tengo algún impedimento?:** Ninguno; preparando la redirección hacia la vista del segundo factor.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Concluí el login de tutor (`T-007.1`, `T-007.2`) y maqueté la vista de horarios (`T-008.1`).
- **¿Qué voy a hacer hoy?:** Validar que el horario sea uniforme y consistente para todos los días hábiles elegidos (`T-008.2`, `T-008.3`).
- **¿Tengo algún impedimento?:** Ninguno; aplicando validaciones en frontend y backend simultáneamente.

#### 4. Yury
- **¿Qué hice ayer?:** Avancé en la consulta visual de horarios ocupados y libres (`T-011.2`).
- **¿Qué voy a hacer hoy?:** Implementar la validación que detecta si el tutor no labora en la fecha consultada (`T-011.3`).
- **¿Tengo algún impedimento?:** Ninguno; agregando indicadores visuales por color para los bloques horarios.

#### 5. Nicole López
- **¿Qué hice ayer?:** Implementé la validación de atención en días válidos del tutor (`T-012.4`).
- **¿Qué voy a hacer hoy?:** Desarrollar la validación estricta de traslapes personales del alumno y bloqueo de doble sesión activa con el mismo tutor (`T-012.5`, `T-012.6`).
- **¿Tengo algún impedimento?:** Ninguno; agregando mensajes de error descriptivos según las heurísticas de Nielsen.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Pasé a QA la cancelación de tutorías (`T-017.1`, `T-017.2`, `T-017.3`).
- **¿Qué voy a hacer hoy?:** Apoyar a Nicole en las pruebas de liberación de horarios en la agenda y revisar casos de borde en base de datos.
- **¿Tengo algún impedimento?:** Ninguno; probando concurrencia de reservas sobre el mismo bloque liberado.

---

### Daily 5 — 7 de septiembre de 2026
- **Fecha:** 7 de septiembre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`daily5.pdf`](tableros_f2/daily5.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Concluí la aprobación de tutores con envío de correo transaccional (`T-005.2`, `T-005.4`).
- **¿Qué voy a hacer hoy?:** Ejecutar pruebas de extremo a extremo de todo el módulo de aprobación y mover las tareas de `HU-004` y `HU-005` a QA.
- **¿Tengo algún impedimento?:** Ninguno; preparando el checklist de integración para el cierre del Sprint 1.

#### 2. Wade
- **¿Qué hice ayer?:** Desarrollé el primer paso del login de administrador (`T-003.1`).
- **¿Qué voy a hacer hoy?:** Programar la segunda autenticación: lectura y verificación criptográfica del archivo `auth2-ayd1.txt` (`T-003.2`, `T-003.3`).
- **¿Tengo algún impedimento?:** Ninguno; validando que el hash del archivo sea distinto al password inicial.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Concluí el registro y persistencia de horarios consistentes (`T-008.2`, `T-008.3`).
- **¿Qué voy a hacer hoy?:** Desarrollar la actualización de horario validando que no existan sesiones activas fuera del nuevo rango (`T-019.1`, `T-019.2`, `T-019.3`).
- **¿Tengo algún impedimento?:** Ninguno; implementando la consulta preventiva de sesiones activas en conflicto.

#### 4. Yury
- **¿Qué hice ayer?:** Finalicé la visualización de horarios ocupados y disponibles por fecha (`T-011.1`, `T-011.2`, `T-011.3`).
- **¿Qué voy a hacer hoy?:** Trasladar las tarjetas de `HU-011` a TEST/QA y realizar pruebas de integración con el formulario de Nicole.
- **¿Tengo algún impedimento?:** Ninguno; interfaz sincronizada con las respuestas del backend.

#### 5. Nicole López
- **¿Qué hice ayer?:** Terminé las validaciones de traslape y mensajes preventivos (`T-012.5`, `T-012.6`).
- **¿Qué voy a hacer hoy?:** Desarrollar la cancelación de sesiones por parte del estudiante y la liberación inmediata de horarios (`T-016.1` a `T-016.4`).
- **¿Tengo algún impedimento?:** Ninguno; validando el diálogo de confirmación antes de anular.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Verifiqué en QA la integridad de la cancelación por parte del tutor (`T-017.1` - `T-017.3`).
- **¿Qué voy a hacer hoy?:** Preparar el set de datos para probar la actualización de horarios de Isai bajo escenarios con tutorías agendadas.
- **¿Tengo algún impedimento?:** Ninguno; entorno Docker estabilizado para pruebas cruzadas.

---

### Daily 6 — 8 de septiembre de 2026
- **Fecha:** 8 de septiembre de 2026
- **Hora / Duración:** 18 min
- **Evidencia del Tablero:** [`daily6_retrospective1.pdf`](tableros_f2/daily6_retrospective1.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Validé la aprobación administrativa de cuentas y los bloqueos de acceso a usuarios no autorizados.
- **¿Qué voy a hacer hoy?:** Verificar el paso de las 50 tarjetas del Sprint 1 a la columna `DONE` y liderar la sesión de Retrospectiva 1.
- **¿Tengo algún impedimento?:** Ninguno; métricas de cobertura del Sprint 1 completadas al 100%.

#### 2. Wade
- **¿Qué hice ayer?:** Culminé el módulo 2FA administrativo con archivo y sesión protegida (`T-003.2`, `T-003.3`).
- **¿Qué voy a hacer hoy?:** Dar el visto bueno a las pruebas unitarias de registro y login de estudiante, pasando mis tarjetas a `DONE`.
- **¿Tengo algún impedimento?:** Ninguno; módulo cerrado y listo para despliegue intermedio.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Finalicé el control de actualización de horarios (`T-019.1` - `T-019.3`) y la vista de perfil de tutor (`T-023.1` - `T-023.3`).
- **¿Qué voy a hacer hoy?:** Documentar las pruebas de configuración horaria y verificar el cierre de mis tickets en `DONE`.
- **¿Tengo algún impedimento?:** Ninguno; validación cruzada con frontend finalizada exitosamente.

#### 4. Yury
- **¿Qué hice ayer?:** Concluí pruebas de visualización de tutores y horarios (`HU-009`, `HU-011`).
- **¿Qué voy a hacer hoy?:** Confirmar en QA el funcionamiento integral de la consulta de catálogo y mover los tickets a `DONE`.
- **¿Tengo algún impedimento?:** Ninguno; todo probado bajo distintas resoluciones de pantalla.

#### 5. Nicole López
- **¿Qué hice ayer?:** Completé el circuito de agendamiento y cancelación del estudiante (`T-012.1` - `T-012.6`, `T-016.1` - `T-016.4`).
- **¿Qué voy a hacer hoy?:** Ejecutar el checklist final de reservas en conjunto con el equipo y mover las tareas a `DONE`.
- **¿Tengo algún impedimento?:** Ninguno; la agenda responde con exactitud a la disponibilidad del tutor.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Cerré la verificación de auditoría en cancelaciones del tutor (`T-017`).
- **¿Qué voy a hacer hoy?:** Trasladar los tickets correspondientes a `DONE` y participar en la Retrospectiva del Sprint 1.
- **¿Tengo algún impedimento?:** Ninguno; paquete cerrado y documentado.

---

## 1.3 Sprint Retrospective 1

- **Fecha:** 8 de septiembre de 2026
- **Hora / Duración:** 11 min
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** https://drive.google.com/drive/folders/1Qv6XXcM7_uXLVQyC7vn3hejGghHMym5P?usp=sharing
- **Evidencia del Tablero al Cierre:** [`daily6_retrospective1.pdf`](tableros_f2/daily6_retrospective1.pdf)

### Dinámica Retrospectiva
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

# 2. Sprint 2: Completitud y Reportes

- **Periodo:** Del 8 de septiembre de 2026 al 14 de septiembre de 2026
- **Evidencias del Tablero:** Archivos PDF en el directorio [`tableros_f2/`](tableros_f2/)

---

## 2.1 Sprint Planning 2

- **Fecha:** 8 de septiembre de 2026
- **Hora / Duración:** 14 min
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** https://drive.google.com/drive/folders/1Qv6XXcM7_uXLVQyC7vn3hejGghHMym5P?usp=sharing
- **Evidencia del Tablero Kanban:** [`sprint2_planning.pdf`](tableros_f2/sprint2_planning.pdf)

### Objetivos y Acuerdos de la Sesión
- Definición y compromiso del **Sprint Goal 2**: Implementar el ciclo completo de atención con resumen pedagógico, cancelación con correo SMTP, perfiles editables, baja lógica de usuarios, búsqueda multicriterio y módulo de reportes analíticos.
- Cargar y priorizar las 41 tareas restantes en el Sprint Backlog distribuidas equitativamente entre los 6 integrantes.
- Planificar la entrega final con etiquetado semántico `v1.0.0` sobre la rama `main`.

---

## 2.2 Daily Scrums — Sprint 2

### Daily 1 — 9 de septiembre de 2026
- **Fecha:** 9 de septiembre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`daily7.pdf`](tableros_f2/daily7.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Planifiqué las tareas del Paquete C para Sprint 2 e inicié el diseño del módulo para dar de baja a estudiantes (`T-024.1`) .
- **¿Qué voy a hacer hoy?:** Desarrollar el endpoint `PATCH /api/admin/estudiantes/:id/baja` para inactivar la cuenta y bloquear accesos (`T-024.2`) .
- **¿Tengo algún impedimento?:** Ninguno; verificando el modal de confirmación antes de ejecutar la baja lógica.

#### 2. Wade
- **¿Qué hice ayer?:** Revisé la especificación para la edición de perfil de estudiante (`HU-022`).
- **¿Qué voy a hacer hoy?:** Maquetar la vista de consulta de perfil (`T-022.1`) y crear el formulario editable bloqueando estrictamente el correo (`T-022.2`) .
- **¿Tengo algún impedimento?:** Ninguno; asegurando el atributo `readOnly` en el campo del correo tanto en frontend como en el backend.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Apoyé la revisión de índices en la base de datos para optimizar las consultas agregadas del sistema.
- **¿Qué voy a hacer hoy?:** Realizar pruebas de consistencia sobre el módulo de horarios y asistir en la preparación de datos para reportes.
- **¿Tengo algún impedimento?:** Ninguno; scripts de migración estabilizados.

#### 4. Yury
- **¿Qué hice ayer?:** Diseñé la distribución de controles para la búsqueda avanzada de tutores (`T-010.1`).
- **¿Qué voy a hacer hoy?:** Programar los selectores dinámicos por materia, años de experiencia, sexo, edad y universidad (`T-010.2`) .
- **¿Tengo algún impedimento?:** Ninguno; aplicando debounce a los inputs para evitar peticiones redundantes.

#### 5. Nicole López
- **¿Qué hice ayer?:** Analicé los requerimientos de visualización de sesiones activas del estudiante (`HU-013`).
- **¿Qué voy a hacer hoy?:** Construir la vista de sesiones pendientes de atención (`T-013.1`) y su endpoint de consulta autenticado (`T-013.2`) .
- **¿Tengo algún impedimento?:** Ninguno; consumiendo el token JWT del estudiante para filtrar sus sesiones.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Estructuré el flujo para listar las tutorías pendientes desde la perspectiva del tutor (`HU-014`).
- **¿Qué voy a hacer hoy?:** Implementar el listado de sesiones pendientes ordenadas por fecha más próxima (`T-014.1`, `T-014.2`) .
- **¿Tengo algún impedimento?:** Ninguno; ordenamiento `ORDER BY fecha ASC, hora ASC` probado en MySQL.

---

### Daily 2 — 10 de septiembre de 2026
- **Fecha:** 10 de septiembre de 2026
- **Hora / Duración:** 14 min
- **Evidencia del Tablero:** [`daily8.pdf`](tableros_f2/daily8.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Concluí el endpoint de inactivación de estudiantes (`T-024.2`) y la notificación de baja (`T-024.3`).
- **¿Qué voy a hacer hoy?:** Desarrollar la interfaz y API para dar de baja a tutores activos (`T-025.1`, `T-025.2`, `T-025.3`).
- **¿Tengo algún impedimento?:** Ninguno; probando que el tutor dado de baja no pueda autenticarse de nuevo.

#### 2. Wade
- **¿Qué hice ayer?:** Implementé la vista y formulario editable de perfil de estudiante (`T-022.1`, `T-022.2`).
- **¿Qué voy a hacer hoy?:** Programar validaciones de actualización y re-cifrado de contraseña si el usuario decide cambiarla (`T-022.3`, `T-022.4`).
- **¿Tengo algún impedimento?:** Ninguno; controlando que contraseñas vacías no sobreescriban el hash existente.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Validé la estructura de almacenamiento de reportes y agregaciones en la base de datos.
- **¿Qué voy a hacer hoy?:** Apoyar a Alvaro en la optimización de las consultas SQL para el ranking de tutores con más atenciones (`T-026.1`).
- **¿Tengo algún impedimento?:** Ninguno; probando agrupaciones `COUNT()` y filtros de estado "Atendida".

#### 4. Yury
- **¿Qué hice ayer?:** Conecté los selectores de búsqueda avanzada con el backend (`T-010.2`).
- **¿Qué voy a hacer hoy?:** Implementar la lógica de filtros combinables en frontend y botón de limpieza de filtros (`T-010.3`, `T-010.4`).
- **¿Tengo algún impedimento?:** Ninguno; asegurando que al resetear vuelva a mostrar todo el catálogo.

#### 5. Nicole López
- **¿Qué hice ayer?:** Implementé la lista de sesiones activas (`T-013.1`, `T-013.2`).
- **¿Qué voy a hacer hoy?:** Agregar ordenamiento por fecha y estado visual cuando no hay tutorías activas (`T-013.3`, `T-013.4`), e iniciar historial (`T-020.1`).
- **¿Tengo algún impedimento?:** Ninguno; agregando ilustraciones y mensajes amigables para estados vacíos.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Terminé el listado ordenado de sesiones pendientes del tutor (`T-014.1`, `T-014.2`).
- **¿Qué voy a hacer hoy?:** Desarrollar el modal "Atender estudiante" exigiendo obligatoriamente el resumen de la tutoría (`T-015.1`, `T-015.2`).
- **¿Tengo algún impedimento?:** Ninguno; aplicando validación para no permitir texto en blanco en el resumen.

---

### Daily 3 — 11 de septiembre de 2026
- **Fecha:** 11 de septiembre de 2026
- **Hora / Duración:** 16 min
- **Evidencia del Tablero:** [`daily9.pdf`](tableros_f2/daily9.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Finalicé el módulo de baja de tutores (`T-025.1` - `T-025.3`) .
- **¿Qué voy a hacer hoy?:** Construir la consulta y API para el Reporte 1: tutores con más estudiantes atendidos (`T-026.1`, `T-026.2`) .
- **¿Tengo algún impedimento?:** Ninguno; integrando la respuesta con datos agregados en formato JSON.

#### 2. Wade
- **¿Qué hice ayer?:** Concluí la persistencia y validaciones del perfil del estudiante (`T-022.3`, `T-022.4`) .
- **¿Qué voy a hacer hoy?:** Pasar `T-022` a TEST/QA y revisar la aplicación de las heurísticas de Jakob Nielsen en las pantallas del estudiante .
- **¿Tengo algún impedimento?:** Ninguno; elaborando el borrador del documento de heurísticas UX.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Diseñé el query de agrupación para el reporte de tutores destacados (`T-026.1`) .
- **¿Qué voy a hacer hoy?:** Apoyar a Yury en la construcción de la consulta agregada para el Reporte 2 de materias con mayor demanda (`T-027.1`) .
- **¿Tengo algún impedimento?:** Ninguno; verificando conteo de tutorías solicitadas por asignatura.

#### 4. Yury
- **¿Qué hice ayer?:** Concluí la interfaz de filtros combinables y estados vacíos (`T-010.3`, `T-010.4`) .
- **¿Qué voy a hacer hoy?:** Ejecutar casos de prueba para filtros complejos (`T-010.5`) y crear el query del reporte de materias (`T-027.1`) .
- **¿Tengo algún impedimento?:** Ninguno; validando la combinación simultánea de 5 filtros.

#### 5. Nicole López
- **¿Qué hice ayer?:** Terminé la vista de sesiones activas (`T-013.3`, `T-013.4`) y la pantalla de historial (`T-020.1`) .
- **¿Qué voy a hacer hoy?:** Implementar la consulta del historial con distinción visual de estados y renderizado del resumen (`T-020.2`, `T-020.3`, `T-020.4`) .
- **¿Tengo algún impedimento?:** Ninguno; badges de color configurados para "Atendido", "Cancelado por alumno" y "Cancelado por tutor".

#### 6. Xavi De León
- **¿Qué hice ayer?:** Implementé el formulario para ingresar resumen de sesión (`T-015.1`, `T-015.2`) .
- **¿Qué voy a hacer hoy?:** Programar la persistencia del resumen y actualización a estado "Atendida" (`T-015.3`, `T-015.4`), e iniciar plantilla de correo de cancelación (`T-018.1`) .
- **¿Tengo algún impedimento?:** Ninguno; verificando que la sesión atendida desaparezca inmediatamente de pendientes.

---

### Daily 4 — 12 de septiembre de 2026
- **Fecha:** 12 de septiembre de 2026
- **Hora / Duración:** 15 min
- **Evidencia del Tablero:** [`daily10,11.pdf`](tableros_f2/daily10,11.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Desarrollé el endpoint de métricas y ranking de tutores (`T-026.2`) .
- **¿Qué voy a hacer hoy?:** Maquetar el componente visual con gráfico de barras y tabla resumen para el administrador (`T-026.3`) .
- **¿Tengo algún impedimento?:** Ninguno; integrando biblioteca de gráficos en el frontend.

#### 2. Wade
- **¿Qué hice ayer?:** Completé pruebas de validación sobre el perfil del estudiante en entorno Docker .
- **¿Qué voy a hacer hoy?:** Redactar la sección del Manual de Usuario correspondiente al registro, autenticación y perfil del estudiante.
- **¿Tengo algún impedimento?:** Ninguno; capturando pantallas reales de la plataforma para los manuales.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Verifiqué la precisión de los cálculos estadísticos en la base de datos para ambos reportes .
- **¿Qué voy a hacer hoy?:** Elaborar la documentación del Manual Técnico enfocada en el esquema de base de datos y scripts de despliegue.
- **¿Tengo algún impedimento?:** Ninguno; exportando diagramas ER actualizados.

#### 4. Yury
- **¿Qué hice ayer?:** Concluí pruebas de búsqueda avanzada (`T-010.5`) y la consulta del reporte de materias (`T-027.1`) .
- **¿Qué voy a hacer hoy?:** Desarrollar el endpoint y componente gráfico del Reporte de materias con mayor demanda (`T-027.2`, `T-027.3`) .
- **¿Tengo algún impedimento?:** Ninguno; estructurando gráfico interactivo con porcentajes y totales.

#### 5. Nicole López
- **¿Qué hice ayer?:** Completé la visualización del historial del estudiante con el resumen de la tutoría (`T-020.1` - `T-020.4`) .
- **¿Qué voy a hacer hoy?:** Mover `HU-013` y `HU-020` a `DONE` y redactar la guía de uso de reservas para el manual de usuario .
- **¿Tengo algún impedimento?:** Ninguno; pruebas de visualización superadas con éxito.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Finalicé la marcación de sesiones como atendidas (`T-015.3`, `T-015.4`) y redacté la plantilla de correo de cancelación (`T-018.1`) .
- **¿Qué voy a hacer hoy?:** Conectar la cancelación del tutor con el envío automático de correo de disculpa (`T-018.2`, `T-018.3`) .
- **¿Tengo algún impedimento?:** Ninguno; verificando entrega exitosa y formato de datos en bandeja de entrada.

---

### Daily 5 — 13 de septiembre de 2026
- **Fecha:** 13 de septiembre de 2026
- **Hora / Duración:** 17 min
- **Evidencia del Tablero:** [`daily10,11.pdf`](tableros_f2/daily10,11.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Concluí el Reporte 1 con gráfico de barras interactivo (`T-026.3`) .
- **¿Qué voy a hacer hoy?:** Supervisar las pruebas de integración final de todos los módulos en el ambiente local con Docker Compose.
- **¿Tengo algún impedimento?:** Ninguno; coordinando la consolidación de la documentación técnica en Markdown.

#### 2. Wade
- **¿Qué hice ayer?:** Avancé en la redacción del manual de usuario para el rol estudiante.
- **¿Qué voy a hacer hoy?:** Consolidar el documento de las 6 heurísticas de Jakob Nielsen con capturas de pantalla de EduConnect.
- **¿Tengo algún impedimento?:** Ninguno; seleccionados: visibilidad de estado, prevención de errores, consistencia, control de usuario, reconocimiento y estética minimalista.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Redacté las secciones de arquitectura de datos y variables de entorno del manual técnico.
- **¿Qué voy a hacer hoy?:** Verificar que el archivo `docker-compose.yml` levante limpiamente frontend, backend y base de datos con un solo comando.
- **¿Tengo algún impedimento?:** Ninguno; validado en contenedores limpios sin volúmenes residuales.

#### 4. Yury
- **¿Qué hice ayer?:** Implementé el Reporte 2 de materias con mayor demanda (`T-027.2`, `T-027.3`) .
- **¿Qué voy a hacer hoy?:** Mover los reportes analíticos a TEST/QA y apoyar en la revisión de estilo UI global .
- **¿Tengo algún impedimento?:** Ninguno; métricas coherentes con la base de datos de prueba.

#### 5. Nicole López
- **¿Qué hice ayer?:** Validé la visualización correcta de historial y sesiones activas en navegadores móviles y de escritorio.
- **¿Qué voy a hacer hoy?:** Realizar pruebas funcionales cruzadas simulando reservas y cancelaciones masivas.
- **¿Tengo algún impedimento?:** Ninguno; todos los escenarios de traslape responden adecuadamente.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Verifiqué el despacho del correo transaccional de disculpa por cancelación (`T-018.2`, `T-018.3`) .
- **¿Qué voy a hacer hoy?:** Desarrollar la vista de historial de sesiones del tutor con filtros por estado (`T-021.1`, `T-021.2`, `T-021.3`) .
- **¿Tengo algún impedimento?:** Ninguno; consumiendo endpoint con token de sesión de tutor.

---

### Daily 6 — 14 de septiembre de 2026
- **Fecha:** 14 de septiembre de 2026
- **Hora / Duración:** 20 min
- **Evidencia del Tablero:** [`daily12_retrospective2.pdf`](tableros_f2/daily12_retrospective2.pdf)

#### 1. Alvaro Ceballos
- **¿Qué hice ayer?:** Verifiqué que las tareas de reportes analíticos y bajas lógicas cumplieran los criterios de aceptación.
- **¿Qué voy a hacer hoy?:** Confirmar el paso de las 91 tareas totales a la columna `DONE` en Trello, ejecutar el merge a `main`, generar el tag `v1.0.0` y liderar la Retrospectiva 2.
- **¿Tengo algún impedimento?:** Ninguno; entregable final en tiempo y forma.

#### 2. Wade
- **¿Qué hice ayer?:** Concluí la redacción del manual de usuario y la justificación de principios de Nielsen.
- **¿Qué voy a hacer hoy?:** Revisar el README principal en la raíz del repositorio y comprobar enlaces relativos hacia la documentación.
- **¿Tengo algún impedimento?:** Ninguno; enlaces validados en GitHub.

#### 3. Isai Patzán
- **¿Qué hice ayer?:** Completé el manual técnico con la guía de despliegue mediante Docker Compose.
- **¿Qué voy a hacer hoy?:** Ejecutar una prueba limpia de clonación y levantamiento con `docker-compose up` desde cero en un ambiente aislado.
- **¿Tengo algún impedimento?:** Ninguno; contenedores levantando en menos de 90 segundos.

#### 4. Yury
- **¿Qué hice ayer?:** Pasé a `DONE` el módulo de búsqueda avanzada y el reporte analítico de materias (`HU-010`, `HU-027`).
- **¿Qué voy a hacer hoy?:** Verificar que los commits individuales en develop sigan la convención de Conventional Commits (`feat:`, `fix:`, `docs:`).
- **¿Tengo algún impedimento?:** Ninguno; historial de Git validado y limpio.

#### 5. Nicole López
- **¿Qué hice ayer?:** Completé la guía de pruebas del estudiante y verifiqué la carga de prototipos de interfaz en Markdown.
- **¿Qué voy a hacer hoy?:** Participar en la sesión de Retrospectiva final y validar que el archivo `auth2-ayd1.txt` cumpla con el formato exacto requerido.
- **¿Tengo algún impedimento?:** Ninguno; checklist de entregables cubierto al 100%.

#### 6. Xavi De León
- **¿Qué hice ayer?:** Culminé el historial del tutor (`T-021.1` - `T-021.3`) y verifiqué el paso a `DONE` de todos los tickets del módulo tutor.
- **¿Qué voy a hacer hoy?:** Integrar los links de las grabaciones de video en la documentación y participar en la Retrospectiva del Sprint 2.
- **¿Tengo algún impedimento?:** Ninguno; todas las evidencias en orden y compartidas.

---

## 2.3 Sprint Retrospective 2

- **Fecha:** 14 de septiembre de 2026
- **Hora / Duración:** 9:30 p.m. / 12 min
- **Asistentes:** Alvaro Ceballos, Wade, Isai Patzán, Yury, Nicole López, Xavi De León.
- **Enlace a Grabación:** https://drive.google.com/drive/folders/1Qv6XXcM7_uXLVQyC7vn3hejGghHMym5P?usp=sharing
- **Evidencia del Tablero al Cierre:** [`daily12_retrospective2.pdf`](tableros_f2/daily12_retrospective2.pdf)

### Dinámica Retrospectiva
- **¿Qué funcionó bien durante el Sprint 2?:**
  - Se alcanzaron las 91 tareas técnicas completadas en `DONE`, sin tickets bloqueados ni deuda técnica pendiente.
  - La comunicación bidireccional entre backend y frontend permitió integrar los gráficos analíticos y el motor de correo en tiempos récord.
  - Las validaciones preventivas implementadas en UI/UX cumplieron cabalmente con los principios de Jakob Nielsen seleccionados.
- **¿Qué dificultades se identificaron en la fase final?:**
  - La sincronización de estados para la prueba del 2FA con archivo requirió crear un middleware específico para controlar sesiones intermedias.
  - La generación de datos masivos para poblar los gráficos de barras y tablas exigió tiempo adicional de testing con seeds.
- **Conclusiones globales del proceso de desarrollo Scrumban:**
  - El marco de trabajo SCRUM, complementado con las 5 columnas del tablero Kanban (`TO-DO`, `BLOCKED`, `IN PROGRESS`, `TEST/QA`, `DEPLOY`), brindó trazabilidad y transparencia absoluta en el avance individual y grupal.
  - Se aseguró el cumplimiento integral de los requisitos de eliminación de la rúbrica (Dockerización completa, base de datos relacional operativa con passwords cifrados, Git Flow con tags semánticos y 12 dailies documentados con progresión real).
  - El sistema **EduConnect** se encuentra completamente operativo y listo para la defensa y calificación presencial.
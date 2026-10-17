# Sprint Backlog — Planificación y Asignación de Tareas (EduConnect)

> El **Sprint Backlog** es el conjunto de elementos del Product Backlog seleccionados para ser desarrollados durante un Sprint, junto con el plan para entregar el incremento de producto y alcanzar el **Sprint Goal**.
> 
> En este documento se presentan los dos ciclos de desarrollo del proyecto **EduConnect**. Las tareas técnicas detalladas y sus responsables asignados se gestionan en el tablero Kanban, mientras que los criterios de aceptación y especificaciones funcionales completas residen en el [Product Backlog](historias_usuario.md).

---

# Fase 1

## Sprint 1: Núcleo Operativo

- **Periodo de Ejecución:** Del 2 de septiembre de 2026 al 8 de septiembre de 2026
- **Duración:** 1 semana de desarrollo (1 sesión de Planning, 6 Daily Scrums y 1 Retrospectiva)
- **Carga de Trabajo:** 13 Historias de Usuario y 50 Tareas Técnicas

### Sprint Goal 1

> Implementar el núcleo de autenticación, gestión de cuentas por roles, configuración horaria base, consulta de tutores y el motor transaccional de reservas y cancelaciones sin traslapes horarios, asegurando la persistencia cifrada y la contenedorización con Docker Compose.

### Descripción del Sprint Backlog

Durante el Sprint 1 se priorizaron e implementaron todas las historias de usuario con **prioridad alta (🟥)**. Este conjunto abarcó las capacidades estructurales y críticas de EduConnect:
1. **Infraestructura Base:** Despliegue de MySQL, backend en Node.js y frontend en React con Docker Compose (`TECH-001`).
2. **Identidad y Autenticación:** Registro de estudiante y tutor, validaciones seguras con hashing Bcrypt, inicio de sesión condicionado al estado de aprobación y login de administrador protegido con 2FA mediante archivo `auth2-ayd1.txt`.
3. **Administración Inicial:** Flujos de aprobación y rechazo de estudiantes y tutores con notificaciones por correo electrónico transaccional vía SMTP.
4. **Agendamiento Base:** Definición de horarios laborales de tutores, catálogo de tutores disponibles (excluyendo aquellos con citas activas previas), agenda de disponibilidad en tiempo real y motor de reservación con validación matemática de traslapes horarios.

---

### Historias de Usuario Abordadas en el Sprint 1

| Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad | Estimación (T-Shirt) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **HU-001** | Registro de estudiante | Katheryn / Wade | A | 🟥 ALTA | **XS** |
| **HU-002** | Registro de tutor | Isai Patzán | B | 🟥 ALTA | **XS** |
| **HU-003** | Autenticación de administrador en dos pasos | Katheryn / Wade | A | 🟥 ALTA | **M** |
| **HU-004** | Aprobar o rechazar registro de estudiante | Alvaro Ceballos | C | 🟥 ALTA | **S** |
| **HU-005** | Aprobar o rechazar registro de tutor | Alvaro Ceballos | C | 🟥 ALTA | **M** |
| **HU-006** | Inicio de sesión de estudiante | Katheryn / Wade | A | 🟥 ALTA | **S** |
| **HU-007** | Inicio de sesión de tutor | Isai Patzán | B | 🟥 ALTA | **S** |
| **HU-008** | Establecer horario de atención | Isai Patzán | B | 🟥 ALTA | **M** |
| **HU-009** | Visualizar tutores disponibles | Yury | D | 🟥 ALTA | **S** |
| **HU-011** | Consultar horarios y disponibilidad del tutor | Yury | D | 🟥 ALTA | **M** |
| **HU-012** | Programar sesión de tutoría | Nicole López | E | 🟥 ALTA | **M** |
| **HU-016** | Cancelar sesión por el estudiante | Nicole López | E | 🟥 ALTA | **S** |
| **HU-017** | Cancelar sesión por el tutor | Xavi De León | F | 🟥 ALTA | **S** |

---

### Distribución de Tareas Técnicas del Sprint 1 (50 Tareas)

Las 50 tareas técnicas desarrolladas y cerradas en la columna `DONE` durante este sprint se dividieron entre los paquetes de trabajo de la siguiente forma:

* **Infraestructura y Datos (1 tarea):** `TECH-001` (Inicialización de tablas, índices y credenciales predeterminadas de MySQL en Docker).
* **Paquete A — Identidad y 2FA (11 tareas):** `T-001.1` a `T-001.4` (Registro Estudiante), `T-003.1` a `T-003.3` (2FA con archivo `auth2-ayd1.txt`), `T-006.1` a `T-006.4` (Login Estudiante y restricciones de acceso).
* **Paquete B — Tutor e Inicio (10 tareas):** `T-002.1` a `T-002.4` (Registro Tutor con foto obligatoria), `T-007.1` a `T-007.3` (Login Tutor), `T-008.1` a `T-008.3` (Configuración horaria homogénea).
* **Paquete C — Gestión Administrativa (8 tareas):** `T-004.1` a `T-004.4` (Aprobación Estudiantes con envío de correo), `T-005.1` a `T-005.4` (Aprobación Tutores con envío de correo).
* **Paquete D — Catálogo y Disponibilidad (6 tareas):** `T-009.1` a `T-009.3` (Catálogo con exclusión de activas), `T-011.1` a `T-011.3` (Consulta de disponibilidad por slots).
* **Paquete E — Reservas y Cancelación Estudiante (10 tareas):** `T-012.1` a `T-012.6` (Formulario, API, cruce de agendas y motor anti-traslapes), `T-016.1` a `T-016.4` (Cancelación con liberación inmediata de horarios).
* **Paquete F — Cancelación Tutor (4 tareas):** `T-017.1` a `T-017.4` (Modal de cancelación, actualización de estado y trazabilidad en base de datos).

---

# Fase 2

## Sprint 2: Completitud, Gestión y Reportes

- **Periodo de Ejecución:** Del 8 de septiembre de 2026 al 14 de septiembre de 2026
- **Duración:** 1 semana de desarrollo (1 sesión de Planning, 6 Daily Scrums y 1 Retrospectiva)
- **Carga de Trabajo:** 14 Historias de Usuario y 41 Tareas Técnicas (Total acumulado: 91 tareas)

### Sprint Goal 2

> Implementar el ciclo completo de atención con resumen pedagógico, cancelación con correo SMTP de disculpa, edición de perfiles, baja lógica de usuarios, búsqueda multicriterio y módulo de reportes analíticos de demanda y tutorías atendidas.

### Descripción del Sprint Backlog

En el Sprint 2 se abordaron las 14 historias restantes clasificadas como **prioridad media (🟨)** y **prioridad baja (🟦)**, orientadas a la experiencia de usuario, auditoría pedagógica, analítica de datos y cierre técnico:
1. **Atención y Notificaciones Pedagógicas:** Modal interactivo para marcar tutorías como atendidas exigiendo resumen del contenido visto (`HU-015`) y despacho de correos transaccionales con motivo de cancelación y disculpa (`HU-018`).
2. **Descubrimiento Avanzado:** Buscador de tutores con filtros combinables y dinámicos por curso/materia, años de experiencia, género, edad y universidad (`HU-010`).
3. **Mantenimiento de Perfiles y Cuentas:** Consulta y actualización de datos de estudiantes y tutores (`HU-022`, `HU-023`) protegiendo el correo institucional como campo no editable, y control de bajas lógicas con bloqueo de sesión inmediata (`HU-024`, `HU-025`).
4. **Historial de Sesiones:** Vistas de seguimiento histórico y sesiones activas para estudiante (`HU-013`, `HU-020`) y tutor (`HU-014`, `HU-021`), mostrando badges de estado y el resumen registrado por el tutor.
5. **Reportes Analíticos de Decisión:** Reporte administrativo de tutores con más estudiantes atendidos con exportación a CSV/PDF (`HU-026`) y Reporte de materias con mayor demanda académica (`HU-027`).

---

### Historias de Usuario Abordadas en el Sprint 2

| Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad | Estimación (T-Shirt) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **HU-010** | Búsqueda avanzada de tutores | Yury | D | 🟨 MEDIA | **L** |
| **HU-013** | Visualizar sesiones activas del estudiante | Nicole López | E | 🟨 MEDIA | **S** |
| **HU-014** | Visualizar sesiones pendientes del tutor | Xavi De León | F | 🟨 MEDIA | **S** |
| **HU-015** | Marcar sesión como atendida | Xavi De León | F | 🟨 MEDIA | **S** |
| **HU-020** | Consultar historial de sesiones del estudiante | Nicole López | E | 🟨 MEDIA | **S** |
| **HU-021** | Consultar historial de sesiones del tutor | Xavi De León | F | 🟨 MEDIA | **S** |
| **HU-022** | Ver y actualizar perfil del estudiante | Katheryn / Wade | A | 🟨 MEDIA | **XS** |
| **HU-023** | Ver y actualizar perfil del tutor | Isai Patzán | B | 🟨 MEDIA | **XS** |
| **HU-024** | Administrar estudiantes aprobados | Alvaro Ceballos | C | 🟨 MEDIA | **M** |
| **HU-025** | Administrar tutores aprobados | Alvaro Ceballos | C | 🟨 MEDIA | **M** |
| **HU-018** | Notificar por correo la cancelación del tutor | Xavi De León | F | 🟦 BAJA | **M** |
| **HU-019** | Actualizar horario de atención | Isai Patzán | B | 🟦 BAJA | **M** |
| **HU-026** | Reporte de tutores con más estudiantes atendidos | Alvaro Ceballos | C | 🟦 BAJA | **S** |
| **HU-027** | Reporte de materia con mayor demanda | Yury | D | 🟦 BAJA | **S** |

---

### Distribución de Tareas Técnicas del Sprint 2 (41 Tareas)

Las 41 tareas técnicas planificadas y concluidas durante el Sprint 2 se estructuraron de la siguiente manera:

* **Paquete A — Perfil de Estudiante (4 tareas):** `T-022.1` a `T-022.4` (Vista, formulario con correo bloqueado, recifrado condicional de contraseña y pruebas).
* **Paquete B — Perfil y Horario de Tutor (7 tareas):** `T-019.1` a `T-019.3` (Actualización de rango horario validando ausencia de citas previas fuera del bloque), `T-023.1` a `T-023.4` (Perfil editable del tutor).
* **Paquete C — Bajas Lógicas y Reporte 1 (9 tareas):** `T-024.1` a `T-024.3` (Baja lógica estudiante), `T-025.1` a `T-025.3` (Baja lógica tutor), `T-026.1` a `T-026.3` (Consulta agregada, API y exportación a CSV/PDF del ranking de tutores).
* **Paquete D — Búsqueda Avanzada y Reporte 2 (8 tareas):** `T-010.1` a `T-010.5` (Controles multicriterio, debounce, filtros combinables, limpieza y QA), `T-027.1` a `T-027.3` (Consulta agrupada, endpoint y gráficos interactivos de materias).
* **Paquete E — Sesiones Activas e Historial Estudiante (6 tareas):** `T-013.1` a `T-013.3` (Listado ordenado de sesiones activas y estados vacíos), `T-020.1` a `T-020.3` (Historial con badges de estado y visualización del resumen de la tutoría).
* **Paquete F — Atención, Historial y Correo Tutor (7 tareas):** `T-014.1` a `T-014.2` (Listado de pendientes del tutor), `T-015.1` a `T-015.2` (Modal de atención con resumen obligatorio), `T-018.1` a `T-018.2` (Plantilla HTML y despacho de correo de disculpa), `T-021.1` a `T-021.3` (Historial con filtrado y detalles).

---

## Resumen Global del Product Backlog y Cumplimiento

| Métrica | Sprint 1 (Fase 1) | Sprint 2 (Fase 2) | Total Proyecto |
| :--- | :---: | :---: | :---: |
| **Historias de Usuario** | 13 (100% Alta 🟥) | 14 (10 Media 🟨 + 4 Baja 🟦) | **27 HUs** |
| **Tareas Técnicas** | 50 tareas | 41 tareas | **91 tareas** |
| **Tallas Consensuadas** | 2 XS, 6 S, 5 M | 2 XS, 6 S, 5 M, 1 L | **4 XS, 12 S, 10 M, 1 L** |
| **Tareas en DONE** | 50 (100%) | 41 (100%) | **91 (100%)** |
| **Tareas Bloqueadas (BLOCKED)** | 0 | 0 | **0** |
| **Deuda Técnica Pendiente** | 0% | 0% | **0%** |

---

# Actualización vigente — Fase 2, Sprint 1, Paquete F

La distribución actualizada de Fase 2 redefine el alcance de Isai para este Sprint 1. El trabajo activo se limita a las historias HU-035 y HU-049; HU-036, HU-037, HU-038 y el despliegue final de CI/CD se mantienen en el Sprint 2.

| Historia | Tarea | Responsable | Prioridad | Estado de implementación |
| :--- | :--- | :--- | :---: | :---: |
| HU-035 | T-035.1 — Formulario de calificación | Isai | 🟥 Alta | Implementada |
| HU-035 | T-035.2 — Validación de sesión atendida y estrellas 0–5 | Isai | 🟥 Alta | Implementada |
| HU-035 | T-035.3 — Persistencia y consulta de calificaciones | Isai | 🟥 Alta | Implementada |
| HU-049 | T-049.1 — Workflow de Build | Isai | 🟥 Alta | Implementada |
| HU-049 | T-049.2 — Workflow de Test | Isai | 🟥 Alta | Implementada |
| HU-049 | T-049.3 — Deploy en `main` | Isai | 🟥 Alta | En progreso |

## Evidencia técnica del cierre parcial

- Backend: `npm test` ejecutado con 32 pruebas exitosas.
- Frontend: `npm run build` ejecutado correctamente.
- Workflow: `.github/workflows/backend-ci-cd.yml` contiene los jobs secuenciales `build` y `test`.
- Bloqueo de integración: la validación funcional completa de HU-035 requiere sesiones `ATTENDED` disponibles en la base de datos; la API ya valida ese estado y no bloquea el desarrollo del pipeline.

## Verificación actual — Sprint 2, Paquete B (Isai)

La distribución vigente asigna a Isai las historias **HU-019** y **HU-023** durante el Sprint 2. La base funcional ya se encontraba integrada en `develop`; en esta iteración se verificó el alcance, se reforzó la validación reutilizable del perfil y se agregó cobertura específica para los criterios de aceptación.

| Historia | Tarea | Evidencia verificada | Estado |
| :--- | :--- | :--- | :---: |
| HU-019 | T-019.1 — Cargar y editar horario | `GET/PUT /api/tutors/me/schedules` y formulario de edición | Verificada |
| HU-019 | T-019.2 — Detectar conflictos con sesiones pendientes | Rechazo `409` si una cita `PENDING` queda fuera del nuevo rango | Verificada |
| HU-019 | T-019.3 — Persistir horario válido | Transacción que desactiva el horario anterior y guarda los nuevos días | Verificada |
| HU-023 | T-023.1 — Consultar perfil del tutor | `GET /api/tutors/me/profile` con correo de solo lectura | Verificada |
| HU-023 | T-023.2 — Actualizar datos profesionales | `PUT /api/tutors/me/profile` con campos permitidos y persistencia | Verificada |
| HU-023 | T-023.3 — Proteger correo y contraseña | Correo inmutable y contraseña validada antes de aplicar hash | Verificada |
| HU-023 | T-023.4 — Pruebas de validación | `tutorProfileValidation.test.js` cubre datos válidos, correo, campos obligatorios y contraseña | Implementada |

### Resultado de verificación

- Backend: **61 pruebas exitosas**.
- Frontend: build de producción exitoso después de instalar las dependencias declaradas en `frontend/package-lock.json`.
- Integración: merge realizado en `develop` mediante el commit `0955b3b` (`merge: integrar sprint 2 de isai`).
- Trello: `T-019.1–T-019.3` y `T-023.1–T-023.3` verificados en la lista `DONE`.
- Bloqueo funcional restante: la prueba end-to-end con MySQL depende de levantar la instancia local; no bloquea las pruebas unitarias ni la compilación.

## Verificación actual — Sprint 2, Paquete F (Isai)

La revisión directa del tablero y del repositorio confirmó que las tarjetas `T-036.1–T-036.3`,
`T-037.1–T-037.3` y `T-038.1–T-038.3` no eran únicamente un atraso visual: antes de esta rama
no existían las rutas ni las vistas completas para reportes disciplinarios y calificación tutor→estudiante.

| Historia | Tareas | Evidencia de avance | Estado |
| :--- | :--- | :--- | :---: |
| HU-036 | T-036.1–T-036.3 | Formulario estudiante, catálogo, validación de sesión `ATTENDED` y persistencia `incident_reports` | En progreso |
| HU-037 | T-037.1–T-037.3 | Formulario tutor, validación 0–5 y separación de calificaciones por `reviewer_role` | En progreso |
| HU-038 | T-038.1–T-038.3 | Formulario tutor, catálogo, validación de sesión `ATTENDED` y persistencia `incident_reports` | En progreso |

La implementación se desarrolla en la rama `sprint2/isai-hu036-hu037-hu038` a partir de `develop`.
La validación funcional con datos reales requiere ejecutar la migración de Fase 2 y disponer de sesiones `ATTENDED`.

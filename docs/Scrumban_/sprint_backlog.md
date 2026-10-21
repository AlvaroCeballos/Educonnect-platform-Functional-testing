# Sprint Backlog — Planificación y Asignación de Tareas (EduConnect)

> El **Sprint Backlog** es el conjunto de elementos del Product Backlog seleccionados para ser desarrollados durante un Sprint, junto con el plan para entregar el incremento de producto y alcanzar el **Sprint Goal**.
> 
> En este documento se presentan los ciclos de desarrollo del proyecto **EduConnect**, estructurado formalmente en dos grandes fases metodológicas:
> - **Parte 1 (Fase 1 del Proyecto):** Núcleo operativo y gestión académica inicial (Sprint 1 y Sprint 2 históricos).
> - **Parte 2 (Fase 2 del Proyecto):** Validación documental estricta, visores embebidos, planes estructurados, moderación, analítica avanzada, CI/CD y despliegue cloud (Sprint 1 y Sprint 2 vigentes).
>
> Las especificaciones de criterios de aceptación residen en el [Product Backlog](historias_usuario.md) y el seguimiento visual en [listaTareas.md](listaTareas.md) y [tablero_kanban.md](tablero_kanban.md).

---

# 1. Fase 1 — Núcleo Operativo y Gestión Inicial

## 1.1 Sprint 1 (Fase 1) — Núcleo Operativo

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

## 1.2 Sprint 2 (Fase 1) — Completitud, Gestión y Reportes

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

## Resumen Global de Fase 1 y Cumplimiento

| Métrica | Sprint 1 (Fase 1) | Sprint 2 (Fase 1) | Total Fase 1 |
| :--- | :---: | :---: | :---: |
| **Historias de Usuario** | 13 (100% Alta 🟥) | 14 (10 Media 🟨 + 4 Baja 🟦) | **27 HUs** |
| **Tareas Técnicas** | 50 tareas | 41 tareas | **91 tareas** |
| **Tallas Consensuadas** | 2 XS, 6 S, 5 M | 2 XS, 6 S, 5 M, 1 L | **4 XS, 12 S, 10 M, 1 L** |
| **Tareas en DONE** | 50 (100%) | 41 (100%) | **91 (100%)** |
| **Tareas Bloqueadas (BLOCKED)** | 0 | 0 | **0** |
| **Deuda Técnica Pendiente** | 0% | 0% | **0%** |

---

# 2. Fase 2 — Validación Documental, Planes, Moderación, CI/CD y Cloud

> La **Fase 2 de EduConnect** amplía integralmente la plataforma con flujos de alta exigencia académica, regulatoria y arquitectónica.
> Organizada en dos Sprints sucesivos conducentes a la entrega final el **19 de octubre de 2026**:
> - **Sprint 1 (Prioridad ALTA 🟥):** Núcleo de validación documental, token por correo, planes estructurados y pipeline CI/CD.
> - **Sprint 2 (Prioridad MEDIA 🟨 / BAJA 🟦):** Despliegue en la nube, constancias PDF, moderación, reportes analíticos y cierre de calidad.

---

## 2.1 Sprint 1 (Fase 2) — Núcleo de Validación, Planes y CI/CD

- **Periodo de Ejecución:** Del 28 de septiembre de 2026 al 8 de octubre de 2026
- **Duración:** 1 semana y media de desarrollo (1 sesión de Sprint Planning 1, 6 sesiones de Daily Scrum y 1 Sprint Retrospective 1)
- **Carga de Trabajo:** 12 Historias de Usuario (100% Prioridad Alta 🟥) y 36 Tareas Técnicas (`T-028.1` a `T-049.3`)

### Sprint Goal 1 (Fase 2)

> Integrar el registro con documentos PDF (carnet y CV), la validación de cuentas por token temporal vía correo electrónico institucional (Mailtrap), los visores embebidos de carnets, la edición protegida de perfiles y resolución de denuncias contra tutores, el registro obligatorio de planes de estudio estructurados con recursos dinámicos, el reporte de evolución temporal de tutorías, las calificaciones base de tutores y la configuración del pipeline automatizado de CI/CD (Build y Test) en GitHub Actions.

### Descripción del Sprint Backlog 1 (Fase 2)

Durante el Sprint 1 de Fase 2 se implementó el conjunto crítico de historias que habilitan la nueva arquitectura del sistema:
1. **Identidad y Tokens (Paquete A):** Registro obligatorio de estudiante con foto y carnet en PDF (`HU-028`), y motor utilitario de generación de tokens alfanuméricos de 6 caracteres con despacho automático por SMTP vía Mailtrap (`HU-030`).
2. **Perfil Docente y Visores PDF (Paquete B):** Registro de tutores con CV en PDF (`HU-029`), y módulo administrativo de aprobación con visor interactivo embebido sin forzar descarga (`HU-039`).
3. **Moderación Inicial y Cuentas (Paquete C):** Padrón de edición de estudiantes aprobados con correo inmutable y baja lógica a `DISABLED` (`HU-041`), y panel de denuncias contra tutores con resolución sancionatoria o desestimación (`HU-043`).
4. **Métricas y Análisis Temporal (Paquete D):** Reporte agregado de promedios de calificación de tutores (`HU-045`), y Reporte Analítico 1 de evolución temporal de citas con gráficos interactivos (`HU-047`).
5. **Planes Estructurados (Paquete E):** Formulario obligatorio para que el tutor registre dificultades y $N$ recursos dinámicos al atender (`HU-032`), y vista dedicada para que el estudiante consulte su plan asignado (`HU-033`).
6. **Feedback y CI/CD (Paquete F):** Calificación de tutores en sesiones atendidas (`HU-035`), y creación del workflow automatizado en GitHub Actions `.github/workflows/backend-ci-cd.yml` para Build y Test (`HU-049`).

---

### Historias de Usuario Abordadas en el Sprint 1 (Fase 2)

| Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad | Estimación (T-Shirt) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **HU-028** | Registro de estudiante con foto reciente y carnet PDF obligatorios | Yury | A | 🟥 ALTA | **M** |
| **HU-030** | Generación de token y despacho automático de correo desde EduConnect | Yury | A | 🟥 ALTA | **M** |
| **HU-029** | Registro de tutor con CV en PDF obligatorio | Xavi | B | 🟥 ALTA | **M** |
| **HU-039** | Aprobación de estudiantes con visor PDF embebido | Xavi | B | 🟥 ALTA | **M** |
| **HU-041** | Edición de perfil de estudiantes (correo bloqueado) y baja lógica | Alvaro Ceballos | C | 🟥 ALTA | **S** |
| **HU-043** | Panel y resolución de denuncias contra tutores | Alvaro Ceballos | C | 🟥 ALTA | **M** |
| **HU-045** | Reporte y cálculo de promedio de tutores en estrellas | Wade | D | 🟥 ALTA | **XS** |
| **HU-047** | Reporte Analítico 1: Evolución temporal de tutorías (semana/mes) | Wade | D | 🟥 ALTA | **L** |
| **HU-032** | Formulario estructurado de atención con dificultades y recursos dinámicos | Nicole López | E | 🟥 ALTA | **L** |
| **HU-033** | Módulo de visualización del plan de estudio estructurado por el estudiante | Nicole López | E | 🟥 ALTA | **M** |
| **HU-035** | Calificación del tutor por estudiante en sesión atendida | Isai Patzán | F | 🟥 ALTA | **S** |
| **HU-049** | Configuración del workflow de CI/CD para backend en GitHub Actions | Isai Patzán | F | 🟥 ALTA | **L** |

---

### Distribución de Tareas Técnicas del Sprint 1 (Fase 2) (36 Tareas)

* **Paquete A — Identidad y Tokens (6 tareas):**
  * `T-028.1`: Formulario frontend de registro de estudiante con carga de imagen y carnet PDF.
  * `T-028.2`: Middleware backend `Multer` con validación estricta de MIME `application/pdf` y tamaño $\le$ 5MB.
  * `T-028.3`: Endpoint `POST /api/auth/register/student` con persistencia en tabla `users` en estado `PENDING`.
  * `T-030.1`: Módulo criptográfico utilitario de generación de tokens alfanuméricos (6 caracteres, expiración 24 hrs).
  * `T-030.2`: Configuración del servicio transaccional SMTP con Nodemailer y credenciales Mailtrap Sandbox.
  * `T-030.3`: Plantilla institucional HTML de correo de bienvenida con token visible y diseño anti-spam.
* **Paquete B — CV Tutor y Visor Estudiantes (6 tareas):**
  * `T-029.1`: Formulario de registro de tutor con validación de foto y carga de currículum vítae en PDF.
  * `T-029.2`: Middleware de subida con almacenamiento en disco persistente y nombres basados en UUID v4.
  * `T-029.3`: Endpoint `POST /api/auth/register/tutor` con persistencia de especialidades docentes y estado `PENDING`.
  * `T-039.1`: Endpoint seguro de streaming de documentos `GET /api/documents/carnet/:id` con cabeceras inline.
  * `T-039.2`: Componente interactivo de visor PDF embebido (`<iframe>` / PDF.js) en el modal de aprobación.
  * `T-039.3`: Controladores administrativos de aprobación (`APPROVED`) y rechazo (`REJECTED`) de estudiantes.
* **Paquete C — Gestión de Estudiantes y Denuncias a Tutores (6 tareas):**
  * `T-041.1`: Tabla administrativa de estudiantes aprobados con buscador reactivo por carnet o nombre.
  * `T-041.2`: Modal de edición de perfil con campo de correo electrónico strictly bloqueado (`readonly`).
  * `T-041.3`: Endpoints `PUT /api/admin/students/:id` (rechazo 400 a mutación de email) y `PATCH .../status` (baja a `DISABLED`).
  * `T-043.1`: Panel administrativo de quejas formales contra tutores con desglose de causal y partes.
  * `T-043.2`: Modal de resolución administrativa con acciones de sanción o desestimación justificada.
  * `T-043.3`: Endpoint transaccional `PATCH /api/admin/reports/tutors/:id/resolve` (baja a tutor infractor y `RESOLVED_BANNED`).
* **Paquete D — Métricas y Evolución Temporal (6 tareas):**
  * `T-045.1`: Consulta SQL agregada con `AVG(rating)` para promedios de calificación docente.
  * `T-045.2`: Endpoint REST `GET /api/reports/tutors-ratings` con soporte de ordenamiento numérico.
  * `T-045.3`: Interfaz de tabla de evaluación docente con representación gráfica de estrellas (0-5).
  * `T-047.1`: Consulta analítica temporal con `DATE_FORMAT` y agrupamiento por semanas y meses.
  * `T-047.2`: Endpoint `GET /api/analytics/sessions-timeline` con selectores de granularidad y rangos de fecha.
  * `T-047.3`: Gráfico interactivo responsivo (Chart.js / Recharts) con curvas de citas atendidas vs canceladas.
* **Paquete E — Planes Estructurados y Atención (6 tareas):**
  * `T-032.1`: Modelo relacional y migraciones para las tablas `study_plans` y `study_resources`.
  * `T-032.2`: Formulario estructurado de atención con campo obligatorio de dificultades y recursos dinámicos.
  * `T-032.3`: Endpoint transaccional `POST /api/sessions/:id/study-plan` (transición a `ATTENDED` y guardado relacional).
  * `T-033.1`: Endpoint `GET /api/sessions/:id/study-plan` para consulta de diagnósticos y recursos asignados.
  * `T-033.2`: Vista dedicada del plan de estudio en el portal estudiantil con badges por tipo de recurso.
  * `T-033.3`: Control de acceso y autorización para asegurar confidencialidad del plan entre estudiante y tutor.
* **Paquete F — Feedback y Pipeline CI/CD (6 tareas):**
  * `T-035.1`: Modal de calificación del tutor desde el historial de citas (estrellas 0 a 5 y comentario).
  * `T-035.2`: Validaciones de negocio: sesión en estado `ATTENDED`, verificación de autoría y calificación única.
  * `T-035.3`: Persistencia en tabla `session_ratings` e integración visual inmediata en el historial.
  * `T-049.1`: Definición de workflow `.github/workflows/backend-ci-cd.yml` activado en eventos push a `main`.
  * `T-049.2`: Job de `Build` automatizado con Dockerfile del backend y verificación de empaquetado.
  * `T-049.3`: Job de `Test` con runner de GitHub Actions (`ubuntu-latest`) ejecutando suite de pruebas unitarias.

---

## 2.2 Sprint 2 (Fase 2) — Despliegue Cloud, Constancias, Moderación y Cierre

- **Periodo de Ejecución:** Del 9 de octubre de 2026 al 19 de octubre de 2026
- **Duración:** 1 semana y media de desarrollo (1 sesión de Sprint Planning 2, 6 sesiones de Daily Scrum, 1 Retrospectiva 2 y Cierre en `main`)
- **Carga de Trabajo:** 11 Historias de Usuario (10 Media 🟨, 1 Baja 🟦), 33 Tareas Técnicas (`T-031.1` a `T-050.3`), suite de 30 Pruebas Unitarias (`PU-01` a `PU-30`) y 6 Pruebas E2E (`E2E-01` a `E2E-06`)

### Sprint Goal 2 (Fase 2)

> Completar el flujo de autenticación trifásica con token, el visor embebido de CV para tutores, la suspensión y edición de perfiles docentes, el panel y resolución de denuncias contra estudiantes, el motor de generación y descarga de constancias en PDF, el sistema de retroalimentación bidireccional (ratings y reportes disciplinarios de 4 categorías), los reportes analíticos de materias críticas y cancelaciones, el despliegue del frontend en la nube mediante Docker multi-stage y la suite integral de pruebas con cierre en la rama main.

### Descripción del Sprint Backlog 2 (Fase 2)

En el Sprint 2 de Fase 2 se completaron las capacidades de cierre técnico y aseguramiento de calidad de EduConnect:
1. **Autenticación Trifásica (Paquete A):** Primer inicio de sesión con validación obligatoria de token y estado `APPROVED`, marcando `email_verified = TRUE` (`HU-031`).
2. **Visor de CV y Despliegue Cloud Frontend (Paquete B):** Visor integrado para currículums de tutores (`HU-040`), y dockerización multi-stage (`nginx:alpine`) con despliegue en la nube mediante URL pública accesible (`HU-050`).
3. **Control Docente y Moderación de Estudiantes (Paquete C):** Padrón de tutores activos con edición segura y baja lógica (`HU-042`), y panel de denuncias contra estudiantes con suspensión inmediata (`HU-044`).
4. **Métricas Estudiantiles y Franjas Críticas (Paquete D):** Promedios de desempeño en estrellas para estudiantes (`HU-046`), y Reporte Analítico 2 correlacionando cancelaciones y horarios de mayor demanda (`HU-048`).
5. **Generador Vectorial de Constancias (Paquete E):** Motor de maquetación institucional y descarga directa de constancias oficiales de tutoría en formato PDF con firma y membrete (`HU-034`).
6. **Régimen Disciplinario y Calificación Docente (Paquete F):** Reportes disciplinarios contra tutores con 4 categorías tipificadas (`HU-036`), evaluación del estudiante por el tutor tras la sesión (`HU-037`), y reportes contra estudiantes infractores (`HU-038`).
7. **Aseguramiento de Calidad:** Verificación de las 30 pruebas unitarias (`PU-01` a `PU-30`) y ejecución de las 6 pruebas end-to-end con Cypress (`E2E-01` a `E2E-06`).

---

### Historias de Usuario Abordadas en el Sprint 2 (Fase 2)

| Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad | Estimación (T-Shirt) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **HU-031** | Primer inicio de sesión trifásico (credenciales + token + admin) | Yury | A | 🟨 MEDIA | **M** |
| **HU-040** | Aprobación de tutores con visor PDF embebido | Xavi | B | 🟨 MEDIA | **M** |
| **HU-050** | Dockerfile multi-stage y despliegue del frontend en nube | Xavi | B | 🟨 MEDIA | **L** |
| **HU-042** | Edición de perfil de tutores (correo bloqueado) y baja lógica | Alvaro Ceballos | C | 🟨 MEDIA | **S** |
| **HU-044** | Panel y resolución de denuncias contra estudiantes | Alvaro Ceballos | C | 🟨 MEDIA | **M** |
| **HU-046** | Reporte y cálculo de promedio de estudiantes en estrellas | Wade | D | 🟨 MEDIA | **XS** |
| **HU-048** | Reporte Analítico 2: Materias con cancelaciones y franjas horarias críticas | Wade | D | 🟦 BAJA | **L** |
| **HU-034** | Motor de generación y descarga de constancia oficial de tutoría en PDF | Nicole López | E | 🟨 MEDIA | **M** |
| **HU-036** | Reporte disciplinario contra tutores con 4 categorías | Isai Patzán | F | 🟨 MEDIA | **M** |
| **HU-037** | Calificación de estudiante por tutor tras la sesión | Isai Patzán | F | 🟨 MEDIA | **S** |
| **HU-038** | Reporte disciplinario contra estudiantes con 4 categorías | Isai Patzán | F | 🟨 MEDIA | **S** |

---

### Distribución de Tareas Técnicas del Sprint 2 (Fase 2) (33 Tareas)

* **Paquete A — Primer Login y Activación (3 tareas):**
  * `T-031.1`: Interfaz de Login adaptativa para solicitar token de 6 caracteres en primer acceso.
  * `T-031.2`: Endpoint de validación dual (coincidencia de token y estado de aprobación administrativa `APPROVED`).
  * `T-031.3`: Transición definitiva a `email_verified = TRUE` y habilitación de login estándar subsecuente.
* **Paquete B — Visor de CV y Frontend Cloud (6 tareas):**
  * `T-040.1`: Visor PDF embebido integrado en la vista de revisión de postulaciones de tutores.
  * `T-040.2`: Endpoint de lectura segura de CVs `GET /api/documents/cv/:id` con cabeceras de visualización.
  * `T-040.3`: Controladores administrativos de aprobación y rechazo de tutores con despacho de correo.
  * `T-050.1`: Creación del `Dockerfile` multi-stage para el frontend y configuración de `nginx.conf` (rutas SPA).
  * `T-050.2`: Despliegue del contenedor del frontend en proveedor cloud con certificado SSL y URL pública.
  * `T-050.3`: Parametrización de variables de entorno de producción (`VITE_API_URL`) y pruebas de conectividad.
* **Paquete C — Edición de Tutores y Denuncias de Estudiantes (6 tareas):**
  * `T-042.1`: Panel de gestión de tutores aprobados con filtros por materia, carnet y estado.
  * `T-042.2`: Modal de actualización de especialidades y datos del tutor con correo inmutable (`readonly`).
  * `T-042.3`: Endpoints `PUT /api/admin/tutors/:id` y `PATCH .../status` (baja lógica a `DISABLED` y ocultamiento de horarios).
  * `T-044.1`: Vista administrativa de denuncias interpuestas contra estudiantes por mala conducta.
  * `T-044.2`: Modal interactivo de resolución disciplinaria con opción de sanción inmediata o desestimación.
  * `T-044.3`: Endpoint `PATCH /api/admin/reports/students/:id/resolve` (suspensión a `DISABLED` y `RESOLVED_BANNED`).
* **Paquete D — Promedios de Estudiantes y Análisis de Cancelaciones (6 tareas):**
  * `T-046.1`: Consulta SQL agregada para promediar calificaciones recibidas por estudiantes en tutorías.
  * `T-046.2`: Endpoint `GET /api/reports/students-ratings` con soporte de paginación y ordenamiento.
  * `T-046.3`: Tabla interactiva de reputación estudiantil con filtros y visualización de estrellas.
  * `T-048.1`: Consulta multidimensional que correlaciona tasas de deserción y demanda por bloque horario.
  * `T-048.2`: Endpoint `GET /api/analytics/cancellations-and-schedules` con agregaciones analíticas.
  * `T-048.3`: Dashboard gráfico combinado (gráficos de pastel/barras y mapa de calor de horarios críticos).
* **Paquete E — Constancias Oficiales en PDF (3 tareas):**
  * `T-034.1`: Motor de renderizado vectorial de documentos PDF (`jsPDF` / `pdfkit`) con membrete oficial.
  * `T-034.2`: Mapeo formateado de datos de la sesión, tutor, estudiante, dificultades y tabla de recursos.
  * `T-034.3`: Botón de descarga en portal estudiantil con nomenclatura oficial `Constancia_Tutoria_[ID].pdf`.
* **Paquete F — Feedback Docente y Denuncias Tipificadas (9 tareas):**
  * `T-036.1`: Formulario modal de denuncia contra tutores con catálogo de 4 categorías predefinidas.
  * `T-036.2`: Endpoint `POST /api/sessions/:id/report-tutor` con validación de sesión atendida y motivo $\ge$ 10 chars.
  * `T-036.3`: Persistencia en tabla `incident_reports` con estado inicial `PENDING` y control anti-duplicados.
  * `T-037.1`: Componente de calificación del estudiante por el tutor (escala 0 a 5 estrellas y comentarios).
  * `T-037.2`: Endpoint `POST /api/sessions/:id/rate-student` con validaciones de sesión y rol docente.
  * `T-037.3`: Persistencia relacional de la calificación independiente de la evaluación del alumno.
  * `T-038.1`: Formulario de reporte disciplinario contra estudiantes con selector de 4 causales tipificadas.
  * `T-038.2`: Endpoint `POST /api/sessions/:id/report-student` con verificación de sesión atendida e id de tutor.
  * `T-038.3`: Persistencia en base de datos para transferencia al panel de moderación administrativa.

---

## Resumen Global de Fase 2 y Métricas de Cumplimiento

| Métrica | Sprint 1 (Fase 2) | Sprint 2 (Fase 2) | Total Fase 2 |
| :--- | :---: | :---: | :---: |
| **Historias de Usuario** | 12 (100% Alta 🟥) | 11 (10 Media 🟨 + 1 Baja 🟦) | **23 HUs** |
| **Tareas Técnicas de Desarrollo** | 36 tareas | 33 tareas | **69 tareas** |
| **Tallas Consensuadas** | 1 XS, 2 S, 5 M, 4 L | 1 XS, 4 S, 5 M, 1 L | **2 XS, 6 S, 10 M, 5 L** |
| **Pruebas Unitarias Automatizadas** | 12 pruebas base | 18 pruebas finales | **30 Pruebas (PU-01 a PU-30)** |
| **Pruebas E2E (Cypress)** | Preparación y mocks | 6 specs completas | **6 Pruebas (E2E-01 a E2E-06)** |
| **Tareas en DONE** | 36 (100%) | 33 (100%) | **69 (100%)** |
| **Tareas Bloqueadas (BLOCKED)** | 0 | 0 | **0** |
| **Deuda Técnica Pendiente** | 0% | 0% | **0%** |
| **Resultado de Verificación de Build** | Exitoso | Exitoso | **Pasa CI/CD en GitHub Actions** |
| **Cierre y Entrega Oficial** | — | 19 de octubre de 2026 | **Tag v2.0.0 en main** |


# AYD1 - EduConnect (Tablero Trello y Tareas Técnicas)

> Este documento contiene el desglose y estado de las tarjetas de trabajo en el tablero oficial de Trello de la plataforma **EduConnect**.
> 
> **Enlace público oficial del tablero (válido para ambas fases):**  
> 🔗 [AYD1 - EduConnect en Trello](https://trello.com/invite/b/6a8e3c36dcf32de42c7d8d45/ATTIc16aa6c7be21da464d3dabfea5738f984D9AE89F/ayd1-educonnect)
>
> La gestión se encuentra estructurada formalmente en dos grandes fases de desarrollo:
> - **Parte 1 (Fase 1 del Proyecto):** 27 Historias de Usuario (HU-001 a HU-027) y 91 tareas técnicas desarrolladas en los Sprints 1 y 2 iniciales.
> - **Parte 2 (Fase 2 del Proyecto):** 23 Historias de Usuario (HU-028 a HU-050) y 69 tareas técnicas de desarrollo + suite de pruebas automatizadas y despliegue cloud, culminadas el 19 de octubre de 2026.

---

# 1. Fase 1 — Tablero Trello Histórico (HU-001 a HU-027)

## Resumen del Tablero (Fase 1)
* **Product Backlog:** 27 Historias de Usuario
* **Sprint Backlog / TO-DO:** 11 Tareas
* **Blocked:** 0 Tareas
* **In Progress:** 6 Tareas
* **Test / QA:** 24 Tareas
* **Deploy:** 0 Tareas
* **Done:** 50 Tareas

---

## 1.1 Historias de Usuario de Fase 1 (Product Backlog: HU-001 a HU-027)

| Código | Título de la Historia de Usuario | Responsable | Prioridad |
| :--- | :--- | :--- | :--- |
| **HU-001** | Registro de estudiante | A \| Katheryn | ALTA |
| **HU-002** | Registro de tutor | B \| Isai | ALTA |
| **HU-003** | Autenticación de administrador en dos pasos | A \| Katheryn | ALTA |
| **HU-004** | Aprobar o rechazar registro de estudiante | C \| Álvaro | ALTA |
| **HU-005** | Aprobar o rechazar registro de tutor | C \| Álvaro | ALTA |
| **HU-006** | Inicio de sesión de estudiante | A \| Katheryn | ALTA |
| **HU-007** | Inicio de sesión de tutor | B \| Isai | ALTA |
| **HU-008** | Establecer horario de atención | B \| Isai | ALTA |
| **HU-009** | Visualizar tutores disponibles | D \| Yury | ALTA |
| **HU-010** | Búsqueda avanzada de tutores | D \| Yury | MEDIA |
| **HU-011** | Consultar horarios y disponibilidad del tutor | D \| Yury | ALTA |
| **HU-012** | Programar sesión de tutoría | E \| Nicole | ALTA |
| **HU-013** | Visualizar sesiones activas del estudiante | E \| Nicole | MEDIA |
| **HU-014** | Visualizar sesiones pendientes del tutor | F \| Xavi | MEDIA |
| **HU-015** | Marcar sesión como atendida | F \| Xavi | MEDIA |
| **HU-016** | Cancelar sesión por el estudiante | E \| Nicole | ALTA |
| **HU-017** | Cancelar sesión por el tutor | F \| Xavi | ALTA |
| **HU-018** | Notificar por correo la cancelación del tutor | F \| Xavi | BAJA |
| **HU-019** | Actualizar horario de atención | B \| Isai | BAJA |
| **HU-020** | Consultar historial de sesiones del estudiante | E \| Nicole | MEDIA |
| **HU-021** | Consultar historial de sesiones del tutor | F \| Xavi | MEDIA |
| **HU-022** | Ver y actualizar perfil del estudiante | A \| Katheryn | MEDIA |
| **HU-023** | Ver y actualizar perfil del tutor | B \| Isai | MEDIA |
| **HU-024** | Administrar estudiantes aprobados | C \| Álvaro | MEDIA |
| **HU-025** | Administrar tutores aprobados | C \| Álvaro | MEDIA |
| **HU-026** | Reporte de tutores con más estudiantes atendidos | C \| Álvaro | BAJA |
| **HU-027** | Reporte de materia con mayor demanda | D \| Yury | BAJA |

---

## 1.2 Tareas de Fase 1 Listadas por Columna

### 1. SPRINT BACKLOG / TO-DO (11 tareas)
* **T-010.1** | Controles de filtrado (D | Yury, MEDIA)
* **T-010.2** | Consulta filtrada (D | Yury, MEDIA)
* **T-010.3** | Filtros combinables y limpieza (D | Yury, MEDIA)
* **T-010.4** | Resultados y estados (D | Yury, MEDIA)
* **T-010.5** | Pruebas de búsqueda avanzada (D | Yury, MEDIA)
* **T-021.1** | Vista de historial del tutor (F | Xavi, MEDIA)
* **T-021.2** | Consulta autenticada (F | Xavi, MEDIA)
* **T-021.3** | Estados y actualización (F | Xavi, MEDIA)
* **T-027.1** | Consulta agregada por materia (D | Yury, BAJA)
* **T-027.2** | Endpoint del reporte (D | Yury, BAJA)
* **T-027.3** | Vista y validación del reporte (D | Yury, BAJA)

### 2. IN PROGRESS (6 tareas)
* **T-018.1** | Plantilla del correo (F | Xavi, BAJA)
* **T-018.2** | Integración con cancelación (F | Xavi, BAJA)
* **T-018.3** | Pruebas de notificación (F | Xavi, BAJA)
* **T-022.2** | Formulario editable (A | Katheryn, MEDIA)
* **T-022.3** | Validaciones y contraseña (A | Katheryn, MEDIA)
* **T-022.4** | Persistencia y pruebas (A | Katheryn, MEDIA)

### 3. TEST / QA (24 tareas)
* **T-014.1** | Listar sesiones pendientes del tutor (F | Xavi, MEDIA)
* **T-014.2** | Ordenar y actualizar sesiones pendientes (F | Xavi, MEDIA)
* **T-015.1** | Formulario de atención (F | Xavi, MEDIA)
* **T-015.2** | Resumen y recomendaciones (F | Xavi, MEDIA)
* **T-015.3** | Cambio de estado y persistencia (F | Xavi, MEDIA)
* **T-015.4** | Validación e historial (F | Xavi, MEDIA)
* **T-024.1** | UI/Frontend: Apartado para dar de baja a estudiantes (C | Álvaro, MEDIA)
* **T-024.2** | Backend/API: Endpoint para inactivar cuenta y bloquear login (C | Álvaro, MEDIA)
* **T-024.3** | Notificaciones/QA: Envío de correo de baja y pruebas de bloqueo (C | Álvaro, MEDIA)
* **T-025.1** | UI/Frontend: Directorio de tutores activos y botón de baja (C | Álvaro, MEDIA)
* **T-025.2** | Backend/API: Endpoint para pasar tutor a inactivo y ocultarlo (C | Álvaro, MEDIA)
* **T-025.3** | Notificaciones/QA: Envío de correo de baja y pruebas de estado (C | Álvaro, MEDIA)
* **T-026.1** | DB/Query: Consulta agregada de sesiones finalizadas por tutor (C | Álvaro, BAJA)
* **T-026.2** | Backend/API: Endpoint de métricas y ranking de tutores (C | Álvaro, BAJA)
* **T-026.3** | UI/Frontend: Componente visual con gráfico de barras y tabla (C | Álvaro, BAJA)
* **T-013.1** | Vista de sesiones activas (Nicole, MEDIA)
* **T-013.2** | Endpoint de consulta de sesiones activas (Nicole, MEDIA)
* **T-013.3** | Ordenamiento por fecha próxima (Nicole, MEDIA)
* **T-013.4** | Estado vacío (Nicole, MEDIA)
* **T-020.1** | Vista de historial (Nicole, MEDIA)
* **T-020.2** | Endpoint de historial (Nicole, MEDIA)
* **T-020.3** | Distinción visual de estados (Nicole, MEDIA)
* **T-020.4** | Visualización del resumen de la sesión (Nicole, MEDIA)
* **T-022.1** | Vista del perfil (A | Katheryn, MEDIA)

### 4. DONE (50 tareas)
* **T-001.3** | Persistencia y seguridad del estudiante (A | Katheryn, ALTA)
* **T-001.1** | Formulario de registro de estudiante (A | Katheryn, ALTA)
* **T-001.2** | Validaciones del registro de estudiante (A | Katheryn, ALTA)
* **T-017.1** | Cancelar sesión pendiente por el tutor (F | Xavi, ALTA)
* **T-017.2** | Actualizar estado y liberar horario (F | Xavi, ALTA)
* **T-017.3** | Conservar cancelación para historial (F | Xavi, ALTA)
* **T-011.1** | Vista de horario del tutor por fecha (D | Yury, ALTA)
* **T-011.2** | Consultar espacios ocupados y disponibles (D | Yury, ALTA)
* **T-011.3** | Validar día de atención del tutor (D | Yury, ALTA)
* **T-004.1** | Tabla de solicitudes pendientes en Frontend (C | Álvaro, ALTA)
* **T-004.2** | API/Back: Endpoint de listado y actualización de estado (C | Álvaro, ALTA)
* **T-004.3** | DB: Migración de estados y seeds de estudiantes pendientes (C | Álvaro, ALTA)
* **T-004.4** | Notificación: Integración de correo electrónico de resolución (C | Álvaro, ALTA)
* **T-005.1** | UI/Frontend: Tabla con fotos y datos de los tutores (C | Álvaro, ALTA)
* **T-005.2** | Backend/API: Endpoint de aprobacion o rechazo del administrador (C | Álvaro, ALTA)
* **T-005.3** | DB: Seed de tutores pendientes para pruebas (C | Álvaro, ALTA)
* **T-005.4** | Notificaciones: Integración de correo electrónico de confirmación (C | Álvaro, ALTA)
* **T-009.1** | Listado de tutores disponibles (D | Yury, ALTA)
* **T-009.2** | Excluir tutores con sesión activa y permitir selección (D | Yury, ALTA)
* **DOC** | Verificación dailies Isai 02-14 sep 2026 (B | Isai, QA)
* **TECH-001** | Cimientos MySQL de Fase 0 (B | Isai, ALTA)
* **T-002.1** | Formulario de registro de tutor (B | Isai, ALTA)
* **T-002.2** | Validaciones del registro de tutor (B | Isai, ALTA)
* **T-002.3** | Persistencia y seguridad del tutor (B | Isai, ALTA)
* **T-003.3** | Control de acceso tras segundo factor (A | Katheryn, ALTA)
* **T-003.1** | Inicio de sesión inicial del administrador (A | Katheryn, ALTA)
* **T-007.1** | Formulario de inicio de sesión del tutor (B | Isai, ALTA)
* **T-007.2** | Validar aprobación y estado del tutor (B | Isai, ALTA)
* **T-008.1** | Formulario para establecer horario (B | Isai, ALTA)
* **T-008.2** | Validar rango y días de atención (B | Isai, ALTA)
* **T-008.3** | Guardar disponibilidad del tutor (B | Isai, ALTA)
* **T-019.1** | Editar horario de atención (B | Isai, BAJA)
* **T-019.2** | Validar conflictos de sesiones (B | Isai, BAJA)
* **T-019.3** | Persistir actualización de horario (B | Isai, BAJA)
* **T-023.1** | Vista de perfil del tutor (B | Isai, MEDIA)
* **T-023.2** | API de perfil del tutor (B | Isai, MEDIA)
* **T-023.3** | Seguridad de contraseña del perfil (B | Isai, MEDIA)
* **T-003.2** | Carga y validación del archivo auth2-ayd1.txt (A | Katheryn, ALTA)
* **T-012.2** | Tabla de sesiones en base de datos (E | Nicole, ALTA)
* **T-012.3** | Endpoint para crear sesión (E | Nicole, ALTA)
* **T-012.4** | Validación de disponibilidad del tutor (E | Nicole, ALTA)
* **T-012.5** | Validación de horario ocupado y traslapes (E | Nicole, ALTA)
* **T-012.1** | Formulario para programar sesión de tutoría (E | Nicole, ALTA)
* **T-012.6** | Mensajes de confirmación y error (E | Nicole, ALTA)
* **T-016.2** | Endpoint de cancelación (E | Nicole, ALTA)
* **T-016.3** | Liberación del horario del tutor (E | Nicole, ALTA)
* **T-016.4** | Actualización de la lista (E | Nicole, ALTA)
* **T-006.1** | Formulario de inicio de sesión del estudiante (A | Katheryn, ALTA)
* **T-006.2** | Validar aprobación y estado del estudiante (A | Katheryn, ALTA)
* **T-016.1** | Botón y confirmación (E | Nicole, ALTA)

---

# 2. Fase 2 — Tablero Trello Vigente (HU-028 a HU-050)

> **Enlace público del tablero:** [AYD1 - EduConnect en Trello](https://trello.com/invite/b/6a8e3c36dcf32de42c7d8d45/ATTIc16aa6c7be21da464d3dabfea5738f984D9AE89F/ayd1-educonnect)

## Resumen del Tablero al Cierre de Fase 2 (19 de octubre de 2026)
* **Product Backlog:** 23 Historias de Usuario (HU-028 a HU-050)
* **Sprint Backlog / TO-DO:** 0 Tareas (100% planificadas y ejecutadas)
* **Blocked:** 0 Tareas (0 bloqueos activos)
* **In Progress:** 0 Tareas (flujo de desarrollo concluido)
* **Deploy:** 2 Tareas (Despliegue cloud del frontend y runner de GitHub Actions)
* **Test / QA:** 15 Tareas (Suites de pruebas unitarias PU-01 a PU-30, Cypress E2E y auditoría de Dailies)
* **Done:** 52 Tareas Técnicas concluidas y verificadas en `develop` y `main`

---

## 2.1 Historias de Usuario de Fase 2 (Sprint 1 y Sprint 2)

| Sprint | Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **Sprint 1** | **HU-028** | Registro de estudiante con foto reciente y carnet PDF obligatorios | A \| Yury | A | 🟥 ALTA |
| **Sprint 1** | **HU-030** | Generación de token y despacho automático de correo desde EduConnect | A \| Yury | A | 🟥 ALTA |
| **Sprint 1** | **HU-029** | Registro de tutor con CV en PDF obligatorio | B \| Xavi | B | 🟥 ALTA |
| **Sprint 1** | **HU-039** | Aprobación de estudiantes con visor PDF embebido | B \| Xavi | B | 🟥 ALTA |
| **Sprint 1** | **HU-041** | Edición de perfil de estudiantes (correo bloqueado) y baja lógica | C \| Alvaro | C | 🟥 ALTA |
| **Sprint 1** | **HU-043** | Panel y resolución de denuncias contra tutores | C \| Alvaro | C | 🟥 ALTA |
| **Sprint 1** | **HU-045** | Reporte y cálculo de promedio de tutores en estrellas | D \| Wade | D | 🟥 ALTA |
| **Sprint 1** | **HU-047** | Reporte Analítico 1: Evolución temporal de tutorías (semana/mes) | D \| Wade | D | 🟥 ALTA |
| **Sprint 1** | **HU-032** | Formulario estructurado de atención con dificultades y recursos dinámicos | E \| Nicole | E | 🟥 ALTA |
| **Sprint 1** | **HU-033** | Módulo de visualización del plan de estudio estructurado por el estudiante | E \| Nicole | E | 🟥 ALTA |
| **Sprint 1** | **HU-035** | Calificación del tutor por estudiante en sesión atendida | F \| Isai | F | 🟥 ALTA |
| **Sprint 1** | **HU-049** | Configuración del workflow de CI/CD para backend en GitHub Actions | F \| Isai | F | 🟥 ALTA |
| **Sprint 2** | **HU-031** | Primer inicio de sesión trifásico (credenciales + token + admin) | A \| Yury | A | 🟨 MEDIA |
| **Sprint 2** | **HU-040** | Aprobación de tutores con visor PDF embebido | B \| Xavi | B | 🟨 MEDIA |
| **Sprint 2** | **HU-050** | Dockerfile multi-stage y despliegue del frontend en nube | B \| Xavi | B | 🟨 MEDIA |
| **Sprint 2** | **HU-042** | Edición de perfil de tutores (correo bloqueado) y baja lógica | C \| Alvaro | C | 🟨 MEDIA |
| **Sprint 2** | **HU-044** | Panel y resolución de denuncias contra estudiantes | C \| Alvaro | C | 🟨 MEDIA |
| **Sprint 2** | **HU-046** | Reporte y cálculo de promedio de estudiantes en estrellas | D \| Wade | D | 🟨 MEDIA |
| **Sprint 2** | **HU-048** | Reporte Analítico 2: Materias con cancelaciones y franjas horarias críticas | D \| Wade | D | 🟦 BAJA |
| **Sprint 2** | **HU-034** | Motor de generación y descarga de constancia oficial de tutoría en PDF | E \| Nicole | E | 🟨 MEDIA |
| **Sprint 2** | **HU-036** | Reporte disciplinario contra tutores con 4 categorías | F \| Isai | F | 🟨 MEDIA |
| **Sprint 2** | **HU-037** | Calificación de estudiante por tutor tras la sesión | F \| Isai | F | 🟨 MEDIA |
| **Sprint 2** | **HU-038** | Reporte disciplinario contra estudiantes con 4 categorías | F \| Isai | F | 🟨 MEDIA |

---

## 2.2 Tareas de Fase 2 Listadas por Columna en el Tablero Trello

### 1. SPRINT BACKLOG / TO-DO (0 tareas)
*(Flujo completado al 100% para el cierre del Sprint 2 y entrega institucional).*

### 2. IN PROGRESS (0 tareas)
*(Flujo completado al 100%; sin tarjetas en curso).*

### 3. DEPLOY (2 tareas)
* **T-049.3** | Configuración de la etapa Deploy del backend en runner de GitHub Actions (F \| Isai, ALTA)
* **T-050.2** | Aprovisionamiento y despliegue del frontend en plataforma cloud con URL pública y SSL (B \| Xavi, MEDIA)

### 4. TEST / QA (15 tareas)
* **PU-A** | Suite de Pruebas Unitarias PU-01 a PU-05: Tokens, Hashing y Mimes (A \| Yury, QA)
* **PU-B** | Suite de Pruebas Unitarias PU-06 a PU-10: Uploads, Streaming PDF y Docker (B \| Xavi, QA)
* **PU-C** | Suite de Pruebas Unitarias PU-11 a PU-15: Bajas lógicas, Edición y Denuncias (C \| Alvaro, QA)
* **PU-D** | Suite de Pruebas Unitarias PU-16 a PU-20: Cálculos de promedios y agregaciones SQL (D \| Wade, QA)
* **PU-E** | Suite de Pruebas Unitarias PU-21 a PU-25: Validación de planes y layout PDF (E \| Nicole, QA)
* **PU-F** | Suite de Pruebas Unitarias PU-26 a PU-30: Feedback bidireccional y pipeline steps (F \| Isai, QA)
* **E2E-01** | Prueba E2E-01: Registro Estudiante $\rightarrow$ Token por correo $\rightarrow$ Primer Login (A \| Yury, QA)
* **E2E-02** | Prueba E2E-02: Registro Tutor $\rightarrow$ Auditoría de CV en visor embebido $\rightarrow$ Aprobación (B \| Xavi, QA)
* **E2E-03** | Prueba E2E-03: Edición perfil $\rightarrow$ Baja por denuncia $\rightarrow$ Bloqueo de inicio de sesión (C \| Alvaro, QA)
* **E2E-04** | Prueba E2E-04: Acceso a métricas $\rightarrow$ Filtros temporales $\rightarrow$ Validación gráfica (D \| Wade, QA)
* **E2E-05** | Prueba E2E-05: Tutor asigna plan estructurado $\rightarrow$ Alumno descarga constancia PDF (E \| Nicole, QA)
* **E2E-06** | Prueba E2E-06: Estudiante califica tutor atendido $\rightarrow$ Denuncia disciplinaria $\rightarrow$ Admin modera (F \| Isai, QA)
* **QA-BUILD** | Verificación de compilación de producción del Frontend con Vite sin warnings críticos (B \| Xavi, QA)
* **QA-RUNNER** | Verificación de ejecución del job de pruebas unitarias en runner GitHub Actions (F \| Isai, QA)
* **DOC-DAILIES** | Auditoría y registro de las 12 Actas de Daily Scrums y evidencias PDF (C \| Alvaro, QA)

### 5. DONE (52 tareas)
* **T-028.1** | Formulario frontend de registro de estudiante con carga de foto y carnet PDF (A \| Yury, ALTA)
* **T-028.2** | Middleware backend Multer para validar formato MIME PDF y límite de 5MB (A \| Yury, ALTA)
* **T-028.3** | Endpoint POST /api/auth/register/student con persistencia en estado PENDING (A \| Yury, ALTA)
* **T-030.1** | Módulo criptográfico utilitario de generación de tokens alfanuméricos de 6 caracteres (A \| Yury, ALTA)
* **T-030.2** | Configuración de servicio SMTP Mailtrap Sandbox para despacho transaccional (A \| Yury, ALTA)
* **T-030.3** | Plantilla HTML institucional de correo con token resaltado y mensaje anti-spam (A \| Yury, ALTA)
* **T-031.1** | Interfaz de Login adaptativa para solicitar token temporal en primer inicio de sesión (A \| Yury, MEDIA)
* **T-031.2** | Endpoint de autenticación con validación dual (token coincidente y estado APPROVED) (A \| Yury, MEDIA)
* **T-031.3** | Transición de cuenta a email_verified = TRUE y habilitación de login estándar (A \| Yury, MEDIA)
* **T-029.1** | Formulario de registro de tutor con validación de foto y CV en PDF obligatorio (B \| Xavi, ALTA)
* **T-029.2** | Middleware de subida con persistencia en disco y nombres UUID v4 (B \| Xavi, ALTA)
* **T-029.3** | Endpoint POST /api/auth/register/tutor con especialidades y estado PENDING (B \| Xavi, ALTA)
* **T-039.1** | Endpoint de streaming seguro de documentos GET /api/documents/carnet/:id (B \| Xavi, ALTA)
* **T-039.2** | Componente interactivo de visor PDF embebido en modal de aprobación de alumnos (B \| Xavi, ALTA)
* **T-039.3** | Acciones administrativas de aprobación y rechazo de solicitudes de estudiantes (B \| Xavi, ALTA)
* **T-040.1** | Componente de visor PDF embebido en panel de revisión de tutores postulantes (B \| Xavi, MEDIA)
* **T-040.2** | Endpoint de streaming GET /api/documents/cv/:id con cabeceras de lectura inline (B \| Xavi, MEDIA)
* **T-040.3** | Controladores administrativos de aprobación y rechazo de tutores con correo (B \| Xavi, MEDIA)
* **T-050.1** | Redacción de frontend/Dockerfile multi-stage y configuración de nginx.conf para SPA (B \| Xavi, MEDIA)
* **T-050.3** | Parametrización de variables de entorno de producción VITE_API_URL y verificación (B \| Xavi, MEDIA)
* **T-041.1** | Tabla administrativa de estudiantes aprobados con buscador reactivo por carnet (C \| Alvaro, ALTA)
* **T-041.2** | Modal de edición de perfil de estudiante con campo de correo inmutable (C \| Alvaro, ALTA)
* **T-041.3** | Endpoints de edición protegida y baja lógica a DISABLED con bloqueo de acceso (C \| Alvaro, ALTA)
* **T-043.1** | Panel administrativo de denuncias contra tutores con detalle de queja y partes (C \| Alvaro, ALTA)
* **T-043.2** | Modal de resolución con acciones de sanción disciplinaria o desestimación (C \| Alvaro, ALTA)
* **T-043.3** | Endpoint transaccional de resolución de denuncias y baja inmediata del tutor (C \| Alvaro, ALTA)
* **T-042.1** | Panel administrativo de tutores activos con filtros por materia y carnet (C \| Alvaro, MEDIA)
* **T-042.2** | Modal de actualización de especialidades del tutor con correo protegido (error 400) (C \| Alvaro, MEDIA)
* **T-042.3** | Endpoints de actualización y baja lógica de tutores con ocultamiento de agenda (C \| Alvaro, MEDIA)
* **T-044.1** | Panel administrativo de denuncias interpuestas contra estudiantes (C \| Alvaro, MEDIA)
* **T-044.2** | Modal interactivo de sanción (baja a DISABLED) o desestimación de la queja (C \| Alvaro, MEDIA)
* **T-044.3** | Endpoint transaccional de resolución de denuncias contra estudiantes (C \| Alvaro, MEDIA)
* **T-045.1** | Consulta SQL agregada con AVG(rating) para cálculo de promedios de tutores (D \| Wade, ALTA)
* **T-045.2** | Endpoint REST GET /api/reports/tutors-ratings con soporte de ordenamiento (D \| Wade, ALTA)
* **T-045.3** | Tabla interactiva de evaluación docente con representación gráfica de estrellas (D \| Wade, ALTA)
* **T-047.1** | Consulta analítica temporal con agrupamiento de sesiones por semanas y meses (D \| Wade, ALTA)
* **T-047.2** | Endpoint GET /api/analytics/sessions-timeline con filtros de granularidad (D \| Wade, ALTA)
* **T-047.3** | Gráfico interactivo responsivo con curvas de citas atendidas vs canceladas (D \| Wade, ALTA)
* **T-046.1** | Consulta SQL agregada para promediar calificaciones recibidas por estudiantes (D \| Wade, MEDIA)
* **T-046.2** | Endpoint GET /api/reports/students-ratings con ordenamiento numérico (D \| Wade, MEDIA)
* **T-046.3** | Componente visual de calificaciones estudiantiles con estrellas y búsqueda (D \| Wade, MEDIA)
* **T-048.1** | Consulta analítica correlacionando tasas de cancelación y demanda horaria (D \| Wade, BAJA)
* **T-048.2** | Endpoint GET /api/analytics/cancellations-and-schedules con agregaciones multidimensionales (D \| Wade, BAJA)
* **T-048.3** | Dashboard visual con gráficos combinados y mapa de calor de horarios críticos (D \| Wade, BAJA)
* **T-032.1** | Modelo relacional y migraciones de tablas study_plans y study_resources (E \| Nicole, ALTA)
* **T-032.2** | Formulario dinámico de atención con dificultades obligatorias y recursos (E \| Nicole, ALTA)
* **T-032.3** | Endpoint POST /api/sessions/:id/study-plan con transición de sesión a ATTENDED (E \| Nicole, ALTA)
* **T-033.1** | Endpoint GET /api/sessions/:id/study-plan para consulta de planes asignados (E \| Nicole, ALTA)
* **T-033.2** | Vista del plan de estudio en portal estudiantil con badges de tipos de recurso (E \| Nicole, ALTA)
* **T-033.3** | Restricciones de autorización para visualización exclusiva entre las partes (E \| Nicole, ALTA)
* **T-034.1** | Motor de renderizado vectorial de documentos PDF con membrete oficial (E \| Nicole, MEDIA)
* **T-034.2** | Función de mapeo de datos de sesión, tutor, estudiante y tabla de recursos a PDF (E \| Nicole, MEDIA)
* **T-034.3** | Botón de descarga directa en portal estudiantil con nombre estandarizado (E \| Nicole, MEDIA)
* **T-035.1** | Modal de calificación del tutor desde historial de sesiones atendidas (F \| Isai, ALTA)
* **T-035.2** | Validaciones de backend: estado ATTENDED, pertenencia y calificación única (F \| Isai, ALTA)
* **T-035.3** | Persistencia en tabla session_ratings y reflejo inmediato en el historial (F \| Isai, ALTA)
* **T-049.1** | Archivo .github/workflows/backend-ci-cd.yml con disparador push a main (F \| Isai, ALTA)
* **T-049.2** | Job de Build automatizado con compilación y Dockerfile del backend (F \| Isai, ALTA)
* **T-036.1** | Formulario de denuncia contra tutores con selector de 4 causales tipificadas (F \| Isai, MEDIA)
* **T-036.2** | Endpoint POST /api/sessions/:id/report-tutor con validación de motivo >= 10 chars (F \| Isai, MEDIA)
* **T-036.3** | Persistencia en incident_reports en estado PENDING y control anti-duplicados (F \| Isai, MEDIA)
* **T-037.1** | Componente de calificación del alumno por el tutor (0 a 5 estrellas y comentario) (F \| Isai, MEDIA)
* **T-037.2** | Endpoint POST /api/sessions/:id/rate-student con validación de rol docente (F \| Isai, MEDIA)
* **T-037.3** | Persistencia relacional de calificación docente independiente de la del alumno (F \| Isai, MEDIA)
* **T-038.1** | Formulario modal de denuncia contra estudiantes con catálogo de 4 categorías (F \| Isai, MEDIA)
* **T-038.2** | Endpoint POST /api/sessions/:id/report-student con verificación de sesión atendida (F \| Isai, MEDIA)
* **T-038.3** | Registro de denuncia en estado PENDING para moderación administrativa (F \| Isai, MEDIA)
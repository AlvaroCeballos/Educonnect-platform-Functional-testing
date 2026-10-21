# Tablero Kanban — Flujo Visual de Trabajo (EduConnect)

> Kanban es un método visual para gestionar el flujo continuo de trabajo. Cada tarjeta representa una actividad técnica o historia de usuario y se desplaza entre columnas conforme evoluciona su ciclo de vida y estado de ejecución.

El tablero Kanban fue utilizado para llevar el control, orquestación y seguimiento diario de todas las tareas desarrolladas durante el proyecto **EduConnect**. Este tablero permitió a los 6 miembros del equipo visualizar en tiempo real el progreso de las actividades, coordinar entregas cruzadas, balancear la carga de trabajo y detectar cuellos de botella en cada sprint.

Se utilizó la herramienta **Trello** para implementar el tablero (`AYD1 - EduConnect.`), organizando el flujo de trabajo según el modelo Scrumban con las siguientes columnas estándar:

- **Product Backlog:** Contiene la totalidad de historias de usuario priorizadas del proyecto. Las tareas técnicas derivadas se trasladan a las columnas activas a medida que se planifican los sprints.
- **TO-DO (Sprint Backlog):** Reúne las tareas planificadas para el sprint en curso que están listas para iniciar su desarrollo, con criterios de aceptación claros y asignación de responsable.
- **BLOCKED:** Contiene tareas detenidas por alguna razón técnica o externa (impedimentos de entorno, dependencias entre módulos pendientes de merge o bloqueos de infraestructura).
- **IN PROGRESS:** Reúne las tareas que están siendo desarrolladas activamente por el miembro del equipo responsable, sujetas a límites de trabajo en progreso (WIP).
- **TEST/QA:** Contiene las tareas terminadas a nivel de código que se encuentran bajo ejecución de pruebas unitarias (`node --test`), validación de integración continua o revisión cruzada por pares (Peer Review).
- **DEPLOY / DONE:** Contiene las tareas probadas, aprobadas y fusionadas exitosamente en la rama de integración (`develop`) o listas para el despliegue final en producción cloud (`main`).

---

## Datos Generales del Tablero

| Información | Detalle |
| :--- | :--- |
| **Herramienta usada** | Trello |
| **Nombre del Tablero** | AYD1 - EduConnect. |
| **Enlace al Tablero** | [Acceder al Tablero Trello (AYD1 - EduConnect)](https://trello.com/invite/b/6a8e3c36dcf32de42c7d8d45/ATTIc16aa6c7be21da464d3dabfea5738f984D9AE89F/ayd1-educonnect) |
| **Visibilidad** | Pública / Compartida (acceso habilitado para evaluación y seguimiento docente) |

---

### Miembros del Equipo y Distribución de Responsabilidades

| Integrante | Carnet | Inicial / Avatar | Rol Scrum | Paquete Asignado (Fase 1) | Paquete Asignado (Fase 2) |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Alvaro Ceballos** | 202300673 | Avatar Rojo | Scrum Master / Dev | **Paquete C:** Aprobaciones y Reportes | **Paquete C:** Moderación, Denuncias y Cuentas |
| **Katheryn / Wade** | 201901358 | `KP` / `WP` | Developer | **Paquete A:** Identidad y Autenticación | **Paquete D:** Métricas, Calificaciones y Reportes |
| **Isai Patzán** | 202200057 | `IP` | Product Owner / Dev | **Paquete B:** Tutor: Horarios y Perfiles | **Paquete F:** Feedback (Ratings/Reportes) y CI/CD |
| **Yury** | 202200350 | `+1` / `YP` | Developer | **Paquete D:** Catálogo y Disponibilidad | **Paquete A:** Identidad, Tokens y PDFs Estudiante |
| **Nicole López** | 202102143 | Avatar Nicole | Developer | **Paquete E:** Sesiones del Estudiante | **Paquete E:** Planes Estructurados y Constancia PDF |
| **Xavi De León** | 202201385 | `XP` | Developer | **Paquete F:** Sesiones del Tutor y Correos | **Paquete B:** CV Tutor, Visores PDF y Despliegue |

---

### Etiquetas y Convenciones Utilizadas en Trello

Para clasificar rápidamente el tipo de trabajo, la prioridad y la pertenencia a cada paquete técnico, se configuraron las siguientes etiquetas visuales en Trello:

![Etiquetas del tablero Trello](imgs_kanban/etiquetas_trello.png)

#### Clasificación de Etiquetas
1. **Prioridad del Elemento:**
   - `ALTA` (Rojo carmesí): Funcionalidades críticas y estructurales del sistema (Sprint 1).
   - `MEDIA` (Amarillo mostaza): Funcionalidades operativas complementarias y gestión avanzada (Sprint 2).
   - `BAJA` (Verde menta): Reportes analíticos secundarios y notificaciones por correo (Sprint 2).

2. **Responsable / Paquete Técnico:**
   - `A | Yury` / `A | Katheryn`: Paquete A — Registro, Login, Tokens y PDFs de Estudiante.
   - `B | Xavi` / `B | Isai`: Paquete B — CV Tutor, Visores PDF, Horarios y Despliegue.
   - `C | Álvaro`: Paquete C — Aprobaciones, Bajas Lógicas, Denuncias y Moderación.
   - `D | Wade` / `D | Yury`: Paquete D — Métricas, Calificaciones y Búsqueda de Tutores.
   - `E | Nicole`: Paquete E — Agendamiento, Planes Estructurados y Constancias PDF.
   - `F | Isai` / `F | Xavi`: Paquete F — Feedback, Ratings, Notificaciones y CI/CD.

3. **Naturaleza del Elemento:**
   - `HU` (Azul cian): Historia de Usuario con criterios de aceptación.
   - `T` (Verde lima claro): Tarea técnica de desarrollo frontend o backend.
   - `TECH` (Verde oliva): Tarea de infraestructura, base de datos, Docker o CI/CD.
   - `QA` (Rosa fucsia): Tareas de aseguramiento de calidad, pruebas unitarias y E2E.
   - `DOC` (Gris): Tareas de documentación técnica, manuales y actas de ceremonias.

---

# 1. Fase 1 — Flujo Visual y Tableros Históricos

## 1.1 Sprint 1 (Fase 1) — Núcleo Operativo

- **Periodo:** Del 2 de septiembre de 2026 al 8 de septiembre de 2026.
- **Alcance:** 13 Historias de Usuario (100% Prioridad Alta 🟥) y 50 Tareas Técnicas iniciales.

### Descripción del Flujo de Trabajo
En este primer sprint se abordaron todas las historias clasificadas con **prioridad alta (🟥)**. El objetivo fue consolidar el núcleo del sistema: esquemas de base de datos en Docker, registro y autenticación de usuarios (estudiante, tutor y 2FA de administrador), aprobación administrativa de cuentas, parametrización de horarios de atención y el motor transaccional de agendamiento y cancelación sin traslapes horarios.

### Historias de Usuario Abordadas en el Sprint 1 (Fase 1)

| Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad | Estimación |
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

### Estado del Tablero — Sprint 1 (Fase 1)
A continuación se muestra una vista panorámica del tablero Kanban en Trello durante el flujo de trabajo del Sprint 1, evidenciando el paso de las tarjetas desde el backlog hacia las columnas de desarrollo, pruebas y control de calidad:

![Tablero Kanban en ejecución — Sprint 1](imgs_kanban/tablero_trello_1.png)

### Evidencias de la Evolución del Tablero (Archivos PDF)
Cada evento de Scrum cuenta con su respectiva evidencia exportada en formato PDF dentro del directorio [`tableros/`](tableros/):

- **Sprint Planning 1:** [`sprint1_planning_.pdf`](tableros/sprint1_planning_.pdf)
- **Daily Scrum 1 (03/09/2026):** [`daily1.pdf`](tableros/daily1.pdf)
- **Daily Scrum 2 (04/09/2026):** [`daily2.pdf`](tableros/daily2.pdf)
- **Daily Scrum 3 (05/09/2026):** [`daily3.pdf`](tableros/daily3.pdf)
- **Daily Scrum 4 (06/09/2026):** [`daily4.pdf`](tableros/daily4.pdf)
- **Daily Scrum 5 (07/09/2026):** [`daily5.pdf`](tableros/daily5.pdf)
- **Daily Scrum 6 y Retrospectiva 1 (08/09/2026):** [`daily6_retrospective1.pdf`](tableros/daily6_retrospective1.pdf)

---

## 1.2 Sprint 2 (Fase 1) — Completitud, Gestión y Reportes

- **Periodo:** Del 8 de septiembre de 2026 al 14 de septiembre de 2026.
- **Alcance:** 14 Historias de Usuario (10 Prioridad Media 🟨 + 4 Prioridad Baja 🟦) y 41 Tareas Técnicas adicionales (total acumulado: 91 tareas).

### Descripción del Flujo de Trabajo
Durante el segundo sprint se implementaron las funcionalidades complementarias del sistema: filtros multicriterio para la búsqueda de tutores, atención de citas con resumen pedagógico obligatorio, notificación automática vía correo SMTP tras cancelación, consulta de sesiones activas e historial tanto para estudiante como para tutor, actualización de perfiles con protección de campos no editables, bajas lógicas de usuarios por el administrador y los dos reportes analíticos requeridos (ranking de tutores más solicitados y materias de mayor demanda).

### Historias de Usuario Abordadas en el Sprint 2 (Fase 1)

| Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad | Estimación |
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

### Estado del Tablero — Sprint 2 (Fase 1)
A continuación se ilustra el tablero Kanban durante el Sprint 2, donde se integraron las tareas técnicas de reportería, perfiles y QA final:

![Tablero Kanban en ejecución — Sprint 2](imgs_kanban/tablero_trello_2.png)

### Evidencias de la Evolución del Tablero (Archivos PDF)
El avance de cada evento del Sprint 2 se encuentra documentado en formato PDF dentro del directorio [`tableros/`](tableros/):

- **Sprint Planning 2:** [`sprint2_planning.pdf`](tableros/sprint2_planning.pdf)
- **Daily Scrum 1 (09/09/2026):** [`daily7.pdf`](tableros/daily7.pdf)
- **Daily Scrum 2 (10/09/2026):** [`daily8.pdf`](tableros/daily8.pdf)
- **Daily Scrum 3 (11/09/2026):** [`daily9.pdf`](tableros/daily9.pdf)
- **Daily Scrum 4 (12/09/2026):** [`daily10,11.pdf`](tableros/daily10,11.pdf)
- **Daily Scrum 5 (13/09/2026):** [`daily10,11.pdf`](tableros/daily10,11.pdf)
- **Daily Scrum 6 y Retrospectiva 2 (14/09/2026):** [`daily12_retrospective2.pdf`](tableros/daily12_retrospective2.pdf)

---

# 2. Fase 2 — Flujo Scrumban, Políticas WIP y Despliegue Cloud

En la Fase 2 del proyecto se refinó la metodología integrando principios formales de **Scrumban**, combinando la cadencia fija de iteraciones de Scrum (sprints de 10 días calendario con ceremonias de Planning, Dailies y Retrospectivas) con el control visual riguroso del flujo continuo de Kanban mediante **límites de trabajo en curso (WIP)** y **criterios explícitos de salida (Definition of Done)** por columna.

---

## 2.1 Sprint 1 (Fase 2) — Núcleo de Validación, Planes y CI/CD

- **Periodo:** Del 5 de octubre de 2026 al 12 de octubre de 2026.
- **Alcance:** 12 Historias de Usuario (100% Prioridad Alta 🟥) y 36 Tareas Técnicas (`T-028.1` a `T-039.3`).

### Dinámica del Flujo de Trabajo y Políticas WIP en Sprint 1
Durante este sprint, el equipo se concentró en desbloquear la arquitectura crítica de Fase 2: la carga y verificación de documentos binarios PDF (carnets de estudiantes y CVs de tutores), el módulo criptográfico de generación de tokens de 6 caracteres con validación Mailtrap, el motor transaccional de planes de estudio estructurados, el panel administrativo de denuncias con baja lógica inmediata, el cálculo automatizado de promedios de calificación y la configuración del pipeline automatizado de CI/CD en GitHub Actions.

Para prevenir cuellos de botella y sobrecarga, se establecieron los siguientes **Límites WIP**:
- **IN PROGRESS (WIP = 6):** Máximo 1 tarjeta activa simultánea por desarrollador. Ningún integrante podía tomar una segunda tarea sin antes haber movido la anterior a `TEST/QA`.
- **TEST/QA (WIP = 4):** Máximo 4 tarjetas en validación de pruebas unitarias. Si la columna se saturaba, los desarrolladores desocupados debían asistir en la revisión por pares (Peer Review) y ejecución de suites con `node --test`.
- **DEPLOY (WIP = 2):** Máximo 2 tarjetas en proceso de fusión e integración en la rama `develop`.

### Definition of Done (DoD) — Sprint 1 (Fase 2)
Una tarjeta se consideraba terminada y trasladable a `DEPLOY / DONE` únicamente si:
1. El código de la tarea estaba implementado cumpliendo el 100% de los criterios de aceptación de la historia de usuario.
2. Se habían programado y superado las pruebas unitarias correspondientes con el Node.js Native Test Runner.
3. Se había realizado la verificación de no regresión contra las funcionalidades existentes de Fase 1.
4. El Pull Request había sido revisado, aprobado por al menos un par técnico y fusionado limpiamente en la rama `develop` sin conflictos.

### Historias de Usuario Abordadas en el Sprint 1 (Fase 2)

| Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad | Estimación |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **HU-028** | Registro de estudiante con foto y carnet en PDF | Yury | A | 🟥 ALTA | **M** |
| **HU-029** | Registro de tutor con CV en formato PDF | Xavi De León | B | 🟥 ALTA | **M** |
| **HU-030** | Envío de correo con token criptográfico vía Mailtrap | Yury | A | 🟥 ALTA | **S** |
| **HU-032** | Registro de plan de estudio estructurado por el tutor | Nicole López | E | 🟥 ALTA | **M** |
| **HU-033** | Consulta de planes de estudio asignados al estudiante | Nicole López | E | 🟥 ALTA | **S** |
| **HU-035** | Calificación de sesión y reporte de incidencias | Isai Patzán | F | 🟥 ALTA | **M** |
| **HU-039** | Panel admin con visor embebido de carnet universitario | Xavi De León | B | 🟥 ALTA | **M** |
| **HU-041** | Gestión y edición de perfil de estudiante (correo bloqueado) | Alvaro Ceballos | C | 🟥 ALTA | **S** |
| **HU-043** | Panel de denuncias e incidencias contra tutores | Alvaro Ceballos | C | 🟥 ALTA | **M** |
| **HU-045** | Métricas globales de la plataforma con filtros temporales | Wade | D | 🟥 ALTA | **L** |
| **HU-047** | Cálculo automático de promedios de calificación del tutor | Wade | D | 🟥 ALTA | **S** |
| **HU-049** | Pipeline de Integración Continua (CI/CD) con GitHub Actions | Isai Patzán | F | 🟥 ALTA | **M** |

### Evidencias de la Evolución del Tablero (Archivos PDF de Sprint 1)
El seguimiento formal de las sesiones de planificación y sincronización diaria del Sprint 1 se encuentra documentado en formato PDF dentro del directorio [`tableroFase2/`](tableroFase2/):

- **Sprint Planning Intermedio (05/10/2026):** [`SprintPlanningIntermedio.pdf`](tableroFase2/SprintPlanningIntermedio.pdf)
- **Daily Scrum 1 (06/10/2026):** [`Daily1.pdf`](tableroFase2/Daily1.pdf)
- **Daily Scrum 2 (07/10/2026):** [`Daily2.pdf`](tableroFase2/Daily2.pdf)
- **Daily Scrum 3 (08/10/2026):** [`Daily3.pdf`](tableroFase2/Daily3.pdf)
- **Daily Scrum 4 (09/10/2026):** [`Daily4.pdf`](tableroFase2/Daily4.pdf)
- **Daily Scrum 5 (10/10/2026):** [`Daily5.pdf`](tableroFase2/Daily5.pdf)
- **Daily Scrum 6 (11/10/2026):** [`Daily6.pdf`](tableroFase2/Daily6.pdf)

---

## 2.2 Sprint 2 (Fase 2) — Despliegue Cloud, Constancias, Moderación y Cierre

- **Periodo:** Del 12 de octubre de 2026 al 19 de octubre de 2026.
- **Alcance:** 11 Historias de Usuario (9 Prioridad Media 🟨 + 2 Prioridad Baja 🟦) y 33 Tareas Técnicas (`T-040.1` a `T-050.3`).

### Dinámica del Flujo de Trabajo y Políticas WIP en Sprint 2
En el segundo sprint el foco se trasladó hacia la completitud funcional y el aseguramiento global de calidad: validación trifásica de tokens en primer login, generación y descarga de constancias académicas en PDF mediante PDFKit/jsPDF, visualización de feedback y desglose por estrellas para tutores, filtros multicriterio por materias y estrellas, visor embebido para el CV de tutores, panel de denuncias contra estudiantes con baneo inmediato, reportes analíticos de satisfacción y el despliegue productivo desacoplado en la nube mediante Docker multi-stage y GitHub Actions Runner.

Se reforzaron las políticas de flujo para la recta final:
- **TEST/QA (WIP = 4):** Exigencia estricta de ejecución de la suite completa de 30 pruebas unitarias en backend y 6 pruebas End-to-End con Cypress en frontend.
- **DEPLOY / DONE (WIP = 2):** Despliegue continuo condicionado a que los jobs de `Build` y `Test` del pipeline `.github/workflows/backend-ci-cd.yml` estuvieran 100% en verde.

### Definition of Done (DoD) — Sprint 2 (Fase 2) — Cierre de Release
Para que una historia o tarea fuese declarada en estado final **DONE** y formar parte del release `v2.0.0`:
1. El código frontend y backend debía estar totalmente integrado y probado en la rama `main`.
2. Las **30 pruebas unitarias** del backend debían pasar exitosamente al 100% sin advertencias ni regresiones.
3. Las **6 pruebas End-to-End** automatizadas en Cypress debían ejecutarse en verde simulando los flujos de usuario reales de punta a punta.
4. El contenedor Docker del backend debía construirse y desplegarse automáticamente en el runner de GitHub Actions con healthchecks satisfactorios.
5. El frontend debía encontrarse desplegado en la nube pública mediante contenedorización multi-stage (`nginx:alpine`) accesible vía URL pública.
6. La documentación técnica, manual de usuario ilustrado, casos de uso expandidos y actas de ceremonias debían estar archivadas en `docs/`.
7. Creación de la etiqueta Git formal de lanzamiento: **`v2.0.0`**.

### Historias de Usuario Abordadas en el Sprint 2 (Fase 2)

| Código | Título de la Historia de Usuario | Responsable | Paquete | Prioridad | Estimación |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **HU-031** | Validación trifásica de cuenta en primer login con token | Yury | A | 🟨 MEDIA | **S** |
| **HU-034** | Generación y descarga de constancia de plan de estudio en PDF | Nicole López | E | 🟨 MEDIA | **M** |
| **HU-036** | Visualización de calificaciones e historial de feedback | Isai Patzán | F | 🟨 MEDIA | **S** |
| **HU-037** | Filtro multicriterio de tutores por calificación y materias | Isai Patzán | F | 🟨 MEDIA | **M** |
| **HU-038** | Notificación por correo al tutor sobre nueva reseña | Isai Patzán | F | 🟦 BAJA | **S** |
| **HU-040** | Panel admin con visor embebido de CV del tutor | Xavi De León | B | 🟨 MEDIA | **M** |
| **HU-042** | Gestión y edición de perfil de tutores por el administrador | Alvaro Ceballos | C | 🟨 MEDIA | **S** |
| **HU-044** | Panel de denuncias contra estudiantes y sanción de baja | Alvaro Ceballos | C | 🟨 MEDIA | **M** |
| **HU-046** | Reporte analítico de efectividad y satisfacción por tutor | Wade | D | 🟦 BAJA | **M** |
| **HU-048** | Visualización de desglose de calificaciones por estrellas | Wade | D | 🟨 MEDIA | **S** |
| **HU-050** | Despliegue de aplicación en la nube con Docker multi-stage | Xavi De León | B | 🟨 MEDIA | **L** |

### Evidencias de la Evolución del Tablero (Archivos PDF de Sprint 2)
El avance de cada sesión del Sprint 2 y el cierre final de proyecto se encuentra respaldado en formato PDF dentro del directorio [`tableroFase2/`](tableroFase2/):

- **Sprint Planning Final (12/10/2026):** [`SprintPlanningFinal.pdf`](tableroFase2/SprintPlanningFinal.pdf)
- **Daily Scrum 7 (13/10/2026):** [`Daily7.pdf`](tableroFase2/Daily7.pdf)
- **Daily Scrum 8 (14/10/2026):** [`Daily8.pdf`](tableroFase2/Daily8.pdf)
- **Daily Scrum 9 (15/10/2026):** [`Daily9.pdf`](tableroFase2/Daily9.pdf)
- **Daily Scrum 10 (16/10/2026):** [`Daily10.pdf`](tableroFase2/Daily10.pdf)
- **Daily Scrum 11 (17/10/2026):** [`Daily11.pdf`](tableroFase2/Daily11.pdf)
- **Daily Scrum 12 (18/10/2026):** [`Daily12.pdf`](tableroFase2/Daily12.pdf)
- **Sprint Retrospective 2 y Cierre (19/10/2026):** [`Daily12.pdf`](tableroFase2/Daily12.pdf)

---

## 2.3 Políticas de Gestión de Impedimentos (Blocked) y Transiciones de Estado

### Protocolo para Tarjetas Bloqueadas (`BLOCKED`)
Cuando un desarrollador encontraba una dependencia insatisfecha (por ejemplo, el endpoint de streaming de PDF de `backend` pendiente de merge mientras se construía el visor en `frontend`), aplicaba las siguientes reglas:
1. **Etiquetado Inmediato:** Se agregaba un comentario en la tarjeta describiendo con precisión la causa del bloqueo, el archivo o módulo involucrado y el integrante del equipo requerido para desbloquearla.
2. **Traslado a BLOCKED:** La tarjeta se movía a la columna `BLOCKED`, liberando la capacidad de la columna `IN PROGRESS` para que el desarrollador pudiera asumir una subtarea paralela sin violar los límites WIP.
3. **Escalamiento en Daily Scrum:** Durante la reunión diaria de 15 minutos, el Scrum Master revisaba prioritariamente las tarjetas en `BLOCKED` para establecer acuerdos inmediatos de resolución entre pares.

### Reglas de Transición entre Columnas
- **Backlog $\rightarrow$ TO-DO:** Las historias y tareas se mueven únicamente durante la sesión de Sprint Planning, habiendo validado criterios de aceptación y estimación por consenso.
- **TO-DO $\rightarrow$ IN PROGRESS:** El responsable asignado toma la tarjeta al iniciar el desarrollo, respetando el límite WIP $\le 6$.
- **IN PROGRESS $\rightarrow$ TEST/QA:** El desarrollador sube los cambios a su rama de feature, ejecuta la prueba unitaria localmente y traslada la tarjeta cuando el código está listo para revisión cruzada.
- **TEST/QA $\rightarrow$ DEPLOY:** La tarjeta solo avanza tras la aprobación del Pull Request y la confirmación de que no rompe la suite de pruebas automatizadas.
- **DEPLOY $\rightarrow$ DONE:** La tarjeta se traslada a `DONE` cuando la funcionalidad está desplegada, probada en el entorno integrado y validada según la Definition of Done.

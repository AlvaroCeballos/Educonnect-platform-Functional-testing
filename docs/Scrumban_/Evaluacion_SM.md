# Evaluación de Desempeño del Equipo de Desarrollo — Scrum Master

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería**  
**Escuela de Ciencias y Sistemas**  
**Análisis y Diseño de Sistemas 1 — 2do Semestre 2026**  
**Proyecto 1:** EduConnect — Plataforma de Gestión de Tutorías Académicas  
**Evaluador:** Alvaro Ceballos (Carnet: `202300673`) — Scrum Master  

---

## 1. Introducción y Marco de Evaluación

De conformidad con las especificaciones del enunciado del proyecto (Sección 4.4 "Entregables — Calificación del Scrum Master"), el presente documento formaliza la evaluación de desempeño individual y colaborativo de los integrantes del equipo Scrum durante el ciclo de vida del proyecto **EduConnect**.

La evaluación comprende los dos sprints de desarrollo (Sprint 1: Núcleo Operativo y Sprint 2: Completitud y Reportes), valorando el compromiso individual, el apego a la metodología SCRUM/Kanban, la calidad técnica del código entregado y la responsabilidad con los artefactos de documentación.

---

## 2. Criterios de Evaluación y Rúbrica (Escala de 1 a 100 Puntos)

Cada miembro del equipo fue evaluado bajo cuatro dimensiones clave ponderadas con 25 puntos cada una:

1. **Cumplimiento y Gestión en el Tablero Kanban (25 pts):**  
   Desglose y avance continuo de tareas técnicas desde `TO-DO` hacia `DONE`, sin acumulación de tickets bloqueados ni deuda técnica al cierre de cada sprint.
2. **Puntualidad y Asistencia a Ceremonias Scrum (25 pts):**  
   Participación activa y oportuna en las 2 sesiones de Sprint Planning, las 12 sesiones de Daily Scrum y las 2 Sprint Retrospectives, respondiendo con claridad a las preguntas del daily.
3. **Calidad Técnica, Git Flow y Entorno Docker (25 pts):**  
   Desarrollo de código robusto, manejo riguroso de ramas (`feature/carnet` hacia `develop`), pruebas unitarias/integración y verificación de compatibilidad con Docker Compose.
4. **Colaboración Cruzada y Documentación Técnica (25 pts):**  
   Disposición para resolver dependencias entre paquetes, revisión cruzada de Pull Requests y entrega puntual de los manuales, historias de usuario y diagramas asignados.

---

## 3. Matriz General de Calificaciones

| No. | Integrante | Carnet / ID | Rol Scrum | Paquete Técnico Asignado | Calificación Final | Estado |
| :-: | :--- | :---: | :---: | :--- | :-: | :-: |
| 1 | **Katheryn / Wade** | `202300596` | Developer | **Paquete A:** Identidad y Autenticación | **100 / 100** | **Excelente** |
| 2 | **Isai Patzán** | `202308204` | Developer | **Paquete B:** Tutor: Identidad y Horarios | **100 / 100** | **Excelente** |
| 3 | **Alvaro Ceballos** | `202300673` | Scrum Master / Dev | **Paquete C:** Administración de Usuarios | **100 / 100** | **Excelente** |
| 4 | **Yury** | `202300359` | Developer | **Paquete D:** Descubrimiento y Disponibilidad | **100 / 100** | **Excelente** |
| 5 | **Nicole López** | `202300659` | Developer | **Paquete E:** Sesiones del Estudiante | **100 / 100** | **Excelente** |
| 6 | **Xavi De León** | `3033373110108` | Product Owner / Dev | **Paquete F:** Sesiones del Tutor y Notificaciones | **100 / 100** | **Excelente** |

---

## 4. Justificación Cualitativa por Integrante

### 1. Katheryn / Wade — Paquete A (Identidad y Autenticación)
* **Calificación:** **100 / 100**
* **Historias Implementadas:** `HU-001`, `HU-003`, `HU-006` (Sprint 1) y `HU-022` (Sprint 2).
* **Justificación:**  
  Demostró un alto rigor técnico en el diseño de la seguridad del sistema. Implementó con éxito la autenticación de dos factores (2FA) para el administrador mediante la lectura y verificación criptográfica del archivo `auth2-ayd1.txt`, además del hashing con `bcrypt` para las contraseñas. Asistió puntualmente a las reuniones diarias, mantuvo sus tarjetas actualizadas en Trello y entregó los requerimientos de restricción (RRs) y escenarios de calidad (EACs) en tiempo y forma.

---

### 2. Isai Patzán — Paquete B (Tutor: Identidad y Horarios)
* **Calificación:** **100 / 100**
* **Historias Implementadas:** `HU-002`, `HU-007`, `HU-008` (Sprint 1), `HU-019` y `HU-023` (Sprint 2).
* **Justificación:**  
  Lideró la inicialización del contenedor de base de datos MySQL 8.0 en Docker (`TECH-001`) con esquemas y tablas normalizadas que sirvieron de cimiento para todo el equipo. Implementó la lógica de configuración homogénea de horarios y la compleja validación que impide recortar horarios si existen tutorías agendadas activas. Asistencia perfecta a las 12 Dailies y documentación técnica de base de datos impecable.

---

### 3. Alvaro Ceballos — Paquete C (Administración de Usuarios y Scrum Master)
* **Calificación:** **100 / 100**
* **Historias Implementadas:** `HU-004`, `HU-005` (Sprint 1), `HU-024`, `HU-025` y `HU-026` (Sprint 2).
* **Justificación:**  
  Como Scrum Master, facilitó la correcta ejecución de todas las ceremonias del marco ágil (Plannings, Dailies y Retrospectivas), gestionó el tablero Trello público y estructuró la carpeta documental `Scrumban/`. Como desarrollador, completó los flujos de aprobación y rechazo de usuarios, las bajas lógicas en cascada y el Reporte 1 con gráficos interactivos y exportación dual a CSV y PDF sin emojis.

---

### 4. Yury — Paquete D (Descubrimiento y Disponibilidad)
* **Calificación:** **100 / 100**
* **Historias Implementadas:** `HU-009`, `HU-011` (Sprint 1), `HU-010` y `HU-027` (Sprint 2).
* **Justificación:**  
  Desarrolló el buscador avanzado con 5 filtros combinables y dinámicos (`HU-010`, la historia de mayor complejidad estimada con talla L), aplicando debounce para optimizar peticiones al backend. Elaboró la documentación de heurísticas de Jakob Nielsen y la guía de estilos UI/UX. Participación activa y proactiva en todas las ceremonias de Scrum sin incidencias.

---

### 5. Nicole López — Paquete E (Sesiones del Estudiante)
* **Calificación:** **100 / 100**
* **Historias Implementadas:** `HU-012`, `HU-016` (Sprint 1), `HU-013` y `HU-020` (Sprint 2).
* **Justificación:**  
  Diseñó y programó el motor matemático de prevención de traslapes horarios y validación de días laborables para las reservas de tutoría, evitando colisiones de agenda. Implementó las vistas de sesiones activas e historial del estudiante con renderizado del resumen pedagógico. Mantuvo una comunicación constante y entregó el Manual de Usuario integral de los tres roles.

---

### 6. Xavi De León — Paquete F (Sesiones del Tutor y Notificaciones / Product Owner)
* **Calificación:** **100 / 100**
* **Historias Implementadas:** `HU-017` (Sprint 1), `HU-014`, `HU-015`, `HU-018` y `HU-021` (Sprint 2).
* **Justificación:**  
  Como Product Owner, veló por la definición de criterios de aceptación verificables y la coherencia del Product Backlog. Como desarrollador, configuró el servicio transaccional SMTP con Nodemailer y Mailtrap para el envío automático de correos de disculpa por cancelación, e implementó la obligatoriedad del resumen pedagógico en la atención de estudiantes. Gestión ejemplar de Pull Requests y cumplimiento total de entregables.

---

## 5. Conclusión y Veredicto del Scrum Master

El equipo de desarrollo de **EduConnect (Grupo 4)** demostró un nivel sobresaliente de cohesión, disciplina metodológica y destreza técnica. Se completaron exitosamente las **27 historias de usuario** y las **91 tareas técnicas planificadas**, alcanzando el **100% de cumplimiento en la columna DONE** sin deuda técnica pendiente. 

Por tanto, en mi calidad de Scrum Master, asigno la **máxima calificación de 100 puntos** a todos y cada uno de los integrantes del equipo.

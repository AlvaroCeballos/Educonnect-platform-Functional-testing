# Evaluación de Desempeño del Equipo de Desarrollo — Scrum Master (Fase 2)

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería**  
**Escuela de Ciencias y Sistemas**  
**Análisis y Diseño de Sistemas 1 — 2do Semestre 2026**  
**Proyecto 1:** EduConnect — Plataforma de Gestión de Tutorías Académicas (Fase 2)  
**Evaluador:** Alvaro Ceballos (Carnet: `202300673`) — Scrum Master  

---

## 1. Introducción y Marco Metodológico de Evaluación

De conformidad con las especificaciones del enunciado del proyecto para la **Fase 2** (Sección "Entregables — Calificación del Scrum Master"), el presente documento formaliza la auditoría y evaluación del desempeño individual y colaborativo de los integrantes del equipo Scrum durante el ciclo de vida de la **Fase 2 de EduConnect**.

El proyecto se ejecutó bajo la metodología híbrida **Scrumban** (Scrum con flujo visual Kanban), estructurado en **2 Sprints de desarrollo**:
- **Sprint 1 (Días 1 al 8 — del 5 al 12 de octubre de 2026):** Núcleo de Validación con Tokens, Planes Estructurados y Pipeline CI/CD.
- **Sprint 2 (Días 8 al 15 — del 12 al 19 de octubre de 2026):** Despliegue Cloud, Constancias PDF, Moderación Disciplinaria y Cierre Técnico.

La evaluación se basa en el compromiso individual, la puntualidad en ceremonias, la calidad técnica del código, la cobertura de pruebas unitarias y E2E, y el cumplimiento estricto del estándar Git Flow.

---

## 2. Criterios de Evaluación y Rúbrica (Escala de 1 a 100 Puntos)

Cada miembro del equipo fue auditado bajo cuatro dimensiones clave ponderadas con **25 puntos cada una**:

1. **Gestión y Cumplimiento en el Tablero Kanban (25 pts):**  
   Desglose técnico de historias de usuario en tareas atómicas (`T-###`), transición continua desde `TO-DO` hacia `DONE` con evidencias verificadas, respetando los límites WIP y sin arrastrar deuda técnica al cierre de sprint.
2. **Asistencia, Puntualidad y Liderazgo en Ceremonias Scrum (25 pts):**  
   Participación activa en las 2 sesiones de Sprint Planning, las 12 sesiones de Daily Scrum y las 2 Sprint Retrospectives, respondiendo con transparencia a los tres pilares del daily (qué hice, qué haré, impedimentos).
3. **Calidad Técnica, Testing (Unitario y E2E) y Entorno Docker (25 pts):**  
   Desarrollo de código modular y desacoplado, suite de 5 pruebas unitarias (`PU-##`) automatizadas y aprobadas, 1 prueba de extremo a extremo (`E2E-##`) en Cypress/Selenium, y garantía de funcionamiento en Docker Compose.
4. **Colaboración Cruzada, Git Flow y Documentación (25 pts):**  
   Gestión rigurosa de ramas (`feature/carnet` hacia `develop`), resolución proactiva de bloqueos entre paquetes de trabajo y entrega oportuna de los artefactos documentales oficiales (manuales, CUNs, requerimientos, arquitectura).

---

## 3. Matriz General de Calificaciones — Fase 2

| No. | Integrante | Carnet / ID | Rol Scrum | Paquete Asignado en Fase 2 | HUs Sprint 1 | HUs Sprint 2 | Pruebas Unitarias | Prueba E2E | Calificación Final | Estado |
| :-: | :--- | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :-: | :-: |
| 1 | **Yury** | Developer | Dev Team | **Paquete A:** Identidad, Tokens y PDFs Estudiante | HU-028, HU-030 | HU-031 | **PU-01 a PU-05** | **E2E-01** | **100 / 100** | **Excelente** |
| 2 | **Xavi De León** | Developer | Dev Team | **Paquete B:** CV Tutor, Visores PDF y Despliegue | HU-029, HU-039 | HU-040, HU-050 | **PU-06 a PU-10** | **E2E-02** | **100 / 100** | **Excelente** |
| 3 | **Alvaro Ceballos** | `202300673` | Scrum Master / Dev | **Paquete C:** Moderación, Denuncias y Cuentas | HU-041, HU-043 | HU-042, HU-044 | **PU-11 a PU-15** | **E2E-03** | **100 / 100** | **Excelente** |
| 4 | **Wade** | Developer | Dev Team | **Paquete D:** Métricas, Calificaciones y Reportes | HU-045, HU-047 | HU-046, HU-048 | **PU-16 a PU-20** | **E2E-04** | **100 / 100** | **Excelente** |
| 5 | **Nicole López** | Developer | Dev Team | **Paquete E:** Planes Estructurados y Constancia | HU-032, HU-033 | HU-034 | **PU-21 a PU-25** | **E2E-05** | **100 / 100** | **Excelente** |
| 6 | **Isai Patzán** | Product Owner | Dev Team | **Paquete F:** Feedback (Ratings/Quejas) y CI/CD | HU-035, HU-049 | HU-036, HU-037, HU-038 | **PU-26 a PU-30** | **E2E-06** | **100 / 100** | **Excelente** |

---

## 4. Justificación Cualitativa y Desglose por Integrante

### 1. Yury — Paquete A (Identidad, Tokens y PDFs Estudiante)
* **Calificación Cuantitativa:** Kanban: 25/25 | Ceremonias: 25/25 | Calidad & Testing: 25/25 | Docs & Git Flow: 25/25 $\rightarrow$ **100 / 100**
* **Historias Completadas:** `HU-028` (Carga de carnet PDF), `HU-030` (Generación de token criptográfico de 6 caracteres y correo Mailtrap) y `HU-031` (Primer login con validación dual).
* **Pruebas y Evidencias:** Pruebas unitarias `PU-01` a `PU-05` (validación de hashes, token de 24h y verificación de tipos MIME). Flujo `E2E-01` completado.
* **Justificación:**  
  Yury asumió con sobresaliente responsabilidad la capa de autenticación y tokenización de la Fase 2. Su módulo utilitario de generación de tokens y despacho SMTP hacia Mailtrap fue fundamental para desbloquear el flujo de inicio de sesión de todos los nuevos integrantes. Cumplió con los documentos de requerimientos no funcionales (RRs y EACs bajo ISO 25010) y demostró puntualidad absoluta en los 12 Dailies.

---

### 2. Xavi De León — Paquete B (CV Tutor, Visores PDF y Despliegue)
* **Calificación Cuantitativa:** Kanban: 25/25 | Ceremonias: 25/25 | Calidad & Testing: 25/25 | Docs & Git Flow: 25/25 $\rightarrow$ **100 / 100**
* **Historias Completadas:** `HU-029` (Registro con CV en PDF), `HU-039` (Aprobación de estudiantes con visor embebido de carnet), `HU-040` (Aprobación de tutores con visor embebido de CV) y `HU-050` (Contenedorización multi-stage de Frontend en Docker).
* **Pruebas y Evidencias:** Pruebas unitarias `PU-06` a `PU-10` (gestión de streams, uploads seguros con UUID v4) y flujo `E2E-02`.
* **Justificación:**  
  Lideró la estructuración inicial del DDL de base de datos en `init.sql` incorporando las columnas de persistencia de archivos PDF y la tabla de planes estructurados. Implementó con maestría los visores embebidos de documentos binarios en el panel administrativo, permitiendo al administrador auditar carnets y currículums sin requerir descargas externas. Excelente gestión de Docker Compose y aportes en el Manual Técnico.

---

### 3. Alvaro Ceballos — Paquete C (Moderación, Denuncias y Cuentas / Scrum Master)
* **Calificación Cuantitativa:** Kanban: 25/25 | Ceremonias: 25/25 | Calidad & Testing: 25/25 | Docs & Git Flow: 25/25 $\rightarrow$ **100 / 100**
* **Historias Completadas:** `HU-041` (Gestión de estudiantes con correo inmutable), `HU-043` (Panel de denuncias contra tutores), `HU-042` (Edición de tutores con correo inmutable y dossier modal) y `HU-044` (Panel de denuncias contra estudiantes).
* **Pruebas y Evidencias:** Pruebas unitarias `PU-11` a `PU-15` más suite de moderación bidireccional (78 pruebas unitarias aprobadas al 100%), especificación `E2E-03` en Cypress y runner de integración.
* **Justificación:**  
  Como Scrum Master, veló por la cadencia metodológica del equipo, coordinando los 2 Plannings, 12 Dailies y 2 Retrospectivas, asegurando que ningún miembro quedara bloqueado por dependencias técnicas. En el rol de desarrollador, diseñó un motor transaccional polimórfico de moderación disciplinaria capaz de sancionar con baja automática (`DISABLED`) a tutores y estudiantes infractores, garantizando la inmutabilidad de los correos electrónicos.

---

### 4. Wade — Paquete D (Métricas, Calificaciones y Reportes Analíticos)
* **Calificación Cuantitativa:** Kanban: 25/25 | Ceremonias: 25/25 | Calidad & Testing: 25/25 | Docs & Git Flow: 25/25 $\rightarrow$ **100 / 100**
* **Historias Completadas:** `HU-045` (Promedio de estrellas de tutores), `HU-047` (Reporte analítico temporal de sesiones por semana y mes con Chart.js), `HU-046` (Promedio de calificaciones de estudiantes) y `HU-048` (Métricas de cancelación y horas pico).
* **Pruebas y Evidencias:** Pruebas unitarias `PU-16` a `PU-20` (algoritmos de agregación, promedios ponderados y tasas porcentuales de cancelación) y prueba `E2E-04`.
* **Justificación:**  
  Wade demostró una gran destreza en el frontend y en la visualización interactiva de datos. Integró bibliotecas de gráficos responsivos que reflejan en tiempo real el comportamiento pedagógico de la plataforma. Cumplió rigurosamente con la documentación de Heurísticas de Nielsen (`UI_UX/principios_nielsen.md`) y el reporte compilado de pruebas E2E.

---

### 5. Nicole López — Paquete E (Planes Estructurados y Constancia PDF)
* **Calificación Cuantitativa:** Kanban: 25/25 | Ceremonias: 25/25 | Calidad & Testing: 25/25 | Docs & Git Flow: 25/25 $\rightarrow$ **100 / 100**
* **Historias Completadas:** `HU-032` (Formulario estructurado de atención con dificultades y recursos dinámicos), `HU-033` (Visualización de plan para estudiante) y `HU-034` (Generador de constancia de tutoría en PDF con membrete institucional).
* **Pruebas y Evidencias:** Pruebas unitarias `PU-21` a `PU-25` (validación de recursos pedagógicos requeridos, integridad de datos del PDF) y prueba `E2E-05`.
* **Justificación:**  
  Aportó un valor pedagógico fundamental a la plataforma mediante el motor de planes estructurados. Desarrolló el servicio de renderizado de constancias en PDF con membrete y pie de firma digital sin errores de codificación. Redactó la Matriz de Requerimientos Funcionales (`RFs-requerimientos-funcionales.md`) y el Manual de Usuario ilustrado.

---

### 6. Isai Patzán — Paquete F (Feedback y Pipeline CI/CD / Product Owner)
* **Calificación Cuantitativa:** Kanban: 25/25 | Ceremonias: 25/25 | Calidad & Testing: 25/25 | Docs & Git Flow: 25/25 $\rightarrow$ **100 / 100**
* **Historias Completadas:** `HU-035` (Calificación de tutores 0-5 estrellas), `HU-049` (Pipeline CI/CD en GitHub Actions con jobs de Build, Test y Deploy con costo $0.00), `HU-036` (Reporte de quejas contra tutores), `HU-037` (Calificación de estudiantes) y `HU-038` (Reporte de quejas contra estudiantes).
* **Pruebas y Evidencias:** Pruebas unitarias `PU-26` a `PU-30` (validación de catálogos disciplinarios y restricciones de sesión atendida) y prueba `E2E-06`.
* **Justificación:**  
  Como Product Owner, mantuvo el Product Backlog priorizado y redactó los CUN Core y Descomposiciones. En infraestructura, diseñó el pipeline de GitHub Actions (`backend-ci-cd.yml`) ejecutando build, tests automatizados y despliegue continuo en el runner sin costos cloud, cumpliendo con la máxima exigencia de DevOps de la Fase 2.

---

## 5. Conclusión y Veredicto del Scrum Master

El equipo de desarrollo de **EduConnect (Grupo 4 — Segundo Semestre 2026)** culminó la **Fase 2** de manera impecable:
- **100% de Historias de Usuario completadas** (`HU-028` a `HU-050`).
- **30 Pruebas Unitarias oficiales (`PU-01` a `PU-30`) y 6 Pruebas E2E (`E2E-01` a `E2E-06`) totalmente operativas.**
- **Pipeline de CI/CD automatizado y operativo.**
- **Deuda técnica: 0%.**

Por lo expuesto, en mi calidad de **Scrum Master**, ratifico y otorgo la **calificación perfecta de 100 puntos** a todos los integrantes del equipo.

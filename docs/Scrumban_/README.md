# Scrumban: Guía General de Gestión y Metodología (EduConnect)

Esta carpeta concentra todos los artefactos, actas formales y documentación técnica utilizados para gestionar el desarrollo de la plataforma **EduConnect** bajo la metodología híbrida **Scrumban** (Scrum con control visual Kanban) a lo largo de la **Fase 1** y la **Fase 2**.

---

## Estructura de la Documentación

Todos los documentos del directorio siguen la jerarquía unificada por fases y sprints:
```markdown
# 1. Fase 1
## 1.1 Sprint 1
## 1.2 Sprint 2

# 2. Fase 2
## 2.1 Sprint 1
## 2.2 Sprint 2
```

### 1. Product Backlog
- **Archivo:** [`historias_usuario.md`](historias_usuario.md)
- **Contenido:**
  - Catálogo completo de las 50 historias de usuario (27 de Fase 1 + 23 de Fase 2).
  - Criterios de aceptación detallados y estimación en tallas de camiseta (*T-Shirt Size*) por consenso con capturas de evidencia.
  - Priorización visual por código de colores (Alta 🟥, Media 🟨, Baja 🟦).

### 2. Sprint Backlog y Tareas Técnicas
- **Archivos:** [`sprint_backlog.md`](sprint_backlog.md) y [`listaTareas.md`](listaTareas.md)
- **Contenido:**
  - Desglose técnico de 160 tareas en total (91 tareas en Fase 1 + 69 tareas en Fase 2) distribuidas en los paquetes técnicos A al F.
  - Objetivos de cada iteración (*Sprint Goals*), fechas de ejecución y definición de alcance.

### 3. Tablero Kanban y Políticas de Flujo
- **Archivo:** [`tablero_kanban.md`](tablero_kanban.md)
- **Contenido:**
  - Definición de columnas (`TO-DO`, `BLOCKED`, `IN PROGRESS`, `TEST/QA`, `DEPLOY` y `DONE`).
  - Políticas explícitas de límites WIP (Work in Progress), Definition of Done (DoD) y reglas de transición.
  - Enlaces directos a las evidencias de evolución en formato PDF para ambas fases.

### 4. Eventos Scrum y Actas de Dailies
- **Archivo:** [`scrum_meetings.md`](scrum_meetings.md)
- **Contenido:**
  - Actas formales de las 4 sesiones de Sprint Planning y 4 Sprint Retrospectives con enlaces directos a las grabaciones en Google Drive.
  - Registro cronológico detallado de las **24 sesiones de Daily Scrum** (12 en Fase 1 y 12 en Fase 2) con las 3 preguntas clave por cada uno de los 6 integrantes del equipo.

### 5. Evaluación de Desempeño del Scrum Master
- **Archivo:** [`Evaluacion_SM.md`](Evaluacion_SM.md)
- **Contenido:**
  - Auditoría cuantitativa y cualitativa (escala 1 a 100) del desempeño individual de los 6 integrantes en las cuatro dimensiones evaluadas por el Scrum Master.

### 6. Evidencias del Tablero en PDF
- **Fase 1:** [`tableros/`](tableros/) — 14 archivos PDF con el registro de Planning 1 y 2, Dailies 1 al 12 y Retrospectivas 1 y 2.
- **Fase 2:** [`tableroFase2/`](tableroFase2/) — 14 archivos PDF con fechas y horas oficiales sincronizadas mediante script automatizado (`actualizar_fechas_tableros.py`).

### 7. Recursos Visuales
- **Directorio:** [`imgs_kanban/`](imgs_kanban/) — Evidencias de tableros Trello, etiquetas de trabajo y planillas de estimación de tallas por camiseta.

---

## Herramientas Utilizadas
- **Trello:** Plataforma visual para el seguimiento Kanban del flujo de desarrollo ([Acceder al Tablero AYD1 - EduConnect](https://trello.com/invite/b/6a8e3c36dcf32de42c7d8d45/ATTIc16aa6c7be21da464d3dabfea5738f984D9AE89F/ayd1-educonnect)).
- **Google Drive:** Almacenamiento seguro de las grabaciones de video de las ceremonias de Scrum ([Carpeta de Grabaciones Fase 2](https://drive.google.com/drive/folders/1QWwwTloNce28EC7Sr9hJwT0NTGPDOz8o?usp=sharing)).
- **PyMuPDF / Python:** Scripting automatizado para la trazabilidad y estandarización de encabezados en evidencias PDF.
- **Markdown & GitHub:** Estándar de documentación técnica y control de versiones bajo Git Flow.

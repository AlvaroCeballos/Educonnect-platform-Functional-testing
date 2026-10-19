# EduConnect — Plataforma de Gestión de Tutorías Académicas

**Universidad de San Carlos de Guatemala**  
**Facultad de Ingeniería**  
**Escuela de Ciencias y Sistemas**  
**Análisis y Diseño de Sistemas 1 — 2do Semestre 2026**  
**Grupo de Proyecto No. 4**  

---

## 1. Información General del Proyecto

EduConnect es una solución web integral diseñada para transformar y optimizar los procesos de tutorías académicas universitarias. Facilita la interacción estructurada entre estudiantes, tutores y administradores, permitiendo la programación de sesiones con motor anti-traslapes, gestión de horarios, atención pedagógica con resúmenes obligatorios, cancelaciones automatizadas con notificación por correo y analítica de datos institucionales.

* **Enlace al Tablero Kanban en Trello:** [AYD1 - EduConnect en Trello](https://trello.com/invite/b/6a8e3c36dcf32de42c7d8d45/ATTIc16aa6c7be21da464d3dabfea5738f984D9AE89F/ayd1-educonnect)
* **Grabaciones de Ceremonias Scrum (Google Drive):** [Carpeta Oficial de Grabaciones — EduConnect](https://drive.google.com/drive/folders/1rvvSWr96XIK4oucYvsTCyCKgbpPEsfQs?usp=sharing)

---

## 2. Integrantes del Equipo (Fase 2)

| No. | Integrante | Rol Scrum | Carnet | Paquete Asignado (Fase 2) | Historias / Responsabilidades |
| :-: | :--- | :---: | :---: | :--- | :--- |
| 1 | **Alvaro Ceballos** | **Scrum Master** & Dev | 202300673 | **Paquete C:** Moderación, Denuncias y Cuentas | HU-041, HU-042, HU-043, HU-044, PU-11 a PU-15, E2E-03, Evaluación SM, README |
| 2 | **Yury** | Developer | — | **Paquete A:** Identidad, Tokens y PDFs Estudiante | HU-028, HU-030, HU-031, PU-01 a PU-05, E2E-01, Requerimientos (RRs, EACs) |
| 3 | **Xavi Alexander De León** | Developer | — | **Paquete B:** CV Tutor, Visores PDF y Despliegue | HU-029, HU-039, HU-040, HU-050, PU-06 a PU-10, E2E-02, init.sql, DER 3FN |
| 4 | **Wade / Katheryn** | Developer | — | **Paquete D:** Métricas, Calificaciones y Reportes F2 | HU-045, HU-046, HU-047, HU-048, PU-16 a PU-20, E2E-04, Nielsen UI/UX, Figma |
| 5 | **Nicole López** | Developer | — | **Paquete E:** Planes Estructurados y Constancia PDF | HU-032, HU-033, HU-034, PU-21 a PU-25, E2E-05, RFs, Manual de Usuario |
| 6 | **Isai Patzán** | **Product Owner** & Dev | — | **Paquete F:** Feedback y Pipeline CI/CD | HU-035, HU-036, HU-037, HU-038, HU-049, PU-26 a PU-30, E2E-06, CI/CD Runner |

---

## 3. Índice General de Documentación

Toda la documentación técnica, casos de uso, requerimientos y gestión ágil del proyecto se encuentra centralizada en la carpeta [`docs/`](docs/):

### Metodología y Gestión de Proyecto (Scrumban)
* [`docs/Scrumban_/README.md`](docs/Scrumban_/README.md): Guía metodológica general del proceso Scrumban.
* [`docs/Scrumban_/historias_usuario.md`](docs/Scrumban_/historias_usuario.md): Product Backlog con Historias de Usuario priorizadas y criterios de aceptación Gherkin.
* [`docs/Scrumban_/sprint_backlog.md`](docs/Scrumban_/sprint_backlog.md): Sprint Goals, alcance y desglose de tareas técnicas con verificación de Paquete C.
* [`docs/Scrumban_/tablero_kanban.md`](docs/Scrumban_/tablero_kanban.md): Modelo Kanban en Trello, flujo de 5 columnas normativas y evidencias.
* [`docs/Scrumban_/scrum_meetings.md`](docs/Scrumban_/scrum_meetings.md): Bitácora de eventos Scrum (Plannings, Dailies y Retrospectivas) con enlaces a grabaciones.
* [`docs/Evaluacion_SM.md`](docs/Evaluacion_SM.md): Evaluación formal de desempeño emitida por el Scrum Master (100/100 para todos los integrantes con desglose de 4 dimensiones).

### Arquitectura, Requerimientos y Casos de Uso
* [`docs/Arquitectura_y_BaseDatos/manual_tecnico.md`](docs/Arquitectura_y_BaseDatos/manual_tecnico.md): Manual técnico de arquitectura, Docker, endpoints y seguridad 2FA.
* [`docs/Arquitectura_y_BaseDatos/diagrama_entidad_relacion.md`](docs/Arquitectura_y_BaseDatos/diagrama_entidad_relacion.md): Modelo relacional y esquema físico de base de datos MySQL 8.0 en 3FN.
* [`docs/Casos_de_uso/0.1-core.md`](docs/Casos_de_uso/0.1-core.md): Caso de uso core del negocio.
* [`docs/Casos_de_uso/0.2-primera-descomposicion.md`](docs/Casos_de_uso/0.2-primera-descomposicion.md): Primera descomposición funcional del sistema.
* [`docs/Casos_de_uso/0.3-cun-expandidos.md`](docs/Casos_de_uso/0.3-cun-expandidos.md): Casos de uso expandidos por módulo.
* [`docs/Casos_de_uso/0.3-descripciones-textuales.md`](docs/Casos_de_uso/0.3-descripciones-textuales.md): Descripciones textuales formales de 11 campos para todos los paquetes (incluyendo CU-ADM-08 a CU-ADM-11 de Paquete C).
* [`docs/Requerimientos/RFs-requerimientos-funcionales.md`](docs/Requerimientos/RFs-requerimientos-funcionales.md): Matriz de requerimientos funcionales.
* [`docs/Requerimientos/RRs-requerimientos-restriccion.md`](docs/Requerimientos/RRs-requerimientos-restriccion.md): Requerimientos de restricción.
* [`docs/Requerimientos/EACs-requerimientos-calidad.md`](docs/Requerimientos/EACs-requerimientos-calidad.md): Escenarios de atributos de calidad (ISO/IEC 25010).

---

## 4. Guía Rápida de Instalación y Ejecución con Docker

### Requisitos Previos
* Docker y Docker Compose instalados.
* Git.

### Pasos para Levantar el Entorno Local
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/GabeKt/AYD1_2S_G4.git
   cd AYD1_2S_G4
   ```

2. **Levantar los servicios:**
   ```bash
   docker compose up --build
   ```

3. **Acceso a los servicios:**
   * **Frontend:** `http://localhost:3000`
   * **Backend / API:** `http://localhost:5000`
   * **Base de Datos:** MySQL en el puerto `3306`

4. **Credenciales predeterminadas de Administrador (con 2FA):**
   * **Correo:** `admin@educonnect.com`
   * **Contraseña inicial:** `Admin123!`
   * **Segundo Factor (Archivo):** Subir el archivo [`auth2-ayd1.txt`](auth2-ayd1.txt) ubicado en la raíz del repositorio.

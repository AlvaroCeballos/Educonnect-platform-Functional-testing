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

## 2. Integrantes del Equipo

| No. | Nombre Completo | Carnet / ID | Rol Scrum | Paquete Técnico Asignado |
| :-: | :--- | :---: | :---: | :--- |
| 1 | **Alvaro Ceballos** | **Scrum Master** & Dev | **Paquete C:** Administración de Usuarios y Reportes |
| 2 | **Katheryn / Wade** | Developer | **Paquete A:** Identidad y Autenticación |
| 3 | **Isai Patzán Tzic** | Developer | **Paquete B:** Tutor: Identidad y Horarios |
| 4 | **Yury** | Developer | **Paquete D:** Descubrimiento y Disponibilidad |
| 5 | **Yulianne Nicole López Elias** | Developer | **Paquete E:** Sesiones del Estudiante |
| 6 | **Xavi Alexander De León Perdomo** | **Product Owner** & Dev | **Paquete F:** Sesiones del Tutor y Notificaciones |

---

## 3. Índice General de Documentación

Toda la documentación técnica, casos de uso, requerimientos y gestión ágil del proyecto se encuentra centralizada en la carpeta [`docs/`](docs/):

### Metodología y Gestión de Proyecto (Scrumban)
* [`docs/Scrumban2/README.md`](docs/Scrumban2/README.md): Guía metodológica general del proceso Scrumban.
* [`docs/Scrumban2/historias_usuario.md`](docs/Scrumban2/historias_usuario.md): Product Backlog con 27 Historias de Usuario priorizadas, criterios de aceptación y matrices de estimación consensuada en Excel.
* [`docs/Scrumban2/sprint_backlog.md`](docs/Scrumban2/sprint_backlog.md): Sprint Goals, alcance y desglose de las 91 tareas técnicas para los Sprints 1 y 2.
* [`docs/Scrumban2/tablero_kanban.md`](docs/Scrumban2/tablero_kanban.md): Modelo Kanban en Trello, flujo de 5 columnas, etiquetas y capturas de evolución.
* [`docs/Scrumban2/scrum_meetings.md`](docs/Scrumban2/scrum_meetings.md): Bitácora de 16 eventos Scrum (2 Plannings, 12 Dailies con 6 integrantes y 2 Retrospectivas) con enlaces a evidencias PDF.
* [`docs/Scrumban2/listaTareas.md`](docs/Scrumban2/listaTareas.md): Listado de 91 tareas técnicas sincronizadas con Trello.
* [`docs/Evaluacion_SM.md`](docs/Evaluacion_SM.md): Evaluación formal de desempeño emitida por el Scrum Master (100/100 para todos los integrantes).

### Arquitectura, Requerimientos y Casos de Uso
* [`docs/Arquitectura_y_BaseDatos/manual_tecnico.md`](docs/Arquitectura_y_BaseDatos/manual_tecnico.md): Manual técnico de arquitectura, Docker, endpoints y seguridad 2FA.
* [`docs/Arquitectura_y_BaseDatos/diagrama_entidad_relacion.md`](docs/Arquitectura_y_BaseDatos/diagrama_entidad_relacion.md): Modelo relacional y esquema físico de base de datos MySQL 8.0.
* [`docs/Casos_de_uso/0.1-core.md`](docs/Casos_de_uso/0.1-core.md): Caso de uso core del negocio.
* [`docs/Casos_de_uso/0.2-primera-descomposicion.md`](docs/Casos_de_uso/0.2-primera-descomposicion.md): Primera descomposición funcional del sistema.
* [`docs/Casos_de_uso/0.3-cun-expandidos.md`](docs/Casos_de_uso/0.3-cun-expandidos.md): Casos de uso expandidos por módulo.
* [`docs/Casos_de_uso/0.3-descripciones-textuales.md`](docs/Casos_de_uso/0.3-descripciones-textuales.md): Descripciones textuales formales de los casos de uso.
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

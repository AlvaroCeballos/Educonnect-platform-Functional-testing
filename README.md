# EduConnect — Plataforma de Gestión de Tutorías Académicas
> **Portafolio de Aseguramiento de Calidad (QA), Pruebas Funcionales y Gestión Ágil**  
> Proyecto Full-Stack y Suite de Verificación desarrollado bajo metodología **Scrumban (Fase 1 y Fase 2)**, integrando análisis de requerimientos, diseño de escenarios de prueba, consultas SQL de validación y automatización de pruebas unitarias y End-to-End (E2E).

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=github-actions)](https://github.com/GabeKt/AYD1_2S_G4)
[![Unit Tests](https://img.shields.io/badge/Unit%20Tests-90%2F90%20Passing-brightgreen?logo=node.js)](backend/test/)
[![E2E Coverage](https://img.shields.io/badge/E2E%20Tests-Cypress%20Automated-brightgreen?logo=cypress)](frontend/cypress/e2e/)
[![Database](https://img.shields.io/badge/Database-MySQL%208.0-orange?logo=mysql)](backend/init.sql)
[![Environment](https://img.shields.io/badge/Environment-Docker%20Compose-2496ED?logo=docker)](docker-compose.yml)

---

##  1. Guía del Repositorio

Para facilitar la auditoría técnica y la revisión del perfil de QA / Tester Funcional, la siguiente tabla mapea cada competencia profesional con su ubicación exacta en el repositorio:

| Área de Competencia | ¿Qué contiene? | Ubicación en el Repositorio |
| :--- | :--- | :--- |
| **Análisis de Requerimientos** | Requerimientos Funcionales (RF), Restricción (RR) y Atributos de Calidad (EAC - ISO 25010). | [`docs/Requerimientos/`](docs/Requerimientos/) |
| **Casos de Uso** | Casos de uso Core, primera descomposición y descripciones textuales formales (11 campos). | [`docs/Casos_de_uso/`](docs/Casos_de_uso/) |
| **Historias de Usuario & Criterios** | Product Backlog priorizado, Historias de Usuario (HU-001 a HU-050) y criterios Gherkin. | [`docs/Scrumban_/historias_usuario.md`](docs/Scrumban_/historias_usuario.md) |
| **Gestión Ágil (Scrumban)** | Sprint Backlogs, tableros Trello/Kanban, minutas de Dailies, Plannings y Retrospectivas. | [`docs/Scrumban_/`](docs/Scrumban_/) |
| **Diseño y Evidencias de Pruebas** | Matrices de casos de prueba, diseño de escenarios, capturas de pantalla y reportes de QA. | [`docs/Pruebas/`](docs/Pruebas/) |
| **Pruebas Unitarias Automatizadas** | 21 suites de prueba (90 tests) para lógica de negocio, colisiones y seguridad con Node.js. | [`backend/test/`](backend/test/) |
| **Pruebas E2E (Flujos Completos)** | Suites de automatización Cypress simulando flujos reales de estudiante, tutor y administrador. | [`frontend/cypress/e2e/`](frontend/cypress/e2e/) |
| **Base de Datos y Scripts SQL** | Esquema DDL en 3FN, migraciones incrementales, contratos de datos y datasets de prueba (seeds). | [`backend/init.sql`](backend/init.sql) & [`backend/migrations/`](backend/migrations/) |
| **Arquitectura & Manuales** | Diagramas C4/Docker, manual técnico de endpoints y manual de usuario final. | [`docs/Arquitectura_y_BaseDatos/`](docs/Arquitectura_y_BaseDatos/) & [`docs/Manuales/`](docs/Manuales/) |
| **Diseño UI/UX** | Evaluación heurística de Nielsen, prototipos y enlaces al diseño interactivo en Figma. | [`docs/UI_UX/`](docs/UI_UX/) |

---

## 2. Resumen Funcional

El sistema modela reglas de negocio de alta concurrencia y criticidad transaccional distribuidas en tres roles (**Estudiante**, **Tutor** y **Administrador**):

### Fase 1: Núcleo de Gestión y Agendamiento
* **Registro y Autenticación:** Registro diferenciado de perfiles; autenticación 2FA para administrador mediante archivo de clave (`auth2-ayd1.txt`).
* **Motor de Agendamiento Anti-Traslapes:** Validación algorítmica para evitar doble reserva (*double-booking*) en la misma fecha/hora con el mismo tutor o materias solapadas.
* **Gestión de Horarios y Cancelaciones:** Configuración de disponibilidad semanal para tutores y flujo de cancelación con liberación automática de horario y envío de correo.
* **Aprobación Administrativa:** Flujo de auditoría previa de perfiles antes de habilitar el acceso a la plataforma.

### Fase 2: Robustecimiento, Seguridad, Calidad y Feedback
* **Validación de Correo con Token (HU-030 & HU-031):** Generación de token único de 6 caracteres; primer login exige `Email + Password + Token`. Limpieza segura de token tras verificación.
* **Verificación Documental en PDF (HU-028 & HU-029):** Subida y validación estricta de Carnet (Estudiante) y CV (Tutor) con visor integrado en dashboard administrativo.
* **Planes de Estudio Estructurados (HU-032 & HU-033):** Registro obligatorio de dificultades detectadas y recursos pedagógicos tipificados (Texto, Video, PDF, Enlace) al marcar una sesión como `ATTENDED`.
* **Generación de Constancias PDF (HU-034):** Descarga dinámica de certificados con validación de cabeceras HTTP de streaming.
* **Calificación Bidireccional y Denuncias (HU-036 a HU-038):** Calificación mutua (0 a 5 estrellas + comentario) únicamente en sesiones atendidas; sistema de reportes disciplinarios para moderación administrativa.
* **Dashboard Analítico (HU-045 a HU-048):** Métricas de demanda horaria agrupada por bloques de 1 hora, ranking de materias y promedios de satisfacción.

---

## 3. Enfoque de Pruebas Funcionales y Aseguramiento de Calidad (QA)

En línea con las mejores prácticas requeridas en consultoría informática y proyectos bancarios, la calidad se abordó en múltiples capas:

### 3.1. Análisis y Criterios de Aceptación (Gherkin)
Cada funcionalidad fue especificada con criterios Given-When-Then, sirviendo de base directa para los casos de prueba:
* *Consulte el desglose detallado en:* [`docs/Scrumban_/historias_usuario.md`](docs/Scrumban_/historias_usuario.md).

### 3.2. Pruebas de Base de Datos y Scripts SQL (Data Verification)
Se estructuraron scripts y consultas para validar que las transacciones respeten integridad referencial, estados válidos y persistencia ACID:
* **Esquema Inicial y Relaciones:** [`backend/init.sql`](backend/init.sql).
* **Migraciones de Esquema Fase 2:** [`backend/migrations/f2_schema_delta.sql`](backend/migrations/f2_schema_delta.sql).
* **Datasets de Prueba (Seeds):** [`backend/seeds_e2e.sql`](backend/seeds_e2e.sql), [`backend/seeds_fase2_metrics.sql`](backend/seeds_fase2_metrics.sql) y [`backend/seeds_fase2_incidents.sql`](backend/seeds_fase2_incidents.sql).
* **Ejemplos de Consultas de Auditoría:** Verificación de sesiones sin calificaciones inválidas, consistencia de planes de estudio huérfanos y limpieza de tokens de un solo uso.

### 3.3. Gestión del Ciclo de Vida de Defectos
Durante el desarrollo se detectaron, documentaron y mitigaron incidencias mediante pruebas de regresión, incluyendo:
* *Resolución de colisiones de proxy inverso en Nginx (`/api/` y `/uploads/`).*
* *Sincronización de eventos asíncronos en componentes React para evitar congelamientos en modales.*
* *Normalización y casteo de tipos en resolución de perfiles y restricciones compuestas en MySQL.*

### 3.4. Automatización de Pruebas
* **Pruebas Unitarias Backend:** 90 pruebas automatizadas sin dependencias externas (100% passing). Detalle en [`docs/Pruebas/pruebas_unitarias.md`](docs/Pruebas/pruebas_unitarias.md) y código en [`backend/test/`](backend/test/).
* **Pruebas End-to-End (E2E):** Cobertura de flujos completos de usuario con Cypress. Detalle y evidencias en [`docs/Pruebas/pruebas_e2e.md`](docs/Pruebas/pruebas_e2e.md) y código en [`frontend/cypress/e2e/`](frontend/cypress/e2e/).

---

##  4. Guía de Instalación y Ejecución Local

El proyecto está 100% contenerizado para garantizar repetibilidad en cualquier entorno operativo:

### Prerrequisitos
* Docker y Docker Compose instalados.
* Git.

### Pasos de Despliegue
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/GabeKt/AYD1_2S_G4.git
   cd AYD1_2S_G4
   ```

2. **Levantar los servicios:**
   ```bash
   docker compose up -d --build
   ```

3. **Acceso a los entornos:**
   * **Frontend Web:** [http://localhost:3000](http://localhost:3000)
   * **API Backend / Healthcheck:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
   * **Base de Datos MySQL:** Puerto `3307` (`educonnect_user` / `educonnect`)

4. **Credenciales predeterminadas para Auditoría:**
   * **Administrador:** `admin@educonnect.com` | Password: `Admin123!` | 2FA: Subir [`auth2-ayd1.txt`](auth2-ayd1.txt).
   * **Tutor de prueba:** `tutorcali2@gmail.com` | Password: `Passw0rd1`
   * **Estudiante de prueba:** `estudianteprueba@gmail.com` | Password: `Passw0rd1`

### Ejecución de Pruebas Automatizadas
```bash
# 1. Ejecutar las 90 Pruebas Unitarias del Backend:
docker exec educonnect_backend npm test

# 2. Ejecutar Pruebas E2E con Cypress (Modo Headless):
cd frontend
npm install
npx cypress run

# 3. Abrir Cypress en Modo Interactivo:
npx cypress open
```

---

##  5. Equipo de Proyecto y Metodología (Grupo 4)

El proyecto fue ejecutado bajo el marco ágil **Scrumban** con rotación y responsabilidades formalmente evaluadas:

| No. | Integrante | Rol Scrum | Carnet | Paquete / Responsabilidad Principal |
| :-: | :--- | :---: | :---: | :--- |
| 1 | **Alvaro Ceballos** | **Scrum Master** & Dev | 202300673 | **Paquete C:** Moderación, Denuncias, Gestión de Cuentas, Hotfixes y Suite E2E-03 |
| 2 | **Yury Cruz** | Developer | 202300359 | **Paquete A:** Identidad, Verificación de Tokens, Criterios de Aceptación y E2E-01 |
| 3 | **Xavi Alexander De León** | Developer | 202300596 | **Paquete B:** Validación CV PDF, Visores de Documentos, Modelo 3FN y E2E-02 |
| 4 | **Katheryn / Wade** | Developer | 202308940 | **Paquete D:** Métricas, Reportes de Demanda Horaria, Evaluación UI/UX y E2E-04 |
| 5 | **Nicole López** | Developer | 202300659 | **Paquete E:** Planes Estructurados, Validación de Recursos, Certificados PDF y E2E-05 |
| 6 | **Isai Patzán** | **Product Owner** & Dev | 202308204 | **Paquete F:** Sistema de Feedback, Calificaciones, Incidencias y Pipeline CI/CD |

* **Tablero Kanban:** [Trello Oficial del Proyecto](https://trello.com/invite/b/6a8e3c36dcf32de42c7d8d45/ATTIc16aa6c7be21da464d3dabfea5738f984D9AE89F/ayd1-educonnect)
* **Ceremonias Scrum:** [Grabaciones en Google Drive](https://drive.google.com/drive/folders/1rvvSWr96XIK4oucYvsTCyCKgbpPEsfQs?usp=sharing)
* **Evaluación Formal de Desempeño SM:** [`docs/Evaluacion_SM.md`](docs/Evaluacion_SM.md)

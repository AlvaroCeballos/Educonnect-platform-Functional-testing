# Sprint Backlog — Planificación y Asignación de Tareas

Este documento detalla la planificación de los dos ciclos de desarrollo del proyecto EduConnect, estableciendo los objetivos (Sprint Goals), las historias de usuario comprometidas y las tareas técnicas derivadas para cada miembro del equipo.

## Sprint 1: Núcleo Operativo (14 días)

**Sprint Goal:** Construir la base operativa de la plataforma. Esto incluye el registro de usuarios, inicio de sesión seguro, configuración de horarios iniciales, motor de programación de citas con prevención de traslapes, aprobación administrativa y la orquestación del entorno con Docker y MySQL.

| Historia de Usuario | Descripción Breve | Responsable | Paquete | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **HU-001** | Registro de estudiante | Wade | Paquete A | 🟥 Alta |
| **HU-002** | Registro de tutor | Isai | Paquete B | 🟥 Alta |
| **HU-003** | Autenticación 2FA de administrador | Wade | Paquete A | 🟥 Alta |
| **HU-004** | Aprobar/rechazar estudiante | Alvaro | Paquete C | 🟥 Alta |
| **HU-005** | Aprobar/rechazar tutor | Alvaro | Paquete C | 🟥 Alta |
| **HU-006** | Inicio de sesión de estudiante | Wade | Paquete A | 🟥 Alta |
| **HU-007** | Inicio de sesión de tutor | Isai | Paquete B | 🟥 Alta |
| **HU-008** | Establecer horario de atención | Isai | Paquete B | 🟥 Alta |
| **HU-009** | Visualizar tutores disponibles | Yury | Paquete D | 🟥 Alta |
| **HU-011** | Consultar horarios del tutor | Yury | Paquete D | 🟥 Alta |
| **HU-012** | Programar sesión con anti-traslapes | Nicole | Paquete E | 🟥 Alta |
| **HU-016** | Cancelar sesión por el estudiante | Nicole | Paquete E | 🟥 Alta |
| **HU-017** | Cancelar sesión por el tutor | Xavi | Paquete F | 🟥 Alta |

**Tareas Técnicas Derivadas (Sprint 1):**
*   **Wade:** Configurar esqueleto Express/React, middleware de autenticación (JWT) y encriptación `bcrypt`.
*   **Isai:** Levantar contenedor MySQL 8.0, volumen persistente y script DDL `init.sql`[cite: 1].
*   **Alvaro:** Crear datos semilla (`seeds.json`) y registrar ceremonias Scrum[cite: 1].
*   **Xavi:** Configurar transporte SMTP con Nodemailer y credenciales Mailtrap[cite: 1].

---

## Sprint 2: Completitud y Reportes (14 días)

**Sprint Goal:** Refinar la plataforma mediante la actualización segura de perfiles y horarios, implementar reportes analíticos para la toma de decisiones administrativas, y finalizar la documentación y evidencias del proyecto[cite: 1].

| Historia de Usuario | Descripción Breve | Responsable | Paquete | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **HU-010** | Búsqueda avanzada de tutores | Yury | Paquete D | 🟨 Media |
| **HU-013** | Visualizar sesiones activas | Nicole | Paquete E | 🟨 Media |
| **HU-014** | Visualizar sesiones pendientes | Xavi | Paquete F | 🟨 Media |
| **HU-015** | Marcar sesión como atendida | Xavi | Paquete F | 🟨 Media |
| **HU-020** | Historial de sesiones (Estudiante) | Nicole | Paquete E | 🟨 Media |
| **HU-021** | Historial de sesiones (Tutor) | Xavi | Paquete F | 🟨 Media |
| **HU-022** | Actualizar perfil de estudiante | Wade | Paquete A | 🟨 Media |
| **HU-023** | Actualizar perfil de tutor | Isai | Paquete B | 🟨 Media |
| **HU-024** | Dar de baja a estudiantes | Alvaro | Paquete C | 🟨 Media |
| **HU-025** | Dar de baja a tutores | Alvaro | Paquete C | 🟨 Media |
| **HU-018** | Correo automático de cancelación | Xavi | Paquete F | 🟦 Baja |
| **HU-019** | Actualizar horario (validación) | Isai | Paquete B | 🟦 Baja |
| **HU-026** | Reporte: Tutores más demandados | Alvaro | Paquete C | 🟦 Baja |
| **HU-027** | Reporte: Materias más demandadas | Yury | Paquete D | 🟦 Baja |

**Tareas Técnicas Derivadas (Sprint 2):**
*   **Alvaro:** Generar gráficos para reportes (barras y circular) y cerrar `Evaluacion_SM.md`[cite: 1].
*   **Yury:** Implementar panel interactivo de 5 filtros en frontend[cite: 1].
*   **Isai:** Programar transacciones en BD que bloqueen actualización de horario si hay sesiones activas[cite: 1].
*   **Xavi:** Diseñar plantilla HTML responsiva para correos de Mailtrap y revisar métricas de calidad[cite: 1].
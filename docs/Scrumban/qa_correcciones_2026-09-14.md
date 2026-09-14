# Evidencia QA — Correcciones de registro y administración

**Fecha:** 14 de septiembre de 2026
**Rama:** `fix/admin-user-approval-tutor-registration`
**Commit de implementación:** `71d458c`
**Alcance:** correcciones detectadas durante la revisión del panel administrativo y del registro de tutor.

## Responsables de las historias

La distribución documentada asigna HU-002 a Isai y HU-004/HU-005 a Alvaro. Esta revisión corrige la integración actual para desbloquear la validación del equipo; no cambia la asignación original.

## Correcciones realizadas

- **HU-004/HU-005:** el panel administrativo consulta solicitudes `PENDING` de estudiantes y tutores, muestra sus datos y permite aprobar o rechazar cada solicitud.
- **HU-004/HU-005:** se agregaron rutas protegidas por JWT y rol administrador: `GET /api/admin/users`, `PATCH /api/admin/users/:id/status` y `PUT /api/admin/users/:id/status`.
- **HU-002:** el campo multipart de fotografía quedó unificado como `fotografia` entre `TutorRegistration.jsx`, Multer y el endpoint `POST /api/auth/register/tutor`.
- **Desarrollo local/Docker:** el proxy de Vite acepta un destino configurable y conserva `http://backend:5000` cuando se ejecuta mediante Compose.

## Validación ejecutada

- `npm test` en backend: **13/13 pruebas aprobadas**.
- `npm run build` en frontend: **build exitoso**.
- Health check directo y mediante proxy: **HTTP 200**.
- Flujo administrativo integrado: login 2FA local, listado de pendientes, aprobación y rechazo comprobados.
- Registro multipart de tutor: el campo `fotografia` fue aceptado por Multer; la respuesta obtenida fue la validación esperada de correo duplicado, no `MulterError: Unexpected field`.

## Pendientes y límites de esta evidencia

- No se marca ninguna historia como **DONE**: falta la revisión QA cruzada y el cierre del release.
- Las notificaciones por correo de los criterios de HU-004/HU-005 requieren configurar SMTP/Mailtrap y no se validaron en este entorno.
- Docker no estaba disponible durante la prueba local. La instancia MySQL y las credenciales usadas para validar fueron locales y temporales; no forman parte del commit.

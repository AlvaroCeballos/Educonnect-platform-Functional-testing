# Contrato de planes de estudio

Este contrato es la referencia compartida para HU-032 (formulario estructurado
del tutor al atender), HU-033 (visualización del plan por el estudiante) y
HU-034 (generación de constancia PDF).

## Modelo

Un plan de estudio **pertenece a una sesión** (`sessions.id`) y la sesión
pertenece a un estudiante y a un tutor. No existe plan sin sesión. Al guardarse
el plan, la sesión transita a `ATTENDED` dentro de la misma transacción; si la
transición falla, el plan no se persiste.

Tablas que se asumen en `backend/init.sql` (las define el Paquete B / Xavi):

- `study_plans(id, session_id UNIQUE, difficulties TEXT NOT NULL, created_at)`
- `study_resources(id, study_plan_id, name, type ENUM('TEXTO','VIDEO','PDF','ENLACE'), instruction TEXT, position)`

`session_id` es `UNIQUE`: una sesión tiene **un solo plan**. Un segundo intento
de atender la misma sesión debe fallar con error de duplicado, no sobrescribir.

## Tipos admitidos de recurso

El campo `type` sólo acepta cuatro valores literales, en MAYÚSCULAS:

- `TEXTO`
- `VIDEO`
- `PDF`
- `ENLACE`

Cualquier otro valor se rechaza con `400 Bad Request`. Esta regla la cubre la
prueba unitaria **PU-23**.

## Endpoint 1 — Crear plan al atender (HU-032)

`POST /api/study-plans`

Autenticación: JWT de **tutor**. El `session_id` del cuerpo debe pertenecer a
una sesión cuyo `tutor_id` coincida con el `tutorId` del token.

Cuerpo:

```json
{
  "session_id": 42,
  "difficulties": "Derivadas parciales y regla de la cadena",
  "resources": [
    {
      "name": "Cálculo de Stewart - Capítulo 14",
      "type": "TEXTO",
      "instruction": "Leer secciones 14.1 a 14.3"
    },
    {
      "name": "Video 3Blue1Brown - Chain rule",
      "type": "VIDEO",
      "instruction": "Ver minuto 2:30 a 8:15"
    }
  ]
}
```

Reglas de validación (todas obligatorias; falla cualquiera y se devuelve `400`
sin tocar la base):

1. `session_id` existe y pertenece al tutor autenticado (autorización pura).
2. La sesión está actualmente en estado `PENDING`. Una sesión `ATTENDED`,
   `CANCELLED_BY_STUDENT` o `CANCELLED_BY_TUTOR` no se puede atender de nuevo.
3. `difficulties` es un string no vacío (trim > 0 caracteres) — **PU-21**.
4. `resources` es un array con **al menos 1 elemento**.
5. Cada recurso tiene `name` no vacío, `type` ∈ ENUM válido, `instruction` no
   vacío — **PU-22**.
6. `position` lo asigna el backend según el orden del array, el cliente no lo
   envía.

Operación atómica (una sola transacción con `BEGIN` / `COMMIT`):

1. `SELECT ... FOR UPDATE` sobre la fila de la sesión.
2. `INSERT INTO study_plans (...)`.
3. `INSERT INTO study_resources (...)` por cada recurso.
4. `UPDATE sessions SET status = 'ATTENDED' WHERE id = ?` — la sesión queda
   atendida sólo si todos los pasos anteriores tuvieron éxito. Esta
   transición la cubre **PU-24**.
5. `COMMIT`. Cualquier error en pasos 2-4 hace `ROLLBACK` y la sesión conserva
   su estado `PENDING`.

Respuesta `201 Created`:

```json
{
  "id": 17,
  "session_id": 42,
  "difficulties": "...",
  "resources": [
    { "id": 55, "name": "...", "type": "TEXTO", "instruction": "...", "position": 1 },
    { "id": 56, "name": "...", "type": "VIDEO", "instruction": "...", "position": 2 }
  ],
  "created_at": "2026-10-10T21:30:00Z"
}
```

## Endpoint 2 — Consultar mis planes (HU-033)

`GET /api/study-plans/me`

Autenticación: JWT de **estudiante**. Devuelve **todos** los planes de las
sesiones del estudiante autenticado, del más reciente al más antiguo
(`ORDER BY created_at DESC`).

El enunciado habla del "plan activo" en singular (la última sesión atendida):
la pantalla de HU-033 muestra el primer elemento del array como plan destacado
y los demás quedan como historial de planes previos.

Respuesta `200 OK`:

```json
{
  "plans": [
    {
      "id": 17,
      "session_id": 42,
      "session_date": "2026-10-08",
      "tutor_name": "Carlos Pérez",
      "tutor_specialty": "Matemática",
      "tutor_identification": "T-001-2023",
      "difficulties": "...",
      "resources": [ { "name": "...", "type": "...", "instruction": "..." } ],
      "created_at": "2026-10-10T21:30:00Z"
    }
  ]
}
```

Si el estudiante aún no tiene planes, devuelve `{"plans": []}` con `200 OK`
(estado vacío manejado por el frontend — **T-033.3**).

## Endpoint 3 — Constancia PDF (HU-034, Sprint 2)

`GET /api/study-plans/:planId/certificate`

Autenticación: JWT de **estudiante**. El `planId` debe pertenecer a una sesión
cuyo `student_id` coincida con el del token (403 si no).

Respuesta: `application/pdf` como stream descargable, con nombre
`constancia-sesion-{session_id}.pdf`.

Contenido mínimo del PDF (define **PU-25** la integridad del payload que lo
alimenta):

- **Encabezado:** "EduConnect", fecha de emisión, teléfono de contacto de la
  plataforma.
- **Cuerpo:** Tabla con las columnas `Nombre | Tipo | Instrucción` para cada
  recurso recomendado.
- **Pie / sello del tutor:** nombre completo, especialidad, número de
  identificación.

## Autorización — resumen

| Endpoint                                | Rol permitido | Chequeo adicional                                       |
| --------------------------------------- | ------------- | ------------------------------------------------------- |
| `POST /api/study-plans`                 | tutor         | `sessions.tutor_id == jwt.tutorId` y sesión `PENDING`   |
| `GET  /api/study-plans/me`              | estudiante    | filtra por `sessions.student_id == jwt.studentId`       |
| `GET  /api/study-plans/:id/certificate` | estudiante    | plan pertenece a sesión del estudiante autenticado      |

## Notas para los equipos que trabajan sobre este contrato

- **Paquete B** (modelo de datos): las tablas `study_plans` y `study_resources`
  se crean en `backend/init.sql` siguiendo el shape definido arriba, incluyendo
  el ENUM `TEXTO|VIDEO|PDF|ENLACE` y el `UNIQUE` sobre `session_id`.
- **Paquete A** (autenticación): el middleware JWT ya embebe `tutorId` y
  `studentId` en el payload — convención consolidada en Fase 1,
  `authController.js:203` emite el token del estudiante con
  `{ id, studentId, role, email, status }` y `tutorLoginController` hace lo
  equivalente para el tutor. Los endpoints de este contrato leen esos campos
  vía `req.user.tutorId` y `req.user.studentId` sin consultas extra, como ya
  lo hacen `sessionController.js` y `scheduleController.js`.
- **Paquete F** (feedback): el `UPDATE sessions SET status = 'ATTENDED'` que
  produce `POST /api/study-plans` deja la sesión lista para que las HUs de
  calificación (HU-035) y denuncia (HU-036) la consuman — ambas restringen a
  sesiones `ATTENDED` por regla de negocio.

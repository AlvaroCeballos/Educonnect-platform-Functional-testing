# Contrato de planes de estudio

Este contrato es la referencia compartida para HU-032 (formulario estructurado
del tutor al atender), HU-033 (visualización del plan por el estudiante) y
HU-034 (generación de constancia PDF).

## Modelo

Un plan de estudio **pertenece a una sesión** (`sessions.id`) y la sesión
pertenece a un estudiante y a un tutor. No existe plan sin sesión. Al guardarse
el plan, la sesión transita a `ATTENDED` dentro de la misma transacción; si la
transición falla, el plan no se persiste.

Tablas en `backend/init.sql` (DDL vigente de Fase 2):

- `study_plans(id, session_id UNIQUE, dificultades_detectadas TEXT NOT NULL, created_at, updated_at)`
- `study_resources(id, study_plan_id, nombre_recurso VARCHAR(255), tipo_recurso ENUM('Texto','Video','PDF','Enlace'), descripcion_uso TEXT, created_at)`

`session_id` es `UNIQUE`: una sesión tiene **un solo plan**. Un segundo intento
de atender la misma sesión debe fallar con error de duplicado, no sobrescribir.

El orden de los recursos se preserva por el `id` autoincrement en el orden en
que se insertan (sin columna `position`); el controlador inserta en el orden
del array del payload.

## Tipos admitidos de recurso

El campo `tipo_recurso` sólo acepta cuatro valores literales, con capitalización
exacta como está en el ENUM:

- `Texto`
- `Video`
- `PDF`
- `Enlace`

Cualquier otro valor (incluyendo variantes de capitalización como `texto` o
`TEXTO`) se rechaza con `400 Bad Request`. Esta regla la cubre la prueba
unitaria **PU-23**.

## Endpoint 1 — Crear plan al atender (HU-032)

`POST /api/study-plans`

Autenticación: JWT de **tutor**. El `session_id` del cuerpo debe pertenecer a
una sesión cuyo `tutor_id` coincida con el `tutorId` del token.

Cuerpo:

```json
{
  "session_id": 42,
  "dificultades_detectadas": "Derivadas parciales y regla de la cadena",
  "recursos": [
    {
      "nombre_recurso": "Cálculo de Stewart - Capítulo 14",
      "tipo_recurso": "Texto",
      "descripcion_uso": "Leer secciones 14.1 a 14.3"
    },
    {
      "nombre_recurso": "Video 3Blue1Brown - Chain rule",
      "tipo_recurso": "Video",
      "descripcion_uso": "Ver minuto 2:30 a 8:15"
    }
  ]
}
```

Reglas de validación (todas obligatorias; falla cualquiera y se devuelve `400`
sin tocar la base):

1. `session_id` existe y pertenece al tutor autenticado (autorización pura).
2. La sesión está actualmente en estado `PENDING`. Una sesión `ATTENDED`,
   `CANCELLED_BY_STUDENT` o `CANCELLED_BY_TUTOR` no se puede atender de nuevo.
3. `dificultades_detectadas` es un string no vacío (trim > 0 caracteres) —
   **PU-21**.
4. `recursos` es un array con **al menos 1 elemento**.
5. Cada recurso tiene `nombre_recurso` no vacío, `tipo_recurso` ∈ ENUM válido,
   `descripcion_uso` no vacío — **PU-22**.

Operación atómica (una sola transacción con `BEGIN` / `COMMIT`):

1. `SELECT ... FOR UPDATE` sobre la fila de la sesión.
2. `INSERT INTO study_plans (session_id, dificultades_detectadas)`.
3. `INSERT INTO study_resources (study_plan_id, nombre_recurso, tipo_recurso, descripcion_uso)` por cada recurso en el orden del array.
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
  "dificultades_detectadas": "...",
  "recursos": [
    { "id": 55, "nombre_recurso": "...", "tipo_recurso": "Texto", "descripcion_uso": "..." },
    { "id": 56, "nombre_recurso": "...", "tipo_recurso": "Video", "descripcion_uso": "..." }
  ],
  "created_at": "2026-10-14T21:30:00Z"
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
      "dificultades_detectadas": "...",
      "recursos": [ { "nombre_recurso": "...", "tipo_recurso": "Texto", "descripcion_uso": "..." } ],
      "created_at": "2026-10-14T21:30:00Z"
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
- **Cuerpo:** Tabla con las columnas `Nombre | Tipo | Descripción de uso` para
  cada recurso recomendado.
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
  ya están aplicadas en `backend/init.sql` por el commit `734fadd`.
  Convención: nombres de columna en español y ENUM `Texto|Video|PDF|Enlace` en
  capitalización inicial. El payload JSON del endpoint refleja la misma
  convención para evitar mapeo.
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

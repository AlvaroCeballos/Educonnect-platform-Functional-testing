# Diagrama entidad–relación y diccionario de datos

## Modelo en tercera forma normal

El modelo separa la identidad (`users`) de los datos propios de cada rol y normaliza el catálogo de materias. Las relaciones N:M se resuelven con `tutor_subjects`; los horarios se almacenan por día y las sesiones referencian una materia mediante `subject_id`.

```mermaid
erDiagram
  USERS ||--o| STUDENT_PROFILES : "tiene"
  USERS ||--o| TUTOR_PROFILES : "tiene"
  TUTOR_PROFILES ||--o{ TUTOR_SUBJECTS : imparte
  SUBJECTS ||--o{ TUTOR_SUBJECTS : asignada
  TUTOR_PROFILES ||--o{ SCHEDULES : configura
  STUDENT_PROFILES ||--o{ SESSIONS : reserva
  TUTOR_PROFILES ||--o{ SESSIONS : atiende
  SUBJECTS ||--o{ SESSIONS : utiliza
  SESSIONS ||--o| REVIEWS : recibe
  STUDENT_PROFILES ||--o{ REVIEWS : escribe
  TUTOR_PROFILES ||--o{ REVIEWS : recibe

  USERS { INT id PK; VARCHAR email UK; VARCHAR password_hash; ENUM role; ENUM status }
  STUDENT_PROFILES { INT id PK; INT user_id FK; VARCHAR nombre; VARCHAR apellido; VARCHAR carnet UK; DATE fecha_nacimiento; ENUM genero; VARCHAR universidad; VARCHAR carrera; VARCHAR fotografia_url }
  TUTOR_PROFILES { INT id PK; INT user_id FK; VARCHAR nombre; VARCHAR apellido; VARCHAR carnet UK; VARCHAR identificacion UK; DATE fecha_nacimiento; ENUM genero; VARCHAR fotografia_url; VARCHAR especialidad; VARCHAR direccion_tutoria; YEAR anio_inicio_experiencia; VARCHAR universidad }
  SUBJECTS { INT id PK; VARCHAR nombre UK; BOOLEAN is_active }
  TUTOR_SUBJECTS { INT tutor_id PK_FK; INT subject_id PK_FK }
  SCHEDULES { INT id PK; INT tutor_id FK; TINYINT day_of_week; TIME start_time; TIME end_time; BOOLEAN is_active }
  SESSIONS { INT id PK; INT student_id FK; INT tutor_id FK; DATE session_date; TIME start_time; TIME end_time; INT subject_id FK; TEXT reason; ENUM status; TEXT summary; TEXT recommendations }
  REVIEWS { INT id PK; INT session_id UK_FK; INT student_id FK; INT tutor_id FK; TINYINT rating; TEXT comment }
```

## Diccionario de datos

El DDL fuente es [`backend/init.sql`](../../backend/init.sql). Todas las tablas usan InnoDB y `utf8mb4`.

### `users`

| Campo | Tipo | Nulo/defecto | Restricción y propósito |
|---|---|---|---|
| id | INT UNSIGNED | No / auto | PK de identidad |
| email | VARCHAR(191) | No | Único; credencial de acceso |
| password_hash | VARCHAR(255) | No | Hash bcrypt, nunca contraseña en claro |
| role | ENUM | No | `student`, `tutor` o `admin` |
| status | ENUM | No / `PENDING` | `PENDING`, `APPROVED`, `REJECTED`, `DISABLED` |
| created_at, updated_at | TIMESTAMP | No | Auditoría automática |

### `student_profiles` y `tutor_profiles`

Ambas tablas tienen `id` como PK y `user_id` como FK única a `users`. Contienen nombre, apellido, carnet, fecha de nacimiento y género. El perfil de tutor agrega `identificacion`, `fotografia_url` obligatoria, `especialidad`, `direccion_tutoria`, `anio_inicio_experiencia` y `universidad`; el de estudiante agrega `carrera`, universidad y fotografía opcional. Carnet e identificación son únicos por rol.

### `subjects` y `tutor_subjects`

`subjects(id, nombre, is_active)` es el catálogo único de materias. `tutor_subjects(tutor_id, subject_id)` es una tabla puente con PK compuesta y FKs a tutor y materia; permite que un tutor imparta varias materias sin duplicar nombres.

### `schedules`

| Campo | Tipo | Restricción |
|---|---|---|
| id | INT UNSIGNED | PK |
| tutor_id | INT UNSIGNED | FK a `tutor_profiles`; único junto con `day_of_week` |
| day_of_week | TINYINT UNSIGNED | 1 lunes … 7 domingo |
| start_time/end_time | TIME | `start_time < end_time` |
| is_active | BOOLEAN | Permite conservar filas históricas |

### `sessions`

`student_id`, `tutor_id` y `subject_id` son FKs. `session_date`, `start_time` y `end_time` forman el intervalo reservado. `status` puede ser `PENDING`, `ATTENDED`, `CANCELLED_BY_STUDENT` o `CANCELLED_BY_TUTOR`; `summary` y `recommendations` se completan al atender.

### `reviews`

Una reseña pertenece a una sesión (`session_id` único), estudiante y tutor. `rating` debe estar entre 1 y 5. Las FKs con `ON DELETE RESTRICT` protegen el historial.

## Integridad y reglas

- Las FK usan `ON UPDATE CASCADE`; perfiles y relaciones dependientes se eliminan con el usuario cuando corresponde.
- Índices por tutor/fecha/hora/estado y estudiante/fecha/hora/estado soportan la consulta de disponibilidad y anti-traslapes.
- El backend valida intervalos con `inicio_nuevo < fin_existente && fin_nuevo > inicio_existente` dentro de transacciones.

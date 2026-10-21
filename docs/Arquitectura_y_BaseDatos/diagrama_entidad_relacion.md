# Diagrama entidad–relación y diccionario de datos (Fase 2)

## Modelo en tercera forma normal (3FN)

El modelo separa la identidad (`users`) de los datos propios de cada rol (`student_profiles` y `tutor_profiles`) y normaliza el catálogo de materias (`subjects`). Las relaciones N:M se resuelven con `tutor_subjects`; los horarios se almacenan por día en `schedules` y las sesiones referencian una materia mediante `subject_id`.

En la **Fase 2**, el esquema se extiende manteniendo la Tercera Forma Normal (3FN) para soportar:
- Verificación de correo electrónico con token y almacenamiento de referencias a documentos PDF (`carnet_pdf_url` y `cv_pdf_url`) en la entidad `users`.
- Calificaciones bidireccionales (`student` y `tutor`) de 0 a 5 estrellas en `reviews`.
- Reportes disciplinarios y denuncias cruzadas con trazabilidad de resolución administrativa en `incident_reports`.
- Planes de estudio estructurados por sesión atendida en `study_plans` y relación 1:N con recursos dinámicos recomendados en `study_resources`.

![Diagrama Entidad-Relación Fase 2](assets/der_fase2.jpg)

---

## Diccionario de datos

El DDL fuente es [`backend/init.sql`](../../backend/init.sql). Todas las tablas usan motor `InnoDB` y codificación `utf8mb4_unicode_ci`.

### 1. `users`

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK de identidad del usuario |
| `email` | `VARCHAR(191)` | No | `UNIQUE` (`uq_users_email`); credencial de acceso inmutable |
| `password_hash` | `VARCHAR(255)` | No | Hash bcrypt (10 rondas), nunca contraseña en texto plano |
| `role` | `ENUM('student','tutor','admin')` | No | Rol del usuario dentro de la plataforma |
| `status` | `ENUM('PENDING','APPROVED','REJECTED','DISABLED')` | No / `'PENDING'` | Estado de aprobación o baja lógica de la cuenta |
| `email_verified` | `BOOLEAN` | No / `FALSE` | **(Nuevo F2)** Indica si el usuario ya validó su token en el primer inicio de sesión |
| `verification_token` | `VARCHAR(10)` | Sí / `NULL` | **(Nuevo F2)** Token alfanumérico de verificación enviado por correo |
| `carnet_pdf_url` | `VARCHAR(500)` | Sí / `NULL` | **(Nuevo F2)** Nombre o ruta del archivo PDF del carnet estudiantil escaneado |
| `cv_pdf_url` | `VARCHAR(500)` | Sí / `NULL` | **(Nuevo F2)** Nombre o ruta del archivo PDF del Currículum Vítae del tutor |
| `created_at` | `TIMESTAMP` | No / `CURRENT_TIMESTAMP` | Fecha y hora de creación del registro |
| `updated_at` | `TIMESTAMP` | No / `CURRENT_TIMESTAMP` | Fecha y hora de última modificación |

---

### 2. `student_profiles`

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK del perfil de estudiante |
| `user_id` | `INT UNSIGNED` | No | FK única (`uq_student_profiles_user`) hacia `users(id)` |
| `nombre` | `VARCHAR(100)` | No | Nombres del estudiante |
| `apellido` | `VARCHAR(100)` | No | Apellidos del estudiante |
| `carnet` | `VARCHAR(20)` | No | `UNIQUE` (`uq_student_profiles_carnet`); carnet universitario |
| `fecha_nacimiento` | `DATE` | Sí / `NULL` | Fecha de nacimiento |
| `genero` | `ENUM('M','F','OTHER','UNSPECIFIED')` | No / `'UNSPECIFIED'` | Género del estudiante |
| `universidad` | `VARCHAR(150)` | Sí / `NULL` | Universidad de procedencia |
| `carrera` | `VARCHAR(150)` | Sí / `NULL` | Carrera universitaria |
| `fotografia_url` | `VARCHAR(500)` | Sí / `NULL` | Ruta de la fotografía obligatoria en registro de Fase 2 |
| `created_at`, `updated_at` | `TIMESTAMP` | No | Auditoría automática |

---

### 3. `tutor_profiles`

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK del perfil de tutor |
| `user_id` | `INT UNSIGNED` | No | FK única (`uq_tutor_profiles_user`) hacia `users(id)` |
| `nombre` | `VARCHAR(100)` | No | Nombres del tutor |
| `apellido` | `VARCHAR(100)` | No | Apellidos del tutor |
| `carnet` | `VARCHAR(20)` | No | `UNIQUE` (`uq_tutor_profiles_carnet`); carnet o ID académico |
| `identificacion` | `VARCHAR(30)` | No | `UNIQUE` (`uq_tutor_profiles_identificacion`); DPI o identificación |
| `fecha_nacimiento` | `DATE` | No | Fecha de nacimiento |
| `genero` | `ENUM('M','F','OTHER','UNSPECIFIED')` | No / `'UNSPECIFIED'` | Género del tutor |
| `fotografia_url` | `VARCHAR(500)` | No | Ruta de la fotografía del tutor |
| `especialidad` | `VARCHAR(150)` | No | Materia o área de especialidad principal |
| `direccion_tutoria` | `VARCHAR(255)` | No | Dirección física o indicación de modalidad Online |
| `anio_inicio_experiencia` | `YEAR` | No | Año en que inició a impartir tutorías |
| `universidad` | `VARCHAR(150)` | No | Universidad de graduación o estudio |
| `created_at`, `updated_at` | `TIMESTAMP` | No | Auditoría automática |

---

### 4. `subjects` y `tutor_subjects`

| Tabla | Campo | Tipo | Restricción y propósito |
|---|---|---|---|
| `subjects` | `id` | `INT UNSIGNED` | PK autoincremental |
| `subjects` | `nombre` | `VARCHAR(150)` | `UNIQUE` (`uq_subjects_nombre`); nombre de la materia |
| `subjects` | `is_active` | `BOOLEAN` | Por defecto `TRUE`; indica si la materia está activa |
| `tutor_subjects` | `tutor_id` | `INT UNSIGNED` | PK compuesta y FK hacia `tutor_profiles(id)` |
| `tutor_subjects` | `subject_id` | `INT UNSIGNED` | PK compuesta y FK hacia `subjects(id)` |

---

### 5. `schedules`

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK del bloque horario |
| `tutor_id` | `INT UNSIGNED` | No | FK a `tutor_profiles(id)`; único junto con `day_of_week` |
| `day_of_week` | `TINYINT UNSIGNED` | No | `CHECK (day_of_week BETWEEN 1 AND 7)` (1 = lunes … 7 = domingo) |
| `start_time` / `end_time` | `TIME` | No | `CHECK (start_time < end_time)` |
| `is_active` | `BOOLEAN` | No / `TRUE` | Permite conservar filas históricas |
| `created_at`, `updated_at` | `TIMESTAMP` | No | Auditoría automática |

---

### 6. `sessions`

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK de la sesión de tutoría |
| `student_id` | `INT UNSIGNED` | No | FK hacia `student_profiles(id)` |
| `tutor_id` | `INT UNSIGNED` | No | FK hacia `tutor_profiles(id)` |
| `session_date` | `DATE` | No | Fecha programada de la tutoría |
| `start_time` / `end_time` | `TIME` | No | Intervalo reservado (`start_time < end_time`) |
| `subject_id` | `INT UNSIGNED` | No | FK hacia `subjects(id)` |
| `reason` | `TEXT` | No | Motivo o temas a tratar en la sesión |
| `status` | `ENUM` | No / `'PENDING'` | `'PENDING'`, `'ATTENDED'`, `'CANCELLED_BY_STUDENT'`, `'CANCELLED_BY_TUTOR'` |
| `summary` | `TEXT` | Sí / `NULL` | Resumen general al atender |
| `recommendations` | `TEXT` | Sí / `NULL` | Recomendaciones generales |
| `created_at`, `updated_at` | `TIMESTAMP` | No | Auditoría automática |

---

### 7. `reviews` (Actualizada en Fase 2)

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK de la calificación |
| `session_id` | `INT UNSIGNED` | No | FK hacia `sessions(id)`; única junto con `reviewer_role` |
| `student_id` | `INT UNSIGNED` | No | FK hacia `student_profiles(id)` |
| `tutor_id` | `INT UNSIGNED` | No | FK hacia `tutor_profiles(id)` |
| `reviewer_role` | `ENUM('student','tutor')` | No / `'student'` | **(Nuevo F2)** Identifica si la calificación la emitió el estudiante o el tutor |
| `rating` | `TINYINT UNSIGNED` | No | **(Actualizado F2)** `CHECK (rating BETWEEN 0 AND 5)` estrellas |
| `comment` | `TEXT` | Sí / `NULL` | Comentario opcional sobre la sesión |
| `created_at`, `updated_at` | `TIMESTAMP` | No | Auditoría automática |

---

### 8. `incident_reports` (Nueva en Fase 2)

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK del reporte disciplinario |
| `session_id` | `INT UNSIGNED` | No | FK hacia `sessions(id)`; única junto con `reporter_id` |
| `reporter_id` | `INT UNSIGNED` | No | FK hacia `users(id)`; usuario que interpone la denuncia |
| `reported_user_id` | `INT UNSIGNED` | No | FK hacia `users(id)`; usuario denunciado |
| `reporter_role` | `ENUM('student','tutor')` | No | Rol de quien realiza el reporte (`student` o `tutor`) |
| `category` | `VARCHAR(150)` | No | Categoría predefinida de la falta |
| `reason` | `TEXT` | No | Explicación detallada del motivo del reporte |
| `status` | `ENUM('PENDING','RESOLVED_BANNED','DISMISSED')` | No / `'PENDING'` | Estado de resolución administrativa de la denuncia |
| `admin_notes` | `TEXT` | Sí / `NULL` | Notas o justificación del administrador al resolver |
| `resolved_by` | `INT UNSIGNED` | Sí / `NULL` | FK hacia `users(id)`; administrador que resolvió el caso |
| `resolved_at` | `TIMESTAMP` | Sí / `NULL` | Fecha y hora de resolución |
| `created_at`, `updated_at` | `TIMESTAMP` | No | Auditoría automática |

---

### 9. `study_plans` (Nueva en Fase 2)

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK del plan de estudio estructurado |
| `session_id` | `INT UNSIGNED` | No | FK única (`uq_study_plans_session`) hacia `sessions(id)` |
| `dificultades_detectadas` | `TEXT` | No | Descripción obligatoria de los temas con dificultad |
| `created_at`, `updated_at` | `TIMESTAMP` | No | Auditoría automática |

---

### 10. `study_resources` (Nueva en Fase 2)

| Campo | Tipo | Nulo / Defecto | Restricción y propósito |
|---|---|---|---|
| `id` | `INT UNSIGNED` | No / `AUTO_INCREMENT` | PK del recurso recomendado |
| `study_plan_id` | `INT UNSIGNED` | No | FK hacia `study_plans(id)` con `ON DELETE CASCADE` |
| `nombre_recurso` | `VARCHAR(255)` | No | Nombre del libro, video, ejercicio o material |
| `tipo_recurso` | `ENUM('Texto','Video','PDF','Enlace')` | No | Clasificación estricta del tipo de recurso |
| `descripcion_uso` | `TEXT` | No | Instrucciones específicas sobre cómo utilizar el recurso |
| `created_at` | `TIMESTAMP` | No / `CURRENT_TIMESTAMP` | Fecha de registro del recurso |

---

## Integridad y reglas de negocio en base de datos

- **Claves foráneas e integridad referencial:** Las relaciones de perfiles, planes y recursos usan `ON UPDATE CASCADE` y `ON DELETE CASCADE`; las sesiones, reseñas y denuncias protegen el historial con `ON DELETE RESTRICT`.
- **Índices compuestos de disponibilidad:** Índices por `(tutor_id, session_date, start_time, status)` y `(student_id, session_date, start_time, status)` soportan la consulta de disponibilidad y validación anti-traslapes.
- **Unicidad de evaluaciones y reportes:** La restricción `uq_reviews_session_reviewer` permite que tanto el estudiante como el tutor califiquen una misma sesión una sola vez cada uno, mientras que `uq_incident_session_reporter` evita denuncias duplicadas por sesión.

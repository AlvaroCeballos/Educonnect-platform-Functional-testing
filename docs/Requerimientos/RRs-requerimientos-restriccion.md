# Requerimientos de Restricción (RRs) — Paquete A

## Identidad y Autenticación

### RR-001: Validación de contraseña
**Descripción:** Toda contraseña debe cumplir con criterios mínimos de seguridad.

**Restricción:**
- Mínimo 8 caracteres.
- Al menos 1 letra mayúscula.
- Al menos 1 letra minúscula.
- Al menos 1 dígito.
- No se permiten espacios en blanco.

**Aplica a:** 
- Estudiantes (HU-001)
- Tutores (HU-002)
- Admin (HU-003)

---

### RR-002: Unicidad de email
**Descripción:** Un correo electrónico no puede estar registrado más de una vez en el sistema.

**Restricción:**
- `users.email` tiene constraint `UNIQUE`.
- Validación en cliente y servidor.

**Aplica a:** Todos los roles.

---

### RR-003: Carnet único de estudiante
**Descripción:** Un carnet no puede estar vinculado a más de un estudiante.

**Restricción:**
- `student_profiles.carnet` tiene constraint `UNIQUE`.
- Validación en servidor.

**Aplica a:** Registro de estudiante.

---

### RR-004: Estado inicial de usuario
**Descripción:** Todo nuevo usuario (estudiante, tutor) inicia en estado `PENDING` hasta aprobación del admin.

**Restricción:**
- `users.status` default `PENDING`.
- Admin debe explícitamente cambiar a `APPROVED`.
- Solo usuarios `APPROVED` pueden loguearse.



---

### RR-005: Autenticación de estudiante requiere estado APPROVED
**Descripción:** Solo estudiantes aprobados pueden iniciar sesión.

**Restricción:**
- `POST /api/auth/login/student` rechaza si `status != APPROVED`.
- Responde HTTP 403 con mensaje "Tu cuenta aún no ha sido aprobada".



---

### RR-006: Segundo factor de autenticación obligatorio para admin
**Descripción:** El admin no puede loguearse solo con email + contraseña. Requiere segunda fase con archivo 2FA.

**Restricción:**
- `POST /api/auth/login/admin` devuelve `phase: 1` (sin JWT).
- `POST /api/auth/login/admin/2fa` con archivo `auth2-ayd1.txt` devuelve JWT.
- Sin completar fase 2, admin NO obtiene acceso.



---

### RR-007: Archivo 2FA debe tener nombre exacto
**Descripción:** El archivo cargado para segundo factor debe ser exactamente `auth2-ayd1.txt`.

**Restricción:**
- Servidor valida `file.originalname === "auth2-ayd1.txt"`.
- Rechaza con HTTP 400 si no coincide.



---

### RR-008: Hash en archivo 2FA debe coincider
**Descripción:** El contenido del archivo 2FA debe ser un hash bcrypt válido que coincida con el almacenado.

**Restricción:**
- Servidor ejecuta `bcrypt.compare(fileContent, storedHash)`.
- Rechaza con HTTP 401 si no coincide.



---

### RR-009: JWT debe contener identificador de perfil
**Descripción:** El JWT generado en login debe incluir el ID del perfil (studentId o tutorId), no solo users.id.

**Restricción:**
- Login estudiante: JWT contiene `studentId`.
- Login tutor: JWT contiene `tutorId`.
- Esto permite sesiones y operaciones al perfil sin queries adicionales.



---

### RR-010: Ruta /admin/profile requiere JWT y rol admin
**Descripción:** Solo admins autenticados pueden acceder a ruta protegida.

**Restricción:**
- Middleware `authenticateJWT` valida token.
- Middleware `authorizeAdmin` valida `role === "admin"`.
- Rechaza con HTTP 401 o 403 si no autorizado.

.

---

## Límites de sesión

### RR-011: Duración de JWT
**Descripción:** Los tokens expiran tras cierto tiempo para limitar sesiones prolongadas.

**Restricción:**
- Estudiantes/Tutores: `JWT_EXPIRES_IN = "24h"` (default).
- Admin: `JWT_EXPIRES_IN = "8h"`.
- Cliente debe refrescar o re-loguearse si expira.

**Aplica a:** Todas las rutas autenticadas.

---

## Encriptación

### RR-012: Contraseñas siempre hasheadas
**Descripción:** Las contraseñas nunca se almacenan en texto plano.

**Restricción:**
- `bcrypt.hash()` con 10 rounds antes de guardar.
- Comparación con `bcrypt.compare()` en logins.
- Base de datos solo contiene hash.

**Aplica a:** Todos los roles.

---


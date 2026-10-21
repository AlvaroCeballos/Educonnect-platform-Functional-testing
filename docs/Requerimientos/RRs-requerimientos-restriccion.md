# Requerimientos de Restricción (RRs) — Fase 1 (Abajo los de las fase 2)

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

### RR-013: Email no es editable
**Descripción:** El correo electrónico no puede ser modificado en la actualización de perfil.

**Restricción:**
- `PUT /api/students/me/profile` ignora cualquier intento de cambiar `email`.
- Solo nombre, apellido, carnet y contraseña son editables.

**Aplica a:** HU-022.

---

### RR-014: Carnet único al actualizar
**Descripción:** Al actualizar carnet, debe validarse que no esté duplicado.

**Restricción:**
- `PUT /api/students/me/profile` valida constraint `UNIQUE` en `student_profiles.carnet`.
- Si carnet ya existe, rechaza con HTTP 409.

**Aplica a:** HU-022 T-022.3.

---

### RR-015: Cambio de contraseña requiere mismos criterios
**Descripción:** Si el estudiante cambia contraseña en perfil, debe cumplir las mismas reglas que al registrarse.

**Restricción:**
- Validación idéntica a RR-001 (8+ chars, mayúscula, minúscula, número).
- Hash con bcrypt (10 rounds) antes de guardar.

**Aplica a:** HU-022 T-022.3, T-022.4.


# Requerimientos de Restricción (RRs) — Fase 2

**Proyecto:** EduConnect — Plataforma de Gestión de Tutorías Académicas  
**Responsable:** Yury Alexander Cruz García (Carnet: 202300359)  
**Módulo:** Paquete A (Identidad, Tokens, Seguridad y Restricciones Técnicas)  

---

## 1. Introducción
Los requerimientos de restricción definen las limitaciones arquitectónicas, normativas, tecnológicas y de seguridad que condicionan el diseño y la implementación de EduConnect en su Fase 2.

---

## 2. Clasificación de Restricciones

### 2.1. Restricciones Legales y de Privacidad (RR-LEG)
* **RR-LEG-01 (Protección de Documentación Universitaria):** Los archivos de Carnet Universitario (estudiantes) y Currículum Vítae (tutores) contienen datos sensibles. Deben almacenarse en el servidor bajo identificadores aleatorios UUID v4 en rutas no indexables directamente y transmitirse con cabeceras `Content-Disposition: inline`.
* **RR-LEG-02 (Confidencialidad de Calificaciones y Reportes):** Las evaluaciones por estrellas y los reportes de incidentes disciplinarios solo pueden ser gestionados por los involucrados directos de la sesión y auditados por el Administrador, garantizando confidencialidad académica.

### 2.2. Restricciones de Estándares y Seguridad (RR-EST)
* **RR-EST-01 (Políticas de Contraseñas):** Toda contraseña debe tener una longitud mínima de 8 caracteres e incluir al menos una letra mayúscula, una letra minúscula y un número. En la base de datos se almacena exclusivamente el hash criptográfico generado con `bcrypt` (mínimo factor de costo 10).
* **RR-EST-02 (Ciclo de Vida del Token de Verificación):** El token para primer inicio de sesión debe ser alfanumérico de 6 caracteres en base 32 sin caracteres ambiguos (`0, O, 1, I`), con una vigencia máxima estricta de 24 horas (`token_expires_at`).
* **RR-EST-03 (Versionamiento y Commits):** Flujo de trabajo obligatorio bajo Git Flow (`main`, `develop`, `feature/<nombre>_<carnet>`) y mensajes bajo el estándar de **Conventional Commits** (`feat:`, `fix:`, `test:`, `docs:`, `ci:`).

### 2.3. Restricciones de Interfaz y UX (RR-INT)
* **RR-INT-01 (Visualización Embebida de PDFs):** El Administrador debe poder inspeccionar el Carnet y el CV directamente en la interfaz web mediante visores PDF embebidos (`<iframe>` o visor nativo del navegador), sin obligar a la descarga local del archivo binario.
* **RR-INT-02 (Frameworks CSS y Prohibición de Plantillas):** Prohibición terminante del uso de Bootstrap o plantillas prediseñadas descargadas. La interfaz debe construirse a medida con **Tailwind CSS**, cumpliendo al menos 6 de las 10 heurísticas de Jakob Nielsen.

### 2.4. Restricciones Técnicas y de Arquitectura (RR-TEC)
* **RR-TEC-01 (Despliegue CI/CD en Runner de GitHub Actions):** La automatización de backend se ejecuta en el runner `ubuntu-latest` al hacer push a `main`, conteniendo estrictamente las tres fases encadenadas: `Build` (imagen Docker) $\rightarrow$ `Test` (pruebas unitarias) $\rightarrow$ `Deploy` (levantamiento del contenedor).
* **RR-TEC-02 (Despliegue del Frontend en la Nube):** El frontend debe estar contenedorizado mediante Dockerfile multi-stage (Node build + Nginx Alpine) y alojado en la nube bajo una URL pública funcional.
* **RR-TEC-03 (Límites de Carga de Archivos):** La subida de fotografías e imágenes de perfil tiene un límite máximo de 5 MB en formatos `JPG, PNG, WEBP`. El carnet y el CV deben ser estrictamente `application/pdf` con un límite estricto de 5 MB.
* **RR-TEC-04 (Servicio SMTP):** La entrega de correos de verificación y notificaciones se centraliza a través de Mailtrap Sandbox para evitar bloqueos por spam o credenciales personales expuestas.

### 2.5. Restricciones Organizacionales (RR-ORG)
* **RR-ORG-01 (Metodología SCRUM):** Ejecución obligatoria de 2 Sprints de 14 días cada uno, con participación de los 6 integrantes como equipo de desarrollo.
* **RR-ORG-02 (Cobertura de Pruebas Obligatoria):** Implementación de al menos 30 pruebas unitarias (5 por integrante) y 6 pruebas End-to-End con Cypress o Selenium (1 por integrante).

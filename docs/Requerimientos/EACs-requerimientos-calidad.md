# Escenarios de Atributos de Calidad (EACs) — ISO/IEC 25010 

## Introducción

Los escenarios definen cómo el sistema debe comportarse bajo diferentes condiciones, combinando características de calidad ISO 25010 con medidas cuantitativas verificables.

Estructura de cada escenario:
1. **Fuente del estímulo:** Quién o qué genera el evento.
2. **Estímulo:** La acción o condición que ocurre.
3. **Artefacto afectado:** Componente del sistema.
4. **Entorno:** Condiciones operativas.
5. **Respuesta esperada:** Qué hace el sistema.
6. **Medida de respuesta:** Métrica cuantitativa verificable.

---

## 1. Usabilidad

### EAC-USA-001: Formulario de registro intuitivo
**Característica:** Usabilidad — Capacidad de aprendizaje.

- **Fuente:** Estudiante sin experiencia previa.
- **Estímulo:** Accede a `/registro` por primera vez.
- **Artefacto:** Formulario de registro (HU-001).
- **Entorno:** Navegador Chrome en desktop (1920x1080).
- **Respuesta esperada:** El formulario muestra labels claros, placeholders descriptivos, validación en tiempo real y feedback visual inmediato de errores.
- **Medida:** El usuario debe poder completar el registro en < 3 minutos sin ayuda externa. 100% de inputs tienen label visible.

### EAC-USA-002: Mensajes de error claros
**Característica:** Usabilidad — Comprensibilidad.

- **Fuente:** Estudiante ingresa email inválido.
- **Estímulo:** Submit del formulario con datos incorrectos.
- **Artefacto:** Validación en cliente y servidor.
- **Entorno:** Operación normal.
- **Respuesta esperada:** Mensaje de error específico (ej: "El correo debe ser válido") aparece junto al campo en color rojo.
- **Medida:** 100% de errores tienen mensaje en idioma español, < 100 caracteres, sin jerga técnica.

---

## 2. Rendimiento

### EAC-REN-001: Tiempo de respuesta en login
**Característica:** Rendimiento — Comportamiento temporal.

- **Fuente:** Estudiante hace clic en "Ingresar".
- **Estímulo:** `POST /api/auth/login/student` con credenciales válidas.
- **Artefacto:** Backend Node + MySQL.
- **Entorno:** Servidor local con 1 conexión concurrente.
- **Respuesta esperada:** Servidor procesa, compara contraseña con bcrypt y devuelve JWT.
- **Medida:** Tiempo total de respuesta < 1.5 segundos (incluye hash bcrypt).

### EAC-REN-002: Carga de página de login
**Característica:** Rendimiento — Eficiencia de recursos.

- **Fuente:** Usuario abre navegador.
- **Estímulo:** Navega a `/login/student`.
- **Artefacto:** Frontend React + Vite.
- **Entorno:** Conexión 4G, CPU Intel i5 de 5 años.
- **Respuesta esperada:** Página interactiva y lista para input.
- **Medida:** First Contentful Paint < 2 segundos; Time to Interactive < 3 segundos.

---

## 3. Seguridad

### EAC-SEG-001: Contraseña no se transmite en claro
**Característica:** Seguridad — Confidencialidad.

- **Fuente:** Cliente realiza login.
- **Estímulo:** Envía `POST /api/auth/login/student` con credenciales.
- **Artefacto:** Protocolo HTTPS, middleware de Express, base de datos MySQL.
- **Entorno:** Desarrollo con HTTPS simulado (localhost).
- **Respuesta esperada:** La contraseña viaja encriptada en HTTPS; servidor solo recibe y compara con hash, nunca almacena en claro.
- **Medida:** 100% de credenciales se transmiten con TLS 1.2+ (en producción). En desarrollo, mock HTTPS. Contraseña nunca visible en logs del servidor.

### EAC-SEG-002: Hash bcrypt impide fuerza bruta
**Característica:** Seguridad — Integridad y autenticidad.

- **Fuente:** Atacante intenta adivinar contraseña.
- **Estímulo:** Múltiples `POST /api/auth/login/student` con contraseñas aleatorias (1000 intentos/segundo).
- **Artefacto:** bcrypt con 10 rounds, base de datos.
- **Entorno:** Ataque contra servidor público.
- **Respuesta esperada:** Cada comparación de bcrypt toma ~100 ms (10 rounds), ralentizando ataque. Sin rate limiting adicional, servidor se vuelve lento pero no falla.
- **Medida:** bcrypt.compare() con 10 rounds ≥ 100 ms/intento. Atacante puede probar ≤ 10 contraseñas/segundo en lugar de 1000.

### EAC-SEG-003: Segundo factor previene acceso sin autorización
**Característica:** Seguridad — Control de acceso.

- **Fuente:** Atacante obtiene email + contraseña de admin.
- **Estímulo:** Intenta `POST /api/auth/login/admin` y luego `POST /api/auth/login/admin/2fa` sin el archivo correcto.
- **Artefacto:** Validación de archivo 2FA, middleware `authorizeAdmin`.
- **Entorno:** Atacante tiene credenciales pero no acceso físico al archivo.
- **Respuesta esperada:** Fase 1 completada pero Fase 2 rechazada. Sin JWT válido, todas las rutas admin devuelven 401/403.
- **Medida:** 100% de intentos sin archivo correcto rechazados. Tiempo máximo entre Fase 1 y 2: 5 minutos (timeout).

### EAC-SEG-004: JWT se valida en cada solicitud privada
**Característica:** Seguridad — Control de acceso.

- **Fuente:** Alumno intenta acceder a `/api/auth/admin/profile`.
- **Estímulo:** Envía request sin JWT o con JWT expirado.
- **Artefacto:** Middleware `authenticateJWT`, librería `jsonwebtoken`.
- **Entorno:** Operación normal.
- **Respuesta esperada:** Middleware rechaza con HTTP 401 "Token no válido".
- **Medida:** 100% de rutas privadas validan JWT. Ninguna ruta privada accesible sin JWT válido.

### EAC-SEG-005: Solo usuarios APPROVED pueden loguearse
**Característica:** Seguridad — Control de acceso.

- **Fuente:** Usuario en estado PENDING intenta login.
- **Estímulo:** `POST /api/auth/login/student` con credenciales válidas.
- **Artefacto:** Controlador de login, base de datos (users.status).
- **Entorno:** Operación normal.
- **Respuesta esperada:** Validación exitosa de contraseña pero status PENDING → respuesta 403 con mensaje "Cuenta no aprobada".
- **Medida:** 0% de usuarios PENDING, REJECTED o DISABLED obtienen JWT. 100% reciben 403.

---

## 4. Confiabilidad y Disponibilidad

### EAC-CONF-001: Carnet único garantizado sin duplicados
**Característica:** Confiabilidad — Integridad de datos.

- **Fuente:** Sistema o dos estudiantes simultáneamente.
- **Estímulo:** Se intenta registrar carnet "202300001" cuando ya existe.
- **Artefacto:** Constraint `UNIQUE` en `student_profiles.carnet`, transacción ACID.
- **Entorno:** Dos requests concurrentes en `POST /api/auth/register/student`.
- **Respuesta esperada:** Solo uno se guarda; el otro rechazado con HTTP 409 "Carnet ya registrado".
- **Medida:** 0 duplicados de carnet en base de datos. Prueba: 100 inserciones concurrentes del mismo carnet → 1 éxito, 99 fallan.

### EAC-CONF-002: Transacciones de login no dejan estado incoherente
**Característica:** Confiabilidad — Recuperación ante fallos.

- **Fuente:** Servidor falla durante `bcrypt.compare()`.
- **Estímulo:** Proceso se interrumpe a mitad del login.
- **Artefacto:** Backend, base de datos (no se realiza UPDATE).
- **Entorno:** Apagón o error de red.
- **Respuesta esperada:** Login falla; usuario queda en estado anterior (no logueado). Base de datos no registra cambio.
- **Medida:** 100% de logins son atómicos. Fallo parcial = sin efecto.

### EAC-CONF-003: Base de datos persiste entre reinicios
**Característica:** Disponibilidad — Recuperación ante fallos.

- **Fuente:** Docker compose reinicia después de caída.
- **Estímulo:** `docker compose down` y `docker compose up`.
- **Artefacto:** Volumen `mysql_data`, contenedor DB.
- **Entorno:** Volumen existe (no `down -v`).
- **Respuesta esperada:** Todos los usuarios, hashes y perfiles persisten. Estudiante puede loguearse con credenciales anteriores.
- **Medida:** 100% de datos persistidos. Reinicio del contenedor no borra usuarios.

---

## 5. Mantenibilidad

### EAC-MANT-001: Código sigue convenciones Conventional Commits
**Característica:** Mantenibilidad — Analizabilidad.

- **Fuente:** Revisor de código.
- **Estímulo:** Revisa historial de commits en rama feature.
- **Artefacto:** Repositorio Git, commits.
- **Entorno:** GitHub.
- **Respuesta esperada:** Cada commit tiene formato `feat(HU-XXX): descripción` o `fix(...)`, indicando tipo, ámbito e HU asociada.
- **Medida:** 100% de commits en feature branches siguen formato. Promedio 2-3 commits por tarea (T-XXX.X).

### EAC-MANT-002: Documentación refleja implementación
**Característica:** Mantenibilidad — Inteligibilidad.

- **Fuente:** Nuevo desarrollador revisa casos de uso.
- **Estímulo:** Lee `0.3-descripciones-textuales.md` para HU-001, HU-003, HU-006.
- **Artefacto:** Documentación en `/docs`, código en `backend/src`.
- **Entorno:** Sprint 1 completo.
- **Respuesta esperada:** Descripción textual coincide con endpoints, flujos y validaciones implementadas. No hay discrepancias.
- **Medida:** 100% de HUs documentadas coinciden con código. Revisor no encuentra "esto no está implementado así".

---


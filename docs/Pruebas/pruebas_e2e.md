# Pruebas End-to-End (E2E) — EduConnect Fase 2

---

## 1. Objetivo

Las pruebas E2E simulan la interacción real de cada rol (estudiante, tutor y administrador) con la interfaz de EduConnect, de principio a fin, para confirmar que los módulos nuevos de la Fase 2 funcionan integrados: frontend, API y base de datos.

Cada integrante del equipo implementa **una prueba E2E** sobre el flujo principal de su paquete.

---

## 2. Entorno y configuración

| Elemento | Valor |
|---|---|
| Framework | Cypress 14.5.4 (`devDependencies` de `frontend/package.json`) |
| Configuración | `frontend/cypress.config.js` |
| `baseUrl` | `http://localhost:3000` (servidor de Vite; `/api` se redirige al backend en `:5000`) |
| `specPattern` | `cypress/e2e/**/*.cy.{js,jsx}` |
| Navegador de ejecución | Firefox 157 (headless) |
| Sistema de referencia | Fedora Linux 44, Node.js 22.23.1 |

### 2.1 Cómo ejecutar la suite

```bash
# 1. Levantar el proyecto (frontend en :3000, backend en :5000, MySQL)
docker compose up --build

# 2. En otra terminal, instalar dependencias del frontend (incluye Cypress)
cd frontend
npm ci

# 3. Ejecutar todas las pruebas E2E
npx cypress run --browser firefox

# Ejecutar una sola prueba
npx cypress run --browser firefox --spec cypress/e2e/e2e-04-metricas-reportes.cy.js

# Modo interactivo (ver cada paso en el navegador)
npm run cypress:open
```

> **Nota para Linux con Wayland:** el navegador por defecto de Cypress (Electron) se bloquea al tomar capturas (`cy.screenshot() timed out`). Ejecutar con `--browser firefox` o `--browser chrome`.

### 2.2 Estrategia de datos de prueba

Para que las pruebas se puedan ejecutar en cualquier máquina, sin depender de los datos de cada base local, el equipo combina dos técnicas:

- **Interacción real** con la interfaz y con el backend en los pasos de autenticación (login, token y 2FA).
- **`cy.intercept`** para simular las respuestas de la API cuyo contenido depende de los datos de cada base (reportes, listados). Así las aserciones verifican valores conocidos.

Las capturas de evidencia (`cy.screenshot`) se generan en `frontend/cypress/screenshots/` (excluida de Git) y se copian a `docs/Pruebas/imgs/`.

---

## 3. Resumen de la suite

| ID | Responsable | Paquete | Flujo | Archivo | Estado |
|---|---|---|---|---|---|
| E2E-01 | Yury Cruz (202300359) | A | Registro con carnet PDF → token → primer login | `student_auth_flow.cy.js` |  1/1 |
| E2E-02 | Xavi (202300596) | B | Registro tutor con CV → admin revisa en visor → aprobación | — |  Pendiente |
| E2E-03 | Alvaro Ceballos (202300673) | C | Admin edita estudiante → baja por denuncia → bloqueo de login | `e2e-03-moderacion-sancion.cy.js` |  En corrección |
| E2E-04 | Katheryn (202308940) | D | Admin → métricas → filtros temporales → validación de gráficos | `e2e-04-metricas-reportes.cy.js` |  3/3 |
| E2E-05 | Nicole López (202300659) | E | Tutor asigna plan → estudiante lo consulta → constancia PDF | `e2e-05-plan-constancia.cy.js` |  Por verificar |
| E2E-06 | Isai (202308204) | F | Estudiante califica tutor → denuncia → admin revisa | — |  Pendiente |

---

## 4. Detalle de las pruebas

### E2E-01 — Registro con PDF, verificación por token y primer login

| Campo | Detalle |
|---|---|
| **Responsable** | Yury Cruz (202300359) — Paquete A |
| **HU cubiertas** | HU-028, HU-030, HU-031 |
| **Archivo** | `frontend/cypress/e2e/student_auth_flow.cy.js` |
| **Estrategia** | Formulario y navegación reales; `POST /api/auth/register/student` y `POST /api/auth/login/student` simulados con `cy.intercept`. |

**Flujo:** el estudiante llena el registro (datos personales, fotografía y carnet en PDF) → ve la pantalla de registro exitoso → intenta su primer login y el sistema le exige el token → ingresa el token → accede a `/dashboard/student`.

**Resultado:** 1/1 passing (5.3 s) en la ejecución del 19/10/2026.

> _Pendiente (Yury): tabla de pasos con resultado esperado / obtenido y captura de evidencia._

---

### E2E-02 — Registro de tutor e inspección del CV en visor PDF

| Campo | Detalle |
|---|---|
| **Responsable** | Xavi (202300596) — Paquete B |
| **HU cubiertas** | HU-029, HU-040 |
| **Archivo** | _Pendiente_ |

**Flujo planificado:** el tutor se registra cargando su CV en PDF → el administrador inicia sesión con 2FA → entra a solicitudes de tutores → abre el visor PDF incrustado → presiona "Aceptar solicitud" → el tutor queda aprobado.

> _Pendiente (Xavi): implementación, tabla de pasos y evidencia._

---

### E2E-03 — Moderación y sanción de cuenta

| Campo | Detalle |
|---|---|
| **Responsable** | Alvaro Ceballos (202300673) — Paquete C |
| **HU cubiertas** | HU-041, HU-043, HU-044 |
| **Archivo** | `frontend/cypress/e2e/e2e-03-moderacion-sancion.cy.js` |

**Flujo:** el administrador inicia sesión con 2FA → abre el listado de estudiantes activos → verifica que el correo no es editable → localiza una denuncia y aplica "Dar de baja" con confirmación → cierra sesión → el estudiante sancionado intenta ingresar y el sistema le niega el acceso.

> _En corrección (Alvaro): pendiente login con rol admin y 2FA, sesión compartida entre `it` y datos independientes de la BD local._

---

### E2E-04 — Supervisión de métricas y reportes analíticos

| Campo | Detalle |
|---|---|
| **Responsable** | Wade (202308940) — Paquete D |
| **HU cubiertas** | HU-045, HU-046, HU-047, HU-048 |
| **Archivo** | `frontend/cypress/e2e/e2e-04-metricas-reportes.cy.js` |
| **Precondición** | Existe el administrador `admin@educonnect.com` / `Admin123!` en la base local. |

**Estrategia:**

- **Login real** del administrador (credenciales + archivo 2FA `auth2-ayd1.txt`) contra el backend. Obtiene un JWT válido, necesario porque el panel administrativo consulta otros endpoints protegidos.
- La sesión se reutiliza entre pruebas con `cy.session`.
- Los 5 endpoints de reportes se simulan con `cy.intercept` y datos fijos que dependen del filtro recibido:
  - `GET /api/reports/tutors-ratings`
  - `GET /api/reports/students-ratings`
  - `GET /api/reports/sessions-evolution`
  - `GET /api/reports/cancellations-by-subject`
  - `GET /api/reports/demanded-schedules`
- Cada filtro se valida esperando la petición con el parámetro exacto (`cy.intercept` con `query`). Así la prueba no se confunde con las peticiones iniciales duplicadas por React StrictMode en desarrollo.

#### Pasos, resultado esperado y resultado obtenido

| # | Acción | Resultado esperado | Obtenido |
|---|---|---|---|
| 1 | Seleccionar rol Administrador, ingresar correo y contraseña | Redirección a `/login/admin/2fa` |  |
| 2 | Cargar `auth2-ayd1.txt` y presionar "Validar y acceder al sistema" | Redirección a `/admin/dashboard` y JWT en `localStorage` |  |
| 3 | Abrir la pestaña **Métricas** | Se muestra el panel de métricas |  |
| 4 | Revisar la tabla de tutores | 3 tutores; Marta Gómez primera con **4.67 ★**; Ana Morales con "Sin calificaciones" | |
| 5 | Revisar la tabla de estudiantes | 3 estudiantes; Diego López primero con **4.00 ★**; Sofía Ramos con "Sin calificaciones" |  |
| 6 | Cambiar "Agrupar por" a **Semana** | Petición con `granularity=week`; el gráfico de evolución se mantiene visible |  |
| 7 | Filtrar el mes **2026-07** (sin sesiones) | Petición con `granularity=week&month=2026-07`; aparece "No hay sesiones atendidas en el período seleccionado." y se oculta el gráfico |  |
| 8 | Presionar "Limpiar filtro" | El campo de mes queda vacío y el gráfico vuelve a mostrarse |  |
| 9 | Revisar el reporte F2-2 sin filtro | Matemática primera con **66.7 %** de cancelación; franja más demandada **08:00 - 09:00**; ambos gráficos visibles |  |
| 10 | Filtrar el reporte F2-2 por **2026-10** | Peticiones de cancelaciones y horarios con `month=2026-10`; Física pasa a primera con **100 %** y la franja más demandada cambia a **14:00 - 15:00** |  |
| 11 | Presionar "Limpiar filtro" del reporte F2-2 | Vuelven Matemática como primera y la franja **08:00 - 09:00** |  |

#### Evidencia de ejecución

```
  E2E-04: Supervisión de métricas y reportes analíticos
    ✓ Pasos 1-3: muestra el promedio de estrellas de tutores y estudiantes activos (2809ms)
    ✓ Paso 4: filtra la evolución de sesiones por granularidad y por mes (1696ms)
    ✓ Paso 5: filtra el reporte F2-2 por mes y actualiza cancelaciones y horarios (1637ms)

  3 passing (6s)
```

_Cypress 14.5.4 · Firefox 157 (headless) · 19/10/2026_

**Promedios de calificaciones de tutores y estudiantes (pasos 3 a 5):**

![E2E-04 promedios de calificaciones](imgs/e2e-04-01-promedios-calificaciones.png)

**Evolución de sesiones tras aplicar y limpiar filtros (pasos 6 a 8):**

![E2E-04 evolución de sesiones](imgs/e2e-04-02-evolucion-sesiones.png)

**Reporte F2-2 filtrado por octubre 2026 (pasos 9 y 10):**

![E2E-04 reporte F2-2 filtrado](imgs/e2e-04-03-reporte-f2-filtrado.png)

---

### E2E-05 — Creación de plan estructurado y constancia PDF

| Campo | Detalle |
|---|---|
| **Responsable** | Nicole López (202300659) — Paquete E |
| **HU cubiertas** | HU-032, HU-033, HU-034 |
| **Archivo** | `frontend/cypress/e2e/e2e-05-plan-constancia.cy.js` |
| **Estrategia** | Login real de tutor y estudiante; la prueba crea su propia sesión PENDING con `cy.request` al iniciar; `GET /api/ratings/**` simulado con `cy.intercept`. |

**Flujo:** el tutor abre sus sesiones pendientes → marca una como atendida → registra las dificultades y 2 recursos (Texto y Video) → guarda el plan (la sesión pasa a ATTENDED) → el estudiante entra a "Mi Plan" y verifica el contenido → descarga la constancia y la respuesta es `application/pdf`.

Evidencia existente: `docs/Pruebas/evidencias/e2e-05-constancia.pdf`.

> _Por verificar: ejecución en una máquina distinta a la de la autora._

---

### E2E-06 — Retroalimentación y denuncia disciplinaria

| Campo | Detalle |
|---|---|
| **Responsable** | Isai (202308204) — Paquete F |
| **HU cubiertas** | HU-035, HU-036 |
| **Archivo** | _Pendiente_ |

**Flujo planificado:** el estudiante entra a su historial de sesiones atendidas → califica al tutor con 5 estrellas → presiona "Reportar tutor" → selecciona una categoría predefinida y redacta el motivo → el sistema confirma y la denuncia llega al buzón administrativo.

> _Pendiente (Isai): implementación, tabla de pasos y evidencia._

---

## 5. Ejecución de la suite completa

> _Pendiente: salida de `npx cypress run --browser firefox` con las 6 pruebas en verde._

---

## 6. Plantilla para completar cada prueba

Cada responsable completa su sección con esta estructura:

1. Tabla de datos: responsable, HU cubiertas, archivo y estrategia de datos.
2. Flujo resumido.
3. Tabla de pasos: **acción / resultado esperado / resultado obtenido**.
4. Salida de la ejecución (`npx cypress run --browser firefox --spec <archivo>`).
5. Capturas generadas con `cy.screenshot('e2e-0X-...')`, copiadas a `docs/Pruebas/imgs/`.
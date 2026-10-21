# Contrato de Denuncias e Incidentes Disciplinarios (Fase 2)

Este contrato es la referencia técnica compartida para:
- **HU-036:** Reporte disciplinario contra tutores por estudiantes (Paquete F / Sprint 2).
- **HU-038:** Reporte disciplinario contra estudiantes por tutores (Paquete F / Sprint 2).
- **HU-043:** Panel de visualización y resolución de denuncias contra tutores por el Administrador (Paquete C / Sprint 1).
- **HU-044:** Panel de visualización y resolución de denuncias contra estudiantes por el Administrador (Paquete C / Sprint 2).

---

## 1. Modelo de Datos (`incident_reports`)

Un reporte disciplinario siempre está vinculado a una sesión de tutoría (`sessions.id`). Solo puede crearse si la sesión se encuentra en estado `ATTENDED`. Un denunciante no puede emitir múltiples reportes sobre la misma sesión (`UNIQUE(session_id, reporter_id)`).

```sql
CREATE TABLE IF NOT EXISTS incident_reports (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id       INT UNSIGNED NOT NULL,
  reporter_id      INT UNSIGNED NOT NULL,
  reported_user_id INT UNSIGNED NOT NULL,
  reporter_role    ENUM('student', 'tutor') NOT NULL,
  category         VARCHAR(150) NOT NULL,
  reason           TEXT NOT NULL,
  status           ENUM('PENDING', 'RESOLVED_BANNED', 'DISMISSED')
                   NOT NULL DEFAULT 'PENDING',
  admin_notes      TEXT NULL,
  resolved_by      INT UNSIGNED NULL,
  resolved_at      TIMESTAMP NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_incident_session_reporter UNIQUE (session_id, reporter_id),
  CONSTRAINT fk_incident_session
    FOREIGN KEY (session_id) REFERENCES sessions(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_incident_reporter
    FOREIGN KEY (reporter_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_incident_reported_user
    FOREIGN KEY (reported_user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_incident_admin
    FOREIGN KEY (resolved_by) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  INDEX idx_incident_status (status),
  INDEX idx_incident_reported_user (reported_user_id),
  INDEX idx_incident_reporter_role (reporter_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 2. Catálogo Oficial de Categorías Predefinidas

De acuerdo con las especificaciones del **Enunciado de Fase 2**:

### Categorías para reportar a un Tutor (HU-036)
1. `Ética y profesionalismo`
2. `Negligencia académica`
3. `Abuso y conducta inapropiada`
4. `Falsificación de información`
5. `Inasistencia o abandono de sesión`

### Categorías para reportar a un Estudiante (HU-038)
1. `Conducta inapropiada`
2. `Falsificación de documentos`
3. `Agresión verbal o física`
4. `Robo o daño a las instalaciones`
5. `Falta de respeto o indisciplina`

---

## 3. Endpoints de la API REST

### 3.1. Crear reporte contra Tutor (HU-036)
* **Método y Ruta:** `POST /api/sessions/:sessionId/report-tutor`
* **Autenticación:** JWT con rol `student`.
* **Cuerpo:**
```json
{
  "category": "Ética y profesionalismo",
  "reason": "El tutor no se presentó a tiempo y mostró una actitud displicente."
}
```
* **Reglas:**
  * Sesión debe pertenecer al estudiante.
  * Sesión debe tener estado `ATTENDED`.
  * `category` debe pertenecer al catálogo de faltas contra tutores.
  * `reason` debe tener al menos 10 caracteres.

### 3.2. Crear reporte contra Estudiante (HU-038)
* **Método y Ruta:** `POST /api/sessions/:sessionId/report-student`
* **Autenticación:** JWT con rol `tutor`.
* **Cuerpo:**
```json
{
  "category": "Conducta inapropiada",
  "reason": "El estudiante mantuvo un trato agresivo durante la sesión."
}
```
* **Reglas:**
  * Sesión debe pertenecer al tutor.
  * Sesión debe tener estado `ATTENDED`.
  * `category` debe pertenecer al catálogo de faltas contra estudiantes.
  * `reason` debe tener al menos 10 caracteres.

### 3.3. Listar denuncias contra Tutores (HU-043)
* **Método y Ruta:** `GET /api/admin/reports/tutors`
* **Autenticación:** JWT con rol `admin`.
* **Parámetros de consulta (opcionales):** `status=PENDING|RESOLVED_BANNED|DISMISSED`
* **Respuesta `200 OK`:**
```json
{
  "reports": [
    {
      "id": 1,
      "sessionId": 12,
      "sessionDate": "2026-10-09",
      "reporterId": 5,
      "reporterNombre": "María",
      "reporterApellido": "González",
      "reporterCarnet": "202300123",
      "reportedUserId": 8,
      "reportedNombre": "Carlos",
      "reportedApellido": "Pérez",
      "reportedCarnet": "201900456",
      "reportedEspecialidad": "Matemática",
      "category": "Ética y profesionalismo",
      "reason": "El tutor no se presentó a tiempo y mostró una actitud displicente.",
      "status": "PENDING",
      "createdAt": "2026-10-10T14:30:00Z"
    }
  ]
}
```

### 3.4. Listar denuncias contra Estudiantes (HU-044)
* **Método y Ruta:** `GET /api/admin/reports/students`
* **Autenticación:** JWT con rol `admin`.
* **Respuesta `200 OK`:** Estructura equivalente orientada a estudiantes denunciados.

### 3.5. Resolver denuncia (HU-043 / HU-044)
* **Método y Ruta:** `PATCH /api/admin/reports/:id/resolve`
* **Autenticación:** JWT con rol `admin`.
* **Cuerpo:**
```json
{
  "action": "BAN", // "BAN" (da de baja al infractor) o "DISMISS" (desestima la queja)
  "notes": "Se verificó la falta y se procede a la inhabilitación de la cuenta."
}
```
* **Efectos:**
  * Si `action == 'BAN'`:
    * `incident_reports.status = 'RESOLVED_BANNED'`
    * `users.status = 'DISABLED'` para el `reported_user_id` (Baja lógica inmediata)
  * Si `action == 'DISMISS'`:
    * `incident_reports.status = 'DISMISSED'`

### 3.6. Consulta de reportes propios (HU-036 / HU-038)

Para evitar duplicar formularios en el historial de sesiones, el frontend consulta los reportes creados por el participante:

* **Estudiante:** `GET /api/incidents/me`
* **Tutor:** `GET /api/incidents/tutor/me`

La creación se implementa mediante `POST /api/sessions/:sessionId/report-tutor` para estudiantes y
`POST /api/sessions/:sessionId/report-student` para tutores. Ambos endpoints exigen JWT con el rol correcto,
validan que la sesión sea propia y `ATTENDED`, y responden `409` si ya existe un reporte del mismo participante.

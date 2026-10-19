# Arquitectura y CI/CD — Fase 2

## Alcance del Sprint 1

La distribución actualizada asigna a Isai el Paquete F: feedback de sesiones y automatización CI/CD. En este Sprint 1 se implementan HU-035 (calificación de tutores) y HU-049 (Build y Test). Las historias de denuncias, calificación de estudiantes y la etapa Deploy corresponden al Sprint 2.

## Arquitectura lógica

```text
Estudiante (React)
      │  GET/POST /api/ratings
      ▼
Backend Express / Node.js
      │  autenticación por JWT + validación de reglas
      ▼
MySQL 8.0
      ├── sessions (estado ATTENDED)
      ├── student_profiles / tutor_profiles
      └── reviews (una calificación por sesión)
```

El frontend muestra el formulario de HU-035 en el historial únicamente para sesiones atendidas. El backend vuelve a validar la identidad del estudiante, la pertenencia de la sesión, el estado `ATTENDED`, la calificación entera entre 0 y 5 y la unicidad de `session_id`; la interfaz nunca sustituye estas reglas de seguridad.

## Contrato de HU-035

| Método | Endpoint | Propósito |
| :--- | :--- | :--- |
| `GET` | `/api/ratings/me` | Consulta las calificaciones del estudiante autenticado. |
| `POST` | `/api/ratings/sessions/:sessionId` | Registra una calificación de 0–5 y un comentario opcional. |

El `POST` responde `400` ante un payload inválido, `404` si la sesión no pertenece al estudiante, `409` si no está atendida o ya fue calificada y `201` cuando la persistencia es exitosa.

## Flujo CI/CD de HU-049

El workflow `.github/workflows/backend-ci-cd.yml` se dispara con `push` a `main` y usa `ubuntu-latest` con Node.js 20:

1. `build`: instala dependencias del backend, construye la imagen Docker y compila el frontend.
2. `test`: depende de `build`, instala las dependencias y ejecuta `npm test`.

La etapa `deploy` no se activa en este Sprint 1; queda reservada para el Sprint 2. Las credenciales y variables sensibles deben configurarse como GitHub Secrets, nunca dentro del YAML o del código fuente.

## Verificación local

```bash
cd backend
npm test

cd ../frontend
npm run build
```

La ejecución realizada para esta entrega produjo 32 pruebas unitarias exitosas y un build de producción del frontend completado.

## Dependencias y bloqueos

La prueba funcional de HU-035 necesita que otro módulo haya marcado sesiones como `ATTENDED`. Esto es una dependencia de datos/integración, no un bloqueo para implementar la API ni el workflow; la regla se valida en backend y se documenta para la integración con el flujo de atención de Nicole.

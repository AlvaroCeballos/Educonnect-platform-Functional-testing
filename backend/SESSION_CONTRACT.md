# Contrato de sesiones y disponibilidad

Este contrato es la referencia compartida para HU-012, HU-016, HU-017 y las
vistas de disponibilidad.

## Materias

- `subjects` contiene el catálogo único de materias.
- `tutor_subjects` relaciona cada tutor con las materias que imparte.
- Una reserva debe enviar `subject_id`; no se acepta texto libre para la
  materia.
- La materia seleccionada debe pertenecer al tutor de la reserva.

Consultas disponibles:

- `GET /api/tutors`: tutores aprobados, incluyendo `materias`.
- `GET /api/tutors/:id/subjects`: materias activas de un tutor.
- `GET /api/tutors/:id/schedules`: horarios activos del tutor.

## Rango horario de una sesión

La tabla `sessions` requiere `start_time` y `end_time`. El formulario puede
mostrar una sola hora de inicio, pero el servicio debe derivar el fin con la
duración estándar de **60 minutos** antes de guardar la reserva. Si en el
futuro el Product Owner cambia la duración, se modifica esa regla del servicio;
el esquema conserva ambos límites para poder validar intervalos completos.

Reglas mínimas:

1. `start_time < end_time`.
2. El intervalo debe quedar dentro del horario del tutor para el día elegido.
3. Una sesión activa (`PENDING`) traslapa otra cuando:
   `nuevo_inicio < existente_fin` y `nuevo_fin > existente_inicio`.
4. Una sesión cancelada o atendida no bloquea nuevamente el horario.

El endpoint de creación debe recibir:

```json
{
  "tutor_id": 1,
  "session_date": "2026-09-15",
  "start_time": "10:00:00",
  "end_time": "11:00:00",
  "subject_id": 3,
  "reason": "Repaso para examen parcial"
}
```


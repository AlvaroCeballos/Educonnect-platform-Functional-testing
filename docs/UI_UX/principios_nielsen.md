# Evaluación y Aplicación de Principios Heurísticos de Jakob Nielsen

## 1. Introducción
El diseño de interfaces de EduConnect se fundamenta en la aplicación de las 10 heurísticas de usabilidad establecidas por Jakob Nielsen. A continuación se detallan y justifican los 6 principios seleccionados, acompañados de su evidencia de implementación en la plataforma.

---

## 2. Principios Seleccionados y Evidencia de Aplicación

### Heurística 1: Visibilidad del Estado del Sistema
* *Justificación:* Los usuarios deben saber en todo momento el resultado de sus acciones y el estado de la comunicación con el servidor.
* *Aplicación en EduConnect:*
  * *Skeletons de Carga:* En el catálogo de tutores (StudentDashboard.jsx), al consultar la base de datos se despliega una cuadrícula animada de carga tipo pulso (pulse), indicando que el contenido está procesándose.
  * *Insignias de Disponibilidad:* Cada tarjeta de tutor muestra un badge visual con punto parpadeante (● Disponible) o advertencias en rojo/ámbar si el tutor no labora.
  * *Notificaciones Toast y Modales:* Respuestas visuales instantáneas mediante SweetAlert2 tras aprobar, rechazar o cancelar una sesión.

  *Evidencia visual — pantalla Catálogo de tutores:* La captura muestra las insignias "Disponible" y el estado visible de cada tutor en las tarjetas del catálogo.
  ![Visibilidad del estado del sistema](../Manuales/imgs/estudiante-05-tutores-disponibles.png)

### Heurística 2: Coincidencia entre el Sistema y el Mundo Real
* *Justificación:* El sistema debe emplear lenguaje, terminología y conceptos propios del entorno universitario sin jerga técnica de base de datos.
* *Aplicación en EduConnect:*
  * Uso de términos comunes para la comunidad académica de la USAC: "Carnet", "Tutoría", "Horario de Atención", "Materia", "Semestre", "DPI".
  * Representación horaria estándar (formato 24 hrs y bloques de 60 minutos reconocibles).

  *Evidencia visual — pantalla Registro de estudiante:* La captura muestra el campo "Carnet universitario" y el vocabulario utilizado por la comunidad académica.
  ![Coincidencia entre el sistema y el mundo real](../Manuales/imgs/estudiante-01-registro.png)

### Heurística 3: Control y Libertad del Usuario
* *Justificación:* Los usuarios a menudo eligen funciones por error y requieren una salida de emergencia clara sin pasar por estados complejos.
* *Aplicación en EduConnect:*
  * *Limpieza Rápida de Filtros:* En el panel de búsqueda avanzada (AdvancedFilters.jsx), se incluye el botón "Limpiar filtros", que restablece el catálogo al estado inicial con un solo clic.
  * *Cierre de Modales:* El modal de horarios (TutorScheduleModal.jsx) cuenta con botón de escape rápido (✕), botón de cierre inferior y descarte al hacer clic fuera del contenedor.

  *Evidencia visual — pantalla Confirmación de cancelación:* La captura muestra las opciones "Sí, cancelar" y "No", que permiten confirmar o abandonar la acción antes de modificar la reserva.
  ![Control y libertad del usuario](../Manuales/imgs/estudiante-11-cancelar-confirmacion.png)

### Heurística 4: Consistencia y Estándares
* *Justificación:* Mantener las mismas convenciones gráficas y de interacción a lo largo de todas las vistas para reducir la curva de aprendizaje.
* *Aplicación en EduConnect:*
  * *Paleta Unificada de Tailwind CSS:* Botones primarios en tonalidades Esmeralda (bg-emerald-700 / hover:bg-emerald-800), acciones destructivas en rojo carmesí y elementos secundarios en Slate.
  * *Diseño Estandarizado de Tarjetas:* Las tarjetas de tutor en la vista principal y en los resultados de búsqueda mantienen exactamente la misma disposición (fotografía a la izquierda, credenciales al centro, acciones al pie).

  *Evidencia visual — pantalla Paneles de tutor:* La captura muestra la estructura visual uniforme de las tarjetas, botones y acciones del panel.
  ![Consistencia y estándares](../Manuales/imgs/paneles%20tutor.png)

### Heurística 5: Prevención de Errores
* *Justificación:* El sistema debe impedir que el usuario ejecute acciones erróneas antes de que se produzca un fallo en el servidor.
* *Aplicación en EduConnect:*
  * *Bloqueo de Horarios Ocupados:* En el selector de bloques de tutoría (TutorScheduleModal.jsx), los slots que colisionan con sesiones ya reservadas se renderizan atenuados, deshabilitados y con etiqueta ✕ Ocupado.
  * *Restricción de Fechas Pasadas:* El selector HTML de tipo date cuenta con atributo min configurado en la fecha actual (CURDATE()), bloqueando fechas retroactivas.
  * *Modales de Confirmación:* Diálogos previos obligatorios con SweetAlert2 antes de cancelar una sesión o dar de baja una cuenta.

  *Evidencia visual — pantalla Actualización de horario:* La captura muestra el bloqueo de una actualización incompatible y el mensaje explicativo que evita continuar con datos inválidos.
  ![Prevención de errores](../Manuales/imgs/tutor-04-actualizar-horario-error.png)

### Heurística 6: Reconocimiento antes que Memorización
* *Justificación:* Minimizar la carga cognitiva haciendo visibles los elementos, opciones y acciones, sin forzar al estudiante a recordar nombres exactos.
* *Aplicación en EduConnect:*

  * *Selectores Asistidos:* La búsqueda por materia utiliza un menú desplegable (`select`) alimentado dinámicamente desde el endpoint `/tutors/subjects-catalog`, evitando errores tipográficos.
  * *Controles Visuales (Sliders e Inputs Numéricos):* Los filtros de años de experiencia y rangos de edad muestran el valor activo en tiempo real.

  *Evidencia visual — pantalla Búsqueda y filtros:* La captura muestra el menú de materias, el slider y los valores visibles para seleccionar opciones sin memorizar nombres o rangos.
  ![Reconocimiento antes que memorización](../Manuales/imgs/estudiante-06-busqueda-filtros.png)
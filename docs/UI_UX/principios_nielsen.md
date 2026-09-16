# Evaluación heurística de usabilidad — EduConnect

**Responsable:** Yury — Paquete D: Descubrimiento y Disponibilidad  
**Historias revisadas:** HU-009, HU-010, HU-011 y HU-027

La evaluación se realiza sobre los flujos de estudiante, tutor y administrador definidos en el prototipo y contrastados con la implementación React. Se documentan seis heurísticas de Nielsen, sus evidencias y el criterio de verificación.

## 1. Visibilidad del estado del sistema

EduConnect comunica carga mediante skeletons, resultados vacíos, errores recuperables, badges de disponibilidad y confirmaciones de reserva. En HU-011 los slots se presentan como libres u ocupados y en HU-027 se muestra el estado del reporte.

**Evidencia:** `StudentDashboard.jsx`, `TutorScheduleModal.jsx`, `AdminDashboard.jsx`.  
**Verificación:** al ejecutar una consulta el usuario puede identificar si el sistema está cargando, terminó, no encontró datos o requiere reintento.

## 2. Coincidencia entre el sistema y el mundo real

La interfaz usa vocabulario del dominio académico: estudiante, tutor, materia, universidad, carnet, disponibilidad, sesión y horario. Las tarjetas y los filtros siguen el modelo mental de buscar un tutor y reservar un espacio.

**Evidencia:** `AdvancedFilters.jsx`, `StudentDashboard.jsx` y los frames `EST-01` a `EST-03`.  
**Verificación:** las etiquetas de la interfaz corresponden a acciones y objetos que el usuario reconoce en el proceso de tutoría.

## 3. Control y libertad del usuario

Los flujos contemplan volver, cerrar modales, limpiar filtros, cancelar una operación y reintentar una consulta fallida. Antes de cancelar una sesión o ejecutar una acción administrativa destructiva se solicita confirmación.

**Evidencia:** `TutorScheduleModal.jsx`, `MySessions.jsx` y `AdminDashboard.jsx`.  
**Verificación:** el usuario puede abandonar o corregir una acción sin quedar atrapado en un flujo irreversible.

## 4. Consistencia y estándares

La barra de navegación, botones, tarjetas, badges, radios, bordes y jerarquía tipográfica reutilizan los mismos patrones. La paleta principal se mantiene en verde/turquesa con azul petróleo para encabezados y fondo claro para superficies.

**Evidencia:** `frontend/src/styles.css`, `frontend/src/index.css` y la guía de estilos de este documento.  
**Verificación:** una misma acción mantiene nombre, forma, posición relativa y comportamiento en los distintos módulos.

## 5. Prevención de errores

Los formularios validan campos obligatorios y formatos; los botones se deshabilitan durante operaciones; se separan horarios libres y ocupados; y el backend valida conflictos de agenda antes de guardar una sesión.

**Evidencia:** `frontend/src/scheduleValidation.js`, `ScheduleForm.jsx`, `TutorScheduleModal.jsx` y `backend/src/controllers/sessionController.js`.  
**Verificación:** el sistema evita reservas inválidas, avisa el motivo y conserva los datos ingresados cuando la operación falla.

## 6. Reconocimiento antes que memorización

Los tutores se presentan mediante tarjetas con fotografía, universidad, materias y disponibilidad. Los filtros aparecen como controles visibles y los horarios se muestran en una cuadrícula con fecha seleccionable, reduciendo la necesidad de recordar códigos o formatos.

**Evidencia:** `StudentDashboard.jsx`, `AdvancedFilters.jsx`, `TutorScheduleModal.jsx` y los frames `EST-02` y `EST-03`.  
**Verificación:** el usuario puede reconocer el tutor, filtro o slot correcto a partir de la información visible.

## 7. Lista de comprobación

- [ ] Contraste suficiente en textos, botones y estados.
- [ ] Foco visible y navegación posible sin depender únicamente del mouse.
- [ ] Mensajes de error junto al campo o acción que los origina.
- [ ] Skeleton, vacío, error y éxito representados en wireframes/mockups.
- [ ] Estados `PENDING`, `ATTENDED`, `CANCELLED`, `AVAILABLE` y `OCCUPIED` diferenciados por texto y color.
- [ ] Las acciones del prototipo coinciden con las rutas y componentes de la aplicación.

## 8. Evidencia visual

Las capturas de los estados implementados y la presentación navegable se mantienen en el archivo de Figma:

[Prototipos interactivos de EduConnect](https://www.figma.com/design/WK53bf0D4M3PiP5elIF0bz/EduConnect-%E2%80%94-Prototipos-interactivos-Yury)

Para la entrega, cada captura debe identificar el frame, la heurística demostrada y el estado probado; no se deben sustituir capturas reales por ilustraciones genéricas.

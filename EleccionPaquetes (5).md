# Elección de Paquetes de Trabajo — EduConnect (Fase 2)

## Metodología de Elección y Balance de Carga

Para esta segunda fase, el alcance se concentra exclusivamente en las **nuevas funcionalidades**, las **actualizaciones de lógica de negocio** y los **componentes de aseguramiento de calidad (Testing y DevOps)**. 

Los seis integrantes del equipo de desarrollo deben seleccionar **un paquete principal de trabajo**. La distribución fue diseñada para garantizar un balance riguroso en términos de complejidad técnica y tiempo estimado de implementación (aproximadamente 13 a 15 Story Points por paquete). Tras las sesiones de Planning Poker, cualquier variación en la estimación se ajustará equilibrando tickets técnicos de soporte.

---

## Paquete A — Identidad, Token de Verificación y Carga Documental de Estudiantes

**Ideal para:** Quien domine flujos de seguridad, middlewares de autenticación, gestión de tokens criptográficos temporales y procesamiento de archivos en backend (`Multer`).

### Historias de Usuario Asignadas:
* **HU-028: Registro de Estudiante con Fotografía Obligatoria y Carga de Carnet en PDF**
  * *Como* estudiante postulante,
  * *Quiero* adjuntar obligatoriamente mi fotografía reciente y mi carnet universitario escaneado en formato PDF al momento de registrarme,
  * *Para que* el administrador cuente con los respaldos documentales necesarios para validar mi identidad académica.
  * *Criterios de Aceptación:*
    * El formulario no permite el envío si falta la fotografía o el archivo `.pdf` del carnet.
    * Validación estricta de MIME-Type (`application/pdf`) y límite de tamaño máximo (ej. 5 MB).
    * Almacenamiento seguro del PDF en el servidor/volumen con nombres UUID no colisionables.
    * Mantiene las validaciones de Fase 1: carnet único, correo único, contraseña segura ($\ge 8$ caracteres, mayúscula, minúscula, número).
* **HU-030: Generación y Envío de Token de Verificación por Correo Electrónico**
  * *Como* sistema EduConnect,
  * *Quiero* generar un token criptográfico único y despachar un correo institucional tras el registro de cualquier estudiante o tutor,
  * *Para que* el usuario verifique la legitimidad de su dirección de correo antes de su primer acceso.
  * *Criterios de Aceptación:*
    * Creación de un token pseudoaleatorio alfanumérico seguro persistido en base de datos asociado al usuario.
    * Envío inmediato mediante transporte SMTP (Mailtrap) con remitente oficial "EduConnect".
    * La plantilla del correo debe incluir obligatoriamente: logotipo oficial, mensaje breve de bienvenida contra filtros anti-spam, el token en texto resaltado e instrucciones paso a paso.
* **HU-031: Primer Inicio de Sesión con Validación Dual (Token y Aprobación Administrativa)**
  * *Como* estudiante o tutor registrado,
  * *Quiero* ingresar mi correo, contraseña y el token recibido en mi primer intento de autenticación,
  * *Para que* el sistema active mi cuenta y me conceda acceso a la plataforma.
  * *Criterios de Aceptación:*
    * En el primer inicio de sesión se exige el campo "Token de Verificación".
    * Si el token es inválido o no coincide, el acceso es rechazado con mensaje específico.
    * Si el usuario no ha sido aprobado aún por el administrador, el sistema bloquea el acceso informando "Cuenta pendiente de aprobación administrativa".
    * Tras validar exitosamente ambas condiciones, la cuenta se marca como `email_verified = TRUE`.
    * En los inicios de sesión subsecuentes, el sistema solicita únicamente correo y contraseña.

### Responsabilidades Técnicas Naturales:
* Migración de esquema para almacenar tokens de verificación, fechas de expiración y banderas de verificación.
* Endpoint centralizado de autenticación adaptado para validar flujos de primer acceso vs accesos recurrentes.
* Configuración de middlewares de validación de carga para imágenes y documentos PDF.
* **Puede comenzar sin esperar a nadie:** Sí, utilizando pruebas directas sobre endpoints de autenticación y carga.

---

## Paquete B — Perfil Profesional del Tutor, Visores PDF Embebidos y Despliegue en la Nube

**Ideal para:** Quien tenga destreza en manejo de documentos en frontend (visores embebidos), streaming de archivos binarios y despliegue en plataformas cloud.

### Historias de Usuario Asignadas:
* **HU-029: Registro de Tutor con Carga Obligatoria de CV en Formato PDF**
  * *Como* tutor postulante,
  * *Quiero* adjuntar mi currículum vítae en formato PDF durante mi registro profesional,
  * *Para que* la administración pueda certificar mi experiencia académica y materias de especialidad.
  * *Criterios de Aceptación:*
    * El formulario bloquea el registro si no se adjunta el archivo `.pdf` del CV.
    * Se valida tamaño máximo y extensión estrictamente PDF.
    * Se almacena la ruta relativa en base de datos asociada al registro profesional del tutor.
    * Preserva la obligatoriedad de la foto, número colegiado/identificación y validaciones de Fase 1.
* **HU-039: Aprobación de Estudiantes con Visor PDF Embebido de Carnet**
  * *Como* administrador del sistema,
  * *Quiero* examinar el carnet del estudiante directamente en la interfaz mediante un visor incrustado sin descargarlo,
  * *Para que* pueda cotejar los datos registrados con el documento oficial de forma rápida antes de aprobar o rechazar.
  * *Criterios de Aceptación:*
    * Integración de un visor PDF interactivo (etiqueta `<iframe / <embed>` o visor nativo PDF.js) en el modal/panel de revisión de estudiantes.
    * El visor permite zoom, navegación y visualización nítida sin forzar la descarga en el disco local.
    * Muestra foto, datos completos y botones de acción ("Aceptar" / "Rechazar") que disparan correo al estudiante.
* **HU-040: Aprobación de Tutores con Visor PDF Embebido de Currículum Vítae**
  * *Como* administrador del sistema,
  * *Quiero* leer el CV del tutor en un visor integrado en pantalla sin necesidad de descargas externas,
  * *Para que* pueda validar su perfil profesional previo a emitir una decisión de ingreso.
  * *Criterios de Aceptación:*
    * Visor de PDF incrustado y responsivo en la vista de tutores pendientes.
    * Visualización simultánea de foto, materias a impartir, identificación y credenciales.
    * Botones "Aceptar" y "Rechazar" completamente funcionales que actualizan el estado y notifican por correo.
* **HU-050: Contenedorización y Despliegue del Frontend en la Nube con Acceso Público**
  * *Como* evaluador técnico y usuario final,
  * *Quiero* acceder a la plataforma web de EduConnect mediante una URL pública desplegada en la nube,
  * *Para que* el sistema sea accesible y operativo fuera de un entorno local cerrado.
  * *Criterios de Aceptación:*
    * Frontend dockerizado con Dockerfile optimizado para producción (multi-stage build con Nginx o servidor de estáticos).
    * Despliegue funcional en proveedor cloud (Vercel, AWS S3/CloudFront, Google Cloud Run o similar).
    * El frontend en la nube se comunica de forma transparente y segura vía API REST con los servicios del backend.

### Responsabilidades Técnicas Naturales:
* Endpoints de streaming de archivos estáticos (`res.sendFile` con cabeceras `Content-Type: application/pdf`).
* Componente reusable de UI para renderizado de documentos PDF embebidos.
* Configuración de Dockerfiles de producción y variables de entorno para endpoints cloud.
* **Puede comenzar sin esperar a nadie:** Sí, usando archivos PDF locales de prueba (dummies).

---

## Paquete C — Moderación de Conducta, Control de Denuncias y Gestión de Cuentas

**Ideal para:** Quien prefiera flujos administrativos críticos, auditoría de usuarios, máquinas de estados y resolución de disputas.

### Historias de Usuario Asignadas:
* **HU-041: Administración, Edición de Perfil y Baja Lógica de Estudiantes**
  * *Como* administrador,
  * *Quiero* visualizar el padrón de estudiantes aprobados, editar su información (salvo correo) o darlos de baja,
  * *Para que* el directorio estudiantil se mantenga depurado y actualizado.
  * *Criterios de Aceptación:*
    * Tabla interactiva con búsqueda y paginación de estudiantes en estado `APPROVED`.
    * Formulario de edición con el correo estrictamente bloqueado para modificación.
    * Acción de "Dar de baja" con modal de confirmación; actualiza el estado a `DISABLED`.
    * Un estudiante dado de baja tiene denegado el acceso de sesión de inmediato.
* **HU-042: Administración, Edición de Perfil y Baja Lógica de Tutores**
  * *Como* administrador,
  * *Quiero* auditar a los tutores aprobados, actualizar sus credenciales profesionales y suspender cuentas infractoras,
  * *Para que* se garantice la idoneidad del personal académico activo.
  * *Criterios de Aceptación:*
    * Listado de tutores activos con opción de editar datos personales y especialidades (correo bloqueado).
    * Opción de "Dar de baja" bajo confirmación previa, actualizando a estado inactivo.
    * Restricción inmediata de inicio de sesión para el tutor dado de baja.
* **HU-043: Panel Administrativo de Gestión y Resolución de Denuncias contra Tutores**
  * *Como* administrador,
  * *Quiero* revisar las quejas formales interpuestas por estudiantes contra tutores y ejecutar sanciones,
  * *Para que* se mantengan altos estándares de ética y profesionalismo en las tutorías.
  * *Criterios de Aceptación:*
    * Vista que agrupa: categoría del reporte, motivo detallado, nombres de las partes y marca de tiempo.
    * Acciones disponibles por denuncia: "Dar de baja al tutor" (sanción aplicada) o "Rechazar denuncia".
    * Las acciones actualizan el estado de la denuncia (`RESOLVED_BANNED` / `DISMISSED`) y afectan la cuenta del tutor si procede.
* **HU-044: Panel Administrativo de Gestión y Resolución de Denuncias contra Estudiantes**
  * *Como* administrador,
  * *Quiero* gestionar los reportes presentados por tutores respecto a conductas irregulares de estudiantes,
  * *Para que* se proteja la integridad física, psicológica y académica de los tutores.
  * *Criterios de Aceptación:*
    * Panel con listado completo de incidencias (categoría, explicación, estudiante infractor, tutor denunciante y fecha).
    * Acciones operativas: "Dar de baja al estudiante" (inhabilitación inmediata) o "Desestimar reporte".
    * Persistencia del historial de moderación para fines de trazabilidad.

### Responsabilidades Técnicas Naturales:
* Controladores de moderación administrativa y actualización de estados de usuarios y denuncias.
* Filtros de seguridad en endpoints para garantizar que usuarios `DISABLED` sean rechazados en autenticación.
* Módulos de gestión con modales de confirmación accesibles (prevención de errores).
* **Puede comenzar sin esperar a nadie:** Sí, utilizando registros semilla de denuncias y perfiles pre-aprobados.

---

## Paquete D — Métricas de Desempeño, Auditoría de Calificaciones y Reportes Analíticos F2

**Ideal para:** Quien disfrute el análisis de datos, agregaciones en base de datos, maquetación de dashboards e integración de gráficos interactivos (Chart.js / Recharts).

### Historias de Usuario Asignadas:
* **HU-045: Reporte y Visualización de Calificación Promedio de Tutores Activos**
  * *Como* administrador,
  * *Quiero* consultar el listado consolidado de tutores activos junto con su promedio de calificación en estrellas,
  * *Para que* pueda evaluar el rendimiento docente y detectar quiénes requieren retroalimentación o incentivos.
  * *Criterios de Aceptación:*
    * Despliega nombre completo, materias que imparte y promedio numérico/visual de 0 a 5 estrellas.
    * El cálculo se deriva matemáticamente de todas las evaluaciones emitidas por estudiantes en sesiones atendidas.
    * Tutores sin evaluaciones registradas deben mostrar indicador claro (ej. "Sin calificaciones aún" o 0.0).
* **HU-046: Reporte y Visualización de Calificación Promedio de Estudiantes Activos**
  * *Como* administrador,
  * *Quiero* monitorear la reputación académica de los estudiantes mediante su promedio de estrellas otorgadas por tutores,
  * *Para que* pueda identificar alumnos ejemplares o aquellos que presenten dificultades sistemáticas.
  * *Criterios de Aceptación:*
    * Muestra nombre completo, carnet y promedio de calificación en estrellas (rango 0 a 5).
    * Cálculo exacto ponderado a partir de las calificaciones registradas por tutores.
    * Permite ordenar de mayor a menor y viceversa para facilitar la supervisión.
* **HU-047: Reporte Analítico Nuevo F2-1: Evolución Temporal y Tendencia de Sesiones**
  * *Como* administrador,
  * *Quiero* un reporte gráfico interactivo que muestre el volumen de tutorías programadas y atendidas por semana y mes,
  * *Para que* la institución planifique la asignación de recursos y refuerzos en épocas de exámenes.
  * *Criterios de Aceptación:*
    * Gráfico de líneas o barras temporales con selectores de rango (último mes, trimestre o semestre).
    * Distinción clara entre sesiones culminadas exitosamente vs sesiones totales.
    * Tabla resumen con totales absolutos y porcentajes de variación. Totalmente diferente a los reportes de Fase 1.
* **HU-048: Reporte Analítico Nuevo F2-2: Análisis de Cancelaciones y Franjas Horarias Críticas**
  * *Como* administrador,
  * *Quiero* un reporte analítico que correlacione las materias con mayor tasa de cancelación y los horarios más demandados,
  * *Para que* se tomen medidas correctivas en las materias críticas y se optimice la oferta horaria.
  * *Criterios de Aceptación:*
    * Gráfico visual combinado (pastel / barras apiladas) mostrando la proporción de cancelaciones por cátedra.
    * Mapa de calor o distribución horaria identificando las franjas con mayor afluencia de reservas.
    * Totalmente desacoplado e independiente de los reportes entregados en Fase 1.

### Responsabilidades Técnicas Naturales:
* Consultas SQL complejas con funciones de agregación (`AVG`, `COUNT`, `GROUP BY`, ventanas temporales).
* Integración y configuración de librerías de visualización gráfica en React.
* Mantenimiento de la integridad visual de los 2 reportes de Fase 1 junto a los 2 reportes nuevos de Fase 2.
* **Puede comenzar sin esperar a nadie:** Sí, alimentando las vistas con datasets mock de calificaciones y sesiones.

---

## Paquete E — Planes de Estudio Estructurados y Generación de Constancias PDF

**Ideal para:** Quien domine interfaces de formularios dinámicos, estructuras de datos jerárquicas y librerías de generación de PDFs en cliente/servidor (PDFKit / jsPDF).

### Historias de Usuario Asignadas:
* **HU-032: Asignación de Plan de Estudio Estructurado con Recursos Dinámicos (Tutor)**
  * *Como* tutor que ha finalizado una sesión presencial u online,
  * *Quiero* registrar un plan de estudio estructurado con dificultades y un listado dinámico de recursos,
  * *Para que* el estudiante cuente con una guía precisa y metodológica para superar sus vacíos académicos.
  * *Criterios de Aceptación:*
    * Al presionar "Atender Estudiante", se despliega un formulario estructurado obligatorio.
    * Campo de texto obligatorio: "Dificultades Identificadas" (no se permite guardar en blanco).
    * Módulo dinámico para agregar, editar y eliminar $N$ recursos recomendados.
    * Cada recurso exige obligatoriamente: Nombre del recurso, Tipo (Texto, Video, PDF, Enlace) y Descripción de uso.
    * Al confirmar, la sesión transiciona a `COMPLETED` / `ATTENDED` y almacena el plan relacionalmente.
* **HU-033: Visualización de Plan de Estudio Estructurado por el Estudiante**
  * *Como* estudiante atendido,
  * *Quiero* acceder a un módulo dedicado para consultar el plan de estudio formulado por mi tutor,
  * *Para que* pueda repasar las dificultades diagnosticadas y acceder a los recursos recomendados.
  * *Criterios de Aceptación:*
    * Vista dedicada que exhibe: fecha de la última sesión, tutor, especialidad, carnet del tutor.
    * Bloque destacado con las "Dificultades Identificadas".
    * Tabla interactiva de recursos con enlaces clicables (si aplica) y guías específicas de estudio.
* **HU-034: Generación y Descarga de Constancia Oficial de Tutoría en Formato PDF**
  * *Como* estudiante,
  * *Quiero* generar y descargar una constancia formal en PDF de mi plan de estudio,
  * *Para que* me sirva como comprobante de asistencia académica ante coordinaciones o cátedras.
  * *Criterios de Aceptación:*
    * Descarga directa con renderizado vectorial limpio y maquetación profesional.
    * Encabezado institucional obligatorio: Nombre "EduConnect", fecha de emisión, teléfonos de contacto.
    * Cuerpo del documento: Tabla formateada con los recursos (Nombre, Tipo, Instrucción de uso).
    * Pie de página obligatorio (firma institucional/sello): Nombre completo del tutor, especialidad y número de identificación.

### Responsabilidades Técnicas Naturales:
* Diseño de componentes frontend con estado dinámico (arrays de objetos para recursos en tiempo real).
* Integración del motor de generación de PDF en servidor (`pdfkit`) o cliente (`jspdf` + `html2canvas`).
* Endpoints para almacenamiento y consulta de la entidad `StudyPlan` y `StudyResource`.
* **Puede comenzar sin esperar a nadie:** Sí, utilizando datos mock de sesiones finalizadas.

---

## Paquete F — Sistema de Retroalimentación Bidireccional y Pipeline Automatizado CI/CD

**Ideal para:** Quien posea visión global de calidad, configuración de pipelines YAML en GitHub Actions, automatización de pruebas y flujos transaccionales de feedback.

### Historias de Usuario Asignadas:
* **HU-035: Calificación del Tutor por el Estudiante en Sesiones Atendidas**
  * *Como* estudiante atendido,
  * *Quiero* calificar de 0 a 5 estrellas y redactar un comentario voluntario sobre el tutor desde mi historial,
  * *Para que* mi opinión contribuya a la reputación y auditoría de la plataforma.
  * *Criterios de Aceptación:*
    * El botón de calificación se activa **única y exclusivamente** si la sesión está en estado "Atendido".
    * Bloqueo estricto para sesiones activas o canceladas.
    * Registro de calificación numérica entera de 0 a 5 estrellas y campo de texto opcional.
* **HU-036: Formulación de Reporte Disciplinario contra Tutores (Estudiante)**
  * *Como* estudiante víctima de irregularidades,
  * *Quiero* reportar a un tutor desde mi historial mediante un catálogo tipificado de faltas,
  * *Para que* la coordinación administrativa investigue y sancione malas conductas.
  * *Criterios de Aceptación:*
    * Válido únicamente sobre sesiones atendidas.
    * Selector obligatorio con al menos 4 categorías predefinidas: (1) Ética y profesionalismo, (2) Negligencia académica, (3) Abuso o conducta inapropiada, (4) Falsificación de información.
    * Campo obligatorio de descripción circunstanciada de los hechos. Envío al buzón del administrador.
* **HU-037: Calificación del Estudiante por el Tutor en Sesiones Atendidas**
  * *Como* tutor,
  * *Quiero* evaluar el compromiso del estudiante (0 a 5 estrellas y comentario) tras concluir la sesión,
  * *Para que* quede un precedente del desempeño del alumno en el sistema.
  * *Criterios de Aceptación:*
    * Disponible únicamente para sesiones en estado "Atendido". Bloqueado para canceladas o activas.
    * Almacena calificación de estrellas y observaciones sobre la preparación previa del estudiante.
* **HU-038: Formulación de Reporte Disciplinario contra Estudiantes (Tutor)**
  * *Como* tutor afectado,
  * *Quiero* levantar un reporte disciplinario contra un estudiante problemático,
  * *Para que* el administrador aplique las sanciones de baja que correspondan.
  * *Criterios de Aceptación:*
    * Válido únicamente sobre sesiones atendidas.
    * Selector obligatorio con al menos 4 categorías predefinidas: (1) Conducta inapropiada, (2) Falsificación de documentos, (3) Agresión verbal o física, (4) Daño a instalaciones / inasistencia lesiva.
    * Campo obligatorio de exposición de motivos. El ticket se transfiere al panel de administración.
* **HU-049: Pipeline de Integración Continua (CI/CD) para Backend en GitHub Actions**
  * *Como* equipo de ingeniería,
  * *Quiero* un pipeline automatizado que compile, pruebe y despliegue el backend en cada integración a `main`,
  * *Para que* se garantice la integridad del código y se eliminen despliegues manuales erróneos.
  * *Criterios de Aceptación:*
    * Archivo de workflow `.github/workflows/backend-ci-cd.yml` activado exclusivamente en evento `push` a la rama `main`.
    * **Etapa 1 (Build):** Construcción de la imagen Docker del backend a partir de su `Dockerfile`.
    * **Etapa 2 (Test):** Ejecución automatizada de las pruebas unitarias; si una prueba falla, el pipeline se aborta inmediatamente impidiendo el despliegue.
    * **Etapa 3 (Deploy):** Despliegue automático y ejecución del contenedor del backend en el runner de GitHub.

### Responsabilidades Técnicas Naturales:
* Reglas de integridad referencial para evitar calificaciones o reportes duplicados sobre una misma sesión.
* Modelado y persistencia de las entidades `Rating` y `Report`.
* Creación y mantenimiento de los workflows de automatización en GitHub Actions.
* **Puede comenzar sin esperar a nadie:** Sí, configurando el runner de GitHub y mockeando sesiones atendidas.

---

## Tabla de Selección de Paquetes para el Equipo

| No. | Integrante | Carnet | Paquete Seleccionado |
| :-: | :--- | :---: | :---: |
| 1 | | | Paquete A / B / C / D / E / F |
| 2 | | | Paquete A / B / C / D / E / F |
| 3 | | | Paquete A / B / C / D / E / F |
| 4 | | | Paquete A / B / C / D / E / F |
| 5 | | | Paquete A / B / C / D / E / F |
| 6 | | | Paquete A / B / C / D / E / F |

*(Nota: La designación de los roles metodológicos Scrum Master y Product Owner, así como el desglose de pruebas y documentación asignada a cada quien, se encuentran detallados formalmente en `DISTRIBUCIONTAREASFASE2.md`).*
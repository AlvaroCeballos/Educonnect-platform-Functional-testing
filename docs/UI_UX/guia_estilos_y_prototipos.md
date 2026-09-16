# Guía de estilos y prototipos — EduConnect

**Responsable:** Yury — Paquete D: Descubrimiento y Disponibilidad  
**Historias relacionadas:** HU-009, HU-010, HU-011 y HU-027  
**Rama de trabajo:** `feature/docs-uiux-modulo-d_202300359`

## 1. Objetivo

Esta guía define el lenguaje visual y la estructura de prototipado de EduConnect. El diseño debe coincidir con la aplicación React implementada: permite descubrir tutores, filtrar resultados, consultar disponibilidad por fecha y visualizar reportes de materias.

## 2. Identidad visual

| Token | Valor | Uso |
| --- | --- | --- |
| `brand/primary` | `#167963` | Acciones principales, enlaces y estados seleccionados |
| `brand/primary-hover` | `#106C58` | Estado hover de acciones principales |
| `brand/secondary` | `#102C46` | Encabezados y fondos de alto contraste |
| `state/success` | `#047857` | Disponible, aprobado y operación exitosa |
| `state/warning` | `#D97706` | Advertencias y pendientes |
| `state/error` | `#DC2626` | Errores y acciones peligrosas |
| `surface/page` | `#F8FAFC` | Fondo general |
| `surface/subtle` | `#EDF2F7` | Fondos secundarios y skeletons |
| `surface/default` | `#FFFFFF` | Tarjetas, formularios y tablas |
| `text/primary` | `#0F172A` | Títulos y contenido principal |
| `text/secondary` | `#64748B` | Ayudas, metadatos y descripciones |
| `border/default` | `#DFE6EE` | Bordes y separadores |

### Tipografía

- Familia: **Inter**; fallback `ui-sans-serif, system-ui, sans-serif`.
- Título de pantalla: 28–32 px, peso 700–800.
- Título de sección: 20–24 px, peso 700.
- Texto de cuerpo: 14–16 px, peso 400–500, interlineado aproximado de 1.5.
- Etiquetas y badges: 12–13 px, peso 600–700.

### Forma, espacio y accesibilidad

- Radios: 10–12 px para controles y 16–18 px para tarjetas o paneles.
- Espaciado base: múltiplos de 4 px; usar 16, 24 y 32 px como separaciones principales.
- Sombras discretas, sin depender únicamente del color para comunicar estados.
- Contraste mínimo AA para texto y controles, foco visible y etiquetas asociadas a cada campo.
- El layout debe adaptarse a escritorio y móvil sin ocultar acciones esenciales.

## 3. Componentes reutilizables

### Barra de navegación

Logo con monograma `E`, nombre EduConnect, enlace **Mis sesiones** y botón **Cerrar sesión**. Se mantiene consistente en el módulo de estudiante.

### Tarjeta de tutor

Debe mostrar fotografía, nombre completo, universidad, especialidad o materias, modalidad/dirección, estado **Disponible** y acción **Ver horarios**. Si la fotografía no está disponible, se usa un avatar de respaldo sin romper la composición.

### Filtros avanzados

Panel con materia, género, universidad, experiencia mínima, rango de edad, chips de filtros activos y acciones **Aplicar filtros** y **Limpiar filtros**. El botón de aplicar queda deshabilitado durante la consulta y se conserva un estado de error recuperable.

### Disponibilidad

Modal o pantalla de detalle con tutor seleccionado, selector de fecha y cuadrícula de slots. Los horarios libres y ocupados deben distinguirse mediante etiqueta, texto y color. La acción **Ir a agendar sesión** solo se habilita cuando existe fecha y horario válidos.

### Estados de interfaz

Todos los flujos contemplan skeleton de carga, catálogo vacío, error de conexión, confirmación exitosa, validaciones de formulario y modal de confirmación. Los estados de sesión usados por el producto son `PENDING`, `ATTENDED`, `CANCELLED`, `AVAILABLE` y `OCCUPIED`.

## 4. Alcance de pantallas

| Frame | Módulo | Relación con la aplicación |
| --- | --- | --- |
| `EST-01 Dashboard estudiante` | Estudiante | Catálogo de tutores y navegación a sesiones |
| `EST-02 Filtros y catálogo` | Estudiante | HU-010, búsqueda por los cinco filtros definidos |
| `EST-03 Disponibilidad del tutor` | Estudiante | HU-011, fecha y slots libres/ocupados |
| `TUT-01 Dashboard tutor` | Tutor | Acceso a sesiones, disponibilidad y perfil |
| `TUT-02 Disponibilidad` | Tutor | Configuración de días y rango horario |
| `TUT-03 Sesiones` | Tutor | Próximas sesiones e historial |
| `ADM-01 Gestión de usuarios` | Administrador | Pestañas de estudiantes y tutores |
| `ADM-02 Detalle de tutor` | Administrador | Consulta completa y acciones administrativas |
| `ADM-03 Reportes` | Administrador | HU-027, materias con mayor demanda y exportación |

La composición se organiza en Figma en tres páginas: **Wireframes**, **Mockups** (alta fidelidad) y **Prototipo interactivo**. La página **Mockups** contiene las cuatro pantallas del paquete de Yury —HU-009, HU-010, HU-011 y HU-027— con la paleta y los componentes alineados a la aplicación; la página **Prototipo interactivo** contiene la copia editable de esas pantallas para continuar conectando los flujos. En todas se conservan los nombres de las historias para facilitar la trazabilidad.

## 5. Flujos del prototipo

1. Inicio de sesión → Dashboard del rol correspondiente.
2. Dashboard estudiante → filtros → resultados → disponibilidad del tutor → agendar sesión.
3. Agendar sesión → confirmación de reserva → Mis sesiones → historial.
4. Dashboard tutor → disponibilidad o sesiones → marcar sesión como atendida.
5. Login administrativo → segundo factor → gestión de usuarios → aprobar, rechazar o dar de baja.
6. Administrador → Reportes → filtrar materias → exportar reporte.

## 6. Enlace de Figma

[Abrir prototipos interactivos de EduConnect en Figma](https://www.figma.com/design/WK53bf0D4M3PiP5elIF0bz/EduConnect-%E2%80%94-Prototipos-interactivos-Yury)

El archivo contiene las pantallas del paquete de Yury y usa la misma paleta, tipografía, jerarquía, tarjetas y estados que la aplicación. El enlace requiere permisos de Figma para editar y presentar el prototipo.

## 7. Correspondencia con el código

- Dashboard y catálogo: `frontend/src/pages/student/StudentDashboard.jsx`.
- Filtros: `frontend/src/components/AdvancedFilters.jsx`.
- Disponibilidad: `frontend/src/components/TutorScheduleModal.jsx`.
- Reportes: `frontend/src/pages/admin/AdminDashboard.jsx` y `frontend/src/utils/pdfReportGenerator.js`.
- Tokens visuales y estados compartidos: `frontend/src/styles.css` y `frontend/src/index.css`.

La revisión final debe comprobar que cualquier cambio de nombre, color, campo o estado se replique tanto en el prototipo como en las pantallas implementadas.

# Guía de estilos y prototipos de EduConnect

> **Responsable:** Yury  
> **Propósito:** definir la identidad visual de EduConnect y documentar los prototipos interactivos utilizados como referencia para la maquetación.

---

## 1. Introducción

EduConnect es una plataforma académica que conecta a estudiantes con tutores para buscar apoyo, consultar disponibilidad y agendar sesiones de tutoría. El sistema de diseño busca transmitir confianza, claridad y acompañamiento, reduciendo la carga cognitiva en tareas frecuentes como registrarse, buscar un tutor y administrar una sesión.

Los criterios descritos en esta guía sirven como referencia para las vistas de **Estudiante**, **Tutor** y **Administrador**, tanto en el prototipo de Figma como en la implementación frontend.

## 2. Principios visuales

- **Claridad primero:** la información académica, los horarios y el estado de las sesiones deben ser fáciles de escanear.
- **Confianza y cercanía:** se utilizan colores sobrios con acentos turquesa y esmeralda para comunicar acompañamiento y disponibilidad.
- **Consistencia:** los botones, tarjetas, tablas, badges, formularios y modales mantienen las mismas reglas en todos los módulos.
- **Prevención de errores:** las acciones sensibles requieren confirmación y los estados inválidos se comunican cerca del campo o elemento afectado.
- **Diseño responsive:** las vistas se adaptan a escritorio, tablet y móvil sin perder la jerarquía de la información.

## 3. Guía de estilos

### 3.1 Paleta de color

| Uso | Nombre | Valor | Aplicación |
|---|---|---|---|
| Primario oscuro | Azul petróleo | `#102C46` | Encabezados, paneles de marca y fondos de navegación. |
| Primario | Esmeralda | `#167963` | Botones principales, enlaces activos y acciones de confirmación. |
| Primario hover | Esmeralda profundo | `#106C58` | Estado hover y énfasis de acciones principales. |
| Acento | Turquesa | `#45D8B0` | Indicadores de disponibilidad, detalles de marca y elementos destacados. |
| Fondo general | Gris azulado claro | `#EDF2F7` | Fondo de la aplicación y separación entre superficies. |
| Superficie | Blanco | `#FFFFFF` | Tarjetas, formularios, tablas y modales. |
| Texto principal | Azul grisáceo | `#17233D` | Títulos, datos y contenido principal. |
| Texto secundario | Gris pizarra | `#6A768C` | Descripciones, metadatos y ayuda contextual. |
| Éxito | Verde | `#14735E` | Confirmaciones, sesiones atendidas y estados activos. |
| Advertencia | Ámbar | `#9A6A00` | Sesiones pendientes, avisos y estados que requieren atención. |
| Error | Rojo carmesí | `#A42E3A` | Validaciones fallidas, rechazos, cancelaciones y acciones destructivas. |

Los colores de estado deben acompañarse de texto o un icono; no se debe comunicar información únicamente mediante color.

### 3.2 Tipografía

La familia principal es **Inter**, seleccionada por su legibilidad en formularios, tablas y datos de horarios.

| Elemento | Tamaño orientativo | Peso | Uso |
|---|---:|---:|---|
| Título de página | 36–48 px | 800–900 | Nombre del módulo o encabezado principal. |
| Título de sección | 26–38 px | 700–800 | Agrupación de contenido dentro de una vista. |
| Título de tarjeta | 16–20 px | 700–800 | Nombre del tutor, sesión o métrica. |
| Texto base | 14–17 px | 400 | Descripciones y contenido general. |
| Etiqueta | 12–13 px | 700–800 | Campos, metadatos, tablas y badges. |
| Texto auxiliar | 12–13 px | 400–500 | Ayudas, restricciones y notas secundarias. |

La jerarquía se construye con tamaño, peso y contraste. Se evita usar mayúsculas sostenidas en textos largos y se mantiene una altura de línea cómoda para la lectura.

### 3.3 Espaciado, bordes y superficies

- Se utiliza una escala de espaciado basada en múltiplos de 4 px, con valores frecuentes de 8, 12, 16, 20, 24 y 32 px.
- Los controles y tarjetas utilizan bordes suaves, principalmente de `1px solid #DFE6EE`.
- Las tarjetas y paneles tienen radios entre 10 y 22 px según su tamaño; los controles pequeños utilizan radios de 8 a 12 px.
- Los badges de estado y contadores utilizan forma de píldora (`border-radius: 999px`).
- Las sombras son discretas y se reservan para superficies elevadas, como modales, tablas y tarjetas de métricas.
- Los campos de entrada muestran un borde esmeralda y un halo suave al recibir foco.

## 4. Componentes reutilizables

### 4.1 Botones

- **Primario:** fondo esmeralda, texto blanco; se utiliza para acciones como `Programar`, `Guardar` o `Aprobar`.
- **Secundario:** fondo blanco o transparente con borde; se utiliza para volver, consultar detalles o cancelar una acción no destructiva.
- **Destructivo:** borde o fondo rojo claro con texto rojo; se utiliza para cancelar una sesión, rechazar una cuenta o deshabilitar un usuario.
- **Deshabilitado/cargando:** reduce la opacidad y bloquea la interacción mientras se procesa la solicitud.

Los botones deben usar verbos claros y mantener una jerarquía visible cuando aparecen varias acciones juntas.

### 4.2 Tarjeta de tutor

La tarjeta de tutor presenta la información necesaria para decidir si se desea agendar una sesión:

1. Fotografía o avatar del tutor.
2. Nombre y datos académicos principales.
3. Materias o especialidades disponibles.
4. Años de experiencia y disponibilidad.
5. Acciones `Ver horarios` y `Programar`.

La disponibilidad se comunica mediante un badge textual, por ejemplo `Disponible`, acompañado de un indicador visual. Las tarjetas deben conservar la misma estructura cuando se muestran en el catálogo o en resultados filtrados.

### 4.3 Tablas administrativas

Las tablas se utilizan para gestionar estudiantes y tutores. Deben incluir:

- Encabezados breves y visibles.
- Filas con suficiente separación vertical.
- Información secundaria debajo del dato principal cuando sea necesario.
- Badges para rol y estado.
- Acciones agrupadas al final de cada fila.
- Desplazamiento horizontal controlado en pantallas pequeñas.

Cuando la tabla no contiene registros, se muestra un estado vacío explicativo en lugar de una superficie en blanco.

### 4.4 Badges y estados

| Estado | Tratamiento visual | Ejemplo |
|---|---|---|
| Activo/disponible | Fondo verde claro, texto verde y punto indicador | `Disponible` |
| Pendiente | Fondo ámbar claro, texto ámbar | `Pendiente` |
| Atendido | Fondo verde claro, texto verde | `Atendida` |
| Cancelado/rechazado | Fondo rojo claro, texto rojo | `Cancelada` |
| Rol | Fondo neutro o verde según el rol | `Estudiante`, `Tutor` |

### 4.5 Formularios

Los formularios agrupan los campos por contexto y colocan la etiqueta directamente encima del control. Los campos obligatorios deben identificarse de forma consistente y los errores deben explicar cómo corregir el valor.

Los formularios de registro pueden incluir datos personales, datos académicos, contraseña y fotografía. El selector de horarios utiliza opciones visibles para días y horas, bloqueando fechas pasadas y espacios ya ocupados.

### 4.6 Modales y confirmaciones

Los modales se reservan para tareas que requieren atención focalizada: consultar el horario de un tutor, programar una sesión o confirmar una cancelación. Deben incluir título, contexto de la acción, controles principales y una forma clara de cerrar o volver atrás.

Las acciones destructivas siempre solicitan confirmación y explican el efecto que tendrá la decisión.

## 5. Aplicación por módulo

### 5.1 Estudiante

El flujo del estudiante prioriza el descubrimiento y la reserva: registro, catálogo de tutores, filtros, consulta de horarios, programación, sesiones activas e historial. Las tarjetas y filtros deben permitir comparar tutores sin abrir múltiples pantallas innecesariamente.

### 5.2 Tutor

El flujo del tutor prioriza la gestión de disponibilidad y sesiones: registro profesional, configuración del horario, actualización del perfil y atención de sesiones pendientes. Los conflictos de horario se muestran antes de guardar cambios.

### 5.3 Administrador

El panel administrativo prioriza la supervisión y la toma de decisiones: pestañas por tipo de usuario, búsqueda, tablas, estados, acciones de aprobación o rechazo y reportes. Los datos deben ser compactos, comparables y fáciles de filtrar.

## 6. Prototipos en Figma

### 6.1 Archivo de diseño

[Abrir archivo editable de diseños en Figma](https://www.figma.com/design/WK53bf0D4M3PiP5elIF0bz/EduConnect-%E2%80%94-Prototipos-interactivos-Yury)

Este enlace contiene las pantallas y componentes utilizados para definir la propuesta visual de EduConnect.

### 6.2 Prototipo interactivo

[Abrir prototipo interactivo de EduConnect](https://www.figma.com/proto/WK53bf0D4M3PiP5elIF0bz/EduConnect-%E2%80%94-Prototipos-interactivos-Yury?scaling=min-zoom&content-scaling=fixed&page-id=12%3A2&node-id=12-3)

El prototipo permite recorrer las interacciones principales y validar los flujos antes de la implementación.

## 7. Capturas de wireframes y mockups

Las siguientes capturas corresponden a los wireframes y mockups diseñados para cada rol de EduConnect.

### 7.1 Módulo Estudiante

![Wireframe o mockup del módulo Estudiante](../Manuales/imgs/estudiante-wireframe.png)

**Descripción de la captura:** catálogo de tutores, filtros de búsqueda, consulta de disponibilidad y programación de una sesión.

### 7.2 Módulo Tutor

![Wireframe o mockup del módulo Tutor](../Manuales/imgs/tutor-wireframe.png)

**Descripción de la captura:** perfil profesional, configuración del horario y listado de sesiones pendientes.

### 7.3 Módulo Administrador

![Wireframe o mockup del módulo Administrador](../Manuales/imgs/administrador-wireframe.png)

**Descripción de la captura:** gestión de usuarios, filtros, tabla de estados, acciones administrativas y reportes.

## 8. Criterios de validación

Antes de considerar una vista terminada, se verifica que:

- Mantenga la paleta, tipografía y jerarquía definidas en esta guía.
- Use los componentes reutilizables en lugar de crear variantes visuales innecesarias.
- Muestre estados de carga, vacío, éxito, advertencia y error cuando correspondan.
- Sea navegable en pantallas pequeñas sin ocultar acciones importantes.
- Tenga textos, botones y mensajes coherentes con el rol del usuario.
- Coincida con los flujos aprobados en el prototipo interactivo de Figma.
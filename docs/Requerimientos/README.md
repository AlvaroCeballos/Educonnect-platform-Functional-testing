# Módulo de Requerimientos del Sistema — EduConnect (Fase 2)

**Proyecto:** EduConnect — Plataforma de Gestión de Tutorías Académicas  
**Responsable:** Yury Alexander Cruz García (Carnet: 202300359)  

---

## 1. Contenido de la Sección
Esta sección consolida la especificación formal de requerimientos para la Fase 2 del proyecto:

* **[RFs-requerimientos-funcionales.md](./RFs-requerimientos-funcionales.md):** Matriz de requerimientos funcionales de Fase 1 complementada con los nuevos requerimientos `RF-F2-01` a `RF-F2-23` (Planes de estudio, tokens, calificaciones, visores y denuncias).
* **[RRs-requerimientos-restriccion.md](./RRs-requerimientos-restriccion.md):** Clasificación en las 5 dimensiones normativas: Legales, Estándares, Interfaz, Técnicas y Organizacionales.
* **[EACs-requerimientos-calidad.md](./EACs-requerimientos-calidad.md):** Escenarios medibles bajo la norma ISO/IEC 25010 (Seguridad, Usabilidad, Rendimiento y Fiabilidad).

---

## 2. Resumen de Requerimientos Clave de la Fase 2
1. **Validación de Identidad por Token:** Todo usuario registrado debe verificar su correo mediante un token criptográfico de 6 caracteres antes de su primer ingreso.
2. **Documentación Obligatoria en PDF:** Carga de Carnet universitario (estudiantes) y CV profesional (tutores) validados por tipo MIME y peso máximo de 5 MB.
3. **Inspección sin Descargas:** Visores PDF embebidos en el módulo administrador.
4. **Calidad y Retroalimentación Bidireccional:** Calificación con estrellas (0 a 5) y reporte de incidentes en sesiones atendidas.
5. **Automatización:** Pipeline CI/CD en GitHub Actions Runner y despliegue del Frontend en la nube.
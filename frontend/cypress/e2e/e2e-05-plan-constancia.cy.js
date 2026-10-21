/**
 * E2E-05: Flujo de Creación de Plan y Generación de Constancia PDF
 * Responsable: Nicole López (Carnet: 202300659) — Paquete E
 *
 * Flujo:
 *  1. El tutor ingresa a sus sesiones pendientes.
 *  2. Selecciona "Marcar como Atendida" en una sesión PENDING.
 *  3. Completa el campo obligatorio de Dificultades Identificadas.
 *  4. Agrega dos recursos recomendados dinámicos (uno Texto, uno Video).
 *  5. Guarda el plan: la sesión transiciona a ATTENDED.
 *  6. El estudiante inicia sesión y entra a "Mi Plan".
 *  7. Verifica que el plan activo refleja los datos ingresados.
 *  8. Solicita la constancia PDF y confirma que la respuesta es application/pdf.
 *
 * Portabilidad entre máquinas del equipo:
 *   - El test siembra su propia sesión PENDING vía API al arrancar (no asume IDs fijos).
 *   - Intercepta endpoints con bugs conocidos (ratings 500) para no romper la vista.
 *   - Requisitos previos (solo una vez por entorno):
 *       1. Docker arriba (frontend 3000, backend 5000, mysql).
 *       2. Cargar los seeds del test (crea usuarios sofia.tutora, sofia.estudiante,
 *          materia Física, horario y sesión PENDING sin tocar datos existentes):
 *            docker compose exec -T db sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' < backend/seeds_e2e.sql
 */

describe('E2E-05: Creación de plan estructurado y generación de constancia PDF', () => {
  const BACKEND = 'http://localhost:5000';
  const tutor = { email: 'sofia.tutora@test.com', password: 'Passw0rd1', role: 'tutor' };
  const estudiante = { email: 'sofia.estudiante@test.com', password: 'Passw0rd1', role: 'student' };

  const dificultades = 'Dificultades para aplicar la segunda ley de Newton en planos inclinados y descomponer fuerzas en componentes vectoriales.';
  const recurso1 = { nombre: 'Fisica Universitaria - Sears Zemansky, Cap. 5', tipo: 'Texto', descripcion: 'Leer secciones 5.1 a 5.3 y resolver ejercicios impares 1-15' };
  const recurso2 = { nombre: 'Khan Academy - Planos inclinados', tipo: 'Video', descripcion: 'Ver los 3 videos de la serie y hacer los ejercicios interactivos' };

  // Interceptar endpoints ajenos con bugs conocidos para no romper el render de la UI
  const stubBugsAjenos = () => {
    cy.intercept('GET', '**/api/ratings/**', { statusCode: 200, body: { ratings: [] } });
  };

  // Garantiza que exista al menos una sesión PENDING para el tutor del test.
  // Si ya hay una PENDING del tutor usa esa; si no, crea una nueva vía API con las
  // credenciales del estudiante del test. Devuelve el id de la sesión.
  const asegurarSesionPendiente = () => {
    return cy.request({
      method: 'POST',
      url: `${BACKEND}/api/auth/login/tutor`,
      body: { email: tutor.email, password: tutor.password },
    }).then((loginTutor) => {
      const tokenTutor = loginTutor.body.token;
      return cy.request({
        url: `${BACKEND}/api/sessions/tutor/me`,
        headers: { Authorization: `Bearer ${tokenTutor}` },
      }).then((lista) => {
        const pendiente = (lista.body.sessions || []).find((s) => s.status === 'PENDING');
        if (pendiente) {
          cy.log(`Sesión PENDING existente reutilizada: id=${pendiente.id}`);
          return cy.wrap(pendiente.id);
        }
        // No hay PENDING → crear una nueva como el estudiante
        return cy.request({
          method: 'POST',
          url: `${BACKEND}/api/auth/login/student`,
          body: { email: estudiante.email, password: estudiante.password },
        }).then((loginEst) => {
          const tokenEst = loginEst.body.token;
          return cy.request({
            method: 'POST',
            url: `${BACKEND}/api/sessions`,
            headers: { Authorization: `Bearer ${tokenEst}` },
            failOnStatusCode: false,
            body: {
              tutor_id: loginTutor.body.user?.tutorId || 8,
              session_date: '2026-12-15',
              start_time: '10:00:00',
              subject_id: 8,
              reason: 'E2E-05 seed automático',
            },
          }).then((nueva) => {
            cy.log(`Sesión PENDING nueva sembrada: id=${nueva.body.id}`);
            return cy.wrap(nueva.body.id);
          });
        });
      });
    });
  };

  const login = (user) => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/login');
    cy.get('select[name="role"]').select(user.role);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button[type="submit"]').click();
  };

  before(() => {
    asegurarSesionPendiente();
  });

  it('Paso 1-5: El tutor atiende una sesión registrando un plan estructurado con 2 recursos', () => {
    stubBugsAjenos();
    login(tutor);
    cy.visit('/tutor/sesiones');

    cy.contains('Pendientes por atender', { timeout: 10000 }).should('be.visible');
    cy.get('button').contains('Marcar como Atendida', { timeout: 10000 }).first().click();
    cy.screenshot('e2e-05-paso1-modal-abierto');

    cy.contains('Dificultades Identificadas').should('be.visible');
    cy.get('textarea').first().type(dificultades);

    cy.contains('button', '+ Agregar recurso').click();
    cy.get('input[placeholder*="Cálculo"]').last().type(recurso1.nombre);
    cy.get('select').last().select(recurso1.tipo);
    cy.get('textarea').last().type(recurso1.descripcion);

    cy.contains('button', '+ Agregar recurso').click();
    cy.get('input[placeholder*="Cálculo"]').last().type(recurso2.nombre);
    cy.get('select').last().select(recurso2.tipo);
    cy.get('textarea').last().type(recurso2.descripcion);

    cy.screenshot('e2e-05-paso2-plan-completo');

    cy.contains('button', 'Guardar y Atender').should('not.be.disabled').click();

    // Al atender, la vista cambia automáticamente al tab "Historial" y muestra la sesión como ATTENDED
    cy.contains('Historial', { timeout: 10000 }).should('be.visible');
    cy.contains('Plan de estudio registrado').should('be.visible');
    cy.screenshot('e2e-05-paso3-sesion-atendida');
  });

  it('Paso 6-7: El estudiante consulta el plan de estudio asignado y verifica el contenido', () => {
    stubBugsAjenos();
    login(estudiante);
    cy.contains('Mi Plan', { timeout: 10000 }).click();
    cy.url().should('include', '/mi-plan');

    // "Plan activo" vive en el DOM en minúsculas; el estilo textTransform: uppercase
    // lo visualiza en mayúsculas. Usamos regex insensitive para que funcione en todos los navegadores.
    cy.contains(/plan activo/i, { timeout: 10000 }).should('be.visible');
    cy.contains(dificultades.substring(0, 40)).should('be.visible');
    cy.contains(recurso1.nombre).should('be.visible');
    cy.contains(recurso2.nombre).should('be.visible');
    cy.contains('Texto').should('be.visible');
    cy.contains('Video').should('be.visible');
    cy.screenshot('e2e-05-paso4-estudiante-ve-plan');
  });

  it('Paso 8: El estudiante solicita la constancia PDF y la respuesta tiene Content-Type application/pdf', () => {
    stubBugsAjenos();
    login(estudiante);
    cy.visit('/mi-plan');
    cy.contains(/plan activo/i, { timeout: 10000 }).should('be.visible');

    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      cy.request({
        url: `${BACKEND}/api/study-plans/me`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((meRes) => {
        const planId = meRes.body.plans[0].id;
        cy.request({
          url: `${BACKEND}/api/study-plans/${planId}/certificate`,
          headers: { Authorization: `Bearer ${token}` },
          encoding: 'binary',
        }).then((pdfRes) => {
          expect(pdfRes.status).to.eq(200);
          expect(pdfRes.headers['content-type']).to.contain('application/pdf');
          expect(pdfRes.headers['content-disposition']).to.contain('constancia-sesion-');
          expect(pdfRes.body.substring(0, 4)).to.eq('%PDF');
          cy.log(`PDF generado — ${pdfRes.body.length} bytes, magic %PDF confirmado`);
        });
      });
    });

    cy.screenshot('e2e-05-paso5-boton-descarga-visible');
  });
});

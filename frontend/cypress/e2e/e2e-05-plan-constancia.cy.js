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
 *  8. Pulsa "Descargar constancia PDF" y confirma que la respuesta es application/pdf.
 */

describe('E2E-05: Creación de plan estructurado y generación de constancia PDF', () => {
  const BACKEND = 'http://localhost:5000';
  const tutor = { email: 'sofia.tutora@test.com', password: 'Passw0rd1', role: 'tutor' };
  const estudiante = { email: 'sofia.estudiante@test.com', password: 'Passw0rd1', role: 'student' };

  const dificultades = 'Dificultades para aplicar la segunda ley de Newton en planos inclinados y para descomponer fuerzas en componentes vectoriales.';
  const recurso1 = { nombre: 'Física Universitaria - Sears Zemansky, Cap. 5', tipo: 'Texto', descripcion: 'Leer secciones 5.1 a 5.3 y resolver ejercicios impares 1-15' };
  const recurso2 = { nombre: 'Khan Academy - Planos inclinados', tipo: 'Video', descripcion: 'Ver los 3 videos de la serie y hacer los ejercicios interactivos' };

  // Precondición: debe existir al menos una sesión PENDING del tutor sofia.tutora@test.com.
  // Si no hay, prepararla con: INSERT INTO sessions (student_id, tutor_id, session_date,
  // start_time, end_time, subject_id, reason, status) VALUES (5, 8, '2026-11-15', '10:00:00',
  // '11:00:00', 8, 'E2E-05 seed', 'PENDING');

  const login = (user) => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/login');
    cy.get('select[name="role"]').select(user.role);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button[type="submit"]').click();
  };

  // Interceptar ratings (bug ajeno 500) para no romper la vista del tutor
  const stubRatings = () => {
    cy.intercept('GET', '**/api/ratings/**', { statusCode: 200, body: { ratings: [] } });
  };

  it('Paso 1-5: El tutor atiende una sesión registrando un plan estructurado con 2 recursos', () => {
    stubRatings();
    login(tutor);
    cy.visit('/tutor/sesiones');

    // Esperar que la lista de pendientes se renderice
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
    login(estudiante);
    cy.contains('Mi Plan', { timeout: 10000 }).click();
    cy.url().should('include', '/mi-plan');

    cy.contains('PLAN ACTIVO', { timeout: 10000 }).should('be.visible');
    cy.contains(dificultades.substring(0, 40)).should('be.visible');
    cy.contains(recurso1.nombre).should('be.visible');
    cy.contains(recurso2.nombre).should('be.visible');
    cy.contains('Texto').should('be.visible');
    cy.contains('Video').should('be.visible');
    cy.screenshot('e2e-05-paso4-estudiante-ve-plan');
  });

  it('Paso 8: El estudiante solicita la constancia PDF y la respuesta tiene Content-Type application/pdf', () => {
    login(estudiante);
    cy.visit('/mi-plan');
    cy.contains('PLAN ACTIVO', { timeout: 10000 }).should('be.visible');

    // Validar que el endpoint de descarga responde con application/pdf
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
          expect(pdfRes.headers['content-disposition']).to.contain(`constancia-sesion-`);
          expect(pdfRes.body.substring(0, 4)).to.eq('%PDF');
          cy.log(`✅ PDF generado correctamente — ${pdfRes.body.length} bytes, magic %PDF confirmado`);
        });
      });
    });

    cy.screenshot('e2e-05-paso5-boton-descarga-visible');
  });
});

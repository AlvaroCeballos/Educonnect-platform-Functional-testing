describe('E2E-02: Flujo de Inspección y Aprobación de CV de Tutor (Xavi)', () => {
  const mockPendingTutor = {
    id: 99,
    email: 'tutor.prueba@educonnect.gt',
    role: 'tutor',
    status: 'PENDING',
    created_at: '2026-10-15T10:00:00.000Z',
    cv_pdf_url: 'cv-demo-uuid.pdf',
    nombre: 'Carlos',
    apellido: 'Méndez',
    carnet: '202012345',
    identificacion: '3001234560101',
    genero: 'M',
    especialidad: 'Física y Matemática',
    universidad: 'USAC',
    fotografia_url: null,
  };

  beforeEach(() => {
    // Red de seguridad: cualquier petición /api no simulada responde 200 vacío.
    // Sin esto, el token falso llegaría al backend real, recibiría 401 y el
    // interceptor de api.js redirigiría a /login. Debe declararse PRIMERO:
    // Cypress da prioridad a los intercepts declarados después.
    cy.intercept('**/api/**', { statusCode: 200, body: {} });

    cy.intercept('GET', '**/api/auth/admin/profile', {
      statusCode: 200,
      body: { user: { id: 1, email: 'admin@educonnect.gt', role: 'admin' } },
    }).as('getAdminProfile');

    cy.intercept('GET', '**/api/admin/users*', (req) => {
      const status = new URL(req.url).searchParams.get('status');
      req.reply({
        statusCode: 200,
        body: { users: status === 'PENDING' ? [mockPendingTutor] : [] },
      });
    }).as('getUsers');

    cy.intercept('GET', '**/api/reports/top-tutors', { statusCode: 200, body: { topTutors: [] } });
    cy.intercept('GET', '**/api/reports/top-subjects', { statusCode: 200, body: { subjectsReport: [] } });
    cy.intercept('GET', '**/api/admin/reports/tutors', { statusCode: 200, body: { reports: [] } });
    cy.intercept('GET', '**/api/admin/reports/students', { statusCode: 200, body: { reports: [] } });
    cy.intercept('GET', '**/api/admin/students/pending', { statusCode: 200, body: { students: [] } });

    cy.intercept('GET', '**/api/admin/tutors/pending', {
      statusCode: 200,
      body: { tutors: [mockPendingTutor] },
    }).as('getPendingTutors');

    // El iframe del visor pide el PDF directamente al backend: se simula la respuesta.
    cy.intercept('GET', '**/api/documents/cvs/cv-demo-uuid.pdf', {
      statusCode: 200,
      headers: { 'content-type': 'application/pdf' },
      body: '%PDF-1.4\n%%EOF',
    }).as('getCvPdf');

    cy.intercept('PUT', '**/api/admin/tutors/99/status', {
      statusCode: 200,
      body: {
        message: 'Tutor aprobado exitosamente',
        user: { id: 99, email: mockPendingTutor.email, role: 'tutor', status: 'APPROVED' },
      },
    }).as('approveTutor');
  });

  it('Permite al administrador abrir el visor PDF incrustado del CV y aprobar al tutor', () => {
    // La ruta real del panel es /admin/dashboard (no existe /admin).
    // La sesión se guarda antes de cargar la app, en el window de la aplicación.
    cy.visit('/admin/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-jwt-admin-token');
        win.localStorage.setItem(
          'admin',
          JSON.stringify({ email: 'admin@educonnect.gt', role: 'admin' }),
        );
      },
    });
    cy.wait('@getAdminProfile');

    // Cambiar a la pestaña de Tutores (la subpestaña "Solicitudes Pendientes" es la predeterminada)
    cy.contains('button.admin-tab', 'Tutores').click();
    cy.wait('@getPendingTutors');

    // El tutor aparece en la tabla con su documento disponible
    cy.contains('Carlos Méndez').should('be.visible');
    cy.contains('PDF disponible').should('be.visible');
    cy.screenshot('e2e-02-01-tutor-pendiente-en-lista', { capture: 'viewport' });

    // Abrir el modal de revisión con visor PDF incrustado
    cy.contains('button', 'Revisar').click();

    // El visor embebido (iframe) se renderiza apuntando al endpoint de streaming inline
    cy.get('[role="dialog"] iframe')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', '/api/documents/cvs/cv-demo-uuid.pdf');
    cy.screenshot('e2e-02-02-visor-pdf-abierto', { capture: 'viewport' });

    // Aprobar la solicitud del tutor
    cy.get('[role="dialog"]').contains('button', 'Aceptar').click();
    cy.wait('@approveTutor').its('request.body').should('deep.equal', { status: 'APPROVED' });

    // El modal se cierra y el tutor desaparece de la lista de pendientes
    cy.get('[role="dialog"]').should('not.exist');
    cy.contains('Carlos Méndez').should('not.exist');
    cy.contains('No hay tutores pendientes de aprobación.').should('be.visible');
    cy.screenshot('e2e-02-03-tutor-aprobado', { capture: 'viewport' });
  });
});

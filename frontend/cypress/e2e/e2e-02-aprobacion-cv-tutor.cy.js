describe('E2E-02: Flujo de Inspección y Aprobación de CV de Tutor (Xavi)', () => {
  const mockPendingTutor = {
    id: 99,
    email: 'tutor.prueba@educonnect.gt',
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
    window.localStorage.setItem('token', 'fake-jwt-admin-token');
    window.localStorage.setItem('admin', JSON.stringify({ email: 'admin@educonnect.gt', role: 'admin' }));

    cy.intercept('GET', '**/api/auth/admin/profile', {
      statusCode: 200,
      body: { user: { id: 1, email: 'admin@educonnect.gt', role: 'admin' } },
    }).as('getAdminProfile');

    cy.intercept('GET', '**/api/admin/users?status=PENDING*', {
      statusCode: 200,
      body: { users: [mockPendingTutor] },
    }).as('getPendingUsers');

    cy.intercept('GET', '**/api/admin/users?status=APPROVED*', {
      statusCode: 200,
      body: { users: [] },
    });

    cy.intercept('GET', '**/api/admin/tutors/pending', {
      statusCode: 200,
      body: { tutors: [mockPendingTutor] },
    }).as('getPendingTutors');

    cy.intercept('PUT', '**/api/admin/tutors/99/status', {
      statusCode: 200,
      body: {
        message: 'Tutor aprobado exitosamente',
        user: { id: 99, email: mockPendingTutor.email, role: 'tutor', status: 'APPROVED' },
      },
    }).as('approveTutor');
  });

  it('Permite al administrador abrir el visor PDF incrustado del CV y aprobar al tutor', () => {
    cy.visit('/admin');
    cy.wait('@getAdminProfile');

    // Cambiar a la pestaña de Tutores
    cy.contains('button', 'Tutores').click();
    cy.wait('@getPendingTutors');

    // Verificar que el tutor aparece en la tabla con su documento disponible
    cy.contains('Carlos Méndez').should('be.visible');
    cy.contains('PDF disponible').should('be.visible');

    // Abrir el modal de revisión con visor PDF incrustado
    cy.contains('button', 'Revisar').click();

    // Verificar que el visor PDF embebido (iframe) se renderiza sin descargar el archivo
    cy.get('iframe[title="Visor de documento PDF"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', '/api/documents/cvs/cv-demo-uuid.pdf');

    // Aprobar la solicitud del tutor
    cy.contains('button', 'Aceptar').click();
    cy.wait('@approveTutor').its('request.body').should('deep.equal', { status: 'APPROVED' });

    // El tutor aprobado desaparece de la lista de pendientes
    cy.contains('Carlos Méndez').should('not.exist');
  });
});

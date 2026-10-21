/**
 * E2E-06: Flujo de feedback de sesiones atendidas
 * Responsable: Isai Patzán — Paquete F
 *
 * HU cubiertas:
 *  - HU-036: estudiante reporta a un tutor.
 *  - HU-037: tutor califica a un estudiante.
 *  - HU-038: tutor reporta a un estudiante.
 *
 * La prueba utiliza respuestas controladas de la API para que sea reproducible
 * sin depender de usuarios, sesiones o denuncias preexistentes en la base de datos.
 */

const attendedStudentSession = {
  id: 501,
  tutorId: 20,
  tutorNombre: 'Ana',
  tutorApellido: 'Morales',
  materia: 'Física',
  sessionDate: '2026-10-15',
  startTime: '10:00:00',
  endTime: '11:00:00',
  status: 'ATTENDED',
  reason: 'Repaso de dinámica y leyes de Newton',
  summary: 'Se revisaron ejercicios de fuerza y aceleración.',
  recommendations: 'Resolver los ejercicios del capítulo 5.',
};

const attendedTutorSession = {
  id: 502,
  tutorId: 20,
  studentId: 10,
  studentNombre: 'Diego',
  studentApellido: 'López',
  materia: 'Matemática',
  sessionDate: '2026-10-16',
  startTime: '14:00:00',
  endTime: '15:00:00',
  status: 'ATTENDED',
  reason: 'Repaso de derivadas',
};

const setAuthenticatedSession = () => {
  cy.visit('/historial', {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', 'e2e-06-token');
    },
  });
};

describe('E2E-06: Feedback de sesiones atendidas — Isai', () => {
  it('HU-036: el estudiante califica y reporta al tutor desde su historial', () => {
    cy.intercept('GET', '**/api/sessions/me', { sessions: [attendedStudentSession] }).as('studentSessions');
    cy.intercept('GET', '**/api/ratings/me', { ratings: [] }).as('studentRatings');
    cy.intercept('GET', '**/api/incidents/me', { incidents: [] }).as('studentIncidents');
    cy.intercept('POST', '**/api/ratings/sessions/501', {
      statusCode: 201,
      body: { rating: { sessionId: 501, rating: 5, comment: 'Excelente explicación.' } },
    }).as('rateTutor');
    cy.intercept('POST', '**/api/sessions/501/report-tutor', {
      statusCode: 201,
      body: {
        incident: {
          id: 701,
          sessionId: 501,
          category: 'Negligencia académica',
          reason: 'El tutor no cubrió el contenido acordado en la sesión.',
        },
      },
    }).as('reportTutor');

    setAuthenticatedSession();
    cy.wait(['@studentSessions', '@studentRatings', '@studentIncidents']);
    cy.contains('Historial de sesiones').should('be.visible');
    cy.contains('Ana Morales').should('be.visible');

    cy.get('button[aria-label="5 estrellas"]').click();
    cy.get('textarea[placeholder="Comentario opcional"]').type('Excelente explicación.');
    cy.contains('button', 'Enviar calificación').click();
    cy.wait('@rateTutor').its('request.body').should('deep.include', {
      rating: 5,
      comment: 'Excelente explicación.',
    });
    cy.contains('Tu calificación:').should('be.visible');
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-container').should('not.exist');

    cy.contains('button', 'Reportar al tutor').click();
    cy.get('.incident-report-form select').select('Negligencia académica');
    cy.get('textarea[placeholder="Describe los hechos de la sesión."]').type(
      'El tutor no cubrió el contenido acordado en la sesión.',
    );
    cy.contains('button', 'Enviar reporte').click();
    cy.wait('@reportTutor').its('request.body').should('deep.include', {
      category: 'Negligencia académica',
      reason: 'El tutor no cubrió el contenido acordado en la sesión.',
    });
    cy.contains('button', 'Reportar al tutor').should('not.exist');
    cy.screenshot('e2e-06-estudiante-feedback');
  });

  it('HU-037 y HU-038: el tutor califica y reporta al estudiante desde su historial', () => {
    cy.intercept('GET', '**/api/sessions/tutor/me', { sessions: [attendedTutorSession] }).as('tutorSessions');
    cy.intercept('GET', '**/api/ratings/tutor/me', { ratings: [] }).as('tutorRatings');
    cy.intercept('GET', '**/api/incidents/tutor/me', { incidents: [] }).as('tutorIncidents');
    cy.intercept('POST', '**/api/ratings/tutor/sessions/502', {
      statusCode: 201,
      body: { rating: { sessionId: 502, rating: 4, comment: 'Buen compromiso.' } },
    }).as('rateStudent');
    cy.intercept('POST', '**/api/sessions/502/report-student', {
      statusCode: 201,
      body: {
        incident: {
          id: 702,
          sessionId: 502,
          category: 'Agresión verbal o física',
          reason: 'El estudiante utilizó lenguaje ofensivo durante la sesión.',
        },
      },
    }).as('reportStudent');

    cy.visit('/tutor/sesiones', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'e2e-06-token');
      },
    });
    cy.wait(['@tutorSessions', '@tutorRatings', '@tutorIncidents']);
    cy.contains('Historial').click();
    cy.contains('Plan de estudio registrado').should('be.visible');
    cy.contains('Diego López').should('be.visible');

    cy.get('button[aria-label="4 estrellas"]').click();
    cy.get('textarea[placeholder="Comentario opcional"]').type('Buen compromiso.');
    cy.contains('button', 'Enviar calificación').click();
    cy.wait('@rateStudent').its('request.body').should('deep.include', {
      rating: 4,
      comment: 'Buen compromiso.',
    });
    cy.contains('button', 'Enviar calificación').should('not.exist');
    cy.get('.swal2-confirm').click();
    cy.get('.swal2-container').should('not.exist');

    cy.contains('button', 'Reportar al estudiante').click();
    cy.get('.incident-report-form select').select('Agresión verbal o física');
    cy.get('textarea[placeholder="Describe los hechos de la sesión."]').type(
      'El estudiante utilizó lenguaje ofensivo durante la sesión.',
    );
    cy.contains('button', 'Enviar reporte').click();
    cy.wait('@reportStudent').its('request.body').should('deep.include', {
      category: 'Agresión verbal o física',
      reason: 'El estudiante utilizó lenguaje ofensivo durante la sesión.',
    });
    cy.contains('button', 'Reportar al estudiante').should('not.exist');
    cy.screenshot('e2e-06-tutor-feedback');
  });
});

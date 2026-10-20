/**
 * E2E-03: Flujo de Moderación y Sanción de Cuenta
 * Paquete C — Moderación, Denuncias y Cuentas
 * Responsable: Alvaro Ceballos (Carnet: 202300673)
 * Historias cubiertas: HU-041, HU-042, HU-044
 * 
 * Flujo oficial:
 * 1. El administrador inicia sesión con credenciales y archivo 2FA contra el backend.
 * 2. Ingresa al listado de usuarios aprobados (pestaña Estudiantes).
 * 3. Intenta editar los datos de un estudiante verificando que el correo no es editable (inmutable).
 * 4. Navega a la subpestaña de denuncias disciplinarias recibidas contra estudiantes (HU-044).
 * 5. Localiza una denuncia válida y presiona "Dar de baja" bajo confirmación modal (SweetAlert2).
 * 6. Se cierra la sesión del administrador.
 * 7. El usuario sancionado intenta ingresar con sus credenciales y el sistema le deniega el acceso (403 / DISABLED).
 * 
 * Los endpoints de datos (/api/admin/*) se simulan con cy.intercept para garantizar independencia de la BD local.
 * El login de administrador utiliza autenticación real contra el backend con sesión compartida.
 */

// Credenciales del administrador semilla
const ADMIN = {
  email: 'admin@educonnect.com',
  password: 'Admin123!',
};

// Hash criptográfico que valida loginAdmin2FA en backend/src/controllers/authController.js
const AUTH_2FA = '$2b$10$GVlO95gxMuYE0pf1eVLDbO4tHQzoj.vJyLKuNyzDj0M2.q0NewzEm';

// Credenciales del estudiante objetivo para la prueba de sanción
const TARGET_STUDENT = {
  email: 'javier.orellana@educonnect.com',
  password: 'Estudiante123!',
};

// ---------- Datos simulados para aislamiento y hermeticidad ----------
const mockApprovedStudents = [
  {
    id: 10,
    nombre: 'Javier',
    apellido: 'Orellana',
    carnet: '202300001',
    email: 'javier.orellana@educonnect.com',
    universidad: 'USAC',
    carrera: 'Ingeniería en Sistemas',
    genero: 'M',
    status: 'APPROVED',
    role: 'student',
    fotografia_url: null,
    created_at: '2026-09-01T10:00:00.000Z',
  },
];

const mockStudentIncidents = [
  {
    id: 50,
    status: 'PENDING',
    category: 'Falta de Respeto o Lenguaje Inapropiado',
    reason: 'Conducta irrespetuosa recurrente durante la sesión de tutoría.',
    createdAt: '2026-10-15T14:30:00.000Z',
    sessionDate: '2026-10-14T09:00:00.000Z',
    materia: 'Matemática Básica 1',
    reportedNombreCompleto: 'Javier Orellana',
    reportedEmail: 'javier.orellana@educonnect.com',
    reportedCarnet: '202300001',
    reportedCarrera: 'Ingeniería en Sistemas',
    reporterNombreCompleto: 'Carlos Tutor',
    reporterCarnet: '201900002',
    reporterEspecialidad: 'Matemática',
    reporterRole: 'tutor',
  },
];

// Configuración de intercepts para aislar la prueba de datos locales
const stubModeration = () => {
  cy.intercept('GET', '**/api/admin/users*', (req) => {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    if (status === 'APPROVED') {
      req.reply({ users: mockApprovedStudents });
    } else if (status === 'PENDING') {
      req.reply({ users: [] });
    } else {
      req.reply({ users: mockApprovedStudents });
    }
  }).as('getAdminUsers');

  cy.intercept('GET', '**/api/admin/reports/students*', { reports: mockStudentIncidents }).as('getStudentReports');
  cy.intercept('GET', '**/api/admin/reports/tutors*', { reports: [] }).as('getTutorReports');
  cy.intercept('GET', '**/api/reports/top-tutors*', { topTutors: [] }).as('getTopTutors');
  cy.intercept('GET', '**/api/reports/top-subjects*', { subjectsReport: [] }).as('getTopSubjects');

  // Intercepta resolución disciplinaria (sanción BAN)
  cy.intercept('PATCH', '**/api/admin/reports/*/resolve', {
    message: 'Estudiante dado de baja exitosamente por sanción disciplinaria.',
    status: 'RESOLVED_BANNED',
  }).as('resolveIncident');

  // Intercepta actualización de perfil de estudiante
  cy.intercept('PUT', '**/api/admin/users/*/student-profile', {
    message: 'Perfil de estudiante actualizado exitosamente.',
    user: { ...mockApprovedStudents[0], nombre: 'Javier Modificado' },
  }).as('updateStudent');
};

// ---------- Login de Administrador con 2FA preservado en sesión ----------
const loginAsAdmin = () => {
  cy.session('admin-e2e-03', () => {
    cy.visit('/login');
    cy.get('select[name="role"]').select('admin');
    cy.get('input[name="email"]').type(ADMIN.email);
    cy.get('input[name="password"]').type(ADMIN.password, { log: false });
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login/admin/2fa');
    cy.get('#auth2-file').selectFile({
      contents: Cypress.Buffer.from(AUTH_2FA),
      fileName: 'auth2-ayd1.txt',
      mimeType: 'text/plain',
    }, { force: true });
    cy.contains('button', 'Validar y acceder al sistema').should('not.be.disabled').click();

    cy.url().should('include', '/admin/dashboard');
  }, {
    validate: () => {
      cy.window().then((win) => expect(win.localStorage.getItem('token')).to.be.a('string'));
    },
  });
};

describe('E2E-03: Flujo de Moderación y Sanción Disciplinaria de Cuenta', () => {
  it('Paso 1 y 2: Administrador inicia sesión con 2FA y visualiza estudiantes activos', () => {
    loginAsAdmin();
    stubModeration();
    cy.visit('/admin/dashboard');

    cy.contains('Panel Administrativo').should('be.visible');

    // Navegar al módulo de Estudiantes
    cy.contains('button', 'Estudiantes').click();
    cy.contains('button', 'Estudiantes Aprobados / Activos (HU-024)').click();
    cy.wait('@getAdminUsers');

    // Verificar que aparece el estudiante aprobado en la tabla
    cy.get('.admin-table tbody tr').should('have.length.at.least', 1)
      .first().should('contain', 'Javier Orellana')
      .and('contain', 'ACTIVO');
  });

  it('Paso 3: Verifica que el correo electrónico del estudiante sea estrictamente inmutable', () => {
    loginAsAdmin();
    stubModeration();
    cy.visit('/admin/dashboard');

    cy.contains('button', 'Estudiantes').click();
    cy.contains('button', 'Estudiantes Aprobados / Activos (HU-024)').click();
    cy.wait('@getAdminUsers');

    // Abrir modal de edición en el estudiante
    cy.get('.admin-table tbody tr').first().within(() => {
      cy.get('.edit-button').click();
    });

    // Validar que el campo correo esté deshabilitado y muestre la insignia Inmutable
    cy.get('.admin-modal-card').should('be.visible');
    cy.get('.admin-modal-card input[type="email"]').should('be.disabled').and('have.value', TARGET_STUDENT.email);
    cy.get('.admin-modal-card').contains('Inmutable').should('be.visible');

    // Cerrar modal
    cy.get('.admin-modal-card').contains('button', 'Cancelar').click();
    cy.get('.admin-modal-card').should('not.exist');
  });

  it('Paso 4 y 5: Localiza denuncia disciplinaria contra estudiante y aplica sanción de baja lógica', () => {
    loginAsAdmin();
    stubModeration();
    cy.visit('/admin/dashboard');

    cy.contains('button', 'Estudiantes').click();
    cy.contains('button', 'Denuncias Recibidas (HU-044)').click();
    cy.wait('@getStudentReports');

    // Localizar la fila con la denuncia en estado PENDIENTE
    cy.get('.admin-table tbody tr').first().within(() => {
      cy.contains('PENDIENTE').should('be.visible');
      cy.get('.ban-button').click();
    });

    // Confirmación modal en SweetAlert2
    cy.get('.swal2-modal').should('be.visible');
    cy.get('.swal2-textarea').type('Falta disciplinaria grave constatada en bitácora.');
    cy.contains('button.swal2-confirm', 'Sí, dar de baja').click();

    cy.wait('@resolveIncident');

    // Mensaje de éxito de la sanción y confirmación
    cy.contains('Estudiante dado de baja').should('be.visible');
    cy.get('.swal2-confirm').click();
  });

  it('Paso 6 y 7: Cierra sesión y valida que el estudiante sancionado no puede iniciar sesión', () => {
    loginAsAdmin();
    stubModeration();
    cy.visit('/admin/dashboard');

    // Intercepta el intento de login del estudiante sancionado devolviendo 403 (DISABLED)
    cy.intercept('POST', '**/api/auth/login/student', {
      statusCode: 403,
      body: {
        message: 'Tu cuenta ha sido dada de baja o suspendida por la administración (DISABLED).',
      },
    }).as('loginBannedStudent');

    // Cerrar sesión del administrador
    cy.contains('button', 'Cerrar sesión').click();
    cy.url().should('include', '/login');

    // Intento de login del estudiante sancionado
    cy.get('select[name="role"]').select('student');
    cy.get('input[name="email"]').type(TARGET_STUDENT.email);
    cy.get('input[name="password"]').type(TARGET_STUDENT.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginBannedStudent');

    // Mensaje de denegación de acceso y permanencia fuera del dashboard
    cy.contains(/dada de baja|suspendida|bloqueada|disabled/i).should('be.visible');
    cy.url().should('not.include', '/dashboard');
  });
});

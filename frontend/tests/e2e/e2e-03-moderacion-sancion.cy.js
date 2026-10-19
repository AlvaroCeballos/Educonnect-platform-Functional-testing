/**
 * E2E-03: Flujo de Moderación y Sanción de Cuenta
 * Responsable: Alvaro Ceballos (Carnet: 202300673) — Paquete C
 * 
 * Flujo:
 * 1. El administrador inicia sesión en EduConnect con 2FA.
 * 2. Ingresa al listado de usuarios aprobados (pestaña Estudiantes).
 * 3. Intenta editar los datos de un estudiante verificando que el correo no es editable (inmutable).
 * 4. Navega a la subpestaña de denuncias disciplinarias recibidas (HU-044).
 * 5. Localiza una denuncia válida y presiona "Dar de baja" bajo confirmación modal.
 * 6. Se cierra la sesión del administrador.
 * 7. El estudiante sancionado intenta ingresar con sus credenciales y el sistema le deniega el acceso (403 / DISABLED).
 */

describe('E2E-03: Flujo de Moderación y Sanción Disciplinaria de Cuenta', () => {
  const adminEmail = 'admin@educonnect.com';
  const adminPassword = 'Admin123!';
  const targetStudentEmail = 'javier.orellana@educonnect.com';
  const targetStudentPassword = 'Estudiante123!';

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Paso 1 y 2: Administrador inicia sesión y visualiza estudiantes activos', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();

    // Verificación de acceso al dashboard
    cy.url().should('include', '/admin');
    cy.contains('Panel Administrativo').should('be.visible');

    // Navegar a la pestaña de Estudiantes
    cy.contains('button', 'Estudiantes').click();
    cy.contains('button', 'Estudiantes Aprobados / Activos (HU-024)').should('be.visible');
  });

  it('Paso 3: Verifica que el correo electrónico del estudiante sea estrictamente inmutable', () => {
    cy.visit('http://localhost:3000/admin');
    cy.contains('button', 'Estudiantes').click();
    cy.contains('button', 'Estudiantes Aprobados / Activos (HU-024)').click();

    // Abrir modal de edición en el primer estudiante
    cy.get('.admin-table tbody tr').first().within(() => {
      cy.get('.edit-button').click();
    });

    // Validar que el campo correo esté deshabilitado (disabled / readonly)
    cy.get('input[type="email"]').should('be.disabled');
    cy.contains('Inmutable').should('be.visible');

    // Cerrar modal
    cy.contains('button', 'Cancelar').click();
  });

  it('Paso 4 y 5: Localiza denuncia disciplinaria contra estudiante y aplica sanción de baja lógica', () => {
    cy.visit('http://localhost:3000/admin');
    cy.contains('button', 'Estudiantes').click();
    cy.contains('button', 'Denuncias Recibidas (HU-044)').click();

    // Localiza la fila con denuncia pendiente
    cy.get('.admin-table tbody tr').first().within(() => {
      cy.contains('PENDIENTE').should('be.visible');
      cy.get('.ban-button').click();
    });

    // Confirmación en modal SweetAlert2 con notas de resolución
    cy.get('.swal2-textarea').type('Falta grave constatada en bitácora de sesión presencial.');
    cy.get('.swal2-confirm').click();

    // Mensaje de éxito
    cy.contains('Estudiante dado de baja').should('be.visible');
    cy.get('.swal2-confirm').click();
  });

  it('Paso 6 y 7: Cierra sesión y valida que el estudiante sancionado no puede iniciar sesión', () => {
    // Cerrar sesión
    cy.visit('http://localhost:3000/admin');
    cy.contains('button', 'Cerrar sesión').click();
    cy.url().should('include', '/login');

    // Intento de login del estudiante sancionado
    cy.get('input[type="email"]').type(targetStudentEmail);
    cy.get('input[type="password"]').type(targetStudentPassword);
    cy.get('button[type="submit"]').click();

    // Bloqueo y denegación de acceso
    cy.contains(/dada de baja|no se encuentra aprobada|bloqueada/i).should('be.visible');
    cy.url().should('not.include', '/dashboard');
  });
});

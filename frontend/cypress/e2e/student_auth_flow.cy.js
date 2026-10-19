// frontend/cypress/e2e/student_auth_flow.cy.js

describe('E2E-01: Flujo Completo de Registro con PDF, Verificación por Token y Login', () => {
  const timestamp = Date.now();
  const testStudent = {
    nombre: 'Yury',
    apellido: 'García',
    carnet: `2023${String(timestamp).slice(-5)}`,
    email: `student.${timestamp}@ingenieria.usac.edu.gt`,
    password: 'Password123!',
    token: 'A8X9K2',
  };

  it('Debe completar el registro adjuntando foto y carnet PDF, y acceder con credenciales y token', () => {
    // 1. Interceptar peticiones para garantizar determinismo en el test
    cy.intercept('POST', '/api/auth/register/student', {
      statusCode: 201,
      body: {
        message: 'Registro exitoso. Se ha enviado el token a tu correo.',
      },
    }).as('registerRequest');

    cy.intercept('POST', '/api/auth/login/student', (req) => {
      if (!req.body.token) {
        req.reply({
          statusCode: 403,
          body: {
            requiresToken: true,
            message: 'Tu cuenta requiere ingresar el token de verificación en tu primer inicio de sesión.',
          },
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            message: 'Inicio de sesión exitoso',
            token: 'fake-jwt-token-e2e',
            student: {
              id: 1,
              userId: 99,
              nombre: testStudent.nombre,
              apellido: testStudent.apellido,
              email: testStudent.email,
            },
          },
        });
      }
    }).as('loginRequest');

    // 2. Navegar al formulario de registro
    cy.visit('/registro');

    // 3. Llenar campos requeridos
    cy.get('input[name="nombre"]').type(testStudent.nombre);
    cy.get('input[name="apellido"]').type(testStudent.apellido);
    cy.get('input[name="carnet"]').type(testStudent.carnet);
    cy.get('select[name="genero"]').select('M');
    cy.get('input[name="fecha_nacimiento"]').type('2003-05-15');
    cy.get('input[name="telefono"]').type('55551234');
    cy.get('input[name="direccion"]').type('Ciudad Universitaria Zona 12');
    cy.get('input[name="email"]').type(testStudent.email);
    cy.get('input[name="password"]').type(testStudent.password);
    cy.get('input[name="confirm"]').type(testStudent.password);

    // 4. Adjuntar fotografía y carnet en PDF mediante inputs de tipo file
    cy.get('input[type="file"]')
      .first()
      .selectFile({
        contents: Cypress.Buffer.from('fake-photo-content'),
        fileName: 'foto-reciente.jpg',
        mimeType: 'image/jpeg',
      });

    cy.get('input[type="file"]')
      .last()
      .selectFile({
        contents: Cypress.Buffer.from('%PDF-1.4 fake pdf content'),
        fileName: 'carnet-escaneado.pdf',
        mimeType: 'application/pdf',
      });

    // 5. Enviar registro
    cy.get('button[type="submit"]').click();
    cy.wait('@registerRequest');

    // 6. Verificar pantalla de éxito informando sobre el token enviado
    cy.url().should('include', '/registro-exitoso');
    cy.contains('¡Revisa tu correo electrónico!').should('be.visible');

    // 7. Navegar a Iniciar Sesión
    cy.contains('Ir a Iniciar Sesión').click();
    cy.url().should('include', '/login');

    // 8. Intentar primer login (el sistema exige token)
    cy.get('select[name="role"]').select('student');
    cy.get('input[name="email"]').type(testStudent.email);
    cy.get('input[name="password"]').type(testStudent.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.contains('token de verificación').should('be.visible');

    // 9. Ingresar el token en el campo habilitado
    cy.get('input[name="token"]').should('be.visible').type(testStudent.token);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    // 10. Confirmar ingreso exitoso al portal estudiantil
    cy.url().should('include', '/dashboard/student');
  });
});
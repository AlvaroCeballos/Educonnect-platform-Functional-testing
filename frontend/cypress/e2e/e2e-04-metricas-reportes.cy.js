/**
 * E2E-04: Flujo de Supervisión de Métricas y Reportes
 * Paquete D
 * HU cubiertas: HU-045, HU-046, HU-047, HU-048
 *
 * Flujo:
 * 1. El administrador inicia sesión (credenciales + archivo 2FA) contra el backend real.
 * 2. Ingresa al módulo de Métricas.
 * 3. Visualiza las tablas de tutores y estudiantes con su promedio de estrellas.
 * 4. Aplica filtros temporales (granularidad y mes) a la evolución de sesiones.
 * 5. En el reporte analítico F2-2 filtra por mes y verifica que la tabla de
 *    cancelaciones y la franja más demandada se actualizan.
 *
 * Los endpoints /api/reports/* se simulan con cy.intercept para que las aserciones
 * no dependan de los datos de cada base local. El login usa el backend real.
 */

// Credenciales del administrador semilla (las mismas que usa E2E-03).
// Si tu admin local tiene otras, ajústalas aquí.
const ADMIN = {
  email: 'admin@educonnect.com',
  password: 'Admin123!',
};
// Contenido que espera loginAdmin2FA (backend/src/controllers/authController.js)
const AUTH_2FA = '$2b$10$GVlO95gxMuYE0pf1eVLDbO4tHQzoj.vJyLKuNyzDj0M2.q0NewzEm';

// ---------- Datos simulados ----------
const tutorsRatings = [
  { id: 1, nombre: 'Marta', apellido: 'Gómez', especialidad: 'Programación', promedio: 4.67, total: 3 },
  { id: 2, nombre: 'Luis', apellido: 'Pérez', especialidad: 'Física', promedio: 3.5, total: 2 },
  { id: 3, nombre: 'Ana', apellido: 'Morales', especialidad: 'Cálculo', promedio: 0, total: 0 },
];

const studentsRatings = [
  { id: 10, nombre: 'Diego', apellido: 'López', carnet: 'E-9003', promedio: 4, total: 2, tutores: 2 },
  { id: 11, nombre: 'Carlos', apellido: 'Díaz', carnet: 'E-9001', promedio: 2.5, total: 4, tutores: 3 },
  { id: 12, nombre: 'Sofía', apellido: 'Ramos', carnet: 'E-9002', promedio: 0, total: 0, tutores: 0 },
];

const evolutionFor = ({ granularity = 'month', month }) => {
  if (month === '2026-07') return []; // mes sin sesiones atendidas
  if (month) return [{ periodo: granularity === 'week' ? '2026-W38' : month, total: 5 }];
  return granularity === 'week'
    ? [{ periodo: '2026-W36', total: 2 }, { periodo: '2026-W38', total: 5 }, { periodo: '2026-W41', total: 4 }]
    : [{ periodo: '2026-08', total: 3 }, { periodo: '2026-09', total: 5 }, { periodo: '2026-10', total: 4 }];
};

const cancellationsFor = ({ month }) => (month === '2026-10'
  ? [
    { materia: 'Física', canceladas: 2, total: 2, tasa: 100 },
    { materia: 'Matemática', canceladas: 0, total: 1, tasa: 0 },
  ]
  : [
    { materia: 'Matemática', canceladas: 2, total: 3, tasa: 66.7 },
    { materia: 'Física', canceladas: 1, total: 4, tasa: 25 },
  ]);

const schedulesFor = ({ month }) => (month === '2026-10'
  ? [{ franja: '14:00 - 15:00', total: 2 }, { franja: '08:00 - 09:00', total: 1 }]
  : [{ franja: '08:00 - 09:00', total: 5 }, { franja: '14:00 - 15:00', total: 3 }]);

const stubReports = () => {
  cy.intercept('GET', '/api/reports/tutors-ratings', { tutorsRatings }).as('tutorsRatings');
  cy.intercept('GET', '/api/reports/students-ratings', { studentsRatings }).as('studentsRatings');
  cy.intercept({ method: 'GET', pathname: '/api/reports/sessions-evolution' }, (req) => {
    req.reply({ granularity: req.query.granularity, month: req.query.month || null, evolution: evolutionFor(req.query) });
  }).as('evolution');
  cy.intercept({ method: 'GET', pathname: '/api/reports/cancellations-by-subject' }, (req) => {
    req.reply({ month: req.query.month || null, cancellations: cancellationsFor(req.query) });
  }).as('cancellations');
  cy.intercept({ method: 'GET', pathname: '/api/reports/demanded-schedules' }, (req) => {
    req.reply({ month: req.query.month || null, schedules: schedulesFor(req.query) });
  }).as('schedules');
};

// ---------- Login real del administrador (credenciales + 2FA) ----------
const loginAsAdmin = () => {
  cy.session('admin-e2e-04', () => {
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

describe('E2E-04: Supervisión de métricas y reportes analíticos', () => {
  beforeEach(() => {
    loginAsAdmin();
    stubReports();
    cy.visit('/admin/dashboard');
    cy.contains('button', 'Métricas').click();
    cy.get('[data-testid="metrics-panel"]').should('be.visible');
  });

  it('Pasos 1-3: muestra el promedio de estrellas de tutores y estudiantes activos', () => {
    cy.wait(['@tutorsRatings', '@studentsRatings']);

    cy.get('[data-testid="ratings-table"] tbody tr').should('have.length', 3)
      .first().should('contain', 'Marta Gómez').and('contain', '4.67 ★');
    cy.get('[data-testid="ratings-table"]').contains('tr', 'Ana Morales')
      .should('contain', 'Sin calificaciones');

    cy.get('[data-testid="students-ratings-table"] tbody tr').should('have.length', 3)
      .first().should('contain', 'Diego López').and('contain', '4.00 ★');
    cy.get('[data-testid="students-ratings-table"]').contains('tr', 'Sofía Ramos')
      .should('contain', 'Sin calificaciones');

    cy.screenshot('e2e-04-01-promedios-calificaciones');
  });

  it('Paso 4: filtra la evolución de sesiones por granularidad y por mes', () => {
    cy.wait('@evolution');
    cy.get('[data-testid="evolution-chart"] canvas').should('be.visible');

    // Cambiar a agrupación semanal
    cy.intercept({ method: 'GET', pathname: '/api/reports/sessions-evolution', query: { granularity: 'week' } })
      .as('evolutionWeek');
    cy.get('[data-testid="granularity-select"]').select('week');
    cy.wait('@evolutionWeek');
    cy.get('[data-testid="evolution-chart"] canvas').should('be.visible');

    // Mes sin sesiones: el gráfico se reemplaza por el estado vacío
    cy.intercept({
      method: 'GET', pathname: '/api/reports/sessions-evolution', query: { granularity: 'week', month: '2026-07' },
    }).as('evolutionJulio');
    cy.get('[data-testid="month-filter"]').type('2026-07');
    cy.wait('@evolutionJulio');
    cy.contains('No hay sesiones atendidas en el período seleccionado.').should('be.visible');
    cy.get('[data-testid="evolution-chart"]').should('not.exist');

    // Limpiar filtro: vuelve el gráfico con todos los períodos
    cy.get('[data-testid="month-filter"]').parents('section').contains('button', 'Limpiar filtro').click();
    cy.get('[data-testid="month-filter"]').should('have.value', '');
    cy.get('[data-testid="evolution-chart"] canvas').should('be.visible');

    cy.screenshot('e2e-04-02-evolucion-sesiones');
  });

  it('Paso 5: filtra el reporte F2-2 por mes y actualiza cancelaciones y horarios', () => {
    cy.wait(['@cancellations', '@schedules']);
    cy.get('[data-testid="reports-f2-panel"]').scrollIntoView();

    cy.get('[data-testid="cancellation-table"] tbody tr').first()
      .should('contain', 'Matemática').and('contain', '66.7%');
    cy.get('[data-testid="top-schedule"]').should('contain', '08:00 - 09:00');
    cy.get('[data-testid="cancellation-chart"] canvas').should('be.visible');
    cy.get('[data-testid="schedules-chart"] canvas').should('be.visible');

    // Filtrar por octubre 2026
    cy.intercept({ method: 'GET', pathname: '/api/reports/cancellations-by-subject', query: { month: '2026-10' } })
      .as('cancellationsOctubre');
    cy.intercept({ method: 'GET', pathname: '/api/reports/demanded-schedules', query: { month: '2026-10' } })
      .as('schedulesOctubre');
    cy.get('[data-testid="f2-month-filter"]').type('2026-10');
    cy.wait(['@cancellationsOctubre', '@schedulesOctubre']);

    cy.get('[data-testid="cancellation-table"] tbody tr').first()
      .should('contain', 'Física').and('contain', '100%');
    cy.get('[data-testid="top-schedule"]').should('contain', '14:00 - 15:00');
    cy.screenshot('e2e-04-03-reporte-f2-filtrado');

    // Limpiar filtro: vuelven los datos de todo el período
    cy.get('[data-testid="reports-f2-panel"]').contains('button', 'Limpiar filtro').click();
    cy.get('[data-testid="f2-month-filter"]').should('have.value', '');
    cy.get('[data-testid="cancellation-table"] tbody tr').first().should('contain', 'Matemática');
    cy.get('[data-testid="top-schedule"]').should('contain', '08:00 - 09:00');
  });
  
});
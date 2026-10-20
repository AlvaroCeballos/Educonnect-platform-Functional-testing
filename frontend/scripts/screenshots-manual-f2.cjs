// Genera capturas automatizadas del flujo Fase 2 del Paquete E
// Uso: cd frontend && node scripts/screenshots-manual-f2.cjs

const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.resolve(__dirname, '../../docs/Manuales/imgs');
const VIEWPORT = { width: 1366, height: 850 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const shot = async (page, name) => {
  await page.screenshot({ path: path.join(OUT_DIR, `f2-${name}.png`), fullPage: false });
  console.log(`  ✓ ${name}.png`);
};

const login = async (page, email, password, role) => {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await sleep(500);
  await page.locator('select[name="role"]').selectOption(role);
  await sleep(200);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForLoadState('networkidle');
  await sleep(2500);
};

const freshContext = async (browser) => {
  const ctx = await browser.newContext({ viewport: VIEWPORT, acceptDownloads: true });
  return { ctx, page: await ctx.newPage() };
};

(async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    // =========== TUTOR ============
    console.log('\n[1/3] Flujo del tutor: atender sesión con plan estructurado');
    {
      const { ctx, page } = await freshContext(browser);
      // Interceptar endpoints ajenos que dan 500 para que no rompan el render
      await page.route('**/api/ratings/**', (route) => {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ratings: [] }) });
      });
      await login(page, 'sofia.tutora@test.com', 'Passw0rd1', 'tutor');
      await page.goto(`${BASE_URL}/tutor/sesiones`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3500);
      await shot(page, 'tutor-01-sesiones-pendientes');

      const atender = page.locator('button:has-text("Marcar como Atendida")').first();
      try {
        await atender.waitFor({ timeout: 8000 });
        await atender.click();
        await sleep(1200);
        await shot(page, 'tutor-02-modal-atender-vacio');

        await page.locator('textarea').first().fill('Dificultades para aplicar la segunda ley de Newton en planos inclinados y para descomponer fuerzas en componentes vectoriales.');
        await sleep(300);

        await page.locator('button:has-text("+ Agregar recurso")').click();
        await sleep(500);
        const nombres = page.locator('input[type="text"]');
        await nombres.last().fill('Física Universitaria - Sears Zemansky, Cap. 5');
        const tipos = page.locator('select');
        await tipos.last().selectOption('Texto');
        const descs = page.locator('textarea');
        await descs.last().fill('Leer secciones 5.1 a 5.3 y resolver ejercicios impares 1-15');

        await page.locator('button:has-text("+ Agregar recurso")').click();
        await sleep(500);
        await page.locator('input[type="text"]').last().fill('Khan Academy - Planos inclinados');
        await page.locator('select').last().selectOption('Video');
        await page.locator('textarea').last().fill('Ver los 3 videos de la serie y hacer los ejercicios interactivos');
        await sleep(600);
        await shot(page, 'tutor-03-modal-con-recursos');

        await page.locator('button:has-text("Guardar y Atender")').click();
        await sleep(2500);
        await shot(page, 'tutor-04-historial-con-plan');
      } catch (e) {
        console.log(`  ⚠ Tutor: ${e.message.slice(0, 100)}`);
      }
      await ctx.close();
    }

    // =========== ESTUDIANTE con planes ============
    console.log('\n[2/3] Flujo del estudiante CON planes (Luis)');
    {
      const { ctx, page } = await freshContext(browser);
      await login(page, 'luis.estudiante@test.com', 'Passw0rd1', 'student');
      await page.goto(`${BASE_URL}/dashboard/student`);
      await page.waitForLoadState('networkidle');
      await sleep(2000);
      await shot(page, 'estudiante-01-dashboard-con-mi-plan');

      await page.locator('a:has-text("Mi Plan")').click();
      await page.waitForLoadState('networkidle');
      await sleep(2500);
      await shot(page, 'estudiante-02-mi-plan-activo');

      await page.evaluate(() => window.scrollTo(0, 400));
      await sleep(500);
      await shot(page, 'estudiante-03-tabla-recursos-y-boton-pdf');

      await ctx.close();
    }

    // =========== ESTUDIANTE empty state ============
    console.log('\n[3/3] Flujo del estudiante SIN planes (Ana - empty state)');
    {
      const { ctx, page } = await freshContext(browser);
      await login(page, 'ana.estudiante@test.com', 'Passw0rd1', 'student');
      await page.goto(`${BASE_URL}/mi-plan`);
      await page.waitForLoadState('networkidle');
      await sleep(2500);
      await shot(page, 'estudiante-04-empty-state');
      await ctx.close();
    }

    console.log('\n✅ Capturas generadas en docs/Manuales/imgs/ (prefijo f2-)');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();

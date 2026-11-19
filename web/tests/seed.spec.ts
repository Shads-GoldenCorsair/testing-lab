import { test, loginAsDemo } from './fixtures';

// Ficheiro "seed" usado pelos agentes de IA do Playwright (planner/generator/healer).
// Dá-lhes o contexto inicial: a app aberta e o utilizador de demonstração com sessão iniciada.
test.describe('Seed', () => {
  test('seed', async ({ page }) => {
    await loginAsDemo(page);
  });
});

import { test, expect, loginAsDemo } from './fixtures';

// Regressão visual: compara capturas com as linhas de base em tests/visual.spec.ts-snapshots/.
// As linhas de base são geradas no CI (workflow "web: actualizar linhas de base visuais"),
// porque a renderização varia entre sistemas e versões de browser.
test.describe('visual', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'só no projecto desktop');
  });

  test('login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page).toHaveScreenshot('login.png', { maxDiffPixelRatio: 0.01 });
  });

  test('carteira', async ({ page }) => {
    await loginAsDemo(page);
    await expect(page.getByTestId('balance')).toBeVisible();
    await expect(page).toHaveScreenshot('carteira.png', { maxDiffPixelRatio: 0.01 });
  });
});

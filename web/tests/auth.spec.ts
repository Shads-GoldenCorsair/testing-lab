import { test, expect, loginAsDemo } from './fixtures';

test.describe('Autenticação', () => {
  test('login com credenciais válidas mostra a carteira', async ({ page }) => {
    await loginAsDemo(page);
    await expect(page.getByTestId('balance')).toContainText(/5\s?000,00 MZN/);
  });

  test('login com palavra-passe errada mostra erro e não entra', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Utilizador').fill('demo');
    await page.getByLabel('Palavra-passe').fill('errada');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('alert')).toHaveText('Credenciais inválidas');
    await expect(page.getByRole('heading', { name: 'A minha carteira' })).toBeHidden();
  });

  test('sair volta ao ecrã de login', async ({ page }) => {
    await loginAsDemo(page);
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });
});

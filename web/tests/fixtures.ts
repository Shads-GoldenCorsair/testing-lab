import { test as base, expect, type Page } from '@playwright/test';

export async function loginAsDemo(page: Page) {
  await page.goto('/');
  await page.getByLabel('Utilizador').fill('demo');
  await page.getByLabel('Palavra-passe').fill('demo123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { name: 'A minha carteira' })).toBeVisible();
}

// Repõe o estado do servidor antes de cada teste (isolamento).
export const test = base.extend<{ resetState: void }>({
  resetState: [
    async ({ request }, use) => {
      await request.post('/api/test/reset');
      await use();
    },
    { auto: true },
  ],
});

export { expect };

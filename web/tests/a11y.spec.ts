import AxeBuilder from '@axe-core/playwright';
import { test, expect, loginAsDemo } from './fixtures';

// Acessibilidade automática (axe-core): apanha problemas de contraste, etiquetas,
// papéis ARIA, etc. Não substitui uma revisão manual com leitor de ecrã.
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test('página de login sem violações WCAG A/AA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test('carteira sem violações WCAG A/AA', async ({ page }) => {
  await loginAsDemo(page);
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

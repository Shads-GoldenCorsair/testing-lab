import { test, expect, loginAsDemo } from './fixtures';

test.describe('Transferências', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('transferência válida reduz o saldo e aparece na lista', async ({ page }) => {
    await page.getByLabel('Destinatário').fill('Ana Macuácua');
    await page.getByLabel('Valor (MZN)').fill('750');
    await page.getByRole('button', { name: 'Enviar' }).click();

    await expect(page.getByRole('status')).toHaveText('Transferência concluída');
    await expect(page.getByTestId('balance')).toContainText(/4\s?250,00 MZN/);
    await expect(page.getByRole('list', { name: 'Transacções' }).getByRole('listitem').first()).toContainText(
      'Ana Macuácua',
    );
  });

  test('saldo insuficiente é rejeitado e o saldo não muda', async ({ page }) => {
    await page.getByLabel('Destinatário').fill('Ana Macuácua');
    await page.getByLabel('Valor (MZN)').fill('999999');
    await page.getByRole('button', { name: 'Enviar' }).click();

    await expect(page.getByRole('status')).toHaveText('Saldo insuficiente');
    await expect(page.getByTestId('balance')).toContainText(/5\s?000,00 MZN/);
  });

  test('campos vazios mostram validação', async ({ page }) => {
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(page.getByRole('status')).toContainText('obrigatórios');
  });

  test('falha da API é tratada sem rebentar a página (mock de rede)', async ({ page }) => {
    await page.route('**/api/transfer', (route) =>
      route.fulfill({ status: 500, json: { message: 'Serviço indisponível' } }),
    );
    await page.getByLabel('Destinatário').fill('Ana');
    await page.getByLabel('Valor (MZN)').fill('10');
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(page.getByRole('status')).toHaveText('Serviço indisponível');
  });
});

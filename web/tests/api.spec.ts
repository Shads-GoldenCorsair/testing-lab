import { test, expect } from './fixtures';

// Testes de API com o cliente HTTP do Playwright (sem browser).
test.describe('API', () => {
  test('rejeita pedidos sem autenticação', async ({ request }) => {
    const res = await request.get('/api/wallet');
    expect(res.status()).toBe(401);
  });

  test('login devolve token e a transferência actualiza o saldo', async ({ request }) => {
    const login = await request.post('/api/login', { data: { username: 'demo', password: 'demo123' } });
    expect(login.ok()).toBeTruthy();
    const { token } = await login.json();
    const headers = { Authorization: `Bearer ${token}` };

    const transfer = await request.post('/api/transfer', { headers, data: { to: 'Loja', amount: 100 } });
    expect(transfer.status()).toBe(201);

    const wallet = await request.get('/api/wallet', { headers });
    expect(await wallet.json()).toEqual({ balance: 4900 });
  });

  test('valor negativo devolve 422', async ({ request }) => {
    const res = await request.post('/api/transfer', {
      headers: { Authorization: 'Bearer demo-token' },
      data: { to: 'Loja', amount: -5 },
    });
    expect(res.status()).toBe(422);
  });
});

// Servidor de exemplo: serve o frontend estático e uma API em memória.
// Serve para os testes E2E correrem sem depender do backend Laravel.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC_DIR = join(fileURLToPath(new URL('.', import.meta.url)), 'public');
const TOKEN = 'demo-token';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const initialState = () => ({
  balance: 5000,
  transactions: [{ id: 1, to: 'Loja Central', amount: 250, date: '2026-11-01' }],
});
let state = initialState();

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

const readJson = (req) =>
  new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); } catch { resolve({}); }
    });
  });

const authorized = (req) => req.headers.authorization === `Bearer ${TOKEN}`;

async function api(req, res, path) {
  if (path === '/api/test/reset' && req.method === 'POST') {
    state = initialState();
    return send(res, 200, { ok: true });
  }
  if (path === '/api/login' && req.method === 'POST') {
    const { username, password } = await readJson(req);
    if (username === 'demo' && password === 'demo123') return send(res, 200, { token: TOKEN });
    return send(res, 401, { message: 'Credenciais inválidas' });
  }
  if (!authorized(req)) return send(res, 401, { message: 'Não autenticado' });

  if (path === '/api/wallet' && req.method === 'GET') return send(res, 200, { balance: state.balance });
  if (path === '/api/transactions' && req.method === 'GET') return send(res, 200, state.transactions);
  if (path === '/api/transfer' && req.method === 'POST') {
    const { to, amount } = await readJson(req);
    const value = Number(amount);
    if (!to || !Number.isFinite(value) || value <= 0) {
      return send(res, 422, { message: 'Destinatário e valor positivo são obrigatórios' });
    }
    if (value > state.balance) return send(res, 422, { message: 'Saldo insuficiente' });
    state.balance -= value;
    const tx = { id: state.transactions.length + 1, to, amount: value, date: '2026-11-19' };
    state.transactions.unshift(tx);
    return send(res, 201, { balance: state.balance, transaction: tx });
  }
  return send(res, 404, { message: 'Não encontrado' });
}

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path.startsWith('/api/')) return api(req, res, path);
  const file = path === '/' ? '/index.html' : path;
  const safe = normalize(file).replace(/^(\.\.[/\\])+/, '');
  try {
    const data = await readFile(join(PUBLIC_DIR, safe));
    res.writeHead(200, { 'Content-Type': MIME[extname(safe)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));

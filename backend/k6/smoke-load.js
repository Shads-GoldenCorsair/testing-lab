// Teste de carga ligeiro com k6 contra a API Laravel.
// Corre: k6 run k6/smoke-load.js   (BASE_URL opcional)
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://127.0.0.1:8000';
const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 5 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // menos de 1% de erros
    http_req_duration: ['p(95)<800'], // 95% dos pedidos abaixo de 800 ms
    checks: ['rate>0.99'],
  },
};

export function setup() {
  const res = http.post(
    `${BASE}/api/login`,
    JSON.stringify({ email: 'demo@example.com', password: 'demo123' }),
    { headers: JSON_HEADERS },
  );
  check(res, { 'login devolve 200': (r) => r.status === 200 });
  return { token: res.json('token') };
}

export default function (data) {
  const params = { headers: { ...JSON_HEADERS, Authorization: `Bearer ${data.token}` } };

  const wallet = http.get(`${BASE}/api/wallet`, params);
  check(wallet, {
    'wallet devolve 200': (r) => r.status === 200,
    'wallet tem saldo': (r) => r.json('balance') !== undefined,
  });

  const txs = http.get(`${BASE}/api/transactions`, params);
  check(txs, { 'transactions devolve 200': (r) => r.status === 200 });

  sleep(1);
}

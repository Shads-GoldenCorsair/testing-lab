const $ = (id) => document.getElementById(id);
const fmt = (n) => `${Number(n).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MZN`;
let token = sessionStorage.getItem('token');

async function call(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message ?? 'Erro inesperado');
  return body;
}

function show(view) {
  $('login-view').hidden = view !== 'login';
  $('wallet-view').hidden = view !== 'wallet';
}

async function loadWallet() {
  const [wallet, txs] = await Promise.all([call('/api/wallet'), call('/api/transactions')]);
  $('balance').textContent = fmt(wallet.balance);
  $('transactions').replaceChildren(
    ...txs.map((t) => {
      const li = document.createElement('li');
      li.textContent = `${t.to}: ${fmt(t.amount)} (${t.date})`;
      return li;
    }),
  );
  show('wallet');
}

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('login-error').hidden = true;
  try {
    const { token: t } = await call('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username: $('username').value, password: $('password').value }),
    });
    token = t;
    sessionStorage.setItem('token', t);
    await loadWallet();
  } catch (err) {
    $('login-error').textContent = err.message;
    $('login-error').hidden = false;
  }
});

$('transfer-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('transfer-message');
  try {
    await call('/api/transfer', {
      method: 'POST',
      body: JSON.stringify({ to: $('to').value.trim(), amount: $('amount').value }),
    });
    msg.textContent = 'Transferência concluída';
    $('to').value = '';
    $('amount').value = '';
    await loadWallet();
  } catch (err) {
    msg.textContent = err.message;
  }
});

$('logout').addEventListener('click', () => {
  token = null;
  sessionStorage.removeItem('token');
  show('login');
});

token ? loadWallet().catch(() => show('login')) : show('login');

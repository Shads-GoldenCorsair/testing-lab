import 'package:flutter/material.dart';

import 'wallet_repository.dart';

class WalletPage extends StatefulWidget {
  const WalletPage({super.key, required this.repository});

  final WalletRepository repository;

  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  final _to = TextEditingController();
  final _amount = TextEditingController();
  String _message = '';

  @override
  void dispose() {
    _to.dispose();
    _amount.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final to = _to.text.trim();
    final amount = double.tryParse(_amount.text.replaceAll(',', '.'));
    if (to.isEmpty || amount == null || amount <= 0) {
      setState(() => _message = 'Destinatário e valor positivo são obrigatórios');
      return;
    }
    try {
      await widget.repository.transfer(to, amount);
      _to.clear();
      _amount.clear();
      setState(() => _message = 'Transferência concluída');
    } on InsufficientFundsException {
      setState(() => _message = 'Saldo insuficiente');
    }
  }

  @override
  Widget build(BuildContext context) {
    final repo = widget.repository;
    return Scaffold(
      appBar: AppBar(title: const Text('A minha carteira')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Saldo: ${repo.balance.toStringAsFixed(2)} MZN',
            key: const Key('balance'),
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          TextField(
            key: const Key('to'),
            controller: _to,
            decoration: const InputDecoration(labelText: 'Destinatário'),
          ),
          const SizedBox(height: 12),
          TextField(
            key: const Key('amount'),
            controller: _amount,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Valor (MZN)'),
          ),
          const SizedBox(height: 16),
          FilledButton(onPressed: _send, child: const Text('Enviar')),
          const SizedBox(height: 8),
          Text(_message, key: const Key('transfer-message')),
          const SizedBox(height: 16),
          const Text('Transacções'),
          for (final t in repo.transactions)
            ListTile(
              dense: true,
              title: Text(t.to),
              trailing: Text('${t.amount.toStringAsFixed(2)} MZN'),
            ),
        ],
      ),
    );
  }
}

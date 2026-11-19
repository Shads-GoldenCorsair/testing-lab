import 'package:flutter/material.dart';

import 'wallet_page.dart';
import 'wallet_repository.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key, required this.repository});

  final WalletRepository repository;

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _username = TextEditingController();
  final _password = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _username.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final ok = await widget.repository.login(_username.text, _password.text);
    if (!mounted) return;
    if (ok) {
      await Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(
          builder: (_) => WalletPage(repository: widget.repository),
        ),
      );
    } else {
      setState(() => _error = 'Credenciais inválidas');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Carteira Demo')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              key: const Key('username'),
              controller: _username,
              decoration: const InputDecoration(labelText: 'Utilizador'),
            ),
            const SizedBox(height: 12),
            TextField(
              key: const Key('password'),
              controller: _password,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Palavra-passe'),
            ),
            const SizedBox(height: 16),
            FilledButton(onPressed: _submit, child: const Text('Entrar')),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Text(
                  _error!,
                  key: const Key('login-error'),
                  style: const TextStyle(color: Colors.red),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

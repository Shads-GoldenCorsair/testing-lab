import 'package:flutter/material.dart';

import 'login_page.dart';
import 'wallet_repository.dart';

class LabApp extends StatelessWidget {
  const LabApp({super.key, required this.repository});

  final WalletRepository repository;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Carteira Demo',
      theme: ThemeData(colorSchemeSeed: Colors.blue, useMaterial3: true),
      home: LoginPage(repository: repository),
    );
  }
}

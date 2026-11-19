import 'package:flutter/material.dart';

import 'app.dart';
import 'wallet_repository.dart';

void main() {
  runApp(LabApp(repository: InMemoryWalletRepository()));
}

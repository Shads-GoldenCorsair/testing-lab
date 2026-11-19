class WalletTransaction {
  const WalletTransaction({required this.to, required this.amount});

  final String to;
  final double amount;
}

class InsufficientFundsException implements Exception {
  const InsufficientFundsException();
}

/// Contrato do repositório. Os testes de widget usam a versão em memória;
/// numa app real esta interface falaria com a API Laravel.
abstract class WalletRepository {
  Future<bool> login(String username, String password);
  double get balance;
  List<WalletTransaction> get transactions;
  Future<void> transfer(String to, double amount);
}

class InMemoryWalletRepository implements WalletRepository {
  InMemoryWalletRepository({double initialBalance = 5000})
      : _balance = initialBalance;

  double _balance;
  final List<WalletTransaction> _transactions = [
    const WalletTransaction(to: 'Loja Central', amount: 250),
  ];

  @override
  Future<bool> login(String username, String password) async =>
      username == 'demo' && password == 'demo123';

  @override
  double get balance => _balance;

  @override
  List<WalletTransaction> get transactions => List.unmodifiable(_transactions);

  @override
  Future<void> transfer(String to, double amount) async {
    if (amount > _balance) throw const InsufficientFundsException();
    _balance -= amount;
    _transactions.insert(0, WalletTransaction(to: to, amount: amount));
  }
}

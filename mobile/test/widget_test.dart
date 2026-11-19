import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:testing_lab_app/app.dart';
import 'package:testing_lab_app/wallet_repository.dart';

Future<void> _login(WidgetTester tester) async {
  await tester.enterText(find.byKey(const Key('username')), 'demo');
  await tester.enterText(find.byKey(const Key('password')), 'demo123');
  await tester.tap(find.text('Entrar'));
  await tester.pumpAndSettle();
}

void main() {
  late WalletRepository repository;

  setUp(() => repository = InMemoryWalletRepository());

  testWidgets('login inválido mostra erro e fica no ecrã de login',
      (tester) async {
    await tester.pumpWidget(LabApp(repository: repository));

    await tester.enterText(find.byKey(const Key('username')), 'demo');
    await tester.enterText(find.byKey(const Key('password')), 'errada');
    await tester.tap(find.text('Entrar'));
    await tester.pumpAndSettle();

    expect(find.text('Credenciais inválidas'), findsOneWidget);
    expect(find.text('A minha carteira'), findsNothing);
  });

  testWidgets('login válido mostra a carteira com o saldo', (tester) async {
    await tester.pumpWidget(LabApp(repository: repository));
    await _login(tester);

    expect(find.text('A minha carteira'), findsOneWidget);
    expect(find.text('Saldo: 5000.00 MZN'), findsOneWidget);
  });

  testWidgets('transferência válida reduz o saldo', (tester) async {
    await tester.pumpWidget(LabApp(repository: repository));
    await _login(tester);

    await tester.enterText(find.byKey(const Key('to')), 'Ana Macuácua');
    await tester.enterText(find.byKey(const Key('amount')), '750');
    await tester.tap(find.text('Enviar'));
    await tester.pumpAndSettle();

    expect(find.text('Transferência concluída'), findsOneWidget);
    expect(find.text('Saldo: 4250.00 MZN'), findsOneWidget);
    expect(find.text('Ana Macuácua'), findsOneWidget);
  });

  testWidgets('saldo insuficiente é rejeitado', (tester) async {
    await tester.pumpWidget(LabApp(repository: repository));
    await _login(tester);

    await tester.enterText(find.byKey(const Key('to')), 'Ana');
    await tester.enterText(find.byKey(const Key('amount')), '999999');
    await tester.tap(find.text('Enviar'));
    await tester.pumpAndSettle();

    expect(find.text('Saldo insuficiente'), findsOneWidget);
    expect(find.text('Saldo: 5000.00 MZN'), findsOneWidget);
  });

  testWidgets('campos vazios mostram validação', (tester) async {
    await tester.pumpWidget(LabApp(repository: repository));
    await _login(tester);

    await tester.tap(find.text('Enviar'));
    await tester.pumpAndSettle();

    expect(find.textContaining('obrigatórios'), findsOneWidget);
  });
}

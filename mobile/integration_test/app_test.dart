import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:testing_lab_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('fluxo completo: login e transferência no dispositivo',
      (tester) async {
    app.main();
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('username')), 'demo');
    await tester.enterText(find.byKey(const Key('password')), 'demo123');
    await tester.tap(find.text('Entrar'));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('to')), 'Ana');
    await tester.enterText(find.byKey(const Key('amount')), '100');
    await tester.tap(find.text('Enviar'));
    await tester.pumpAndSettle();

    expect(find.text('Saldo: 4900.00 MZN'), findsOneWidget);
  });
}

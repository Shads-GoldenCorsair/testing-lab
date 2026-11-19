# 05. Guias de integração

Cada secção aponta para ficheiros reais do repositório. Onde algo ainda não foi executado,
está marcado como **não verificado**.

## Playwright (web) — `web/`

1. `cd web && npm ci && npx playwright install chromium`
2. `npm test` corre a suite (UI, API e mock de rede). `npm run test:ui` abre o modo interactivo.
3. Sem poder descarregar browsers, usa o Chrome instalado: `PW_CHANNEL=chrome npm test`.
4. Falhas: o relatório HTML fica em `playwright-report/` (`npm run report`), com screenshot e trace.

Padrões usados (ver `tests/`):

| Padrão | Ficheiro | Para quê |
| --- | --- | --- |
| Localizadores por papel e etiqueta (`getByRole`, `getByLabel`) | `auth.spec.ts` | Testes que resistem a mudanças de CSS |
| Fixture com reposição de estado automática | `fixtures.ts` | Isolamento entre testes |
| `page.route` para simular uma falha da API | `transfer.spec.ts` | Testar erros difíceis de provocar |
| Cliente `request` sem browser | `api.spec.ts` | Testes de API rápidos |
| Projecto "mobile-chrome" (Pixel 7) | `playwright.config.ts` | Mesmo teste em ecrã de telemóvel |

## Agentes de IA do Playwright — `web/.claude/agents/`

Ver [04-ia-nos-testes.md](04-ia-nos-testes.md). Para voltar a gerar os agentes:
`npx playwright init-agents --loop=claude` (também existem `vscode`, `codex`, `copilot`, `opencode`).

## Pest (Laravel) — `backend/`

1. Requisitos: PHP 8.3+ e Composer.
2. `./backend/setup.sh` gera `backend/app/` (Laravel + Sanctum + Pest) e aplica `backend/overlay/`.
3. `cd backend/app && ./vendor/bin/pest`.

Padrões usados (ver `backend/overlay/tests/`):

| Padrão | Ficheiro |
| --- | --- |
| `RefreshDatabase` + `postJson` + `assertJsonStructure` | `Feature/AuthTest.php` |
| `Sanctum::actingAs` para simular utilizador autenticado | `Feature/WalletTest.php` |
| Datasets (`->with([...])`) para vários pedidos inválidos | `Feature/TransferTest.php` |
| Teste de arquitectura (`arch(...)`) | `Unit/ExampleArchTest.php` |

## k6 (carga) — `backend/k6/smoke-load.js`

1. Instala o k6 e arranca a API: `cd backend/app && php artisan serve`.
2. `k6 run backend/k6/smoke-load.js`.
3. O teste falha (código de saída diferente de zero) se mais de 1% dos pedidos falhar ou
   se o p95 passar de 800 ms.

## Flutter — `mobile/`

1. Requisito: Flutter SDK. Gera as pastas de plataforma uma vez:
   `cd mobile && flutter create --org com.testinglab --project-name testing_lab_app --platforms=android .`
2. `flutter pub get`
3. Unit e widget: `flutter test`
4. Integração num emulador ou dispositivo ligado: `flutter test integration_test`

### Maestro — `mobile/.maestro/login_and_transfer.yaml` (não verificado)

Com a app instalada num emulador: `maestro test .maestro/login_and_transfer.yaml`.
Os `tapOn` usam o texto visível dos campos.

### Patrol (não verificado, exemplo ilustrativo)

Patrol precisa de configuração nativa (Android e iOS) e da CLI `patrol_cli`; segue o
guia oficial para o preparar. Um teste típico, quando precisa de conceder uma permissão
do sistema, tem esta forma:

```dart
patrolTest('pede permissão de notificações', ($) async {
  await $.pumpWidgetAndSettle(const LabApp(/* ... */));
  if (await $.native.isPermissionDialogVisible()) {
    await $.native.grantPermissionWhenInUse();
  }
});
```

Os nomes exactos da API podem variar com a versão do Patrol: confirma na documentação.

## TestSprite (opcional) — não incluído no repositório

Não o ligámos ao laboratório. Para o experimentar, segue a documentação do fornecedor
(`docs.testsprite.com`) e aponta-o a um ambiente de testes. Confirma primeiro, com a app
real, o que ele consegue fazer em Flutter.

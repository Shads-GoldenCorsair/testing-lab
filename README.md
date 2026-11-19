# testing-lab

Laboratório para comparar e experimentar ferramentas de testes automatizados em cada camada
(web, backend, app móvel), com IA onde faz sentido. Três projectos pequenos com o mesmo domínio
(login, saldo, transferência), cada um com a ferramenta recomendada ligada ao CI.

| Projecto | Ferramentas | Estado |
| --- | --- | --- |
| [`web/`](web) | Playwright (UI, API, mock de rede), agentes de IA do Playwright | Verificado no CI: 22 execuções a passar (11 testes, desktop e telemóvel). Também falha quando se estraga a regra de saldo |
| [`backend/`](backend) | Laravel + Sanctum, Pest, k6, OpenAPI (Scramble) + Schemathesis | Verificado no CI: 14 testes Pest (+1 de regressão); k6 com 0% de falhas em 281 pedidos e p95 de 12 ms; contrato OpenAPI gerado do código ([`openapi.json`](backend/openapi.json)) e fuzzing Schemathesis a passar (fases examples + fuzzing). O Schemathesis encontrou 5 incoerências reais, todas corrigidas (ver abaixo). A falha do snapshot em caso de deriva está no CI mas ainda não foi provocada de propósito |
| [`mobile/`](mobile) | Flutter, flutter_test, integration_test, Maestro | Verificado no CI: 5 testes de widget; integração `integration_test` no emulador Android e no simulador iOS (macOS); fluxo Maestro completo (login + transferência) no emulador Android — os 3 últimos correm à mão (workflow_dispatch com `run_integration`). **Não verificados:** Maestro em iOS e Patrol |

Nota: o `flutter analyze` mostra 6 avisos de depreciação (o Flutter mais recente quer
`material_ui` no lugar de `flutter/material.dart`). O CI usa `--no-fatal-infos` e a migração
fica como tarefa.

A documentação está em [`docs/`](docs): comparação, fluxograma de decisão, casos de uso,
IA nos testes, guias passo a passo e fontes.

## Começar

```bash
cd web && npm ci && npx playwright install chromium && npm test
```

Os outros projectos têm os passos em [docs/05-guias-de-integracao.md](docs/05-guias-de-integracao.md).

## O que o Schemathesis encontrou (e foi corrigido)

1. Pedido sem `Accept: application/json` a uma rota protegida devolvia **500** (`Route [login] not defined`) em vez de 401.
2. `amount: 0.0` era válido no contrato mas rejeitado pelo código (contrato passou a ter `minimum`).
3. O 422 de "Saldo insuficiente" não tinha o campo `errors` que o contrato documenta para 422.
4. `/transactions` omitia `user_id`/`updated_at`, que o contrato declara obrigatórios.
5. `amount` das transacções saía como string (`"0.01"`) enquanto `/wallet` devolvia número.

Excluído de propósito: a fase de cobertura (o servidor embutido do PHP responde 501 a métodos desconhecidos, o que não é da app) e o check "dados válidos aceites" (uma regra de negócio, como saldo insuficiente, pode legitimamente rejeitar um pedido válido pelo esquema).

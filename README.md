# testing-lab

Laboratório para comparar e experimentar ferramentas de testes automatizados em cada camada
(web, backend, app móvel), com IA onde faz sentido. Três projectos pequenos com o mesmo domínio
(login, saldo, transferência), cada um com a ferramenta recomendada ligada ao CI.

| Projecto | Ferramentas | Estado |
| --- | --- | --- |
| [`web/`](web) | Playwright (UI, API, mock de rede), agentes de IA do Playwright | Verificado no CI: 22 execuções a passar (11 testes, desktop e telemóvel). Também falha quando se estraga a regra de saldo |
| [`backend/`](backend) | Laravel + Sanctum, Pest, k6 | Verificado no CI: 14 testes Pest a passar; k6 com 0% de falhas em 281 pedidos e p95 de 12 ms |
| [`mobile/`](mobile) | Flutter, flutter_test, integration_test, Maestro | Verificado no CI: 5 testes de widget a passar. **Não verificados:** integração em emulador (manual no CI), Maestro e Patrol |

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

# testing-lab

Laboratório para comparar e experimentar ferramentas de testes automatizados em cada camada
(web, backend, app móvel), com IA onde faz sentido. Três projectos pequenos com o mesmo domínio
(login, saldo, transferência), cada um com a ferramenta recomendada ligada ao CI.

| Projecto | Ferramentas | Estado |
| --- | --- | --- |
| [`web/`](web) | Playwright (UI, API, mock de rede), agentes de IA do Playwright | Verificado localmente: suite a passar; falha quando se estraga a regra de saldo |
| [`backend/`](backend) | Laravel + Sanctum, Pest, k6 | Código escrito, sintaxe PHP validada. **Pest e k6 ainda não correram** (dependem do CI) |
| [`mobile/`](mobile) | Flutter, flutter_test, integration_test, Maestro | Código escrito. **Ainda não compilado nem testado** (depende do CI) |

A documentação está em [`docs/`](docs): comparação, fluxograma de decisão, casos de uso,
IA nos testes, guias passo a passo e fontes.

## Começar

```bash
cd web && npm ci && npx playwright install chromium && npm test
```

Os outros projectos têm os passos em [docs/05-guias-de-integracao.md](docs/05-guias-de-integracao.md).

<?php

// Os testes de Feature usam o TestCase do Laravel (HTTP, base de dados, autenticação).
// Os de Unit ficam sem ele, mais rápidos.
pest()->extend(Tests\TestCase::class)->in('Feature');

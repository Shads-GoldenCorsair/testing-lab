<?php

// Teste de arquitectura do Pest: garante regras de estrutura do código.
arch('os modelos não dependem de controladores')
    ->expect('App\Models')
    ->not->toUse('App\Http\Controllers');

<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('exige autenticação para ver a carteira', function () {
    $this->getJson('/api/wallet')->assertUnauthorized();
});

it('mostra o saldo do utilizador autenticado', function () {
    Sanctum::actingAs(User::factory()->create(['balance' => 1234.5]));

    $this->getJson('/api/wallet')->assertOk()->assertExactJson(['balance' => 1234.5]);
});

it('só lista as transacções do próprio utilizador', function () {
    $ana = User::factory()->create(['balance' => 100]);
    $rui = User::factory()->create(['balance' => 100]);
    $ana->transactions()->create(['to' => 'Loja', 'amount' => 10]);
    $rui->transactions()->create(['to' => 'Padaria', 'amount' => 20]);

    Sanctum::actingAs($ana);

    $this->getJson('/api/transactions')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.to', 'Loja');
});

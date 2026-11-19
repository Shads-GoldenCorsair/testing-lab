<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('devolve um token com credenciais válidas', function () {
    User::factory()->create(['email' => 'ana@example.com', 'password' => 'segredo123']);

    $this->postJson('/api/login', ['email' => 'ana@example.com', 'password' => 'segredo123'])
        ->assertOk()
        ->assertJsonStructure(['token']);
});

it('rejeita palavra-passe errada com 401', function () {
    User::factory()->create(['email' => 'ana@example.com', 'password' => 'segredo123']);

    $this->postJson('/api/login', ['email' => 'ana@example.com', 'password' => 'errada'])
        ->assertUnauthorized()
        ->assertJson(['message' => 'Credenciais inválidas']);
});

it('valida o formato do pedido com 422', function () {
    $this->postJson('/api/login', ['email' => 'nao-e-email'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});

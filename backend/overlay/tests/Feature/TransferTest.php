<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create(['balance' => 5000]);
    Sanctum::actingAs($this->user);
});

it('transfere, reduz o saldo e regista a transacção', function () {
    $this->postJson('/api/transfer', ['to' => 'Ana Macuácua', 'amount' => 750])
        ->assertCreated()
        ->assertJsonPath('balance', 4250);

    expect((float) $this->user->fresh()->balance)->toBe(4250.0);
    $this->assertDatabaseHas('transactions', ['user_id' => $this->user->id, 'to' => 'Ana Macuácua']);
});

it('rejeita saldo insuficiente e não altera nada', function () {
    $this->postJson('/api/transfer', ['to' => 'Ana', 'amount' => 999999])
        ->assertUnprocessable()
        ->assertJson(['message' => 'Saldo insuficiente']);

    expect((float) $this->user->fresh()->balance)->toBe(5000.0);
    $this->assertDatabaseCount('transactions', 0);
});

it('rejeita pedidos inválidos', function (array $payload) {
    $this->postJson('/api/transfer', $payload)->assertUnprocessable();
})->with([
    'sem destinatário' => [['amount' => 10]],
    'sem valor' => [['to' => 'Ana']],
    'valor zero' => [['to' => 'Ana', 'amount' => 0]],
    'valor negativo' => [['to' => 'Ana', 'amount' => -5]],
    'valor não numérico' => [['to' => 'Ana', 'amount' => 'abc']],
]);

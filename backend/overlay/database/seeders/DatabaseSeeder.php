<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Utilizador de demonstração usado pelo k6 e pelos testes manuais.
        User::factory()->create([
            'name' => 'Demo',
            'email' => 'demo@example.com',
            'password' => 'demo123',
            'balance' => 5000,
        ]);
    }
}

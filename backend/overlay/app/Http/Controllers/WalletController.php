<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    public function wallet(Request $request): JsonResponse
    {
        return response()->json(['balance' => (float) $request->user()->balance]);
    }

    public function transactions(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->transactions()->latest('id')->get(['id', 'to', 'amount', 'created_at'])
        );
    }

    public function transfer(Request $request): JsonResponse
    {
        $data = $request->validate([
            'to' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'gt:0'],
        ]);

        return DB::transaction(function () use ($request, $data) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->first();

            if ((float) $data['amount'] > (float) $user->balance) {
                return response()->json(['message' => 'Saldo insuficiente'], 422);
            }

            $user->decrement('balance', $data['amount']);
            $transaction = $user->transactions()->create([
                'to' => $data['to'],
                'amount' => $data['amount'],
            ]);

            return response()->json([
                'balance' => (float) $user->fresh()->balance,
                'transaction' => $transaction,
            ], 201);
        });
    }
}

<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/wallet', [WalletController::class, 'wallet']);
    Route::get('/transactions', [WalletController::class, 'transactions']);
    Route::post('/transfer', [WalletController::class, 'transfer']);
});

<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Correcção apanhada pelo Schemathesis: pedidos sem 'Accept: application/json'
        // a /api/* devolviam 500 (redirect para route('login') inexistente) em vez de 401.
        // Sem rota 'login' (API pura): não redirecionar, deixar o handler responder 401 JSON.
        Authenticate::redirectUsing(fn () => null);
        $handler = $this->app->make(ExceptionHandler::class);
        if ($handler instanceof Handler) {
            $handler->shouldRenderJsonWhen(fn ($request, $e) => $request->is('api/*') || $request->expectsJson());
        }

        // Contrato OpenAPI gerado do código (Scramble). Declara a autenticação
        // por token Bearer (Sanctum) que as rotas protegidas exigem.
        Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
            $openApi->secure(SecurityScheme::http('bearer'));
        });
    }
}

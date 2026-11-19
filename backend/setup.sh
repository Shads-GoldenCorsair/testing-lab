#!/usr/bin/env bash
# Gera uma app Laravel nova em ./app e aplica por cima os ficheiros de ./overlay
# (controladores, modelos, migrações, rotas e testes Pest).
# Requisitos: PHP >= 8.3 e Composer.
set -euo pipefail
cd "$(dirname "$0")"

APP_DIR="${APP_DIR:-app}"

if [ ! -d "$APP_DIR" ]; then
  composer create-project laravel/laravel "$APP_DIR" --no-interaction --prefer-dist
fi

cd "$APP_DIR"

# Sanctum (tokens de API) + rotas de API
php artisan install:api --no-interaction

# Pest
composer config --no-plugins allow-plugins.pestphp/pest-plugin true
composer require pestphp/pest pestphp/pest-plugin-laravel --dev --with-all-dependencies --no-interaction
php artisan pest:install --no-interaction

# Ficheiros do laboratório por cima do esqueleto
cp -R ../overlay/. .
rm -f tests/Feature/ExampleTest.php tests/Unit/ExampleTest.php

php artisan migrate:fresh --seed --force --no-interaction
echo "Pronto. Corre os testes com: cd $APP_DIR && ./vendor/bin/pest"

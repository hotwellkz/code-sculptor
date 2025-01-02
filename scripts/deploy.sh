#!/bin/bash

# Проверяем наличие переменных окружения
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "Error: SUPABASE_ACCESS_TOKEN is not set"
    exit 1
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "Error: CLOUDFLARE_API_TOKEN is not set"
    exit 1
fi

# Устанавливаем зависимости
echo "Installing dependencies..."
npm ci

# Запускаем тесты
echo "Running tests..."
npm test

# Собираем проект
echo "Building the project..."
npm run build

# Деплоим Edge Functions в Supabase
echo "Deploying Edge Functions..."
supabase functions deploy generate-code --project-ref msqyjrpkylernifouxct

# Деплоим фронтенд
echo "Deploying frontend..."
npm run deploy

echo "Deployment completed successfully!"
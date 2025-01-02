#!/bin/bash

# Проверяем наличие переменных окружения
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo "Error: NETLIFY_AUTH_TOKEN is not set"
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

# Деплоим на Netlify
echo "Deploying to Netlify..."
npx netlify-cli deploy --prod --dir=dist

echo "Deployment completed successfully!"
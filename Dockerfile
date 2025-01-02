FROM denoland/deno:latest

WORKDIR /app

# Копируем файлы Edge Functions
COPY supabase/functions ./functions

# Копируем конфигурационные файлы
COPY supabase/config.toml ./config.toml

# Устанавливаем переменные окружения
ENV DENO_DIR=/app/.deno
ENV PATH="/app/.deno/bin:$PATH"

# Открываем порт для Edge Functions
EXPOSE 8000

# Запускаем Edge Functions
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "functions/generate-code/index.ts"]
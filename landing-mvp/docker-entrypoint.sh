#!/bin/sh
set -e

echo "==> Применяю миграции базы данных..."
./node_modules/.bin/prisma migrate deploy

echo "==> Миграции применены. Запускаю сервер..."
exec "$@"

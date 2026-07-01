# Landing MVP — продающий лендинг с админ-панелью

Стек: Next.js 15 (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL + JWT + Cloudinary.

## Дизайн

Визуальный слой обновлён до премиум-стиля: Inter + Sora, индиго/violet-палитра, мягкие тени и
скругления, собственный SVG-логотип (`src/components/Logo.tsx`), иконки — lucide-react.
Всё завязано на реальные данные из БД:

- Hero показывает живые цифры — количество товаров, число заявок за сегодня и средний рейтинг
  (`src/app/page.tsx` → `getHeroStats`).
- Каталог получил фильтр по категориям на основе ранее не используемого `/api/categories`.
- Админка (товары) — выбор категории при создании/редактировании товара.

Логика и API-роуты не менялись — редизайн затронул только компоненты представления.


## Структура проекта

```
landing-mvp/
├── prisma/
│   ├── schema.prisma      # модели: User, Category, Product, OrderRequest, Review, SiteSettings
│   └── seed.ts            # создаёт админа и базовый контент
├── src/
│   ├── app/
│   │   ├── page.tsx               # лендинг
│   │   ├── layout.tsx             # SEO metadata, OpenGraph
│   │   ├── sitemap.ts / robots.ts
│   │   ├── admin/                 # админ-панель (защищена middleware)
│   │   │   ├── login/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── reviews/
│   │   │   └── settings/
│   │   └── api/                   # REST API (products, orders, reviews, settings, categories, auth, upload)
│   ├── components/                # Hero, Advantages, Catalog, Reviews, FAQ, Contacts, OrderForm...
│   ├── lib/                       # prisma, auth (JWT), cloudinary, validation (zod), rate-limit, utils
│   └── middleware.ts              # защита /admin и мутирующих API-запросов
├── Dockerfile
├── docker-compose.yml
├── railway.json
└── .env.example
```

## 1. Локальный запуск (без Docker)

Требования: Node.js 20+, PostgreSQL 16+ (локально или в контейнере).

```bash
# 1. Установить зависимости
npm install

# 2. Скопировать .env
cp .env.example .env
# отредактировать DATABASE_URL, JWT_SECRET, данные Cloudinary

# 3. Применить миграции и создать таблицы
npx prisma migrate dev --name init

# 4. Засеять начальные данные (админ + пример товара)
npm run prisma:seed

# 5. Запустить dev-сервер
npm run dev
```

Сайт: http://localhost:3000
Админ-панель: http://localhost:3000/admin/login

Логин по умолчанию берётся из `.env` (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`), по умолчанию:
`admin@example.com` / `ChangeMe123!` — **обязательно смените после первого входа**.

## 2. Запуск через Docker Compose (локально, с БД в контейнере)

```bash
docker compose up --build
```

Поднимет PostgreSQL и приложение. После первого старта выполните миграции и seed внутри контейнера:

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run prisma:seed
```

## 3. Деплой на Railway

### Вариант А — через Dockerfile (рекомендуется)

1. Создайте новый проект на [railway.app](https://railway.app), подключите этот репозиторий (GitHub).
2. Railway автоматически найдёт `railway.json` и соберёт проект через `Dockerfile`.
3. Добавьте плагин **PostgreSQL** (New → Database → PostgreSQL) — Railway создаст переменную `DATABASE_URL` автоматически и подставит её в сервис приложения (Variable Reference).
4. В настройках сервиса приложения добавьте переменные окружения:
   - `JWT_SECRET` — длинная случайная строка (32+ символов)
   - `JWT_EXPIRES_IN` = `7d`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_SITE_URL` — итоговый домен Railway (например `https://your-app.up.railway.app`)
   - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (для первого seed)
5. После первого деплоя откройте вкладку **Shell** сервиса и выполните:
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```
6. Зайдите на `https://ваш-домен/admin/login` и смените пароль администратора (через прямое обновление в БД или добавьте страницу смены пароля).

### Вариант B — без Docker (Nixpacks)

Если не хотите использовать Dockerfile — удалите `railway.json` (или измените `builder` на `NIXPACKS`), Railway соберёт проект автоматически по `package.json`. Убедитесь, что в `package.json` есть `postinstall: prisma generate` (уже добавлено) и `build` включает `prisma migrate deploy`.

## 4. Переменные окружения (обязательные)

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | строка подключения к PostgreSQL |
| `JWT_SECRET` | секрет для подписи токенов авторизации |
| `CLOUDINARY_*` | хранение изображений товаров |
| `NEXT_PUBLIC_SITE_URL` | используется в SEO (OpenGraph, sitemap) |

## 5. Безопасность (уже реализовано)

- JWT в httpOnly cookie, недоступен из JS
- Middleware защищает все `/admin/*` (кроме `/admin/login`) и мутирующие API-запросы
- Rate limiting на форме заявки, отзывов и логина (защита от брутфорса/спама)
- Валидация данных через Zod на каждом API-эндпоинте
- Пароли хранятся как bcrypt-хэши
- Защита от SQL-инъекций обеспечена Prisma ORM (параметризованные запросы)

## 6. Что стоит доработать перед реальным коммерческим запуском

- Добавить страницу смены пароля администратора в UI
- Настроить CSRF-токены для форм (сейчас базовая защита через SameSite=Lax cookie)
- Подключить реальный email/Telegram-бот для уведомлений о новых заявках
- Настроить CDN/кэширование для изображений и статики
- Добавить логирование (Sentry) и мониторинг аптайма

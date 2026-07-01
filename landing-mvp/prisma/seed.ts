import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Админ по умолчанию
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashed,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  // Категория
  const category = await prisma.category.upsert({
    where: { slug: "main" },
    update: {},
    create: { name: "Основные товары", slug: "main" },
  });

  // Пример товара
  const existing = await prisma.product.findFirst();
  if (!existing) {
    await prisma.product.create({
      data: {
        title: "Пример товара",
        slug: "primer-tovara",
        description: "Краткое описание примера товара. Отредактируйте через админ-панель.",
        price: 999,
        oldPrice: 1299,
        discount: 23,
        images: ["https://placehold.co/600x600?text=Product"],
        characteristics: [
          { label: "Материал", value: "Пример" },
          { label: "Цвет", value: "Чёрный" },
        ],
        stock: 4,
        isHit: true,
        categoryId: category.id,
        isActive: true,
      },
    });
  }

  // Базовые настройки сайта
  const defaults: Record<string, string> = {
    "hero.title": "Ваш продукт — просто. Быстро. Выгодно.",
    "hero.subtitle": "Современное решение, которое экономит время и деньги",
    "hero.cta": "Оформить заявку",
    "hero.image": "https://placehold.co/1200x800?text=Hero",
    "contacts.phone": "+380000000000",
    "contacts.email": "info@example.com",
    "contacts.telegram": "https://t.me/example",
    "contacts.viber": "viber://chat?number=%2B380000000000",
    "contacts.whatsapp": "https://wa.me/380000000000",
    "payment.cardNumber": "0000 0000 0000 0000",
    "payment.cardHolder": "Имя Фамилия",
    "payment.bank": "monobank",
    "seo.title": "Landing MVP — купить онлайн",
    "seo.description": "Продающий лендинг с каталогом товаров и онлайн-заявкой",
  };

  for (const [key, value] of Object.entries(defaults)) {
    await prisma.siteSettings.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log("Seed completed. Admin login:", adminEmail, "/ password:", adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

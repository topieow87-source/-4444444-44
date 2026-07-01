import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { slugify } from "@/lib/utils";

/** Гарантирует уникальность slug, добавляя суффикс -2, -3... при коллизии */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${n++}`;
  }
}

// GET /api/products?active=true — публичный список товаров
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";

  const products = await prisma.product.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { category: true },
  });

  // Decimal -> number для JSON
  const serialized = products.map((p) => ({
    ...p,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
  }));

  return NextResponse.json({ products: serialized });
}

// POST /api/products — создание товара (защищено middleware, требует авторизации)
export async function POST(req: NextRequest) {
  if (!checkRateLimit(`products:post:${getClientKey(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    const slug = await uniqueSlug(slugify(data.slug || data.title));

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        characteristics: data.characteristics ?? undefined,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.errors ? "Ошибка валидации" : "Ошибка сервера", details: err.errors }, { status: 400 });
  }
}

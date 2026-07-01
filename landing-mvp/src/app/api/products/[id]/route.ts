import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) return NextResponse.json({ error: "Товар не найден" }, { status: 404 });

  return NextResponse.json({
    product: { ...product, price: Number(product.price), oldPrice: product.oldPrice ? Number(product.oldPrice) : null },
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = productSchema.partial().parse(body);

    let slug: string | undefined = undefined;
    if (data.slug) {
      slug = await uniqueSlug(slugify(data.slug), id);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        slug,
        oldPrice: data.oldPrice ?? undefined,
        characteristics: data.characteristics ?? undefined,
      },
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    return NextResponse.json({ error: "Ошибка обновления", details: err.errors }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }
}

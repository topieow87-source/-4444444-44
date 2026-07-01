import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = categorySchema.partial().parse(body);
    const category = await prisma.category.update({ where: { id: params.id }, data });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Ошибка обновления категории" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Категория не найдена" }, { status: 404 });
  }
}

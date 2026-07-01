import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = categorySchema.parse(body);
    const category = await prisma.category.create({ data });
    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ошибка создания категории" }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validation";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const approvedOnly = searchParams.get("approved") === "true";

  // Просмотр всех (включая неодобренные) — только для админа
  if (!approvedOnly) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: approvedOnly ? { isApproved: true } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(`reviews:post:${getClientKey(req)}`, 3, 60_000)) {
    return NextResponse.json({ error: "Слишком много отзывов. Попробуйте позже." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const data = reviewSchema.parse(body);

    // Новые отзывы требуют модерации перед публикацией
    const review = await prisma.review.create({ data: { ...data, isApproved: false } });
    return NextResponse.json({ review }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Ошибка валидации отзыва" }, { status: 400 });
  }
}

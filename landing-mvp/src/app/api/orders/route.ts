import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderRequestSchema } from "@/lib/validation";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { getUserFromRequest } from "@/lib/auth";
import { sendOrderTelegramNotification } from "@/lib/telegram";

// GET /api/orders — только для авторизованного админа
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.orderRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ orders });
}

// POST /api/orders — публичная форма заявки (защищена rate limit + валидацией)
export async function POST(req: NextRequest) {
  if (!checkRateLimit(`orders:post:${getClientKey(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Слишком много заявок. Попробуйте позже." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const data = orderRequestSchema.parse(body);

    // Для самовывоза поле "отделение" не нужно, даже если пришло с фронта
    if (data.deliveryMethod === "PICKUP") data.warehouse = null;

    const order = await prisma.orderRequest.create({ data });

    // Уведомление в Telegram не должно блокировать ответ пользователю
    sendOrderTelegramNotification(order).catch(() => {});

    return NextResponse.json({ order }, { status: 201 });
  } catch (err: any) {
    const message = err.errors?.[0]?.message || "Ошибка валидации данных";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { orderStatusEnum } from "@/lib/validation";

const updateSchema = z.object({
  status: orderStatusEnum,
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status } = updateSchema.parse(body);

    const order = await prisma.orderRequest.update({ where: { id: params.id }, data: { status } });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Ошибка обновления заявки" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.orderRequest.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
}

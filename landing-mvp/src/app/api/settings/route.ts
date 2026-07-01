import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settingsUpdateSchema } from "@/lib/validation";

// GET /api/settings — публичный доступ (нужен для рендера контента на лендинге)
export async function GET() {
  const rows = await prisma.siteSettings.findMany();
  const map: Record<string, string> = {};
  rows.forEach((r) => (map[r.key] = r.value));
  return NextResponse.json({ settings: map });
}

// PUT /api/settings — массовое обновление key-value (защищено middleware)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = settingsUpdateSchema.parse(body);

    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.siteSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка обновления настроек" }, { status: 400 });
  }
}

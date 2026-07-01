import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

// POST /api/upload — body: { file: "data:image/png;base64,..." }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.file || typeof body.file !== "string") {
      return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
    }

    const url = await uploadImage(body.file);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: "Ошибка загрузки изображения" }, { status: 500 });
  }
}

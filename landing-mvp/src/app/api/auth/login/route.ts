import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Защита от брутфорса
  if (!checkRateLimit(`login:${getClientKey(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Слишком много попыток входа. Попробуйте через минуту." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Некорректные данные для входа" }, { status: 400 });
  }
}

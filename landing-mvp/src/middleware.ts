import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/") &&
    (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") &&
    !pathname.startsWith("/api/auth/login") &&
    !pathname.startsWith("/api/orders") && // публичная форма заявки — POST разрешён без авторизации
    !pathname.startsWith("/api/reviews"); // публичное добавление отзыва — POST разрешён без авторизации

  if (!isAdminRoute && !isAdminApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    if (isAdminRoute) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

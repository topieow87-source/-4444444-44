"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ClipboardList, Star, Settings, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const nav = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/orders", label: "Заявки", icon: ClipboardList },
  { href: "/admin/reviews", label: "Отзывы", icon: Star },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-canvas">
      <aside className="w-64 bg-slate-950 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80">
          <Logo light wordmark="Bränd OS" />
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={17} className={active ? "text-brand-400" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink size={17} /> На сайт
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut size={17} /> Выйти
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

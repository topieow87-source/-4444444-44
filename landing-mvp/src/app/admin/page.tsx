import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Package, ClipboardList, Star, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productsCount, ordersCount, newOrdersCount, reviewsPending] = await Promise.all([
    prisma.product.count(),
    prisma.orderRequest.count(),
    prisma.orderRequest.count({ where: { status: "NEW" } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  const stats = [
    { label: "Товаров в каталоге", value: productsCount, icon: Package, href: "/admin/products", tint: "bg-blue-50 text-blue-600" },
    { label: "Всего заявок", value: ordersCount, icon: ClipboardList, href: "/admin/orders", tint: "bg-violet-50 text-violet-600" },
    { label: "Новых заявок", value: newOrdersCount, icon: Clock, href: "/admin/orders", tint: "bg-amber-50 text-amber-600" },
    { label: "Отзывов на модерации", value: reviewsPending, icon: Star, href: "/admin/reviews", tint: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900">Дашборд</h1>
      <p className="mt-1 text-sm text-slate-500">Обзор активности вашего каталога в реальном времени</p>

      <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-6 h-full hover:shadow-lifted hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tint}`}>
                  <s.icon size={18} />
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trash2, ClipboardList, Zap } from "lucide-react";

type OrderStatus = "NEW" | "CONFIRMED" | "SHIPPED" | "DONE" | "CANCELLED";
type DeliveryMethod = "NOVA_POSHTA" | "UKRPOSHTA" | "PICKUP";
type PaymentMethod = "COD" | "CARD";

interface Order {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  region: string | null;
  deliveryMethod: DeliveryMethod | null;
  warehouse: string | null;
  paymentMethod: PaymentMethod | null;
  comment: string | null;
  productTitle: string | null;
  isQuick: boolean;
  status: OrderStatus;
  createdAt: string;
}

const statusLabels: Record<OrderStatus, string> = {
  NEW: "Новый",
  CONFIRMED: "Подтверждён",
  SHIPPED: "Отправлен",
  DONE: "Завершён",
  CANCELLED: "Отменён",
};

const statusSelectClass: Record<OrderStatus, string> = {
  NEW: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-brand-50 text-brand-700",
  SHIPPED: "bg-violet-50 text-violet-700",
  DONE: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const deliveryLabels: Record<DeliveryMethod, string> = {
  NOVA_POSHTA: "Новая Пошта",
  UKRPOSHTA: "Укрпошта",
  PICKUP: "Самовывоз",
};

const paymentLabels: Record<PaymentMethod, string> = {
  COD: "Наложка",
  CARD: "Карта",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success("Статус обновлён");
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success("Заявка удалена");
  }

  const filtered = statusFilter === "ALL" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Заявки</h1>
          <p className="mt-1 text-sm text-slate-500">Все обращения клиентов с сайта</p>
        </div>
        <Badge variant="brand">{orders.length} всего</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors",
            statusFilter === "ALL"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          )}
        >
          Все
        </button>
        {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors",
              statusFilter === s
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Клиент</th>
                <th className="text-left px-5 py-3 font-medium">Товар</th>
                <th className="text-left px-5 py-3 font-medium">Доставка</th>
                <th className="text-left px-5 py-3 font-medium">Оплата</th>
                <th className="text-left px-5 py-3 font-medium">Дата</th>
                <th className="text-left px-5 py-3 font-medium">Статус</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Загрузка...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 text-slate-400">
                    <ClipboardList className="mx-auto mb-2 text-slate-300" size={28} />
                    Заявок пока нет
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors align-top">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 font-medium text-slate-900">
                        {o.isQuick && <Zap size={13} className="text-amber-500 shrink-0" />}
                        {o.name}
                      </div>
                      <a href={`tel:${o.phone}`} className="text-brand-600 hover:underline text-xs">
                        {o.phone}
                      </a>
                      {(o.city || o.region) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {[o.city, o.region].filter(Boolean).join(", ")}
                        </p>
                      )}
                      {o.comment && <p className="text-xs text-slate-400 mt-0.5 max-w-[200px] truncate">{o.comment}</p>}
                    </td>
                    <td className="px-5 py-3 max-w-[160px] truncate text-slate-600">{o.productTitle || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {o.deliveryMethod ? deliveryLabels[o.deliveryMethod] : "—"}
                      {o.warehouse && <p className="text-xs text-slate-400 mt-0.5">№ {o.warehouse}</p>}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {o.paymentMethod ? paymentLabels[o.paymentMethod] : "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleString("uk-UA")}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                        className={cn(
                          "text-xs font-semibold rounded-full pl-2.5 pr-1.5 py-1 border-0 focus-visible:outline-none cursor-pointer",
                          statusSelectClass[o.status]
                        )}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        aria-label="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

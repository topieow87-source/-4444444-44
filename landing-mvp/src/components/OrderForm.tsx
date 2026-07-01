"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea, Label, IconInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  User,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  MapPin,
  Building2,
  Truck,
  Store,
  Package,
  Banknote,
  CreditCard,
  Copy,
} from "lucide-react";

type DeliveryMethod = "NOVA_POSHTA" | "UKRPOSHTA" | "PICKUP";
type PaymentMethod = "COD" | "CARD";

const deliveryOptions: { value: DeliveryMethod; label: string; icon: any }[] = [
  { value: "NOVA_POSHTA", label: "Новая Пошта", icon: Truck },
  { value: "UKRPOSHTA", label: "Укрпошта", icon: Package },
  { value: "PICKUP", label: "Самовывоз", icon: Store },
];

const paymentOptions: { value: PaymentMethod; label: string; icon: any }[] = [
  { value: "COD", label: "Наложенный платёж", icon: Banknote },
  { value: "CARD", label: "Оплата на карту", icon: CreditCard },
];

export default function OrderForm({
  productId,
  productTitle,
  formId = "order-form",
  quick = false,
}: {
  productId?: string;
  productTitle?: string;
  formId?: string;
  /** Быстрый заказ — только имя и телефон, максимум 2 поля для холодного трафика */
  quick?: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("NOVA_POSHTA");
  const [warehouse, setWarehouse] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cardInfo, setCardInfo] = useState<{ number?: string; holder?: string; bank?: string } | null>(
    null
  );

  useEffect(() => {
    if (!sent || paymentMethod !== "CARD" || quick) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        if (s["payment.cardNumber"]) {
          setCardInfo({
            number: s["payment.cardNumber"],
            holder: s["payment.cardHolder"],
            bank: s["payment.bank"],
          });
        }
      })
      .catch(() => {});
  }, [sent, paymentMethod, quick]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          comment,
          productId,
          productTitle,
          isQuick: quick,
          ...(quick
            ? {}
            : {
                city,
                region,
                deliveryMethod,
                warehouse: deliveryMethod === "PICKUP" ? null : warehouse,
                paymentMethod,
              }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");

      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      setSent(true);
    } catch (err: any) {
      toast.error(err.message || "Не удалось отправить заявку");
    } finally {
      setLoading(false);
    }
  }

  function copyCard() {
    if (!cardInfo?.number) return;
    navigator.clipboard.writeText(cardInfo.number.replace(/\s/g, ""));
    toast.success("Номер карты скопирован");
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 px-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={28} />
        </span>
        <h3 className="mt-4 font-display font-semibold text-lg text-slate-900">Заявка отправлена!</h3>
        <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
          Мы свяжемся с вами в ближайшее время, чтобы подтвердить заказ.
        </p>

        {paymentMethod === "CARD" && !quick && cardInfo?.number && (
          <div className="mt-5 w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Реквизиты для оплаты
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-semibold text-slate-900">{cardInfo.number}</span>
              <button
                type="button"
                onClick={copyCard}
                className="text-slate-400 hover:text-brand-600 transition-colors shrink-0"
                aria-label="Копировать номер карты"
              >
                <Copy size={15} />
              </button>
            </div>
            {cardInfo.holder && <p className="mt-1 text-sm text-slate-600">{cardInfo.holder}</p>}
            {cardInfo.bank && <p className="text-xs text-slate-400">{cardInfo.bank}</p>}
          </div>
        )}

        <Button variant="outline" size="sm" className="mt-5" onClick={() => setSent(false)}>
          Оформить ещё одну заявку
        </Button>
      </div>
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {productTitle && (
        <div className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-sm text-slate-600">
          Товар: <span className="font-medium text-slate-900">{productTitle}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${formId}-name`}>Имя *</Label>
          <IconInput
            id={`${formId}-name`}
            icon={<User size={16} />}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
          />
        </div>
        <div>
          <Label htmlFor={`${formId}-phone`}>Телефон *</Label>
          <IconInput
            id={`${formId}-phone`}
            icon={<Phone size={16} />}
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+380 XX XXX XX XX"
          />
        </div>
      </div>

      {!quick && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${formId}-city`}>Город *</Label>
              <IconInput
                id={`${formId}-city`}
                icon={<MapPin size={16} />}
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ваш город"
              />
            </div>
            <div>
              <Label htmlFor={`${formId}-region`}>Область *</Label>
              <IconInput
                id={`${formId}-region`}
                icon={<Building2 size={16} />}
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ваша область"
              />
            </div>
          </div>

          <div>
            <Label>Способ доставки *</Label>
            <div className="grid grid-cols-3 gap-2">
              {deliveryOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDeliveryMethod(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-colors min-h-[64px]",
                    deliveryMethod === opt.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  <opt.icon size={17} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {deliveryMethod !== "PICKUP" && (
            <div>
              <Label htmlFor={`${formId}-warehouse`}>
                {deliveryMethod === "NOVA_POSHTA" ? "Отделение Новой Пошты *" : "Индекс / отделение *"}
              </Label>
              <IconInput
                id={`${formId}-warehouse`}
                icon={<Store size={16} />}
                required
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                placeholder={deliveryMethod === "NOVA_POSHTA" ? "Например, №5" : "Индекс отделения"}
              />
            </div>
          )}

          <div>
            <Label>Способ оплаты *</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPaymentMethod(opt.value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors min-h-[44px]",
                    paymentMethod === opt.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  <opt.icon size={16} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor={`${formId}-comment`}>Комментарий</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400">
                <MessageSquare size={16} />
              </span>
              <Textarea
                id={`${formId}-comment`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительная информация (необязательно)"
                className="pl-11"
              />
            </div>
          </div>
        </>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          "Отправка..."
        ) : (
          <>
            {quick ? "Заказать в 1 клик" : "Оформить заказ"}
            <Send size={16} />
          </>
        )}
      </Button>
      <p className="text-center text-xs text-slate-400">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Phone, Search, CreditCard } from "lucide-react";

const groups: { title: string; icon: any; fields: { key: string; label: string; textarea?: boolean }[] }[] = [
  {
    title: "Главный экран",
    icon: Sparkles,
    fields: [
      { key: "hero.title", label: "Заголовок Hero" },
      { key: "hero.subtitle", label: "Подзаголовок Hero", textarea: true },
      { key: "hero.cta", label: "Текст кнопки CTA" },
      { key: "hero.image", label: "URL изображения Hero" },
    ],
  },
  {
    title: "Контакты",
    icon: Phone,
    fields: [
      { key: "contacts.phone", label: "Телефон" },
      { key: "contacts.email", label: "Email" },
      { key: "contacts.telegram", label: "Ссылка Telegram" },
      { key: "contacts.viber", label: "Ссылка Viber" },
      { key: "contacts.whatsapp", label: "Ссылка WhatsApp" },
    ],
  },
  {
    title: "Оплата (реквизиты карты)",
    icon: CreditCard,
    fields: [
      { key: "payment.cardNumber", label: "Номер карты" },
      { key: "payment.cardHolder", label: "Получатель (ФИО)" },
      { key: "payment.bank", label: "Банк" },
    ],
  },
  {
    title: "SEO",
    icon: Search,
    fields: [
      { key: "seo.title", label: "SEO: Meta Title" },
      { key: "seo.description", label: "SEO: Meta Description", textarea: true },
    ],
  },
];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setValues(d.settings || {}))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      toast.success("Настройки сохранены");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900">Настройки сайта</h1>
      <p className="mt-1 text-sm text-slate-500">Контент лендинга и SEO — без правки кода</p>

      {loading ? (
        <p className="mt-6 text-slate-400 text-sm">Загрузка...</p>
      ) : (
        <form onSubmit={handleSave} className="mt-6 space-y-5 max-w-2xl">
          {groups.map((group) => (
            <Card key={group.title} className="p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <group.icon size={16} />
                </span>
                <h2 className="font-display font-semibold text-slate-900">{group.title}</h2>
              </div>
              <div className="space-y-4">
                {group.fields.map((f) => (
                  <div key={f.key}>
                    <Label>{f.label}</Label>
                    {f.textarea ? (
                      <Textarea
                        value={values[f.key] || ""}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      />
                    ) : (
                      <Input
                        value={values[f.key] || ""}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить настройки"}
          </Button>
        </form>
      )}
    </div>
  );
}

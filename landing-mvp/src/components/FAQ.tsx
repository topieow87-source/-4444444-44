"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Как оформить заказ?",
    a: "Выберите товар в каталоге и нажмите «Заказать», либо заполните общую форму заявки внизу страницы.",
  },
  {
    q: "Какие способы оплаты доступны?",
    a: "Наличными при получении, картой онлайн или на карту — уточняйте у менеджера после заявки.",
  },
  {
    q: "Сколько длится доставка?",
    a: "По Украине доставка занимает 1-3 рабочих дня в зависимости от региона.",
  },
  {
    q: "Можно ли вернуть товар?",
    a: "Да, согласно закону о защите прав потребителей — в течение 14 дней при сохранении товарного вида.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-24 bg-slate-50/70">
      <div className="container max-w-2xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">FAQ</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-slate-900">
            Частые вопросы
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={cn(
                  "rounded-2xl border bg-white overflow-hidden transition-colors",
                  isOpen ? "border-brand-200 shadow-card" : "border-slate-200"
                )}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left font-medium text-slate-900"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  {f.q}
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full shrink-0 transition-all duration-300",
                      isOpen ? "bg-brand-600 text-white rotate-45" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <Plus size={15} />
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

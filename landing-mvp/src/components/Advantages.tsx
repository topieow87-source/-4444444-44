"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Clock, Wallet } from "lucide-react";
import { CardHover } from "@/components/ui/card";

const items = [
  {
    icon: Truck,
    title: "Быстрая доставка",
    text: "Отправка по всей Украине в день заказа",
    tint: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Гарантия качества",
    text: "Проверенные товары с официальной гарантией",
    tint: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Clock,
    title: "Поддержка 24/7",
    text: "Отвечаем в Telegram, Viber и WhatsApp",
    tint: "bg-violet-50 text-violet-600",
  },
  {
    icon: Wallet,
    title: "Выгодные цены",
    text: "Честная цена без скрытых наценок",
    tint: "bg-amber-50 text-amber-600",
  },
];

export default function Advantages() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Наши преимущества</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-slate-900">
            Почему выбирают нас
          </h2>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <CardHover className="p-6 h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.tint}`}>
                  <item.icon size={22} />
                </div>
                <h3 className="mt-4 font-display font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.text}</p>
              </CardHover>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

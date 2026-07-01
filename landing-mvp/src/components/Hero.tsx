"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, ArrowDown, ShieldCheck, Flame, Star } from "lucide-react";

export interface HeroStats {
  productsCount: number;
  ordersToday: number;
  avgRating: number | null;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero({
  title,
  subtitle,
  cta,
  image,
  stats,
}: {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  stats: HeroStats;
}) {
  return (
    <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-noise-grid">
      {/* декоративные "блобы" на фоне — тихая амбиентная анимация */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-brand-400/20 blur-3xl animate-blob"
      />
      <div
        aria-hidden
        className="absolute top-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-accent-400/20 blur-3xl animate-blob"
        style={{ animationDelay: "3s" }}
      />

      <div className="container relative grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow-xs px-3.5 py-1.5 text-xs font-semibold text-brand-700">
            <ShieldCheck size={14} />
            Официальная гарантия на все товары
          </span>

          <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-slate-900 leading-[1.08]">
            {title}
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">{subtitle}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => scrollTo("catalog")}>
              {cta}
              <ArrowRight size={17} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo("catalog")}>
              Смотреть каталог
              <ArrowDown size={17} />
            </Button>
          </div>

          {/* живая статистика — реальные данные из базы */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div>
              <p className="font-display text-2xl font-bold text-slate-900">{stats.productsCount}+</p>
              <p className="text-xs text-slate-500">товаров в каталоге</p>
            </div>
            <div className="h-9 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <p className="font-display text-2xl font-bold text-slate-900">
                {stats.avgRating ? stats.avgRating.toFixed(1) : "5.0"}
              </p>
              <p className="text-xs text-slate-500 ml-0.5">средний рейтинг</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lifted ring-1 ring-slate-900/5">
            <Image
              src={image}
              alt="Hero"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
          </div>

          {stats.ordersToday > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-4 sm:left-6 glass rounded-2xl border border-white/70 shadow-lifted px-4 py-3 flex items-center gap-3 animate-float"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Flame size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {stats.ordersToday} {stats.ordersToday === 1 ? "заявка" : "заявок"} сегодня
                </p>
                <p className="text-xs text-slate-500 mt-0.5">оформили за сегодня</p>
              </div>
            </motion.div>
          )}

          <div className="absolute -top-5 -right-4 hidden sm:flex glass rounded-2xl border border-white/70 shadow-lifted px-3.5 py-2.5 items-center gap-2 animate-float" style={{ animationDelay: "1s" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-dot" />
            </span>
            <p className="text-xs font-semibold text-slate-700">Заявки принимаются онлайн</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

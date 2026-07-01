"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Menu, X, LayoutGrid, Star, CircleHelp, MessageCircle, ArrowRight } from "lucide-react";

const links = [
  { href: "#catalog", label: "Каталог", icon: LayoutGrid },
  { href: "#reviews", label: "Отзывы", icon: Star },
  { href: "#faq", label: "FAQ", icon: CircleHelp },
  { href: "#contacts", label: "Контакты", icon: MessageCircle },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-3 sm:pt-4">
      <div className="container">
        <div
          className={`flex items-center justify-between gap-4 rounded-2xl px-4 sm:px-5 h-16 transition-all duration-300 ${
            scrolled ? "glass shadow-lifted border border-white/60" : "bg-transparent"
          }`}
        >
          <a href="#" className="shrink-0">
            <Logo />
          </a>

          <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-900/[0.03] p-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(l.href.slice(1));
                }}
                className="group flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all duration-200"
              >
                <l.icon size={15} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button size="sm" onClick={() => scrollTo("catalog")}>
              Оставить заявку
              <ArrowRight size={15} />
            </Button>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-slate-700"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl border border-white/60 shadow-lifted px-4 py-4 flex flex-col gap-1 animate-fade-up">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  scrollTo(l.href.slice(1));
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <l.icon size={17} className="text-brand-600" />
                {l.label}
              </a>
            ))}
            <Button
              size="sm"
              className="mt-2"
              onClick={() => {
                setOpen(false);
                scrollTo("catalog");
              }}
            >
              Оставить заявку
              <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

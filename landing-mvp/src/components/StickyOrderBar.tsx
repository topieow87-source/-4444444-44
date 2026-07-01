"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

/**
 * Липкая кнопка заказа для мобильных — появляется после прокрутки первого экрана.
 * onClick передаётся с конкретной страницы (открыть модалку / скроллить к форме).
 */
export default function StickyOrderBar({
  label = "Заказать",
  onClick,
  priceLabel,
}: {
  label?: string;
  onClick: () => void;
  priceLabel?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass border-t border-white/60 shadow-[0_-8px_24px_-8px_rgba(15,23,42,0.15)] px-4 py-3 flex items-center gap-3">
        {priceLabel && (
          <span className="font-display font-bold text-slate-900 text-base shrink-0">{priceLabel}</span>
        )}
        <Button size="lg" className="flex-1 min-h-[48px]" onClick={onClick}>
          <ShoppingBag size={17} />
          {label}
        </Button>
      </div>
    </div>
  );
}

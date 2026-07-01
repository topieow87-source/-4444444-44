"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import OrderModal from "@/components/OrderModal";
import StickyOrderBar from "@/components/StickyOrderBar";
import { ProductCardData } from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Zap } from "lucide-react";

export default function ProductActions({ product }: { product: ProductCardData }) {
  const [open, setOpen] = useState(false);
  const [quick, setQuick] = useState(false);

  function openModal(isQuick: boolean) {
    setQuick(isQuick);
    setOpen(true);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" className="w-full min-h-[48px]" onClick={() => openModal(true)}>
          <Zap size={17} />
          Быстрый заказ
        </Button>
        <Button size="lg" className="w-full min-h-[48px]" onClick={() => openModal(false)}>
          <ShoppingBag size={17} />
          Купить
        </Button>
      </div>

      <StickyOrderBar
        label="Купить"
        priceLabel={formatPrice(product.price)}
        onClick={() => openModal(false)}
      />

      <OrderModal product={open ? product : null} quick={quick} onClose={() => setOpen(false)} />
    </>
  );
}

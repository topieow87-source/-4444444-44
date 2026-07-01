"use client";

import { useState } from "react";
import Catalog from "@/components/Catalog";
import OrderModal from "@/components/OrderModal";
import StickyOrderBar from "@/components/StickyOrderBar";
import { ProductCardData } from "@/components/ProductCard";

function scrollToCatalog() {
  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
}

export default function CatalogWithModal() {
  const [selected, setSelected] = useState<ProductCardData | null>(null);
  const [quick, setQuick] = useState(false);

  return (
    <>
      <Catalog
        onOrder={(product, isQuick) => {
          setSelected(product);
          setQuick(isQuick);
        }}
      />
      <OrderModal product={selected} quick={quick} onClose={() => setSelected(null)} />
      <StickyOrderBar label="Смотреть каталог и заказать" onClick={scrollToCatalog} />
    </>
  );
}

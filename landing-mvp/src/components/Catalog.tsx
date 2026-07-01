"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { ProductCardData } from "@/components/ProductCard";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Catalog({
  onOrder,
}: {
  onOrder: (product: ProductCardData, quick: boolean) => void;
}) {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?active=true").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const usedCategoryIds = useMemo(
    () => new Set(products.map((p) => p.categoryId).filter(Boolean)),
    [products]
  );
  const visibleCategories = categories.filter((c) => usedCategoryIds.has(c.id));

  const filtered = activeCategory ? products.filter((p) => p.categoryId === activeCategory) : products;

  return (
    <section id="catalog" className="py-20 md:py-24 bg-slate-50/70">
      <div className="container">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Каталог</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-slate-900">
            Выберите то, что нужно
          </h2>
          <p className="mt-3 text-slate-600">Оформите заявку в один клик — мы свяжемся с вами</p>
        </div>

        {visibleCategories.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === null
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              )}
            >
              <LayoutGrid size={14} />
              Все товары
            </button>
            {visibleCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeCategory === c.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))
            : filtered.map((p) => <ProductCard key={p.id} product={p} onOrder={onOrder} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="text-center text-slate-400 mt-12">Товары скоро появятся</p>
        )}
      </div>
    </section>
  );
}

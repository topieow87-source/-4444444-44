"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, Flame } from "lucide-react";

export interface ProductCardData {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  images: string[];
  stock?: number | null;
  isHit?: boolean;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
}

export default function ProductCard({
  product,
  onOrder,
}: {
  product: ProductCardData;
  onOrder: (product: ProductCardData, quick: boolean) => void;
}) {
  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="overflow-hidden group flex flex-col h-full hover:shadow-lifted hover:-translate-y-1 hover:border-brand-200/70">
        <Link href={`/product/${product.slug}`} className="relative aspect-square bg-slate-100 overflow-hidden block">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="skeleton w-full h-full" />
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isHit ? (
              <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Flame size={12} /> Хит
              </span>
            ) : null}
            {product.discount ? (
              <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                -{product.discount}%
              </span>
            ) : null}
          </div>

          {product.category ? (
            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {product.category.name}
            </span>
          ) : null}

          {lowStock ? (
            <span className="absolute bottom-3 left-3 bg-slate-900/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Осталось {product.stock} шт.
            </span>
          ) : null}
        </Link>

        <div className="p-4 flex flex-col flex-1">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-display font-semibold text-slate-900 line-clamp-2 leading-snug hover:text-brand-600 transition-colors">
              {product.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2 flex-1">{product.description}</p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
            {product.oldPrice ? (
              <span className="text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => onOrder(product, true)}>
              <Zap size={14} />
              Быстро
            </Button>
            <Button size="sm" className="w-full" onClick={() => onOrder(product, false)}>
              <ShoppingBag size={14} />
              Купить
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

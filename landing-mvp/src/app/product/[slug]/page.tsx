import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, Truck, ShieldCheck, Banknote, Flame } from "lucide-react";

export const revalidate = 60;

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.isActive) return null;

  return {
    ...product,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    characteristics: (product.characteristics as { label: string; value: string }[] | null) ?? null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Товар не найден" };

  return {
    title: `${product.title} — купить с доставкой`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <main className="pb-24 md:pb-0">
      <Header />

      <div className="container pt-28 md:pt-32">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={16} />
          Назад в каталог
        </Link>

        <div className="mt-5 grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={product.images} title={product.title} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.isHit && (
                <Badge variant="warning" className="bg-amber-500 text-white">
                  <Flame size={12} /> Хит продаж
                </Badge>
              )}
              {product.discount ? <Badge variant="danger">-{product.discount}%</Badge> : null}
              {product.category ? <Badge variant="outline">{product.category.name}</Badge> : null}
              {typeof product.stock === "number" && product.stock > 0 && product.stock <= 5 ? (
                <Badge variant="default">Осталось {product.stock} шт.</Badge>
              ) : null}
            </div>

            <h1 className="mt-4 font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</span>
              {product.oldPrice ? (
                <span className="text-lg text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
              ) : null}
            </div>

            <p className="mt-5 text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>

            {product.characteristics && product.characteristics.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display font-semibold text-slate-900 mb-2.5">Характеристики</h2>
                <dl className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  {product.characteristics.map((c, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                      <dt className="text-slate-500">{c.label}</dt>
                      <dd className="font-medium text-slate-900 text-right">{c.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-100 p-3">
                <Truck size={18} className="text-brand-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-snug">
                  Новая Пошта, Укрпошта или самовывоз
                </p>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-100 p-3">
                <Banknote size={18} className="text-brand-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-snug">
                  Наложенный платёж или оплата на карту
                </p>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-100 p-3">
                <ShieldCheck size={18} className="text-brand-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-snug">Гарантия качества товара</p>
              </div>
            </div>

            <div className="mt-7">
              <ProductActions
                product={{
                  id: product.id,
                  title: product.title,
                  slug: product.slug,
                  description: product.description,
                  price: product.price,
                  oldPrice: product.oldPrice,
                  discount: product.discount,
                  images: product.images,
                  stock: product.stock,
                  isHit: product.isHit,
                  categoryId: product.categoryId,
                  category: product.category,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Reviews />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}

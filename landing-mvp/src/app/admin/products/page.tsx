"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn, slugify } from "@/lib/utils";
import { Pencil, Trash2, Plus, Upload, Package, X, Flame, ExternalLink } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Characteristic {
  label: string;
  value: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  images: string[];
  characteristics: Characteristic[] | null;
  stock: number | null;
  isHit: boolean;
  categoryId: string | null;
  isActive: boolean;
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  oldPrice: "",
  discount: "",
  images: [] as string[],
  characteristics: [] as Characteristic[],
  stock: "",
  isHit: false,
  categoryId: "",
  isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setProducts(productsRes.products || []);
    setCategories(categoriesRes.categories || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function categoryName(id: string | null) {
    if (!id) return null;
    return categories.find((c) => c.id === id)?.name ?? null;
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      discount: p.discount ? String(p.discount) : "",
      images: p.images,
      characteristics: p.characteristics ?? [],
      stock: p.stock !== null && p.stock !== undefined ? String(p.stock) : "",
      isHit: p.isHit,
      categoryId: p.categoryId ?? "",
      isActive: p.isActive,
    });
    setOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      toast.success("Изображение загружено");
    } catch (err: any) {
      toast.error(err.message || "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  }

  function addCharacteristic() {
    setForm((f) => ({ ...f, characteristics: [...f.characteristics, { label: "", value: "" }] }));
  }

  function updateCharacteristic(index: number, field: "label" | "value", value: string) {
    setForm((f) => ({
      ...f,
      characteristics: f.characteristics.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }));
  }

  function removeCharacteristic(index: number) {
    setForm((f) => ({ ...f, characteristics: f.characteristics.filter((_, i) => i !== index) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const cleanCharacteristics = form.characteristics.filter((c) => c.label.trim() && c.value.trim());
    const payload = {
      title: form.title,
      slug: form.slug ? slugify(form.slug) : slugify(form.title),
      description: form.description,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      discount: form.discount ? parseInt(form.discount) : null,
      images: form.images.length ? form.images : ["https://placehold.co/600x600?text=No+Image"],
      characteristics: cleanCharacteristics.length ? cleanCharacteristics : null,
      stock: form.stock !== "" ? parseInt(form.stock) : null,
      isHit: form.isHit,
      categoryId: form.categoryId || null,
      isActive: form.isActive,
    };

    try {
      const res = await fetch(editing ? `/api/products/${editing.id}` : "/api/products", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      toast.success(editing ? "Товар обновлён" : "Товар создан");
      setOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить товар?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.success("Товар удалён");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Товары</h1>
          <p className="mt-1 text-sm text-slate-500">Каталог, который видят покупатели на сайте</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Добавить товар
        </Button>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400 text-sm">Загрузка...</p>
        ) : products.length === 0 ? (
          <Card className="p-14 text-center text-slate-400 sm:col-span-2 lg:col-span-3">
            <Package className="mx-auto mb-2 text-slate-300" size={28} />
            Товаров пока нет — добавьте первый
          </Card>
        ) : (
          products.map((p) => (
            <Card key={p.id} className="p-4 flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {p.images[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{p.title}</p>
                <p className="text-sm text-slate-500">{formatPrice(p.price)}</p>
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <Badge variant={p.isActive ? "success" : "default"}>
                    {p.isActive ? "Активен" : "Скрыт"}
                  </Badge>
                  {p.isHit && (
                    <Badge variant="warning">
                      <Flame size={11} /> Хит
                    </Badge>
                  )}
                  {typeof p.stock === "number" && p.stock <= 5 && (
                    <Badge variant="danger">Осталось {p.stock}</Badge>
                  )}
                  {categoryName(p.categoryId) && <Badge variant="outline">{categoryName(p.categoryId)}</Badge>}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Link
                  href={`/product/${p.slug}`}
                  target="_blank"
                  className="text-slate-400 hover:text-brand-600 transition-colors"
                  aria-label="Открыть страницу товара"
                >
                  <ExternalLink size={16} />
                </Link>
                <button onClick={() => openEdit(p)} className="text-slate-500 hover:text-brand-600 transition-colors" aria-label="Редактировать">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-slate-500 hover:text-red-600 transition-colors" aria-label="Удалить">
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[92vw] max-w-lg bg-white rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto focus:outline-none">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="font-display font-semibold text-lg">
                {editing ? "Редактировать товар" : "Новый товар"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors" aria-label="Закрыть">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>URL (slug) — необязательно, сгенерируется из названия</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder={form.title ? slugify(form.title) : "avtomaticheski-iz-nazvaniya"}
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>Категория</Label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-500/10"
                >
                  <option value="">Без категории</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label>Цена</Label>
                  <Input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <Label>Старая цена</Label>
                  <Input type="number" step="0.01" min="0" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
                </div>
                <div>
                  <Label>Скидка %</Label>
                  <Input type="number" min="0" max="99" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                </div>
                <div>
                  <Label>Остаток, шт.</Label>
                  <Input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="—" />
                </div>
              </div>

              <div>
                <Label>Характеристики</Label>
                <div className="space-y-2">
                  {form.characteristics.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder="Параметр"
                        value={c.label}
                        onChange={(e) => updateCharacteristic(i, "label", e.target.value)}
                      />
                      <Input
                        placeholder="Значение"
                        value={c.value}
                        onChange={(e) => updateCharacteristic(i, "value", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeCharacteristic(i)}
                        className="shrink-0 text-slate-400 hover:text-red-600 transition-colors px-1"
                        aria-label="Удалить характеристику"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addCharacteristic}>
                  <Plus size={14} /> Добавить характеристику
                </Button>
              </div>

              <div>
                <Label>Фото</Label>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 group">
                        <Image src={url} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          aria-label="Удалить фото"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-dashed border-slate-300 cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload size={16} /> {uploading ? "Загрузка..." : "Загрузить фото"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  Активен (отображается на сайте)
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isHit}
                    onChange={(e) => setForm({ ...form, isHit: e.target.checked })}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  Бейдж «Хит продаж»
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

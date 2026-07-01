"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Check, MessageSquareText } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r)));
    toast.success("Отзыв одобрен");
  }

  async function remove(id: string) {
    if (!confirm("Удалить отзыв?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("Отзыв удалён");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Отзывы</h1>
          <p className="mt-1 text-sm text-slate-500">Модерация отзывов перед публикацией на сайте</p>
        </div>
        <Badge variant="brand">{reviews.length} всего</Badge>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-slate-400 text-sm">Загрузка...</p>
        ) : reviews.length === 0 ? (
          <Card className="p-14 text-center text-slate-400">
            <MessageSquareText className="mx-auto mb-2 text-slate-300" size={28} />
            Отзывов пока нет
          </Card>
        ) : (
          reviews.map((r) => (
            <Card key={r.id} className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900">{r.authorName}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                      />
                    ))}
                  </div>
                  {!r.isApproved && <Badge variant="warning">На модерации</Badge>}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{r.text}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!r.isApproved && (
                  <Button size="sm" onClick={() => approve(r.id)}>
                    <Check size={14} /> Одобрить
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => remove(r.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

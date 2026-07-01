"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
}

const GRADIENTS = [
  "from-brand-500 to-accent-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews?approved=true")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => setReviews([]));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-20 md:py-24 bg-white">
      <div className="container">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Отзывы</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-slate-900">
            Что говорят клиенты
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <Quote size={26} className="text-brand-100" />
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={15}
                      className={idx < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                <p className="mt-3 text-slate-700 text-sm leading-relaxed flex-1">{r.text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-white text-xs font-bold`}
                  >
                    {initials(r.authorName)}
                  </span>
                  <p className="font-semibold text-slate-900 text-sm">{r.authorName}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

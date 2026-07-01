"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const list = images.length > 0 ? images : ["https://placehold.co/1000x1000?text=Photo"];
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  function go(delta: number) {
    setActive((i) => (i + delta + list.length) % list.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  return (
    <div>
      <div
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="absolute inset-0 z-10"
          aria-label="Увеличить фото"
        >
          <Image
            src={list[active]}
            alt={`${title} — фото ${active + 1}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </button>

        <span className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm pointer-events-none">
          <ZoomIn size={16} />
        </span>

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Предыдущее фото"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Следующее фото"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {list.map((_, i) => (
            <button
              key={i}
              aria-label={`Фото ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-brand-600" : "w-1.5 bg-slate-300"
              )}
            />
          ))}
        </div>
      )}

      {list.length > 1 && (
        <div className="mt-3 hidden sm:grid grid-cols-5 gap-2">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 transition-colors",
                i === active ? "border-brand-500" : "border-transparent hover:border-slate-200"
              )}
            >
              <Image src={src} alt={`${title} — миниатюра ${i + 1}`} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}

      <Dialog.Root open={zoomOpen} onOpenChange={setZoomOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/90 z-[80]" />
          <Dialog.Content className="fixed inset-0 z-[90] flex items-center justify-center p-4 focus:outline-none">
            <Dialog.Title className="sr-only">{title} — увеличенное фото</Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Закрыть"
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
            <div className="relative w-full h-full max-w-3xl max-h-[85vh]">
              <Image src={list[active]} alt={title} fill className="object-contain" sizes="100vw" />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

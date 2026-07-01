"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, PackageCheck } from "lucide-react";
import OrderForm from "@/components/OrderForm";
import { ProductCardData } from "@/components/ProductCard";

export default function OrderModal({
  product,
  quick = false,
  onClose,
}: {
  product: ProductCardData | null;
  quick?: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={!!product} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[92vw] max-w-md max-h-[88vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-7 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between mb-5 gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
                <PackageCheck size={19} />
              </span>
              <div>
                <Dialog.Title className="font-display font-semibold text-base leading-tight">
                  {quick ? "Быстрый заказ" : "Оформить заказ"}
                </Dialog.Title>
                <p className="text-sm text-slate-500 truncate max-w-[220px]">{product?.title}</p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Закрыть"
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          {product && (
            <OrderForm
              productId={product.id}
              productTitle={product.title}
              formId="order-modal-form"
              quick={quick}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

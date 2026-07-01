import { cn } from "@/lib/utils";
import * as React from "react";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "brand" | "success" | "warning" | "danger" | "outline";
}) {
  const variants: Record<string, string> = {
    default: "bg-slate-100 text-slate-700",
    brand: "bg-brand-50 text-brand-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    outline: "border border-slate-200 text-slate-600 bg-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

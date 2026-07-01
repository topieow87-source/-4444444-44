import { cn } from "@/lib/utils";
import * as React from "react";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-200/70 bg-white shadow-card transition-all duration-300",
      className
    )}
    {...props}
  />
);

export const CardHover = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-200/70 bg-white shadow-card hover:shadow-lifted hover:-translate-y-1 hover:border-brand-200/70 transition-all duration-300",
      className
    )}
    {...props}
  />
);

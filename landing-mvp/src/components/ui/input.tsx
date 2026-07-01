import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow duration-200 focus-visible:outline-none focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-500/10 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow duration-200 focus-visible:outline-none focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-500/10 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("text-sm font-medium text-slate-700 mb-1.5 block", className)} {...props} />
);

/** Инпут с иконкой слева — для форм заказа/входа */
export const IconInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }
>(({ className, icon, ...props }, ref) => (
  <div className="relative">
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow duration-200 focus-visible:outline-none focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-500/10 disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
IconInput.displayName = "IconInput";

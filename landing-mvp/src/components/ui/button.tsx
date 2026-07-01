import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-brand-gradient text-white shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-xs",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-xs",
        dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-xs",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-[3.25rem] px-8 text-[0.95rem]",
        icon: "h-10 w-10 shrink-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };

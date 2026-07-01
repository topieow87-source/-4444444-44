import { cn } from "@/lib/utils";

/**
 * Фирменный знак бренда — стилизованная раскрытая коробка/куб.
 * Единый визуальный якорь: используется в хедере, футере, админке и на странице входа.
 */
export function LogoMark({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C6CFF" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#logo-grad)" />
      <path
        d="M12 14.5 L20 10 L28 14.5 L28 25.5 L20 30 L12 25.5 Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M12 14.5 L20 19 L28 14.5" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 19 L20 30" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export function Logo({
  className,
  wordmark = "Bränd",
  light = false,
}: {
  className?: string;
  wordmark?: string;
  /** Использовать светлый текст на тёмном фоне (футер, тёмная админ-сайдбар) */
  light?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "font-display font-bold text-[1.15rem] tracking-tight",
          light ? "text-white" : "text-slate-900"
        )}
      >
        {wordmark}
      </span>
    </span>
  );
}

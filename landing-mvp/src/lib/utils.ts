import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(num) + " ₴";
}

const translitMap: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z",
  и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ь: "", ю: "iu", я: "ia", ъ: "", ы: "y", э: "e",
};

/** Генерирует URL-slug из названия товара (кириллица -> транслит) */
export function slugify(input: string): string {
  const transliterated = input
    .toLowerCase()
    .split("")
    .map((ch) => (ch in translitMap ? translitMap[ch] : ch))
    .join("");

  return (
    transliterated
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "product"
  );
}

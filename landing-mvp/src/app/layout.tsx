import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

async function getSetting(key: string, fallback: string) {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = await getSetting("seo.title", "Landing MVP");
  const description = await getSetting(
    "seo.description",
    "Продающий лендинг с каталогом товаров и онлайн-заявкой"
  );

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: siteUrl,
      locale: "uk_UA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
    icons: {
      icon: "/favicon.svg",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${inter.variable} ${sora.variable}`}>
      <body>
        {children}
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "14px",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}

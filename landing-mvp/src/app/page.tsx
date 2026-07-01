import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Advantages from "@/components/Advantages";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import CatalogWithModal from "@/components/CatalogWithModal";

async function getSettings() {
  const rows = await prisma.siteSettings.findMany();
  const map: Record<string, string> = {};
  rows.forEach((r) => (map[r.key] = r.value));
  return map;
}

async function getHeroStats() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [productsCount, ordersToday, reviews] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.orderRequest.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.review.findMany({ where: { isApproved: true }, select: { rating: true } }),
  ]);

  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  return { productsCount, ordersToday, avgRating };
}

export const dynamic = "force-dynamic"; // рендерим на каждый запрос — без обращения к БД во время build

export default async function HomePage() {
  const [s, stats] = await Promise.all([getSettings(), getHeroStats()]);

  return (
    <main className="pb-20 md:pb-0">
      <Header />
      <Hero
        title={s["hero.title"] || "Ваш продукт — просто. Быстро. Выгодно."}
        subtitle={s["hero.subtitle"] || ""}
        cta={s["hero.cta"] || "Оформить заявку"}
        image={s["hero.image"] || "https://placehold.co/1200x800"}
        stats={stats}
      />
      <Advantages />
      <CatalogWithModal />
      <Reviews />
      <FAQ />
      <Contacts
        phone={s["contacts.phone"] || ""}
        email={s["contacts.email"] || ""}
        telegram={s["contacts.telegram"] || "#"}
        viber={s["contacts.viber"] || "#"}
        whatsapp={s["contacts.whatsapp"] || "#"}
      />
      <Footer />
    </main>
  );
}

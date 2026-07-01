import { Logo } from "@/components/Logo";
import { Phone, Mail, Send, MessageCircle } from "lucide-react";

const links = [
  { href: "#catalog", label: "Каталог" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacts", label: "Контакты" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-slate-500 max-w-xs leading-relaxed">
            Продающий каталог с быстрым оформлением заявки без регистрации и лишних шагов.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-4">Навигация</p>
          <ul className="space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-4">Связаться</p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={14} /> +380 00 000 00 00
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} /> info@example.com
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-4">Мессенджеры</p>
          <div className="flex gap-2">
            <a
              href="#"
              aria-label="Telegram"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <Send size={15} />
            </a>
            <a
              href="#"
              aria-label="WhatsApp / Viber"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Bränd. Все права защищены.</p>
          <p className="text-xs text-slate-600">Сделано на Next.js для рынка Украины</p>
        </div>
      </div>
    </footer>
  );
}

import { Send, Phone, Mail, MessageCircle } from "lucide-react";
import OrderForm from "@/components/OrderForm";

export default function Contacts({
  phone,
  email,
  telegram,
  viber,
  whatsapp,
}: {
  phone: string;
  email: string;
  telegram: string;
  viber: string;
  whatsapp: string;
}) {
  return (
    <section id="contacts" className="py-20 md:py-24 bg-white">
      <div className="container grid md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Контакты</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-slate-900">
            Свяжитесь с нами
          </h2>
          <p className="mt-4 text-slate-600 max-w-md">
            Ответим на любые вопросы удобным для вас способом
          </p>

          <div className="mt-8 space-y-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-slate-700 hover:text-brand-600 transition-colors group"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                  <Phone size={17} />
                </span>
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-slate-700 hover:text-brand-600 transition-colors group"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                  <Mail size={17} />
                </span>
                {email}
              </a>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#229ED9] text-white text-sm font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-xs"
            >
              <Send size={16} /> Telegram
            </a>
            <a
              href={viber}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7360F2] text-white text-sm font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-xs"
            >
              <MessageCircle size={16} /> Viber
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-xs"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8">
          <OrderForm formId="order-form" />
        </div>
      </div>
    </section>
  );
}

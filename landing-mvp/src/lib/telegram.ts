/**
 * Отправка уведомлений о новых заказах в Telegram.
 * Требует переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.
 * Если они не заданы — функция тихо ничего не делает (не ломает оформление заказа).
 */

const deliveryLabels: Record<string, string> = {
  NOVA_POSHTA: "Новая Пошта",
  UKRPOSHTA: "Укрпошта",
  PICKUP: "Самовывоз",
};

const paymentLabels: Record<string, string> = {
  COD: "Наложенный платёж",
  CARD: "Оплата на карту",
};

export interface OrderNotificationPayload {
  id: string;
  name: string;
  phone: string;
  city?: string | null;
  region?: string | null;
  deliveryMethod?: string | null;
  warehouse?: string | null;
  paymentMethod?: string | null;
  comment?: string | null;
  productTitle?: string | null;
  isQuick?: boolean;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendOrderTelegramNotification(order: OrderNotificationPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // уведомления не настроены — молча пропускаем

  const lines = [
    order.isQuick ? "⚡ <b>Быстрый заказ</b>" : "🛒 <b>Новый заказ</b>",
    "",
    `👤 Имя: ${escapeHtml(order.name)}`,
    `📞 Телефон: ${escapeHtml(order.phone)}`,
  ];

  if (order.productTitle) lines.push(`📦 Товар: ${escapeHtml(order.productTitle)}`);
  if (order.city) lines.push(`🏙 Город: ${escapeHtml(order.city)}`);
  if (order.region) lines.push(`📍 Область: ${escapeHtml(order.region)}`);
  if (order.deliveryMethod)
    lines.push(`🚚 Доставка: ${deliveryLabels[order.deliveryMethod] || order.deliveryMethod}`);
  if (order.warehouse) lines.push(`🏤 Отделение/индекс: ${escapeHtml(order.warehouse)}`);
  if (order.paymentMethod)
    lines.push(`💳 Оплата: ${paymentLabels[order.paymentMethod] || order.paymentMethod}`);
  if (order.comment) lines.push(`💬 Комментарий: ${escapeHtml(order.comment)}`);
  lines.push("", `🆔 ${order.id}`);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    // Не даём сбою Telegram сломать оформление заказа
    console.error("Telegram notification failed:", err);
  }
}

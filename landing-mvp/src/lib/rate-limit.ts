// Простой in-memory rate limiter (для single-instance Railway deployment).
// Для multi-instance продакшена стоит заменить на Redis (Upstash) — легко подменяется здесь.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * @param key уникальный идентификатор клиента (например IP + route)
 * @param limit максимум запросов
 * @param windowMs окно в миллисекундах
 */
export function checkRateLimit(key: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function getClientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

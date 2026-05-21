type Bucket = {
  count: number;
  resetAt: number;
};

// Fallback memory store (resets on serverless cold starts)
const buckets = new Map<string, Bucket>();

export async function checkRateLimit(key: string) {
  const max = Number(process.env.RATE_LIMIT_MAX ?? 30);
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_SECONDS ?? 3600) * 1000;
  const now = Date.now();

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Primary: Serverless-safe Redis Rate Limiter
  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/incr/${key}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      const count = data.result as number;
      
      if (count === 1) {
        await fetch(`${upstashUrl}/pexpire/${key}/${windowMs}`, {
          headers: { Authorization: `Bearer ${upstashToken}` },
          cache: "no-store"
        });
      }
      
      if (count > max) return { allowed: false, remaining: 0 };
      return { allowed: true, remaining: max - count };
    } catch (error) {
      console.warn("Redis rate limit failed, falling back to memory.", error);
    }
  }

  // Fallback: In-memory (vulnerable to cold starts, but keeps MVP running)
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (bucket.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: max - bucket.count };
}

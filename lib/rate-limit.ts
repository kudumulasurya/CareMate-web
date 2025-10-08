type Key = string

const buckets = new Map<Key, { tokens: number; last: number }>()

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now()
  let b = buckets.get(key)
  if (!b) {
    b = { tokens: limit, last: now }
    buckets.set(key, b)
  }
  const elapsed = now - b.last
  const refill = Math.floor((elapsed / windowMs) * limit)
  b.tokens = Math.min(limit, b.tokens + refill)
  b.last = now
  if (b.tokens <= 0) return false
  b.tokens -= 1
  return true
}

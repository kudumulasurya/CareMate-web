import { type NextRequest, NextResponse } from "next/server"
import { getClientIP } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"

const ALLOW_ORIGIN = process.env.FRONTEND_URL

export function json(data: any, init?: number | ResponseInit) {
  const res = NextResponse.json(data, init as ResponseInit)
  if (ALLOW_ORIGIN) {
    res.headers.set("Access-Control-Allow-Origin", ALLOW_ORIGIN)
    res.headers.set("Vary", "Origin")
  }
  return res
}

export function error(message: string, status = 400) {
  return json({ error: message }, { status })
}

export function requireRateLimit(req: NextRequest, keySuffix: string, limit = 30, windowMs = 60_000) {
  const ip = getClientIP(req)
  const key = `${ip}:${keySuffix}`
  if (!rateLimit(key, limit, windowMs)) return false
  return true
}

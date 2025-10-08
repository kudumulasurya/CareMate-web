import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies, headers } from "next/headers"
import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db" // add DB connection for fetching user
import { User } from "@/models/User" // add User model import

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret"

type JWTPayload = {
  sub: string
  role: "admin" | "doctor" | "user"
  email: string
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signAccessToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" })
}

export function signRefreshToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "30d" })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload
}

export async function setAuthCookies(access: string, refresh: string) {
  const c = await cookies()
  c.set("access_token", access, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 15,
  })
  c.set("refresh_token", refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearAuthCookies() {
  const c = await cookies()
  c.delete("access_token")
  c.delete("refresh_token")
}

export async function getTokenFromCookies() {
  const c = await cookies()
  return c.get("access_token")?.value
}

export async function getRefreshFromCookies() {
  const c = await cookies()
  return c.get("refresh_token")?.value
}

export async function getClientIP(req?: NextRequest) {
  // best-effort for rate limiting keys
  const h = req ? req.headers : await headers()
  return (h.get("x-forwarded-for") || h.get("x-real-ip") || "unknown").split(",")[0].trim()
}

export type Role = "admin" | "doctor" | "user"

export type CurrentUser = {
  id: string
  email: string
  role: "admin" | "doctor" | "user"
  name: string
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = await getTokenFromCookies()
  if (!token) return null
  try {
    const payload = verifyAccessToken(token)
    await connectDB()
    const doc = await User.findById(payload.sub).lean()
    if (!doc || Array.isArray(doc)) return null
    const fullName = doc.name?.first && doc.name?.last ? `${doc.name.first} ${doc.name.last}` : doc.email || "User"
    return {
      id: String(doc._id),
      email: doc.email,
      role: doc.role,
      name: fullName,
    }
  } catch {
    return null
  }
}

export async function requireAuth(allowed?: Role[]) {
  const token = await getTokenFromCookies()
  if (!token) return null
  try {
    const payload = verifyAccessToken(token)
    if (allowed && !allowed.includes(payload.role)) return null
    return payload
  } catch {
    return null
  }
}

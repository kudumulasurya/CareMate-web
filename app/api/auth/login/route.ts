import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { loginSchema } from "@/lib/validation"
import { User } from "@/models/User"
import { comparePassword, setAuthCookies, signAccessToken, signRefreshToken } from "@/lib/auth"
import { error, json, requireRateLimit } from "@/app/api/_utils"

export async function POST(req: NextRequest) {
  if (!requireRateLimit(req, "auth_login", 15, 60_000)) return error("Rate limit exceeded", 429)
  await connectDB()
  const body = await req.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return error(parsed.error.message, 422)
  const user = await User.findOne({ email: parsed.data.email })
  if (!user) return error("Invalid credentials", 401)
  const ok = await comparePassword(parsed.data.password, user.passwordHash)
  if (!ok) return error("Invalid credentials", 401)
  if (user.role === "doctor" && !user.doctorProfile?.isApproved) {
    return error("Doctor not approved yet", 403)
  }
  const payload = { sub: String(user._id), role: user.role, email: user.email }
  const access = signAccessToken(payload)
  const refresh = signRefreshToken(payload)
  setAuthCookies(access, refresh)
  return json({ success: true })
}

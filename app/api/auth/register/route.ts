import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { registerSchema } from "@/lib/validation"
import { User } from "@/models/User"
import { hashPassword } from "@/lib/auth"
import { error, json, requireRateLimit } from "@/app/api/_utils"

export async function POST(req: NextRequest) {
  if (!requireRateLimit(req, "auth_register", 10, 60_000)) return error("Rate limit exceeded", 429)
  await connectDB()
  const body = await req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) return error(parsed.error.message, 422)
  const exists = await User.findOne({ email: parsed.data.email })
  if (exists) return error("Email already registered", 409)
  const passwordHash = await hashPassword(parsed.data.password)
  const user = await User.create({
    email: parsed.data.email,
    passwordHash,
    name: parsed.data.name,
    role: "user",
    phone: parsed.data.phone,
    profile: parsed.data.profile,
    isVerified: true,
  })
  return json({ success: true, userId: user._id })
}

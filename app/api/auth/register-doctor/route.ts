import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { registerDoctorSchema } from "@/lib/validation"
import { User } from "@/models/User"
import { hashPassword } from "@/lib/auth"
import { error, json, requireRateLimit } from "@/app/api/_utils"

export async function POST(req: NextRequest) {
  if (!requireRateLimit(req, "auth_register_doctor", 10, 60_000)) return error("Rate limit exceeded", 429)
  await connectDB()
  const body = await req.json()
  const parsed = registerDoctorSchema.safeParse(body)
  if (!parsed.success) return error(parsed.error.message, 422)
  const exists = await User.findOne({ email: parsed.data.email })
  if (exists) return error("Email already registered", 409)
  const passwordHash = await hashPassword(parsed.data.password)
  const user = await User.create({
    email: parsed.data.email,
    passwordHash,
    name: parsed.data.name,
    role: "doctor",
    phone: parsed.data.phone,
    profile: parsed.data.profile,
    isVerified: true,
    doctorProfile: {
      ...parsed.data.doctorProfile,
      isApproved: false,
    },
  })
  return json({ success: true, message: "Registration received. Await admin approval.", userId: user._id })
}

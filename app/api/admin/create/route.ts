import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { hashPassword } from "@/lib/auth"
import { error, json } from "@/app/api/_utils"

export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_CREATION_SECRET
  if (!secret) return error("ADMIN_CREATION_SECRET not set", 500)
  const { providedSecret, email, password, first = "Admin", last = "User" } = await req.json()
  if (providedSecret !== secret) return error("Forbidden", 403)
  await connectDB()
  const exists = await User.findOne({ role: "admin" })
  if (exists) return error("Admin already exists", 409)
  const passwordHash = await hashPassword(password)
  const admin = await User.create({
    email,
    passwordHash,
    name: { first, last },
    role: "admin",
    isVerified: true,
  })
  return json({ success: true, adminId: admin._id })
}

import {
  getRefreshFromCookies,
  setAuthCookies,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth"
import { error, json } from "@/app/api/_utils"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"

export async function POST() {
  const token = getRefreshFromCookies()
  if (!token) return error("Unauthorized", 401)
  try {
    const payload = verifyRefreshToken(token)
    await connectDB()
    const user = await User.findById(payload.sub)
    if (!user) return error("Unauthorized", 401)
    const newPayload = { sub: String(user._id), role: user.role, email: user.email }
    const access = signAccessToken(newPayload)
    const refresh = signRefreshToken(newPayload)
    setAuthCookies(access, refresh)
    return json({ success: true })
  } catch {
    return error("Unauthorized", 401)
  }
}

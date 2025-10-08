import { connectDB } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function GET() {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const user = await User.findById(auth.sub).select("-passwordHash")
  if (!user) return error("Not found", 404)
  return json(user)
}

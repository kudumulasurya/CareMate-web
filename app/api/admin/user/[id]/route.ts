import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(["admin"])
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  await User.findByIdAndDelete(params.id)
  return json({ success: true })
}

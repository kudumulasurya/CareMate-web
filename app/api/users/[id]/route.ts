import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  if (auth.sub !== params.id && auth.role !== "admin") return error("Forbidden", 403)
  await connectDB()
  const user = await User.findById(params.id).select("-passwordHash")
  if (!user) return error("Not found", 404)
  return json(user)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  if (auth.sub !== params.id && auth.role !== "admin") return error("Forbidden", 403)
  await connectDB()
  const body = await req.json()
  await User.findByIdAndUpdate(params.id, { $set: { profile: body?.profile } })
  return json({ success: true })
}

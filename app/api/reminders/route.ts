import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { MedicineReminder } from "@/models/MedicineReminder"
import { reminderCreateSchema } from "@/lib/validation"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const filter: any = {}
  if (userId) {
    if (auth.role !== "admin" && auth.sub !== userId) return error("Forbidden", 403)
    filter.userId = userId
  } else if (auth.role === "user") {
    filter.userId = auth.sub
  }
  const items = await MedicineReminder.find(filter).sort({ createdAt: -1 }).limit(100)
  return json(items)
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const body = await req.json()
  const parsed = reminderCreateSchema.safeParse(body)
  if (!parsed.success) return error(parsed.error.message, 422)
  if (auth.role !== "admin" && auth.sub !== parsed.data.userId) return error("Forbidden", 403)
  const created = await MedicineReminder.create({
    ...parsed.data,
    schedule: parsed.data.schedule.map((s) => new Date(s)),
  })
  return json({ success: true, reminderId: created._id })
}

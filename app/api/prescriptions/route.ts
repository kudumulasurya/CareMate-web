import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Prescription } from "@/models/Prescription"
import { prescriptionCreateSchema } from "@/lib/validation"
import { error, json } from "@/app/api/_utils"

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["doctor"])
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const body = await req.json()
  const parsed = prescriptionCreateSchema.safeParse(body)
  if (!parsed.success) return error(parsed.error.message, 422)
  const created = await Prescription.create(parsed.data)
  return json({ success: true, prescriptionId: created._id })
}

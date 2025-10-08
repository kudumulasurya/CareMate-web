import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Prescription } from "@/models/Prescription"
import { error, json } from "@/app/api/_utils"

export async function GET(_: Request, { params }: { params: { patientId: string } }) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  if (auth.role === "user" && auth.sub !== params.patientId) return error("Forbidden", 403)
  const items = await Prescription.find({ patientId: params.patientId }).sort({ createdAt: -1 }).limit(100)
  return json(items)
}

import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import { User } from "@/models/User"
import { appointmentCreateSchema } from "@/lib/validation"
import { error, json } from "@/app/api/_utils"
import { rangesOverlap, toDate } from "@/utils/slots"

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || undefined
  const q: any = {}
  if (status) q.status = status
  if (auth.role === "user") q.patientId = auth.sub
  if (auth.role === "doctor") q.doctorId = auth.sub
  const items = await Appointment.find(q).sort({ start: -1 }).limit(100)
  return json(items)
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["user"])
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const body = await req.json()
  const parsed = appointmentCreateSchema.safeParse(body)
  if (!parsed.success) return error(parsed.error.message, 422)
  const doctor = await User.findById(parsed.data.doctorId)
  if (!doctor || doctor.role !== "doctor" || !doctor.doctorProfile?.isApproved) return error("Invalid doctor", 400)
  const start = toDate(parsed.data.start)
  const end = toDate(parsed.data.end)
  if (!(start instanceof Date) || !(end instanceof Date) || +start >= +end) return error("Invalid times", 400)
  // prevent conflict
  const existing = await Appointment.find({ doctorId: doctor._id, start: { $lte: end }, end: { $gte: start } })
  if (existing.some((a) => rangesOverlap(a.start, a.end, start, end))) return error("Slot conflict", 409)
  const created = await Appointment.create({
    patientId: auth.sub,
    doctorId: doctor._id,
    start,
    end,
    status: "confirmed",
  })
  return json({ success: true, appointmentId: created._id })
}

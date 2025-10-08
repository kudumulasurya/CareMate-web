import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import { error, json } from "@/app/api/_utils"
import { rangesOverlap, toDate } from "@/utils/slots"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const appt = await Appointment.findById(params.id)
  if (!appt) return error("Not found", 404)
  const isOwner = appt.patientId?.toString() === auth.sub || appt.doctorId?.toString() === auth.sub
  if (!isOwner && auth.role !== "admin") return error("Forbidden", 403)
  const body = await req.json()
  if (body.status) {
    appt.status = body.status
  }
  if (body.start && body.end) {
    const start = toDate(body.start)
    const end = toDate(body.end)
    if (+start >= +end) return error("Invalid times", 400)
    const existing = await Appointment.find({
      _id: { $ne: appt._id },
      doctorId: appt.doctorId,
      start: { $lte: end },
      end: { $gte: start },
    })
    if (existing.some((a) => rangesOverlap(a.start, a.end, start, end))) return error("Slot conflict", 409)
    appt.start = start
    appt.end = end
  }
  await appt.save()
  return json({ success: true })
}

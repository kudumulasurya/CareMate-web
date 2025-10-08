import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function PATCH(req: NextRequest, { params }: { params: { doctorId: string } }) {
  const auth = await requireAuth(["admin"])
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const { approve } = await req.json()
  const doctor = await User.findById(params.doctorId)
  if (!doctor || doctor.role !== "doctor") return error("Not found", 404)
  doctor.doctorProfile = doctor.doctorProfile || ({} as any)
  doctor.doctorProfile.isApproved = !!approve
  if (approve) doctor.doctorProfile.approvedBy = auth.sub as any
  await doctor.save()
  return json({ success: true })
}

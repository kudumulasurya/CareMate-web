import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { Appointment } from "@/models/Appointment"
import { error, json } from "@/app/api/_utils"

export async function GET() {
  const auth = await requireAuth(["admin"])
  if (!auth) return error("Unauthorized", 401)
  await connectDB()
  const [totalDoctors, totalPatients, totalAppointmentsLast30d] = await Promise.all([
    User.countDocuments({ role: "doctor", "doctorProfile.isApproved": true }),
    User.countDocuments({ role: "user" }),
    Appointment.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
  ])
  return json({ totalDoctors, totalPatients, totalAppointmentsLast30d })
}

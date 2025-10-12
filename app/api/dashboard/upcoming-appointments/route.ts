import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import { User } from "@/models/User"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  
  await connectDB()
  
  // Get upcoming appointments with doctor details
  const appointments = await Appointment.find({
    patientId: auth.sub,
    start: { $gte: new Date() },
    status: { $in: ["confirmed", "pending"] }
  })
    .sort({ start: 1 })
    .limit(5)
    .lean()
  
  // Populate doctor details
  const appointmentsWithDoctors = await Promise.all(
    appointments.map(async (apt) => {
      const doctor = await User.findById(apt.doctorId).select("name doctorProfile.specialization avatarUrl").lean()
      return {
        ...apt,
        doctor: doctor ? {
          name: `${doctor.name.first} ${doctor.name.last}`,
          specialization: doctor.doctorProfile?.specialization || "General",
          avatarUrl: doctor.avatarUrl
        } : null
      }
    })
  )
  
  return json(appointmentsWithDoctors)
}

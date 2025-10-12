import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import { VirtualDoctorInteraction } from "@/models/VirtualDoctorInteraction"
import { MedicineReminder } from "@/models/MedicineReminder"
import { error, json } from "@/app/api/_utils"

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth) return error("Unauthorized", 401)
  
  await connectDB()
  
  // Get upcoming appointments count
  const upcomingAppointments = await Appointment.countDocuments({
    patientId: auth.sub,
    start: { $gte: new Date() },
    status: { $in: ["confirmed", "pending"] }
  })
  
  // Get total predictions
  const totalPredictions = await VirtualDoctorInteraction.countDocuments({
    userId: auth.sub
  })
  
  // Get active reminders count
  const activeReminders = await MedicineReminder.countDocuments({
    userId: auth.sub,
    active: true
  })
  
  return json({
    upcomingAppointments,
    totalPredictions,
    activeReminders
  })
}
